### RSA私钥及公钥生成

#### 使用OpenSSL工具命令生成
> genrsa -out rsa_private_key.pem 1024  
> pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt -out rsa_private_key_pkcs8.pem # FOR Java  
> rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem  

### 生成随机字符串
#### OpenSSL head hash cut tr
> openssl passwd -stdin  
> openssl rand -hex/base64 6  
> head -c 12 /dev/random | base64  
> head -c 6 /dev/urandom | base64  
> head -c 6 /dev/urandom | cksum  
> head -c 6 /dev/urandom | md5sum  
> head -c 6 /dev/urandom | sha1sum  
> head -c 6 /dev/urandom | sha224sum  
> head -c 6 /dev/urandom | sha256sum  
> head -c 6 /dev/urandom | sha384sum  
> head -c 6 /dev/urandom | sha512sum  
> head -c 6 /dev/urandom | sha1sum | cut -c 1-12
> uuidgen |tr -d '-' 32  
> openssl md5/sha1

### Github/Gitlab配置ssh
#### ssh-keygen
> ssh-keygen -t rsa -C "example@example.com"  
> 生成两个文件`~/.ssh/id_rsa`  `~.ssh/id_rsa.pub`  
> 复制`~.ssh/id_rsa.pub`内容, 配置`ssh key`  
>