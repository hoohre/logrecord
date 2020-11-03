## Linux Install Redis

#### Installation
> Download, extract and compile Redis with:
```
$ wget https://download.redis.io/releases/redis-6.0.9.tar.gz
$ tar xzf redis-6.0.9.tar.gz
$ cd redis-6.0.9
$ make
```
> The binaries that are now compiled are available in the src directory. Run Redis with: 
```
$ src/redis-server
```
> You can interact with Redis using the built-in client:
```
$ src/redis-cli
redis> set foo bar
OK
redis> get foo
"bar"
```

#### Configration
| Param         | Default       | Desc  |
| ------------- |:-------------:| :-----|
| daemonize  | yes/no  | yes表示启用守护进程，默认是no即不以守护进程方式运行。其中Windows系统下不支持启用守护进程方式运行|
| port  | 6379 | 指定 Redis 监听端口，默认端口为 6379  |
| bind  | 127.0.0.1 | 绑定的主机地址,如果需要设置远程访问则直接将这个属性备注下或者改为bind * 即可,这个属性和下面的protected-mode控制了是否可以远程访问 |
| protected-mode | yes/no | 保护模式，该模式控制外部网是否可以连接redis服务，默认是yes,所以默认我们外网是无法访问的，如需外网连接rendis服务则需要将此属性改为no|
| timeout | 300 | 当客户端闲置多长时间后关闭连接，如果指定为 0，表示关闭该功能  |
| loglevel | debug/verbose/notice/warning  | 日志级别，默认为 notice  |
| logfile | ""  | 日志记录的位置，默认是直接输出到控制台中。|
| databases | 16 | 设置数据库的数量，默认的数据库是0  |
| rdbcompression |  yes、no |  指定存储至本地数据库时是否压缩数据，默认为yes，Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大|   
| dbfilename | dump.rdb | 指定本地数据库文件名，默认值为 dump.rdb  |
| dir | | 指定本地数据库存放目录 |
| requirepass |	 | 设置 Redis 连接密码，如果配置了连接密码，客户端在连接 Redis 时需要通过 AUTH <password> 命令提供密码，默认关闭 |
| maxclients | 0 | 设置同一时间最大客户端连接数，默认无限制，Redis可以同时打开的客户端连接数为Redis进程可以打开的最大文件描述符数，如果设置maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息。|
| maxmemory	| XXX <bytes> | 指定 Redis 最大内存限制，Redis 在启动时会把数据加载到内存中，达到最大内存后，Redis 会先尝试清除已到期或即将到期的 Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis 新的 vm 机制，会把 Key 存放内存，Value 会存放在 swap 区。配置项值范围列里XXX为数值。|

#### 杂项
```
安装完 Redis，可以看到 Redis 安装目录下只有一个 bin 目录，目录内容如下：
	redis-server —— Redis 的服务器
	redis-cli —— Redis 的命令行客户端
	redis-benchmark —— Redis 的性能测试工具
	redis-check-rdb —— Redis 的 RDB 文件检索工具
	redis-check-aof —— Redis 的 AOF 文件修复工具
	redis-sentinel —— Redis 的集群监控工具

```

#### 参考资料
* [Redis - Download](https://redis.io/download)  
