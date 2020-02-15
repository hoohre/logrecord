### Windows Server Manager
### NSSM - the Non-Sucking Service Manager
####
https://nssm.cc/commands
https://nssm.cc/usage

nssm install ml9000  
根据GUI配置参数
nssm get ml9000 Application C:\Users\Administrator\Envs\musiclink\Scripts\python.exe  
nssm get ml9000 AppParameters manage.py runserver 0.0.0.0:9000  
nssm get ml9000 AppDirectory C:\pros\pypro\musiclink\  
nssm set ml9000 DisplayName ml9000  
nssm set ml9000 Description Unreal Tournament 2003  
nssm set ml9000 Start SERVICE_AUTO_START/SERVICE_DEMAND_START  
nssm get ml9000 AppStdout C:\pros\pypro\musiclink\output.log  
nssm get ml9000 AppStderr C:\pros\pypro\musiclink\nohup.log  
