#### 挂在硬盘
> https://help.aliyun.com/document_detail/25426.html?spm=5176.10695662.1996646101.1.754b3944qwI5qu  
> https://cloud.tencent.com/document/product/559/8211  
>> fdisk -l  
>> 创建分区`fdisk -u /dev/vdb`  
>> 输入`p`, 查看数据盘的分区情况  
>> 输入`n`创建一个新分区  
>> 输入`p`, 选择分区类型为主分区   
>> 输入分区编号并按回车键。仅创建一个分区，输入`1`  
>> 输入第一个可用的扇区编号，按回车键采用默认值2048  
>> 输入最后一个扇区编号。仅创建一个分区，按回车键采用默认值  
>> 输入`p`查看该数据盘的规划分区情况  
>> 输入`w`开始分区，并在完成分区后退出。  
>> 运行`mkfs.ext4 /dev/vdb1`命令在新分区上创建一个文件系统。其他文件系统格式请自行修改mkfs.ext4命令  
>> 覆盖旧的分区信息  
>>> 向`/etc/fstab`写入新分区信息，启动开机自动挂载分区  
>>> 运行命令`cp /etc/fstab /etc/fstab.bak`，备份`/etc/fstab`。  
>>> 运行命令echo `blkid /dev/vdb1 | awk '{print $2}' | sed 's/\"//g'` /mnt ext4 defaults 0 0 >> /etc/fstab，向/etc/fstab里写入新分区信息  
>>> 运行`cat /etc/fstab`命令查看`/etc/fstab`中的新分区信息   
>>
>> 运行`mount /dev/vdb1 /mnt`命令挂载文件系统  
>> 如果运行`df -h`命令后出现新建文件系统的信息，表示文件系统挂载成功
>
#### 修改ssh端口
>  cd /etc/ssh  
> cp sshd_config sshd_config.bak  
> vim sshd_config
>> Port  2244  
> systemctl restart sshd.service   
> systemctl status sshd.service  

#### 安装软件
> yum install svn  
>
> yum install lrzsz  
>
> caddy  
>
> MySQL
>> wget 'https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm'  
>> rpm -Uvh mysql57-community-release-el7-11.noarch.rpm  
>> yum repolist all | grep mysql  
>> 选择版本57
>>> yum-config-manager --disable mysql80-community  
>>> yum-config-manager --enable mysql57-community  
>>> 或直接修改文件`/etc/yum.repos.d/mysql-community.repo`  
>>> enabled=0禁用, enabled=1启用  
>>> yum repolist enabled | grep mysql  
>>> yum install mysql-community-server  
>>
>> systemctl start mysqld.service, restart, status  
>> 修改配置
>>> grep 'temporary password' /var/log/mysqld.log   
>>> mysql -uroot -p, 输入看到的密码  
>>> ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';  
>>> 不想用那么复杂的密码，可以修改默认策略, `/etc/my.cnf`添加`validate_password=OFF`,保存并重启MySQL  
>>> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;  
>>> FLUSH PRIVILEGES;  
>>> `vim /etc/my.cnf`   
>> 修改数据路径需要重新创建数据库  
>>> `sudo mysqld --user=mysql --datadir=/mnt/efs/fs1/log/mysql`
```
sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"  

character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci
init_connect="SET NAMES utf8mb4"

max_connections = 1000

# bin log 可选
log_bin=mysql_bin
binlog_format=row
# server_id > 1
server_id=6543
# MySQL >=5.6 需要配置
binlog_row_image=full

#[slow_query]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql_slow.log
long_query_time = 2

[client]
default-character-set = utf8mb4
[mysql]
default-character-set = utf8mb4
```
> Python2.7 > Python3.6
>> yum install python-devel mysql-devel openssl-devel gcc gcc-c++ ncurses-devel ncurses-libs 
>> ncurses-devel - uwsgitop监控需要   
>> https://www.python.org/downloads/source/  
>> wget  https://www.python.org/ftp/python/3.6.6/Python-3.6.6.tgz  
>> tar xvf Python-3.6.6.tgz  
>> 配置环境  
>>> 根据需要配置, pip安装插件时才会发现缺少什么,可能需要重新编译安装  
>>> 也可重新编辑, 将响应的.co文件copy到`/usr/local/lib/python3.6/lib-dynload/`  
>>> `sudo cp build/lib.linux-x86_64-3.6/_curses* /usr/local/lib/python3.6/lib-dynload/`  
>>
>> ./configure ./configure --enable-optimizations  
>> make && make install  
>> mv /usr/bin/python /usr/bin/python2.7.5  
>> ln -s /usr/local/bin/python3.6 /usr/bin/python  
>> 修改`yum`配置 `vim /usr/bin/yum`
>>> `#!/usr/bin/python`改成`#!/usr/bin/python2.7`
>>
>> 后面可能需要修改其他的配置,例如`/usr/libexec/urlgrabber-ext-down`  
>> mv /usr/bin/pip /usr/bin/pip2.7.5  
>> ln -s /usr/local/bin/pip3.6 /usr/bin/pip  
>>
> pip install uwsgi  
>
#### monit监控mongodb
> https://mmonit.com/wiki/Monit/Systemd  
> https://mmonit.com/wiki/Monit/Installation  
> yum install monit  
>> 如何配置  
>> 使用yum安装默认配置文件在：  
>> /etc/monitrc # 全局参数配置文件  
>> /etc/monit.d/ # 在这个目录下新增每个待监控服务的配置  
>>
>> 编辑全局参数配置文件/etc/monitrc，我的配置如下  
>> vim /etc/monitrc  
```
#设置周期，每60秒自动检测一次 
set daemon 30   
#设置报警邮件发送格式 
set mailserver smtp.163.com port 25 USERNAME "xxxxx@163.com" PASSWORD "xxxxxx" 
set mail-format {           
	from: xxxx@163.com           
	subject: monit alert --  $EVENT $SERVICE           
	message: $EVENT Service $SERVICE                 
		Date:        $DATE                 
		Action:      $ACTION                 
		Host:        $HOST                 
		Description: $DESCRIPTION    
}   
#设置报警邮件发给谁，默认只会发送一次报警。 #with reminder on 3 cycles表示如果服务一直处于失败，则基于周期最多发送3次报警 
set alert xxxy@qq.com with reminder on 3 cycles   
# Monit Web界面相关的访问配置，如不使用则不需要配置(web管理界面需要额外的M/Monit项目) 
set httpd port 2812      allow app:app 
set eventqueue basedir /var/monit slots 1000   
#包含所有需要监控服务的子配置项，这里使用了文件名通配符 
include /etc/monit.d/*.monitrc.conf

```
> 监控mongodb配置示例（利用端口监控）
>>
```
#匹配进程名 
CHECK PROCESS mongo MATCHING mongo 
#配置服务启动和重启命令 
start program = "/usr/bin/sudo service mongodb start" 
restart program = "/usr/bin/sudo service mongodb restart" 
#如果端口27017无法访问则认为服务失败，发报警邮件并重启服务 
if failed port 27017  type tcp then alert if failed port 27017  type tcp then restart 
#如果在三个周期内重启了3次，则不再监控 
if 3 restarts within 3 cycles then unmonitor
```

