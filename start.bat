@Echo off
:Start
node main
echo Program terminated at %Date% %Time% with Error
echo Press Ctrl-C if you don't want to restart automatically
ping -n 10 localhost

goto Start