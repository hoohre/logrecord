## Mac Install Redis

##### type below:

```
brew update
brew install redis
```

To have launchd start redis now and restart at login:
```
brew services start redis
```

to stop it, just run:

```
brew services stop redis
```

Or, if you don't want/need a background service you can just run:

```
redis-server /usr/local/etc/redis.conf
```

Test if Redis server is running.

```
redis-cli ping
```
If it replies “PONG”, then it’s good to go!

Location of Redis configuration file.

```
/usr/local/etc/redis.conf
```

Uninstall Redis and its files.

```
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

##### 
```
$> brew install redis
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (homebrew/services).
No changes to formulae.

==> Downloading https://mirrors.aliyun.com/homebrew/homebrew-bottles/bottles/redis-6.0.7.catalina.bottle.tar.gz
==> Pouring redis-6.0.7.catalina.bottle.tar.gz
==> Caveats
To have launchd start redis now and restart at login:
  brew services start redis
Or, if you don't want/need a background service you can just run:
  redis-server /usr/local/etc/redis.conf
==> Summary
🍺  /usr/local/Cellar/redis/6.0.7: 13 files, 3.8MB
==> `brew cleanup` has not been run in 30 days, running now...

```