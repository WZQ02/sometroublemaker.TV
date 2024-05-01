<script setup>
    import { getCurrentInstance } from 'vue'
    import ReconnectingWebSocket from'reconnecting-websocket'
    import { marked } from 'marked'
    import { stp_store } from '../store.js'
    import DOMPurify from 'dompurify'

    let ws,chat_sendheartbeat,init_finished
    const gCI = getCurrentInstance()

    //chatroom活动状态
    let chatroom_isalive = 0
    //chatroom组件不活动时，缓存的消息列表
    let cached_message_list = []
    //用户是否勾选“是否显示用户进入、退出”
    let chatroom_isshowuserinout = 0
    //用户是否禁用markdown
    let chatroom_ismarkdown = 0
    //上一条消息是否是用户发言
    let is_last_msg_from_user = 0
    //上一次从服务器接收到的时间码
    let last_received_time = 0
    //chatroom ws服务的地址
    const chatroom_defualt_url = 'wss://wzq02.top/websocketchat'
    //当前在线的sid列表
    let sid_list = {}
    //dots活动状态
    let dots_isalive = 0
    //在线人数统计
    let online_count = 0
    //弹幕是否显示发送者昵称
    let danmaku_showname = 0

    //向服务器发送信息
    gCI.proxy?.$bus.on('chatroom_send',(e)=>{
        if (e.length > 256000) {//msg长度不应超过250k
            gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.3.3"))
            return
        }
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
        if (e.length > 50) {//username长度不应超过50
            gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.3.1"))
            return
        }
        let msg = {
            type: 2,
            username: e
        };
        ws.send(JSON.stringify(msg));
        startsendbeat()
        //ws.send(`setUsrName=${e}`);
    })
    gCI.proxy?.$bus.on('chatroom_clean_history',()=>{
        ws.send(JSON.stringify({type:90}));//清除历史记录
        if (document.querySelector(".prev_msgs")) {
            document.querySelector(".prev_msgs").style.display = "none";
        }
        gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.1.7"))
    })

    gCI.proxy?.$bus.on('dots_activate',()=>{
        dots_isalive = 1;
        if (init_finished) {
            update_dots();
        }
    })
    gCI.proxy?.$bus.on('dots_deactivate',()=>{
        dots_isalive = 0;
    })
    gCI.proxy?.$bus.on('chat_send_beacon',()=>{
        ws.send(JSON.stringify({type:20}));//发送信标
    })
    function update_dots() {
        gCI.proxy?.$bus.emit('dots_update',sid_list)
    }

    if (stp_store.settings.danmaku_showname.value) {
        danmaku_showname = 1
    }
    gCI.proxy?.$bus.on('dm_showname_toggle',(checked)=>{
        if (checked) {
            danmaku_showname = 1
        } else {
            danmaku_showname = 0
        }
    })

    //对服务器发送的信息进行格式化
    let format = (str) => {
	    const formatted = document.createElement('div');
	    if (str.indexOf('{') == 0) {//服务器通知当前用户发出的信息或其他用户的相关信息
		    let parseStr = JSON.parse(str);
            if (((convert_time(parseStr.time) - last_received_time) < 300) && is_last_msg_from_user) {
                formatted.innerHTML = "";//5分钟内，不重复显示时间信息
            } else {
                formatted.innerHTML = `<span class="timer" title="${parseStr.time}">${remove_date(parseStr.time)}</span><br/>`;
            }
            //记录本次接受的时间码
            last_received_time = convert_time(parseStr.time)
		    switch (parseStr.type) {
			    case 0://用户离线时formatted的class
                    if (chatroom_isshowuserinout) {//根据是否选中“不显示用户进入退出信息”决定是否呈现相关信息
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${DOMPurify.sanitize(parseStr.msg)}</span>`
                        formatted.className = "leave";
                    }
                    is_last_msg_from_user = 0
				    break;
			    case 1://用户加入时
                    if (chatroom_isshowuserinout) {
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${DOMPurify.sanitize(parseStr.msg)}</span>`
                        formatted.className = "entry";
                    }
                    is_last_msg_from_user = 0
				    break;
			    case 2://用户发言时
                    //单独提取用户名和发言信息
                    let speak_name,speak_cont
                    if (parseStr.username) {//服务器提供了“用户名”信息
                        speak_name = parseStr.username//这一步先不做sanitize，避免发言信息被不正确截断
                        speak_cont = parseStr.msg.slice(speak_name.length+2)//这一步先不做sanitize，以避免影响后续markdown转换
                    } else {//服务器没有提供“用户名”信息，使用原来的处理逻辑
                        speak_name = DOMPurify.sanitize(parseStr.msg.slice(0,parseStr.msg.indexOf(": ")))
                        if (speak_name == 'undefined') {
                            speak_name = '?'
                        }
                        speak_cont = parseStr.msg.slice(parseStr.msg.indexOf(": ")+2)
                    }
                    //let speak_cont_raw = speak_cont
                    if (!chatroom_ismarkdown) {
                        speak_cont = marked.parse(speak_cont)
                    }
                    speak_name = DOMPurify.sanitize(speak_name)//转换后清理speak_name
                    speak_cont = DOMPurify.sanitize(speak_cont)//转换后清理speak_cont
                    //将换行符转换为HTML格式
                    speak_cont = speak_cont.replace(/\n/g, '<br>')
                    //删除多余的换行符
                    if (speak_cont.slice(-4)=="<br>") {
                        speak_cont = speak_cont.slice(0,-4)
                    }
                    formatted.innerHTML += `<span class="speak_name" title="${parseStr.time}">${speak_name}</span><br><div class="speak_cont_contain"><span class="speak_cont">${speak_cont}</span></div>`
                    //判断是不是自己发言
                    if (stp_store.chatroom.username.value && DOMPurify.sanitize(stp_store.chatroom.username.value) == speak_name) {
                        formatted.className = "speak isyou";
                    } else {
                        formatted.className = "speak";
                    }
                    is_last_msg_from_user = 1
                    //display_msg_as_danmaku(speak_cont_raw);
                    //创建临时DOM元素，以提取用户发言中的纯文本内容，将其呈现于弹幕
                    const tempdiv = document.createElement('div')
                    tempdiv.innerHTML = speak_cont
                    if (danmaku_showname) {
                        tempdiv.innerHTML = speak_name+": "+tempdiv.innerHTML
                    }
                    display_msg_as_danmaku(tempdiv.textContent || tempdiv.innerText || '');
				    break;
                    
                case 9://接收到消息记录
                    formatted.innerHTML = ''//清除时间戳
                    formatted.className = "prev_msgs";
                    let last_recorded_time = 0 //消息记录中上一条显示了时间戳的消息的时间
                    if (parseStr.prev_msg) {
                        for (let i=0; i<Object.keys(parseStr.prev_msg).length; i++) {
                            const formatted_prev_msg = document.createElement('div');
                            let speak_name,speak_cont,speak_time
                            speak_time = DOMPurify.sanitize(parseStr.prev_msg[i].time)
                            if (parseStr.prev_msg[i].username) {
                                speak_name = DOMPurify.sanitize(parseStr.prev_msg[i].username)
                            } else {
                                speak_name = "?"
                            }
                            speak_cont = parseStr.prev_msg[i].msg//同样这一步先不做sanitize
                            if (!chatroom_ismarkdown) {
                                speak_cont = marked.parse(speak_cont)
                            }
                            speak_cont = DOMPurify.sanitize(speak_cont)//转换后清理
                            //将换行符转换为HTML格式，并删除多余的换行符
                            speak_cont = speak_cont.replace(/\n/g, '<br>')
                            if (speak_cont.slice(-4)=="<br>") {
                                speak_cont = speak_cont.slice(0,-4)
                            }
                            if (convert_time(speak_time) - last_recorded_time >= 3600) {//记录间隔超过1小时则显示时间信息
                                last_recorded_time = convert_time(speak_time)
                                formatted_prev_msg.innerHTML = `<span class="timer" title="${speak_time}">${speak_time}</span><br/>`;
                            }
                            formatted_prev_msg.innerHTML += `<span class="speak_name" title="${speak_time}">${speak_name}</span><br><div class="speak_cont_contain"><span class="speak_cont">${speak_cont}</span></div>`
                            if (stp_store.chatroom.username.value && DOMPurify.sanitize(stp_store.chatroom.username.value) == speak_name) {
                                formatted_prev_msg.className = "speak isyou";
                            } else {
                                formatted_prev_msg.className = "speak";
                            }
                            formatted.appendChild(formatted_prev_msg)
                        }
                    }
                    if (Object.keys(parseStr.prev_msg).length >= 1) {
                        formatted.innerHTML += "<span class='msg'> -- 以上为历史消息 -- </span>"
                    }
                    break
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
    //已弃用，目前改用DOMPurify处理
    /*let replaceHTMLtags = (e) => {
        if (stp_store.settings.adv_set_enabled.value == 1 && stp_store.adv_settings.allow_html_in_chat_content.value == 1) {
            return e;
        } else {
            return DOMPurify.sanitize(e);
            //return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        }
    }*/
    //转换服务器提供的时间码，便于计算
    let convert_time = (time) => {
        if (typeof(new Date().getTime)!="undefined") {
            return new Date(time).getTime()/1000 //改用unix时间戳
        } else { //new Date().getTime不兼容的处理，只考虑时间不考虑日期
            if (time.indexOf('M') != -1) {//带有 "AM/PM" 后缀
                time = time.slice(0,-3)
            }
            let hh = Math.ceil(time.slice(-8,-6))
            let mm = Math.ceil(time.slice(-5,-3))
            let ss = Math.ceil(time.slice(-2))
            return hh*3600+mm*60+ss
        }
    }
    let remove_date = (time) => {
        if (time.indexOf('M') != -1) {
            return time.slice(-11)
        } else {
            return time.slice(-8)
        }
    }

    //初始化
    function chatroom_init(by_player) {
        init_finished = 1;
        let ws_options = {debug: false};
        if (stp_store.settings.adv_set_enabled.value == 1 && stp_store.adv_settings.custom_ws_url.value) {
            ws = new ReconnectingWebSocket(stp_store.adv_settings.custom_ws_url.value, null, ws_options)
        } else {
            ws = new ReconnectingWebSocket(chatroom_defualt_url, null, ws_options)
        }
        ws.addEventListener('open', (e) => {
            //告知chatroom组件，已连接服务器
            if (by_player) {} else {
                gCI.proxy?.$bus.emit('chatserverconnected')
            }
            let RealusrName = stp_store.chatroom.username.value;
            if (RealusrName) {//如果存在用户名，更新用户名信息
                gCI.proxy?.$bus.emit('chatroom_chgusrname',RealusrName)
            }
	        console.log("已连接到聊天服务器。");
        });
        //接受服务器发送的信息，并呈现于chatcontent
        ws.addEventListener('message', (e) => {
            //chatroom活动时，立即呈现信息
            if (JSON.parse(e.data).type == 5) {//接收到心跳包时，不做任何动作
                return
            }
            if (JSON.parse(e.data).type == 20) {//接收到信标
                gCI.proxy?.$bus.emit('chat_receive_beacon',JSON.parse(e.data).sid)
                return
            }
            if (JSON.parse(e.data).type == 11) {//接收sid list时，更新sid list后退出
                sid_list = JSON.parse(e.data).sid_list
                //console.log("当前sid列表："+JSON.stringify(sid_list))
                if (dots_isalive) {
                    update_dots();
                }
                return
            }
            if (JSON.parse(e.data).type == 1) {//有人建立用户名时更新sid list
                sid_list[JSON.parse(e.data).sid] = JSON.parse(e.data).username
                if (dots_isalive) {
                    update_dots();
                }
            }
            if (JSON.parse(e.data).type == 0) {//有人退出时更新sid list
                delete sid_list[JSON.parse(e.data).sid]
                if (dots_isalive) {
                    update_dots();
                }
            }
            online_count = JSON.parse(e.data).online;//更新在线人数数值
            console.log(e.data);//如果type不为5,20,11则输出接收到的json到控制台
            if (chatroom_isalive) {
                gCI.proxy?.$bus.emit('chatroomdisplaymsg',format(e.data))
                gCI.proxy?.$bus.emit('chatroomchgroominfo',online_count)//如果chatroom组件活动，告知该组件更新在线人数
            } else {
                //chatroom不活动时，缓存消息到cached_message_list
                cached_message_list[cached_message_list.length] = format(e.data);
                //console.log("离开聊天室界面期间，共接收到 "+cached_message_list.length+" 条信息。")
            }
        });
        startsendbeat();
        //首次挂载时，向服务器请求消息记录
        ws.send(JSON.stringify({type:9}));
    }
    //chatroom组件被初次挂载后，启动ws
    gCI.proxy?.$bus.on('req_chatserverbknd',(by_player) => {
        if (init_finished) {//已由另一组件提前触发初始化
            if (by_player) //由chatroom先触发初始化
            {} else {//player先触发
                setTimeout(()=>{gCI.proxy?.$bus.emit('chatserverconnected')},5)
            }
        } else {
            chatroom_init(by_player);
        }
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
        gCI.proxy?.$bus.emit('chatroomchgroominfo',online_count)//更新在线人数
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

    function display_msg_as_danmaku(content) {//消息以弹幕形式在播放器呈现
        gCI.proxy?.$bus.emit('display_danmaku',content)
    }
</script>

<template>
</template>