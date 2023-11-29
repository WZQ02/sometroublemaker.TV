<script setup>
    import '../assets/styles/chatroom.css'
    import { onMounted,onUnmounted,ref,getCurrentInstance } from 'vue'
    import ReconnectingWebSocket from'reconnecting-websocket'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiInformation } from '@mdi/js'
    import { setCookie,getCookie } from '../scripts/cookie.js'

    const ws = new ReconnectingWebSocket('wss://wzq02.cf/websocketchat')
    const usrmsg = ref(null)
    const sendmsg = ref(null)
    const content = ref(null)
    const chgUsrName = ref(null)
    const prompb = ref(null)
    const usrName = ref(null)
    const askforusername_pmpt = ref(null)
    const info = ref(null)
    const currentusername = ref(null)
    const notice = ref(null)
    const quoteselector = ref(null)
    const chatroom_container = ref(null)
    const isshowuserinout = ref(null)

    const gCI = getCurrentInstance()

    let sendusrmsg = () => {
	    if (usrmsg.value.value.length <= 0) {
		    //alert(dystr(str1c));
            gCI.proxy?.$bus.emit('trigger_popup',dystr(str1c))

	    } else {
		    ws.send(usrmsg.value.value);
		    usrmsg.value.value = "";
	    }
    }
    let askforusername = () => {
	    //更改用户名并刷新本页后，再次修改用户名时把原先用户名自动填写在usrname区
	    usrName.value.value = getCookie('chatUserName');
	    prompb.value.style.display = "block";
	    askforusername_pmpt.value.style.display = "block";
	    usrName.value.addEventListener('keydown',(e) => {
		    if (e.keyCode == 13) {
			    chgusername();
		    }
	    });
    }
    let chgusername = () => {
        let usrNameValue = usrName.value.value;
	    if (usrNameValue == '') {
		    //alert(dystr(str2c));
            gCI.proxy?.$bus.emit('trigger_popup',dystr(str2c))
	    } else {
		    setCookie('chatUserName',usrNameValue,365);
		    var RealusrName = getCookie('chatUserName');
		    ws.send(`setUsrName=${RealusrName}`);
		    noticeUser();
		    askforusername_pmpt.value.style.display = "";
	    }
    }
    //存储“是否显示用户进入、退出”的信息到cookie
    let isshowuserinout_store = () => {
        setCookie('isshowuserinout',isshowuserinout.value.checked,365);
    }
    //显示注意事项
    let noticeUser = () => {
	    notice.value.style.display = "block";
    }
    //关闭注意事项
    let closeprompt = () => {
	    if (notice.value.style.display == "block") {
	    	notice.value.style.animation = "zoomout2 0.2s cubic-bezier(0.6, 0, 1, 0.4) 1";
	    	setTimeout(function(){notice.value.style.display = "none";notice.value.style.animation = ""},192);
	    }
	    if (info.value.style.display == "block") {
	    	info.value.style.animation = "zoomout2 0.2s cubic-bezier(0.6, 0, 1, 0.4) 1";
	    	setTimeout(function(){info.value.style.display = "none";info.value.style.animation = ""},192);
	    }
	    prompb.value.style.animation = "disappear 0.2s ease 1";
	    setTimeout(function(){prompb.value.style.display = "";prompb.value.style.animation = ""},192);
    }
    //显示信息
    let displayinfo = () => {
	    var RealusrName = getCookie('chatUserName');
	    prompb.value.style.display = "block";
	    info.value.style.display = "block";
	    currentusername.value.innerText = RealusrName
    }
    //信息页面修改用户名
    let alterusrname = () => {
	    info.value.style.display = "none";
	    askforusername();
    }

    let format = (str) => {
	    const formatted = document.createElement('p');
	    var roominfo = document.getElementById('roominfo');
	    if (str.indexOf('{') == 0) {//服务器通知当前用户发出的信息或其他用户的相关信息
		    let parseStr = JSON.parse(str);
            formatted.innerHTML = `<span class="timer">${parseStr.time}</span><br/>`;
		    roominfo.innerText = parseStr.online;
		    switch (parseStr.type) {
			    case 0://用户离线时formatted的class
                    if (isshowuserinout.value.checked) {//根据是否选中“不显示用户进入退出信息”决定是否呈现相关信息
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${parseStr.msg}</span>`
                        formatted.className = "leave";
                    }
				    break;
			    case 1://用户加入时
                    if (isshowuserinout.value.checked) {
                        formatted.innerHTML = ""
                    } else {
                        formatted.innerHTML = formatted.innerHTML + `<span class="msg">${parseStr.msg}</span>`
                        formatted.className = "entry";
                    }
				    break;
			    case 2://用户发言时
                    //单独提取用户名和发言信息
                    let speak_name = parseStr.msg.slice(0,parseStr.msg.indexOf(": "))
                    let speak_cont = parseStr.msg.slice(parseStr.msg.indexOf(": ")+2)
                    formatted.innerHTML = formatted.innerHTML + `<span class="speak_name">${speak_name}</span><br><div class="speak_cont_contain"><span class="speak_cont">${speak_cont}</span><div>`
                    //判断是不是自己发言
                    if (getCookie('chatUserName') == speak_name) {
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
    //语录选择器
    let quotechange = () => {
        let selector = quoteselector.value
	    usrmsg.value.value = usrmsg.value.value + selector.options[selector.selectedIndex].value
    }
    //将滚动条位置置于底部
    let goBottom = () => {
        content.value.scrollTop = content.value.scrollHeight;
    }

    //生成随机数改变chatroom页面的部分字符串
    const str1c = ["消息不能为空", "你咋不说话啊", "空消息是发不出来的，别试啦"];
    const str2c = ["用户名不能为空，怕你不知道跟你说一下", "起个昵称吧", "你不起名字，别人咋认得你是谁啊"];
    let dystr = (strxc) => {return strxc[Math.floor(Math.random()*3)];}

    onMounted(() => {
        //通知控制台已连接到服务器，并检查cookie里面的用户名
        ws.addEventListener('open', (e) => {
	        console.log("已连接到聊天服务器。");
	        var RealusrName = getCookie('chatUserName');
	        if (RealusrName == "") {
		        askforusername();
	        } else {
	            ws.send(`setUsrName=${RealusrName}`);
	        }
	        goBottom();
        });
        //接受服务器发送的信息，并呈现于chatcontent
        ws.addEventListener('message', (e) => {
        	console.log(e.data);
	        content.value.appendChild(format(e.data));
	        goBottom();
        });
        //回车发送
        usrmsg.value.addEventListener('keydown',(e) => {
	        if (e.keyCode == 13) {
		        sendusrmsg();
	        }
        });
        //读取cookie并设置存储“是否显示用户进入、退出”的信息到cookie
        if (getCookie('isshowuserinout') == 'true') {
            isshowuserinout.value.checked = 1;
        } else {
            isshowuserinout.value.checked = 0;
        }
    })

    onUnmounted(() => {
        //退出聊天室前关闭连接
        ws.close();
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="chatroom_container" ref="chatroom_container" key="chatroom_container">
        <div id="chatcontent" ref="content" name="chatcontent"></div>
        <input type="text" class="text_input" v-bind:placeholder="$t('chatroom.input.1')" id="usrmsg" ref="usrmsg">
        <div id="panel1">
            <select id="quoteselector" @change="quotechange();" ref="quoteselector">
                <option value="(=・ω・=)">(=・ω・=)</option>
                <option value="(ﾟДﾟ≡ﾟдﾟ)!?">(ﾟДﾟ≡ﾟдﾟ)!?</option>
                <option value="(￣3￣)✧">(￣3￣)✧</option>
                <option value="(≖ ◡ ≖✿)">(≖ ◡ ≖✿)</option>
                <option value="_(≧∇≦」∠)_">_(≧∇≦」∠)_</option>
                <option value="━━━∑(ﾟ□ﾟ*川━">━━━∑(ﾟ□ﾟ*川━</option>
                <option value="(╯°口°)╯(┴—┴">(╯°口°)╯(┴—┴</option>
                <option value="(-_-#)">(-_-#)</option>
                <option value="(๑>؂<๑）">(๑>؂&lt;๑）</option>
                <option value="草">草</option>
                <option value="呵呵">呵呵</option>
                <option value="什么意思？">什么意思？</option>
            </select>
            <button id="sendmsg" ref="sendmsg" @click="sendusrmsg();">{{ $t("chatroom.button.send") }}</button>
            <svg-icon type="mdi" :path=mdiInformation @click="displayinfo();" height="24" width="24"></svg-icon>
        </div>
        <div id="prompb" ref="prompb"></div>
        <div id="askforusername" ref="askforusername_pmpt" class="prompt">
            <input type="text" class="text_input" v-bind:placeholder="$t('chatroom.input.2')" id="usrName" ref="usrName">
            <button id="promptbtn" @click="chgusername();" ref="chgUsrName">{{ $t("chatroom.button.confirm") }}</button>
        </div>
        <div id="notice" ref="notice" class="prompt">
            <span>
                {{ $t("chatroom.message.1") }}<p>{{ $t("chatroom.message.2") }}</p><p>
                {{ $t("chatroom.message.3") }}</p><p>{{ $t("chatroom.message.4") }}</p><p>
                {{ $t("chatroom.message.5") }}</p>
            </span>
            <button id="promptbtn" @click="closeprompt();">{{ $t("chatroom.button.ok_got_it") }}</button>
        </div>
        <div id="info" ref="info" class="prompt">
            {{ $t("chatroom.message.6") }}<span id="currentusername" ref="currentusername" style="font-weight: bold;"></span>&nbsp;&nbsp;<button id="promptbtn" @click="alterusrname();">{{ $t("chatroom.button.change") }}</button><br><br>
            {{ $t("chatroom.message.7") }}<span id="roominfo" style="font-weight: bold;"></span><br><br>
            <input type="checkbox" id="isshowuserinout" name="isshowuserinout" ref="isshowuserinout" @click="isshowuserinout_store()"><span>{{ $t("chatroom.message.8") }}</span><br><br>
            <button id="promptbtn" @click="closeprompt();">{{ $t("chatroom.button.got_it") }}</button>
        </div>
    </div></TransitionGroup>
</template>

<style>
</style>