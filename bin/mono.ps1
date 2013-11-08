param(
  [String] $file,
  [String[]] $arguments,
  [Switch][Bool] $shell
)

[String] $MONGO_BIN = "D:\opt\mongodb\pkg01\soft\bin"
[String] $MONGO = $MONGO_BIN + "\mongo.exe"
[String] $MONO_BASE = Split-Path -Parent (Split-Path -Parent -Path $MyInvocation.MyCommand.Definition)
[String] $MONO_JS = $MONO_BASE + "\mono.js"

[String] $process = "void(process = { argv: [], env: {} });"
[String] $globals = ""
[String] $commandLine = "$MONGO"

#(1) create process object
foreach ($a in $arguments) {
  if ($a -ne $null) {
    $process += " void(process.argv.push('$a'));"
  }
}

gci env: |
ForEach {
  $process += " void(process.env['$($_.name)'] = '$($_.value)');"
}

$process = $process -replace "\\", "\\"

#(3) invoke mongo
if ($file -eq "") {
  & $MONGO --shell --nodb --eval ($process + $globals) $MONO_JS
} else  {
  $globals += " void(__filename = `"$($(dir $file).FullName)`");"
  $globals += " void(__dirname = `"$($(dir $file).DirectoryName)`");"
  
  & $MONGO --nodb --eval $process $MONO_JS $file
}