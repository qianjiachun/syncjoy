## 自动部署模块

1. 在这个目录下新建`config.json`文件，内容如下：

```json
[
  {
    "host": "ip",
    "port": "端口",
    "username": "ssh账号",
    "password": "ssh密码",
    "remotePath": "服务器上的部署目录"
  }
  // 其余服务器
]
```

2. `pnpm run deploy`即可自动部署到服务器上
