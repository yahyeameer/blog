$files = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    if ($file.FullName -match "ThemeProvider") {
        continue
    }
    
    $content = Get-Content $file.FullName -Raw
    
    # 1. Old Dark Text -> New Dark Text
    $content = $content -replace '#FAFAFA', '#F1E3FC'
    # 2. Old Light BG -> New Light BG
    $content = $content -replace '#FDFCE4', '#FAFAFA'
    # 3. Old Light Text -> New Light Text
    $content = $content -replace '#111111', '#2C143B'
    # 4. Old Dark BG -> New Dark BG
    $content = $content -replace '#18181B', '#13091B'
    # 5. Old Accent Pink -> New Accent Purple
    $content = $content -replace '#EC4899', '#692484'
    
    # Fix logo visibility by removing mix-blend modes
    $content = $content -replace 'mix-blend-multiply', ''
    $content = $content -replace 'dark:mix-blend-screen', ''
    
    Set-Content -Path $file.FullName -Value $content
}
