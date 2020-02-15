## Music Dance -- Visualize

#### 音频可视化
* Web Player & AudioDance
* 可播放本地文件和音频链接

> [Example](musicdance/musicdemo.html)
```
var player = null;
window.onload = function() {
    player = new WebPlayer();
    player.init();
};
```

##### 参考资料
* [MDN AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext)
* [MDN AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)
* [基于Web Audio API实现音频可视化效果](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
