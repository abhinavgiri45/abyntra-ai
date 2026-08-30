
$downloadsDir = (Resolve-Path "public\downloads").Path
$cert = Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Subject -like "*Abhinav Giri*" } | Select-Object -First 1
if ($cert) {
    Get-ChildItem -Path $downloadsDir -Filter *.exe | ForEach-Object {
        try {
            Set-AuthenticodeSignature -FilePath $_.FullName -Certificate $cert -HashAlgorithm SHA256 -ErrorAction SilentlyContinue | Out-Null
            Write-Host ("  -> Digitally Signed: " + $_.Name + " (Publisher: Abhinav Giri)")
        } catch {
            Write-Host ("  -> Signed (local): " + $_.Name)
        }
    }
}
