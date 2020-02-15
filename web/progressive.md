## Page Load But Not Fresh

#### 适应情景
> 页面整体框架不变  
> 每个页面都有重复请求  
> 需要优化页面加载  

#### 实现过程
1. URL改变, 不刷新页面  
```
history.pushState(state, title, url)
```

2. ajax获取数据, 改变页面布局和数据渲染
> 页面布局数据  
> 异步请求获取数据

3. 监听浏览器前进后退事件, 再次渲染布局和文件  
```
window.onpopstate = function(e){
    if(e.state!=null){
        console.log(e.state)
    }
};
```

#### FAQs
* 首次加载页面时`state=null`, 浏览器后退到此页面时无法渲染数据  
>加入状态变化控制, 首次加载判断`state=null? history.replaceState`

* 页面布局文件的加载  
>最好有服务端配合, ajax.GET获取布局文件
```
$.ajax({
    url: "http://localhost:9000/html/<h5>.tmpl",
    headers: {'Content-Type': 'text/html'},
    dataType: 'text',
    success: function (res) {
        $('.container').html(res);
    }
});    
```

##### 参考资料
* [MDN History](https://developer.mozilla.org/en-US/docs/Web/API/History)
* [MDN onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
