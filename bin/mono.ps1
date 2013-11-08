<#
  .SYNOPSIS
  Runs the MoNo app.
  
  .PARAMETER file
  Indicates a JavaScript file to execute.
  
  .PARAMETER arguments
  The argument list of the file to execute.
  
  .PARAMETER shell
  Option --shell of the mongo shell.
  
  .PARAMETER nodb
  Option --nodb of the mongo shell.
  
  .PARAMETER hostname
  Option --host of the mongo shell.
  
  .PARAMETER port
  Option --port of the mongo shell.
  
  .PARAMETER ipv6
  Option --ipv6 of the mongo shell.
  
  .PARAMETER username
  Option --username of the mongo shell.
  
  .PARAMETER password
  Option --password of the mongo shell.
  
  .EXAMPLE
  mono -file sum.js -arguments @(1, 2, 3)
  
  Runs the file sum.js passing the arguments 1, 2 and 3 and exits.
  
  .EXAMPLE
  mono -shell -file sum.js -arguments @(1, 2, 3)
  
  Runs the file sum.js passing the arguments 1, 2 and 3 and shells.
#>

param(
  [String] $file,
  [String[]] $arguments,
  [Switch][Bool] $shell,
  [Switch][Bool] $nodb,
  [String] $hostname,
  [String] $port,
  [String] $ipv6,
  [String] $username,
  [String] $password
)

[String] $MONGO_BIN = "D:\opt\mongodb\pkg01\soft\bin"
[String] $MONGO = $MONGO_BIN + "\mongo.exe"
[String] $MONO_BASE = Split-Path -Parent (Split-Path -Parent -Path $MyInvocation.MyCommand.Definition)
[String] $MONO_JS = $MONO_BASE + "\mono.js"

[String] $process = "void(process = { argv: [], env: {} });"
[String] $globals = ""
[String] $requirePath = ""

[String[]] $commandLine = @()

#(1) create process object
foreach ($a in $arguments) {
  if ($a -ne $null) {
    $process += " void(process.argv.push('$a'));"
  }
}

foreach ($i in (gci env:)) {
  $process += " void(process.env['$($i.name)'] = '$($i.value)');"
}

$process = $process -replace "\\", "\\"

#(2) create common command line
if ($file -eq "" -or $shell) {
  $commandLine += "--shell"
}

if ($nodb) {
  $commandLine += " --nodb"
} else {
  if ($hostname -ne "") {
    $commandLine += "--host " + $hostname
  }
  
  if ($port -ne "") {
    $commandLine += "--port " + $port
  }
  
  if ($username -ne "") {
    $commandLine += "--username " + $username
  }
  
  if ($password -ne "") {
    $commandLine += "--password " + $password
  }
  
  if ($ipv6 -ne "") {
    $commandLine += "--ipv6"
  }
}

#(3) create requirePath
$requirePath = $MONO_BASE -replace "\\", "\\"

#(4) invoke mongo
if ($file -eq "") {
  $commandLine += "--eval `"$process void(process.__requirePath__ = '$requirePath');`""
  $commandLine += $MONO_JS
} else  {
  if (-not (Test-Path -PathType Leaf $file)) {
    Write-Error "'$file' doesn't exist."
    Exit 1
  }

  $globals += " var __filename = '$($(dir $file).FullName)';"
  $globals += " var __dirname = '$($(dir $file).DirectoryName)';"
  $globals = $globals -replace "\\", "\\"
  $commandLine += "--eval `"$process $globals void(process.__requirePath__ = '$requirePath');`""
  $commandLine += $MONO_JS
  $commandLine += $file
}

Start-Process -FilePath $MONGO -ArgumentList $commandLine -NoNewWindow -Wait