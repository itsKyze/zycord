!macro customInit
  SetSilent silent
!macroend

!macro customInstall
  WriteRegStr HKCU "Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache" "$appExe.FriendlyAppName" "Zycord"
  Exec '"$appExe"'
!macroend
