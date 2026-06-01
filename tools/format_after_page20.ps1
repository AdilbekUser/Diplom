param(
    [Parameter(Mandatory = $true)][string]$DocxPath,
    [Parameter(Mandatory = $false)][double]$BodyLineMultiple = 1.62,
    [Parameter(Mandatory = $false)][int]$StartPage = 20,
    [Parameter(Mandatory = $false)][string]$PdfPath = ""
)

$wdGoToPage = 1
$wdGoToAbsolute = 1
$wdStatisticPages = 2
$wdStatisticWords = 0
$wdExportFormatPDF = 17
$wdAlignJustify = 3
$wdAlignCenter = 1
$wdAlignLeft = 0
$wdLineSpaceSingle = 0
$wdLineSpaceMultiple = 5
$wdWithInTable = 12
$fontName = "Times New Roman"

$word = $null
$doc = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($DocxPath, $false, $false)
    $doc.Repaginate()

    $startRange = $doc.GoTo($wdGoToPage, $wdGoToAbsolute, $StartPage)
    $startPos = $startRange.Start
    $bodyLine = [single](12.0 * $BodyLineMultiple)

    foreach ($paragraph in $doc.Paragraphs) {
        if ($paragraph.Range.Start -lt $startPos) {
            continue
        }

        $text = ($paragraph.Range.Text -replace "[\r\n\t\a]+", " ").Trim()
        $styleName = $paragraph.Range.Style.NameLocal
        $outlineLevel = 10
        $inTable = $false
        try { $outlineLevel = [int]$paragraph.OutlineLevel } catch {}
        try { $inTable = [bool]$paragraph.Range.Information($wdWithInTable) } catch {}

        $paragraph.Range.Font.Name = $fontName
        $paragraph.Range.Font.NameBi = $fontName
        $paragraph.Range.Font.NameOther = $fontName
        $paragraph.Format.SpaceBefore = 0
        $paragraph.Format.SpaceAfter = 0
        $paragraph.Format.WidowControl = $true

        if ($inTable) {
            $paragraph.Range.Font.Size = 14
            $paragraph.Format.LineSpacingRule = $wdLineSpaceSingle
            $paragraph.Format.LineSpacing = 12
            $paragraph.Format.FirstLineIndent = 0
            if ($text.Length -le 35) {
                $paragraph.Format.Alignment = $wdAlignCenter
            } else {
                $paragraph.Format.Alignment = $wdAlignLeft
            }
            continue
        }

        if ($styleName -eq "CaptionCustom" -or $text -match "^\d+-") {
            $paragraph.Range.Font.Size = 12
            $paragraph.Range.Font.Bold = $false
            $paragraph.Format.Alignment = $wdAlignCenter
            $paragraph.Format.FirstLineIndent = 0
            $paragraph.Format.LineSpacingRule = $wdLineSpaceSingle
            $paragraph.Format.LineSpacing = 12
            $paragraph.Format.SpaceAfter = 6
            $paragraph.Format.KeepWithNext = $true
            continue
        }

        if ($styleName -match "Heading" -or $outlineLevel -le 3) {
            $paragraph.Range.Font.Size = 14
            $paragraph.Range.Font.Bold = $true
            $paragraph.Format.FirstLineIndent = 0
            $paragraph.Format.LineSpacingRule = $wdLineSpaceMultiple
            $paragraph.Format.LineSpacing = $bodyLine
            $paragraph.Format.SpaceBefore = 6
            $paragraph.Format.SpaceAfter = 6
            $paragraph.Format.KeepWithNext = $true
            if ($outlineLevel -eq 1) {
                $paragraph.Format.Alignment = $wdAlignCenter
            } else {
                $paragraph.Format.Alignment = $wdAlignLeft
            }
            continue
        }

        $paragraph.Range.Font.Size = 14
        $paragraph.Range.Font.Bold = $false
        $paragraph.Format.Alignment = $wdAlignJustify
        $paragraph.Format.FirstLineIndent = $word.CentimetersToPoints(1.25)
        $paragraph.Format.LineSpacingRule = $wdLineSpaceMultiple
        $paragraph.Format.LineSpacing = $bodyLine
        $paragraph.Format.KeepWithNext = $false
    }

    foreach ($table in $doc.Tables) {
        if ($table.Range.Start -lt $startPos) {
            continue
        }
        $table.Range.Font.Name = $fontName
        $table.Range.Font.Size = 14
        $table.Rows.Alignment = 1
        try { $table.AutoFitBehavior(1) } catch {}
    }

    foreach ($toc in $doc.TablesOfContents) {
        $toc.Update()
        $toc.UpdatePageNumbers()
    }
    foreach ($story in $doc.StoryRanges) {
        try { $story.Fields.Update() | Out-Null } catch {}
    }

    $doc.Repaginate()
    $pages = $doc.ComputeStatistics($wdStatisticPages)
    $words = $doc.ComputeStatistics($wdStatisticWords)
    $doc.Save()

    if ($PdfPath -ne "") {
        $pdfDir = Split-Path -Parent $PdfPath
        if ($pdfDir -and -not (Test-Path -LiteralPath $pdfDir)) {
            New-Item -ItemType Directory -Force -Path $pdfDir | Out-Null
        }
        $doc.ExportAsFixedFormat($PdfPath, $wdExportFormatPDF)
    }

    [pscustomobject]@{
        Pages = $pages
        Words = $words
        StartPage = $StartPage
        StartPos = $startPos
        BodyLineMultiple = $BodyLineMultiple
        PdfPath = $PdfPath
    } | ConvertTo-Json -Compress
}
finally {
    if ($doc) { $doc.Close($true) | Out-Null }
    if ($word) { $word.Quit() | Out-Null }
}
