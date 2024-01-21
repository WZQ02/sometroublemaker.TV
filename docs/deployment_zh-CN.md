# 如何部署

如果你想要自己部署这个项目，你将需要：

- 一个可以接受 RTMP 视频流，并将 RTMP 流转换为 HLS 流的媒体服务器。
  - 你可以使用如 [SRS](https://ossrs.net/)、[Nginx-RTMP](https://github.com/arut/nginx-rtmp-module) 这样的媒体服务方案。
- 聊天室的后端服务器。
  - 聊天室后端服务基于 Node.js 搭建，服务端代码见 [WZQ02/wzq02.github.io](https://github.com/WZQ02/wzq02.github.io) 仓库中 chatroom1 目录下的 server-verbose.js。<br>
  如需部署，将这个文件放在服务器上的一个空文件夹中，然后在同目录下新建一个 package.json 文件。里面填写：
  ```json
  {
    "dependencies": {
      "nodejs-websocket": "^1.7.2"
    }
  }
  ```
  之后在这个目录下执行 ```npm install``` 安装依赖包，安装完后运行 ```node server-verbose.js``` 以启动服务。（服务默认端口号为 8081，可按需修改）
- 提供前端页面的 Web 服务器（也可以用 GitHub Pages 或者 Vercel 等网页托管平台）。

当你已经部署完前两项后，你就可以直接在[我的网站这边](http://wzq02.cf/playgrnd/)测试你部署的后端服务了。需要在[设置页面](http://wzq02.cf/playgrnd/#/settings)里启用高级设置，然后在下方的两个输入框里面填写你部署的视频服务器和聊天服务器地址。（如果你是以 HTTPS 协议访问我的网站，则你的后端服务也应该以 HTTPS 协议提供，否则会用不了）

要部署前端页面的话，你将需要将本项目 Clone 下来，在项目根目录下使用 ```npm install``` 命令安装依赖项，并修改本项目的一些代码。要改的主要有这么几处：

- /index.html 中 link 项中引用的图标，和 title 部分的文字，这俩都改成你自己的，改成什么都行。
- /src/images 中的图标文件，同样换成你自己的。
- /src/pages 目录下 welcome.vue 和 home.vue 里面的标题、文字内容和超链接，都换成你自己的。
- /src/pages/live_player.vue 中 template 部分结尾的两个 button，删掉或把里面的链接换成自己的。
- /src/pages/live_player.vue 中的两个常量 vid_domain 和 vid_src，其中 vid_domain 中的三个项全换成你的直播服务器所在的域名，vid_src 第一项换成你的直播服务器提供的 HLS M3U8 文件的地址，第二项换成你的直播服务器提供的 HTTP-FLV 或 MPEG-TS 流的地址。
- /src/components/stp_chat_bknd.vue 中的常量 chatroom_defualt_url，换成你部署的聊天室后端服务地址。（这里是 ws/wss 而不是 http/https，如 ws://114.51.45.81:8081）

修改完后，在项目根目录下执行 ```npm run build``` 构建用于部署的代码，构建完后再把 dist 子目录下的文件扔到你的 Web 服务器（或者网页托管平台）上，即可完成部署。