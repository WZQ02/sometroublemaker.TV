# 这东西到底是个啥？

目前来说，这个东西就是一个带有弹幕功能的 HLS 直播流播放器，和一个在线聊天室（弹幕和聊天室共用一个后端，所以发送的弹幕也会出现在聊天室）。<br>
~~我写这个东西的主要目的是为了上手并熟悉 Vue 3 前端框架。（是的，这是我做的第一个 Vue App）~~

## 我可以往上面推送视频流吗？

可以。你可以使用 OBS 或者 FFmpeg 等支持 RTMP 推流协议的软件推送直播流，推流成功后就能在[播放页面](https://play.wzq02.top/player)看到视频。如果有这方面的需要，请在社交平台私信我，以获取推流地址。（出于安全考虑，推流地址不会公开）

## 为什么要用到这个，而不是在已有的主流直播平台直播？

~~因为在这里直播不会莫名奇妙地被超管ban掉。~~

## 我能自己部署吗？

可以。部署教程见[如何部署](./deployment_zh-CN.md)。

## 使用到的项目（包括但不限于）：

- [Vue](https://vuejs.org/)
- [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket)
- [Danmaku](https://danmaku.js.org/)
- [Hammer](http://hammerjs.github.io/)
- [MaterialDesign-JS](https://github.com/Templarian/MaterialDesign-JS)
- [Marked](https://marked.js.org/)
- [hls.js](https://github.com/video-dev/hls.js/)
- [mpegts.js](https://github.com/xqq/mpegts.js)

## 许可证

不想纠结太多了，所以本项目采用 MIT 协议发布。