
### 数据备份
> MySQL  
>> mysqldump -uroot -p dbbase > mysql/dbbase.sql  
>>
> MongoDB  
>>  mongodump.exe --host="127.0.0.1:27017" --username="server" --password="xxxx" --authenticationDatabase="admin"  --db="biolink" --out="E:\\Bakup\\mongo\\" 
### 数据备份 - 迁移
> MySQL  
>> mysqldump -uroot -p dbbase > mysql/dbbase.sql  
>> mysqldump -uroot -p dbbase | gzip > dbbase.200614.sql.gz  
>> xxxx  
>>
>> gunzip backup.sql.gz
>>
>> mysqldump --host=$src_host --port=$src_port -u$src_user -p$src_password $src_database --tables $src_table | mysql --host=$dst_host --port=$dst_port -u$dst_user -p$dst_password $dst_database
>>
>> gunzip < dbbase.200614.sql.gz | mysql -h127.0.0.1 -uroot -p dbbase
>> xxxx 
>
>
> MongoDB  
>>  mongodump.exe --host="127.0.0.1:27017" --username="server" --password="xxxxxx" --authenticationDatabase="admin"  --db="biolink" --out="E:\\Bakup\\mongo\\" 
>>
>> mongorestore --host="127.0.0.1:27017" --username="server" --password="xxxxxx" --authenticationDatabase="admin" E:\\Bakup\\mongo\\
>
#### 阿里云DTS
> 使用增量备份, 实现不停机迁移
>
#### 查看服务器状态
> show status like "%connections%";  
> show processlist; 
> select * from information_schema.processlist WHERE time > 10;  
>
>
### 参考资料
* [从ECS上的自建MySQL同步至RDS MySQL](https://www.alibabacloud.com/help/zh/doc-detail/118368.htm#concept-263741) 
* [mysqldump 深入浅出](https://juejin.im/post/5b6a4838e51d4519560570d6)
* [使用MongoDB工具迁移自建数据库上云](https://www.alibabacloud.com/help/zh/doc-detail/100995.htm#concept-ztl-f4w-fgb)
* [使用DTS的增量数据迁移时Binlog相关的预检查项失败](https://help.aliyun.com/knowledge_detail/52126.html)