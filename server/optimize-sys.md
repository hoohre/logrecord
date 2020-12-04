## 系统优化加载

#### sysctl
> netstat -n | awk '/^tcp/ {++y[$NF]} END {for(w in y) print w, y[w]}'  
>
> netstat -n | grep TIME_WAIT | wc -l  
>
> /ect/sysctl.conf
```
net.core.somaxconn = 1024  # default 128
net.ipv4.tcp_max_tw_buckets = 18000  # default 65536, 18000
net.ipv4.tcp_fin_timeout = 30  # default 60
net.ipv4.tcp_max_syn_backlog = 8192  # 512
net.ipv4.tcp_tw_reuse = 1  # default 0
net.ipv4.tcp_syn_retries = 6  # default 6
net.ipv4.tcp_synack_retries = 3  # default 5
## close wait
net.ipv4.tcp_keepalive_time = 1800  # default 7200
net.ipv4.tcp_keepalive_probes = 3   # default 9
net.ipv4.tcp_keepalive_intvl = 15  # default 75
```
> sysctl -p 

##### *不要在linux上启用net.ipv4.tcp_tw_recycle参数*  
##### *et.ipv4.tcp_tw_recycle 4.12被移除*

#### uwsgi & uwsgitop
> config options 
```
http-socket = 127.0.0.1:8079
master = true
processes = 8
chdir = /data/part1/pypro/tabio
env = DJANGO_SETTINGS_MODULE=tabio.settings
module = tabio.wsgi:application
;processes = 2
;threads = 8
enable-threads = true
max-requests = 100000
thunder-lock = true
listen = 1024
buffer-size = 40960
post-buffering = 40960
harakiri=30

uid=root
gid=root
; 退出uwsgi是否清理中间文件，包含pid、sock和status文件
vacuum=true
; socket文件，配置nginx时候使用
;socket=%(chdir)/uwsgi/uwsgi.sock
# status文件，可以查看uwsgi的运行状态
stats=%(chdir)/uwsgi/uwsgi.status
# pid文件，通过该文件可以控制uwsgi的重启和停止
pidfile=%(chdir)/uwsgi/uwsgi.pid

; Disable built-in logging
;disable-logging = true
; log requests slower than the specified number of milliseconds
;log-slow = 2000
; but log 4xx's anyway
;log-4xx = true
; and 5xx's
;log-5xx = true
```
>>  gevent  
>>  vacuum  
>> daemonize = /var/log/uwsgi.log  

```
uwsgi --ini uwsgi/uwsgi.status        # 启动
uwsgi --reload uwsgi/uwsgi.status        # 重启
uwsgi --stop uwsgi/uwsgi.status         # 关闭
```

`uwsgi --connect-and-read uwsgi/uwsgi.status`

`uwsgitop uwsgi/uwsgi.status`

#### Linux查看物理CPU个数、核数、逻辑CPU个数
```
# 总核数 = 物理CPU个数 X 每颗物理CPU的核数 
# 总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数

# 查看物理CPU个数
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l

# 查看每个物理CPU中core的个数(即核数)
cat /proc/cpuinfo| grep "cpu cores"| uniq

# 查看逻辑CPU的个数
cat /proc/cpuinfo| grep "processor"| wc -l

# 查看CPU信息（型号）
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c

# 查看内 存信息
cat /proc/meminfo
```

#### 参考资料
* [Linux实例常用内核网络参数介绍与常见问题处理](https://help.aliyun.com/knowledge_detail/41334.html)  
* [解决TIME_WAIT过多造成的问题](https://www.cnblogs.com/dadonggg/p/8778318.html)  
