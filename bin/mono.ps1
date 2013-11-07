param(
  [String] $file,
  [String[]] $arguments
)

[String] $MONGO_BIN = "D:\opt\mongodb\pkg01\soft\bin"
[String] $mongo = $MONGO_BIN + "\mongo.exe"
[String] $jsargs = "void(process = { argv: [] });"

#(1) create jsargs
foreach ($a in $arguments) {
  if ($a -ne $null) {
    $jsargs += " void(process.argv.push('$a'));"
  }
}

#(2) invoke mongo
if ($file -eq "") {
  & $mongo --shell --eval $jsargs --nodb ..\mono.js
} else  {
  & $mongo --shell --nodb --eval "void($jsargs)" ..\mono.js $file
}