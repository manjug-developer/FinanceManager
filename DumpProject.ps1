$sourcePath = "C:\Users\manju\Documents\Projects\FinanceManager\src"
$outputDir  = "C:\Users\manju\Documents\Projects\Output"
$outputFile = Join-Path $outputDir "FinanceManager_AllFiles.txt"

# Ensure output directory exists
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Get all files recursively
$files = Get-ChildItem -Path $sourcePath -Recurse -File

# Start writing to output file
"FINANCE MANAGER - COMPLETE SOURCE DUMP" | Out-File $outputFile
"Generated on: $(Get-Date)" | Out-File $outputFile -Append
"Source Path: $sourcePath" | Out-File $outputFile -Append
"============================================================" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# INDEX SECTION
"========================= INDEX =========================" | Out-File $outputFile -Append
$i = 1
foreach ($file in $files) {
    $relativePath = $file.FullName.Replace($sourcePath, "").TrimStart("\")
    "$i. $relativePath" | Out-File $outputFile -Append
    $i++
}
"" | Out-File $outputFile -Append
"=========================================================" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# FILE CONTENT SECTION
foreach ($file in $files) {
    $relativePath = $file.FullName.Replace($sourcePath, "").TrimStart("\")

    "============================================================" | Out-File $outputFile -Append
    "FILE: $relativePath" | Out-File $outputFile -Append
    "============================================================" | Out-File $outputFile -Append
    "" | Out-File $outputFile -Append

    Get-Content $file.FullName | Out-File $outputFile -Append

    "" | Out-File $outputFile -Append
    "" | Out-File $outputFile -Append
}

Write-Host "Done! Output created at: $outputFile"