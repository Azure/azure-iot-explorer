Param(
  [string]$Path,
  [string]$Ext,
  [string]$ClientPath,
  [string]$ESRPClientId
)

function Create-TmpJson($Obj) {
	$FileName = [System.IO.Path]::GetTempFileName()
	ConvertTo-Json -Depth 100 $Obj | Out-File -Encoding UTF8 $FileName
	return $FileName
}

$FileToSign = Get-ChildItem $Path | where {$_.extension -eq $Ext} | Select-Object -first 1 | % {$_.FullName}

$Auth = Create-TmpJson @{
	Version = "1.0.0"
	AuthenticationType = "AAD_CERT"
	ClientId = $ESRPClientId
	AuthCert = @{
		SubjectName = $env:ESRPAuthCertificateSubjectName
		StoreLocation = "LocalMachine"
		StoreName = "My"
	}
	RequestSigningCert = @{
		SubjectName = $env:ESRPCertificateSubjectName
		StoreLocation = "LocalMachine"
		StoreName = "My"
	}
}

$Policy = Create-TmpJson @{
	Version = "1.0.0"
}

$Input = Create-TmpJson @{
	Version = "1.0.0"
	SignBatches = @(
		@{
			SourceLocationType = "UNC"
			SignRequestFiles = @(
				@{
					CustomerCorrelationId = $env:ESRPClientId
					SourceLocation = $FileToSign
				}
			)
			SigningInfo = @{
				Operations = @(
					@{
						KeyCode = "CP-230012"
						OperationCode = "SigntoolSign"
						Parameters = @{
							OpusName = "Microsoft"
							OpusInfo =  "http://www.microsoft.com"
							FileDigest = "/fd `"SHA256`""
							PageHash = "/NPH"
							TimeStamp = "/tr `"http://rfc3161.gtm.corp.microsoft.com/TSS/HttpTspServer`" /td sha256"
						}
						ToolName = "sign"
						ToolVersion = "1.0"
					},
					@{
						KeyCode = "CP-230012"
						OperationCode = "SigntoolVerify"
						Parameters = @{
							VerifyAll = "/all"
						}
						ToolName = "sign"
						ToolVersion = "1.0"
					}
				)
			}
		}
	)
}

$Output = [System.IO.Path]::GetTempFileName()
& "$ClientPath\ESRPClient.exe" Sign -a $Auth -p $Policy -i $Input -o $Output
