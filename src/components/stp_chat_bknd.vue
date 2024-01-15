<script setup>
    import { getCurrentInstance } from 'vue'
    import ReconnectingWebSocket from'reconnecting-websocket'
    import { marked } from 'marked'

    let ws,chat_sendheartbeat
    const gCI = getCurrentInstance()

    //chatroom活动状态
    let chatroom_isalive = 0
    //chatroom组件不活动时，缓存的消息列表
    let cached_message_list = []
    //用户是否勾选“是否显示用户进入、退出”
    let chatroom_isshowuserinout = 0
    //用户是否禁用markdown
    let chatroom_ismarkdown = 0

    //向服务器发送信息
    gCI.proxy?.$bus.on('chatroom_send',(e)=>{
        let msg = {
            type: 1,
            msg: e
        };
        ws.send(JSON.stringify(msg));
        startsendbeat()
        //ws.send(e);
    })
    //向服务器发送更改用户名信息
    gCI.proxy?.$bus.on('chatroom_chgusrname',(e)=>{
        let msg = {
            type: 2,
            username: e
        };
        ws.send(JSON.stringify(msg));
        startsendbeat()
        //ws.send(`setUsrName=${e}`);
    })

    //对服务器发送的信息进行格式化
    let format = (str) => {
	    const formatted = document.createElement('p');
	    if (str.indexOf('{') == 0) {//服务器通知当前用户发出的信息或其他用户的相关信息
		    let parseStr = JSON.parse(str);
            formatted.innerHTML = `<span class="timer">${parseStr.time}</span><br/>`;
            if (chatroom_isalive) {
                gCI.proxy?.$bus.emit('chatroomchgroominfo',parseStr.online)
            }
		    switch (parseStr.type) {
			    case 0://用户离线时formatted的class
                    if (chatroom_isshowuserinout) {//根据是否选中“不显示用户进入退出信息”决定是否呈现相关信息
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${replaceHTMLtags(parseStr.msg)}</span>`
                        formatted.className = "leave";
                    }
				    break;
			    case 1://用户加入时
                    if (chatroom_isshowuserinout) {
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${replaceHTMLtags(parseStr.msg)}</span>`
                        formatted.className = "entry";
                    }
				    break;
			    case 2://用户发言时
                    //单独提取用户名和发言信息
                    let speak_name = replaceHTMLtags(parseStr.msg.slice(0,parseStr.msg.indexOf(": ")))
                    let speak_cont = replaceHTMLtags(parseStr.msg.slice(parseStr.msg.indexOf(": ")+2))
                    if (chatroom_ismarkdown) {
                    } else {
                        speak_cont = marked.parse(speak_cont)
                    }
                    formatted.innerHTML = formatted.innerHTML + `<span class="speak_name">${speak_name}</span><br><div class="speak_cont_contain"><span class="speak_cont">${speak_cont}</span><div>`
                    //判断是不是自己发言
                    if (localStorage.getItem('chatUserName') == speak_name) {
                        formatted.className = "speak isyou";
                    } else {
                        formatted.className = "speak";
                    }
				    break;
		    }
	    } else {//服务器通知当前用户已加入聊天室
		    formatted.innerText = str;
	    }
	    return formatted;
    }
    let startsendbeat = () => {//每隔55秒发送心跳包
        if (chat_sendheartbeat) {
            clearInterval(chat_sendheartbeat)
        }
        chat_sendheartbeat = setInterval(()=>{
            let msg = {
                type: 5
            };
            ws.send(JSON.stringify(msg))
        },55000)
    }
    //防止用户输入的html标签和脚本生效（防xss）
    let replaceHTMLtags = (e) => {
        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    //chatroom组件被初次挂载后，启动ws
    gCI.proxy?.$bus.on('req_chatserverbknd',() => {
        let ws_options = {debug: false};
        if (localStorage.getItem('adv_set_enabled') == 1 && localStorage.getItem('custom_ws_url')) {
            ws = new ReconnectingWebSocket(localStorage.getItem('custom_ws_url'), null, ws_options)
        } else {
            ws = new ReconnectingWebSocket('wss://wzq02.cf/websocketchat', null, ws_options)
        }
        ws.addEventListener('open', (e) => {
            //告知chatroom组件，已连接服务器
            gCI.proxy?.$bus.emit('chatserverconnected')
	        console.log("已连接到聊天服务器。");
        });
        //接受服务器发送的信息，并呈现于chatcontent
        ws.addEventListener('message', (e) => {
            //chatroom活动时，立即呈现信息
            if (JSON.parse(e.data).type == 5) {//接收到心跳包时，不做任何动作
                return
            }
            console.log(e.data);
            if (chatroom_isalive) {
                gCI.proxy?.$bus.emit('chatroomdisplaymsg',format(e.data))
            } else {
                //chatroom不活动时，缓存消息到cached_message_list
                cached_message_list[cached_message_list.length] = format(e.data);
                console.log("离开聊天室界面期间，共接收到 "+cached_message_list.length+" 条信息。")
            }
        });
        startsendbeat();
    })
    gCI.proxy?.$bus.on('chatroomactivated',()=>{
        chatroom_isalive = 1
        //chatroom激活时，若存在被缓存的信息，呈现于chatroom界面
        if (cached_message_list.length != 0) {
            for (let i=0; i<cached_message_list.length; i++) {
                gCI.proxy?.$bus.emit('chatroomdisplaymsg',cached_message_list[i])
            }
            cached_message_list = []
        }
    })
    gCI.proxy?.$bus.on('chatroomdeactivated',()=>{
        chatroom_isalive = 0
    })
    gCI.proxy?.$bus.on('chatroomisshowuserinout_onchange',(e)=>{
        chatroom_isshowuserinout = e
    })
    gCI.proxy?.$bus.on('chatroomismarkdown_onchange',(e)=>{
        chatroom_ismarkdown = e
    })
</script>

<template>
</template>