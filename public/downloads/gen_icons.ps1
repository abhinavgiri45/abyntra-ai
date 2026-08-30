
Add-Type -AssemblyName System.Drawing

$rootDir = (Get-Item .).FullName
$logoPath = Join-Path $rootDir "public\logo.png"
$publicDir = Join-Path $rootDir "public"
$downloadsDir = Join-Path $publicDir "downloads"

if (-not (Test-Path $downloadsDir)) {
    New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null
}

$origImg = [System.Drawing.Image]::FromFile($logoPath)
$sizes = @(512, 256, 192, 144, 128, 96, 64, 48, 32, 16)
$pngStreams = @{}

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $s, $s, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($origImg, 0, 0, $s, $s)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngStreams[$s] = $ms.ToArray()
    $ms.Dispose()

    $outFile = Join-Path $publicDir ("icon-" + $s + ".png")
    [System.IO.File]::WriteAllBytes($outFile, $pngStreams[$s])
    $bmp.Dispose()
}
$origImg.Dispose()

function Build-IcoFile ($targetPath, $icoSizes) {
    $icoMs = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter $icoMs

    $bw.Write([UInt16]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]$icoSizes.Count)

    $headerSize = 6 + ($icoSizes.Count * 16)
    $currentOffset = $headerSize

    foreach ($s in $icoSizes) {
        $bytes = $pngStreams[$s]
        $w = if ($s -ge 256) { [byte]0 } else { [byte]$s }
        $h = if ($s -ge 256) { [byte]0 } else { [byte]$s }

        $bw.Write([byte]$w)
        $bw.Write([byte]$h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([UInt16]1)
        $bw.Write([UInt16]32)
        $bw.Write([UInt32]$bytes.Length)
        $bw.Write([UInt32]$currentOffset)
        
        $currentOffset += $bytes.Length
    }

    foreach ($s in $icoSizes) {
        $bytes = $pngStreams[$s]
        $bw.Write($bytes)
    }

    $bw.Flush()
    [System.IO.File]::WriteAllBytes($targetPath, $icoMs.ToArray())
    $bw.Dispose()
    $icoMs.Dispose()
    Write-Host ("Generated ICO: " + $targetPath)
}

$appIcoSizes = @(256, 128, 64, 48, 32, 16)
Build-IcoFile (Join-Path $publicDir "app.ico") $appIcoSizes
Build-IcoFile (Join-Path $publicDir "favicon.ico") $appIcoSizes
Build-IcoFile (Join-Path $downloadsDir "app.ico") $appIcoSizes

Write-Host "Setting up Code Signing Certificate for Abhinav Giri..."
$certSubject = "CN=Abhinav Giri, O=Girionix AI, OU=Sovereign Software, C=IN"
$existingCert = Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Subject -like "*Abhinav Giri*" } | Select-Object -First 1

if (-not $existingCert) {
    Write-Host "Creating new Code Signing Certificate for Abhinav Giri..."
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject $certSubject -FriendlyName "Girionix AI (Abhinav Giri)" -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(10) -HashAlgorithm "SHA256" -KeyLength 2048 -KeyUsage DigitalSignature -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3")
} else {
    $cert = $existingCert
}

$cerPath = Join-Path $downloadsDir "AbhinavGiri-GirionixAI.cer"
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
[System.IO.File]::WriteAllBytes($cerPath, $certBytes)
Write-Host ("Exported public verification certificate: " + $cerPath)
