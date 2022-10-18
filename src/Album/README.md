# Album

相册桌面组件

- 随机显示相册图片
- 支持多相册多组件不同显示

参数为相册名

## 参数

支持通过 URL Scheme 跳转打开相册或指定图片

| 参数名 | 说明 |
| :---- | :--- |
| album | 相册名 |
| filename | 相册内图片文件名 |

## 存储

图片过大时 JSBox 桌面组件无法正常显示，为此添加的图片会稍微压缩下提高 JSBox 渲染稳定性

所有图片均存于应用的 `albums/` 文件夹内

`albums/` 文件夹内的文件夹名为相册名

如果通过应用添加的图片不够清晰可以直接通过 JSBox 目录导入原图

也可以通过 JSBox 自带的目录功能重命名、删除等等，自己发觉吧