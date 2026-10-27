param([string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference = 'Stop'
$content = Get-Content -LiteralPath (Join-Path $ProjectRoot 'docs\curriculo-content.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$outputDir = Join-Path $ProjectRoot 'public\downloads'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
$word = $null
$document = $null

try {
    # Instância própria e invisível: não altera os documentos abertos pelo usuário.
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Add()
    $document.PageSetup.PaperSize = 7 # A4
    $document.PageSetup.TopMargin = 40
    $document.PageSetup.BottomMargin = 40
    $document.PageSetup.LeftMargin = 45
    $document.PageSetup.RightMargin = 45
    $normal = $document.Styles.Item(-1)
    $normal.Font.Name = 'Calibri'
    $normal.Font.Size = 10
    $normal.Font.Color = 0
    $normal.ParagraphFormat.SpaceAfter = 4
    $normal.ParagraphFormat.LineSpacingRule = 0
    $normal.ParagraphFormat.WidowControl = -1
    $selection = $word.Selection

    function Add-ResumeParagraph([string]$Text, [string]$Kind = 'body') {
        $selection.Style = $document.Styles.Item(-1)
        $selection.Font.Name = 'Calibri'
        $selection.Font.Size = 10
        $selection.Font.Bold = 0
        $selection.Font.Color = 0
        $selection.ParagraphFormat.SpaceBefore = 0
        $selection.ParagraphFormat.SpaceAfter = 4
        $selection.ParagraphFormat.KeepWithNext = 0
        switch ($Kind) {
            'title' { $selection.Style = $document.Styles.Item(-63); $selection.Font.Name = 'Calibri'; $selection.Font.Size = 21; $selection.Font.Bold = -1; $selection.Font.Color = 0; $selection.ParagraphFormat.SpaceAfter = 5 }
            'role' { $selection.Font.Size = 12; $selection.Font.Bold = -1; $selection.ParagraphFormat.KeepWithNext = -1 }
            'contact' { $selection.Font.Size = 9; $selection.ParagraphFormat.SpaceAfter = 3; $selection.ParagraphFormat.KeepWithNext = -1 }
            'heading' { $selection.Style = $document.Styles.Item(-2); $selection.Font.Name = 'Calibri'; $selection.Font.Size = 12; $selection.Font.Bold = -1; $selection.Font.Color = 0; $selection.ParagraphFormat.SpaceBefore = 10; $selection.ParagraphFormat.SpaceAfter = 5; $selection.ParagraphFormat.KeepWithNext = -1 }
            'job' { $selection.Font.Bold = -1; $selection.ParagraphFormat.SpaceBefore = 5; $selection.ParagraphFormat.KeepWithNext = -1 }
            'period' { $selection.Font.Size = 9; $selection.ParagraphFormat.KeepWithNext = -1 }
        }
        $selection.TypeText($Text)
        $selection.TypeParagraph()
    }

    Add-ResumeParagraph $content.name 'title'
    Add-ResumeParagraph $content.role 'role'
    Add-ResumeParagraph $content.contact 'contact'
    Add-ResumeParagraph $content.links 'contact'
    Add-ResumeParagraph 'Resumo profissional' 'heading'
    Add-ResumeParagraph $content.summary
    Add-ResumeParagraph 'Experiência profissional' 'heading'
    foreach ($job in $content.experience) {
        Add-ResumeParagraph $job.title 'job'
        Add-ResumeParagraph $job.period 'period'
        foreach ($item in $job.items) { Add-ResumeParagraph ('• ' + $item) }
    }
    Add-ResumeParagraph 'Experiência industrial' 'heading'
    foreach ($experience in $content.industrialExperience) {
        Add-ResumeParagraph $experience.title 'job'
        Add-ResumeParagraph $experience.description
    }
    Add-ResumeParagraph 'Formação acadêmica' 'heading'
    foreach ($course in $content.education) { Add-ResumeParagraph $course }
    $selection.InsertBreak(7)
    Add-ResumeParagraph 'Projetos de software' 'heading'
    foreach ($project in $content.projects) {
        Add-ResumeParagraph $project.title 'job'
        Add-ResumeParagraph $project.description
    }
    Add-ResumeParagraph 'Habilidades técnicas' 'heading'
    foreach ($skill in $content.skills) { Add-ResumeParagraph $skill }
    Add-ResumeParagraph 'Cursos complementares' 'heading'
    foreach ($course in $content.courses) { Add-ResumeParagraph $course }
    Add-ResumeParagraph 'Idiomas' 'heading'
    Add-ResumeParagraph $content.languages
    Write-Output "Formatacao concluida"
    $docxPath = Join-Path $outputDir 'curriculo-gustavo-melo.docx'
    $pdfPath = Join-Path $outputDir 'curriculo-gustavo-melo.pdf'
    Write-Output "Salvando DOCX"
    $document.SaveAs2([string]$docxPath, 16)
    Write-Output "Exportando PDF"
    $document.ExportAsFixedFormat([string]$pdfPath, 17)
    Write-Output 'Currículo gerado nos formatos DOCX e PDF.'
    Write-Output $docxPath
    Write-Output $pdfPath
}
finally {
    if ($document) { $document.Close(0); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($document) }
    if ($word) { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
}

