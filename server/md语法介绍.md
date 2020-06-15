
# 1. MarkDown标记语法
-----
>This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

> ## 2. 这是一个标题。
>
> 1.   这是第一行列表项。
> 2.   这是第二行列表项。
>
> 给出一些例子代码：
>
>     return shell_exec("echo $input | $markdown_script");

### 3. 无序*
* Red
* Green
* Blue

### 4. 无序+
+   Red
+   Green
+   Blue

### 5. 无序-
-   Red
-   Green
-   Blue

### 6. 有序
1.  Bird
2.  McHale
3.  Parish

*   A list item with a blockquote:
    > This is a blockquote
    > inside a list item.

### 7. 有序
1.  Bird
*  McHale
*  Parish

### 8. 分割线
* * *

***

****

---

- - -
## 9. 斜体
*single asterisks*

_single underscores_

## 10. 粗体
**double asterisks**

__double underscores__

## 111. 图片、超链接
![Alt text](/path/to/img.jpg)

![Alt text](/path/to/img.jpg "Optional title")

I get 10 times more traffic from [Google][1] than from
[Yahoo][2] or [MSN][3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"

## 12. 表格
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> `*`备注
>>1. :----: 居中
>>2. ----: 右对齐
>>3. :---- 左对齐
>>4. 默认左对齐

### 13. 代码
```
func HttpGet(apiURL string, params url.Values) (rs []byte, err error) {
    var Url *url.URL
    Url, err = url.Parse(apiURL)
    if err != nil {
        log.Errorf("Parse url error for :%v, URL:%s", err, apiURL)
        return nil, err
    }
    Url.RawQuery = params.Encode()
    resp, err := http.Get(Url.String())
    if err != nil {
        log.Errorf("Request error for :%v, URL:%s", err, apiURL)
        return nil, err
    }
    defer resp.Body.Close()
    return ioutil.ReadAll(resp.Body)
}
```

### 完
