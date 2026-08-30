Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\Indian_Armed_Forces_(Triservices)_logo_at_National_War_Memorial.png"
$destPath = Join-Path $PSScriptRoot "..\public\Indian_Armed_Forces_Triservices.png"
$docsDestPath = Join-Path $PSScriptRoot "..\docs\Indian_Armed_Forces_Triservices.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
$dest = New-Object System.Drawing.Bitmap(600, 600)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$g.DrawImage($src, 0, 0, 600, 600)
$src.Dispose()
$g.Dispose()

$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
if (Test-Path (Join-Path $PSScriptRoot "..\docs")) {
    $dest.Save($docsDestPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
$dest.Dispose()

Write-Output "Successfully created optimized Triservices image."
