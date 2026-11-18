!macro customInit
  !ifndef BUILD_UNINSTALLER
    SetSilent silent
  !endif
!macroend

!macro customInstall
  ExecShell "" "$launchLink"
!macroend
