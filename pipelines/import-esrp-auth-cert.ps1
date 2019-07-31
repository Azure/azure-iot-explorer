Param(
  [string]$AuthCertFilePath,
  [string]$AuthCertKey,
  [string]$CertFilePath,
  [string]$CertKey
)

# Import auth certificate
$AuthCertificate = Import-PfxCertificate -FilePath $AuthCertFilePath -CertStoreLocation Cert:\LocalMachine\My -Password (ConvertTo-SecureString $AuthCertKey -AsPlainText -Force)
$ESRPAuthCertificateSubjectName = $AuthCertificate.Subject

Write-Output ("##vso[task.setvariable variable=ESRPAuthCertificateSubjectName;]$ESRPAuthCertificateSubjectName")

# Import signing certificate
$Certificate = Import-PfxCertificate -FilePath $CertFilePath -CertStoreLocation Cert:\LocalMachine\My -Password (ConvertTo-SecureString $CertKey -AsPlainText -Force)
$ESRPCertificateSubjectName = $Certificate.Subject

Write-Output ("##vso[task.setvariable variable=ESRPCertificateSubjectName;]$ESRPCertificateSubjectName")

