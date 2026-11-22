$ErrorActionPreference = "Stop"

if (-not $env:WORKER_URL -or -not $env:INGEST_API_KEY) {
    throw "WORKER_URL and INGEST_API_KEY must be set."
}

$records = @(Get-Content "data/cleaned_housing.json" -Raw | ConvertFrom-Json)
$records = @($records[0])
$batchSize = 100


$headers = @{
    Authorization = "Bearer $env:INGEST_API_KEY"
}

for ($i = 0; $i -lt $records.Count; $i += $batchSize) {
    $end = [Math]::Min($i + $batchSize - 1, $records.Count - 1)
    $batch = @($records[$i..$end])

    $body = ConvertTo-Json -InputObject $batch -Depth 5

    $result = Invoke-RestMethod `
        -Uri "$env:WORKER_URL/ingest" `
        -Method Post `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing

    Write-Host "Uploaded $($end + 1)/$($records.Count)"
}

Write-Host "Upload complete!"