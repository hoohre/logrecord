## 亚马逊AWS EC2上使用root用户登录

#### 使用 SSH 连接到 Linux 实例
##### 使用 SSH 连接到您的实例
> 1. 在终端窗口中，使用 ssh 命令连接到该实例。您可以指定私有密钥 (.pem) 的路径和文件名、AMI 的用户名以及实例的公有 DNS 名称或 IPv6 地址。有关如何查找私有密钥、AMI 的用户名以及实例的 DNS 名称或 IPv6 地址的更多信息，请参阅查找私有密钥和获取有关您的实例的信息。要连接到您的实例，请执行以下操作之一：
>> （公有 DNS）要使用实例的公有 DNS 进行连接，请输入以下命令。
```
ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```
>> (IPv6) 或者，如果您的实例具有 IPv6 地址，要使用实例的 IPv6 地址进行连接，请输入以下命令。
```
ssh -i /path/my-key-pair.pem ec2-user@2001:db8:1234:1a00:9691:9503:25ad:1761
```
>> 您会看到如下响应：
```
The authenticity of host 'ec2-198-51-100-1.compute-1.amazonaws.com (10.254.142.33)'
can't be established.
RSA key fingerprint is 1f:51:ae:28:bf:89:e9:d8:1f:25:5d:37:2d:7d:b8:ca:9f:f5:f1:6f.
Are you sure you want to continue connecting (yes/no)?
```
> 2. (可选) 验证安全警报中的指纹是否与您之前在 （可选）获取实例指纹 中获得的指纹相匹配。如果这些指纹不匹配，则表示有人可能在试图实施“中间人”攻击。如果匹配，请继续到下一步。
> 3. 输入`yes`。您会看到如下响应：
```
Warning: Permanently added 'ec2-198-51-100-1.compute-1.amazonaws.com' (RSA) 
to the list of known hosts.
```
#### 使用root用户登录
> 创建root的密码`sudo passwd root`  
> 然后会提示你输入new password, 再输入一遍进行验证  
> 切换到root身份`su root`   
> 使用root身份编辑亚马逊云主机的ssh登录方式，找到 `PasswordAuthentication no`，把`no`改成`yes`
```
vim /etc/ssh/sshd_config

# To disable tunneled clear text passwords, change to no here!
#PasswordAuthentication yes
#PermitEmptyPasswords no
PasswordAuthentication no

```
> 重新启动下sshd, `systemctl restart sshd.service`或者`sudo /sbin/service sshd restart`  
> 再切换到root身份, `su root`  
> 为原来的`ec2-user`添加登录密码, `passwd ec2-user`, 按提示，两次输入密码  
> 修改sshd配置文件, `vim /etc/ssh/sshd_config` 
```
#PermitRootLogin yes

UsePAM yes
======>>>>
PermitRootLogin yes

UsePAM no

``` 
> (可选) 修改ssh端口, `vim /etc/ssh/sshd_config`
```
Port  2244  
```
> 重新启动下sshd, `systemctl restart sshd.service`

#### 可能出现的问题
##### caddy Service
> `WARNING: File descriptor limit 1024 is too low for production servers. At least 8192 is recommended. Fix with "ulimit -n 8192"`
>> `vim /etc/security/limits.conf`
```
# End of file
root soft nofile 65535
root hard nofile 65535
* soft nofile 65535
* hard nofile 65535
```
> MySQL 修改max_connections, 被限制在214，无法再大
>> `vim /lib/systemd/system/mysql.service`
```
如果修改后生效，但被限制在214，无法再大
1、修改/etc/security/limits.conf，添加
root soft nofile 65535
root hard nofile 65535
* soft nofile 65535
* hard nofile 65535

2、修改/lib/systemd/system/mysql.service，添加
LimitNOFILE=65535
LimitNPROC=65535

```
> 脚本权限问题
>> `sudo`  
>> `/home/ec2-user/caddy/caddy -conf=/home/ec2-user/caddy/Caddyfile -pidfile=/home/ec2-user/caddy/caddy.pid 2>&1 &`  
>> `ps aux|grep caddy|grep -v grep|cut -c 9-15|xargs sudo kill -10`  

##### MongoDB
> /etc/mongo.conf  
> 修改配置，日志、数据路径，授权访问  
```
use admin;
db.createUser(
  {
    user: "server",
    pwd: "xxxxxx",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
);

db.system.users.remove({user:"userName"})
db.changeUserPassword("userName", "new password")

setParameter:
   enableLocalhostAuthBypass: false
security:
    authorization: enabled
```
> 限制内存使用  
```
engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 4
```

#### 参考资料
* [使用 SSH 连接到 Linux 实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)
* [EFS文件系统挂载到EC2实例上并测试](https://docs.aws.amazon.com/zh_cn/efs/latest/ug/wt1-test.html)
* [Install MongoDB Community Edition on Amazon Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/)