> monit相关命令
```
 monit # 启动monit daemon
 monit reload # 当更新了配置文件需要重载
 monit status # 查看所有服务状态
 monit status nginx # 查看nginx服务状态
 monit stop all # 停止所有服务
 monit stop mongo # 停止mongo服务
 monit start all # 启动所有服务
 monit start mongo # 启动mongo服务
```
#### 修复系统盘
> https://aws.amazon.com/premiumsupport/knowledge-center/ec2-sudoers-syntax-errors-sudo/  
> https://serverfault.com/questions/948408/mount-wrong-fs-type-bad-option-bad-superblock-on-dev-xvdf1-missing-codepage
```
If the instances were launched using the same AMI then their root volumes will have been created from the same EBS snapshot, so the problem is likely duplicate XFS UUIDs. The error message from mount isn't very helpful, but you may see errors like this in /var/log/messages or equivalent:

Jan 13 23:30:29 ip-172-31-15-234 kernel: XFS (nvme1n1): Filesystem has duplicate UUID 56282b3b-c1f3-425e-90db-e9e26def629d - can't mount
(This example is from a t3 instance using NVMe storage, but it's not NVMe-specific.)

Every XFS filesystem has a (supposedly) unique ID stored on-disk, which protects you from accidentally mounting the same filesystem multiple times. Because the EBS snapshot/restore process is a block-level copy, any volumes you create from a snapshot will have the same UUID as the source volume so you can only mount one at a time.

You can view the UUID for a volume by attaching it but not mounting it, then running xfs_db to examine the attached disk:

# xfs_db -c uuid /dev/nvme1n1
UUID = 56282b3b-c1f3-425e-90db-e9e26def629d
(EDIT: The blkid command will also show you the UUID, even if the device is mounted.)

To work around the issue, you can either use the XFS-specific nouuid mount option to temporarily ignore the duplicate check, e.g.

# mount -t xfs -o nouuid /dev/nvme1n1 /mnt
or you can use xfs_admin to permanently change the UUID on the volume:

# xfs_admin -U generate /dev/nvme1n1
Clearing log and setting UUID
writing all SBs
new UUID = 1eb81512-3f22-4b79-9a35-f22f29745c60

sudo mount -t xfs -o nouuid /dev/xvdf1 /mnt

```
