$content = Get-Content 'D:/AIsoftware/niche_loyalty/src/config/db/schema.ts'
$newContent = $content[0..783]
$newContent | Out-File -FilePath 'D:/AIsoftware/niche_loyalty/src/config/db/schema_clean.ts' -Encoding UTF8
Move-Item -Path 'D:/AIsoftware/niche_loyalty/src/config/db/schema_clean.ts' -Destination 'D:/AIsoftware/niche_loyalty/src/config/db/schema.ts' -Force

