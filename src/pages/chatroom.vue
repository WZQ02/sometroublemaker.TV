<script setup>
    import '../assets/styles/chatroom.css'
    import { onMounted,ref,getCurrentInstance,onActivated, onDeactivated } from 'vue'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiInformation } from '@mdi/js'
    import { setCookie,getCookie } from '../scripts/cookie.js'

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
    const roominfo = ref(null)
    const gCI = getCurrentInstance()

    let sendusrmsg = () => {
        if (usrmsg.value.value.length <= 0) {
            gCI.proxy?.$bus.emit('trigger_popup',dystr(str1c))
	    } else {
            gCI.proxy?.$bus.emit('chatroom_send',usrmsg.value.value)
		    usrmsg.value.value = "";
	    }
    }
    let askforusername = () => {
	    //更改用户名并刷新本页后，再次修改用户名时把原先用户名自动填写在usrname区
	    usrName.value.value = getCookie('chatUserName');
	    prompb.value.style.display = "block";
	    askforusername_pmpt.value.style.display = "block";
    }
    let chgusername = () => {
        let usrNameValue = usrName.value.value;
	    if (usrNameValue == '') {
            gCI.proxy?.$bus.emit('trigger_popup',dystr(str2c))
	    } else {
		    setCookie('chatUserName',usrNameValue,365);
		    var RealusrName = getCookie('chatUserName');
            gCI.proxy?.$bus.emit('chatroom_chgusrname',RealusrName)
		    noticeUser();
		    askforusername_pmpt.value.style.display = "";
	    }
    }
    //存储“是否显示用户进入、退出”的信息到cookie
    let isshowuserinout_store = () => {
        setCookie('isshowuserinout',isshowuserinout.value.checked,365);
        gCI.proxy?.$bus.emit('chatroomisshowuserinout_onchange',isshowuserinout.value.checked)
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
    const str1c = [gCI.proxy?.$t("toasts.1.1"), gCI.proxy?.$t("toasts.1.2"), gCI.proxy?.$t("toasts.1.3")];
    const str2c = [gCI.proxy?.$t("toasts.1.4"), gCI.proxy?.$t("toasts.1.5"), gCI.proxy?.$t("toasts.1.6")];
    let dystr = (strxc) => {return strxc[Math.floor(Math.random()*3)];}

    //根据接收的信息更改roominfo（在线人数）数值
    gCI.proxy?.$bus.on('chatroomchgroominfo',(e)=>{
        roominfo.value.innerText = e
    })

    //呈现接受的消息
    gCI.proxy?.$bus.on('chatroomdisplaymsg',(e)=>{
        content.value.appendChild(e);
        goBottom()
    })

    onMounted(() => {
        gCI.proxy?.$bus.emit('req_chatserverbknd')
        gCI.proxy?.$bus.on('chatserverconnected',()=>{
            var RealusrName = getCookie('chatUserName');
	        if (RealusrName == "") {
		        askforusername();
	        } else {
	            //ws.send(`setUsrName=${RealusrName}`);
                gCI.proxy?.$bus.emit('chatroom_send',`setUsrName=${RealusrName}`)
	        }
	        goBottom();
        })
        //回车发送
        usrmsg.value.addEventListener('keydown',(e) => {
	        if (e.keyCode == 13) {
		        sendusrmsg();
	        }
        });
        //回车更改用户名
        usrName.value.addEventListener('keydown',(e) => {
		    if (e.keyCode == 13) {
			    chgusername();
		    }
	    });
        //读取cookie并设置存储“是否显示用户进入、退出”的信息到cookie
        if (getCookie('isshowuserinout') == 'true') {
            gCI.proxy?.$bus.emit('chatroomisshowuserinout_onchange',1)
            isshowuserinout.value.checked = 1;
        } else {
            gCI.proxy?.$bus.emit('chatroomisshowuserinout_onchange',0)
            isshowuserinout.value.checked = 0;
        }
    })
    onDeactivated(() => {
        gCI.proxy?.$bus.emit('chatroomdeactivated')
    })
    onActivated(() => {
        gCI.proxy?.$bus.emit('chatroomactivated');
        goBottom()
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="chatroom_container" ref="chatroom_container" key="chatroom_container">
        <div id="chatcontent" ref="content" name="chatcontent"></div>
        <input type="text" v-bind:placeholder="$t('chatroom.input.1')" id="usrmsg" ref="usrmsg">
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
            <input type="text" v-bind:placeholder="$t('chatroom.input.2')" id="usrName" ref="usrName">
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
            {{ $t("chatroom.message.7") }}<span id="roominfo" ref="roominfo" style="font-weight: bold;"></span><br><br>
            <input type="checkbox" id="isshowuserinout" name="isshowuserinout" ref="isshowuserinout" @click="isshowuserinout_store()"><span>{{ $t("chatroom.message.8") }}</span><br><br>
            <button id="promptbtn" @click="closeprompt();">{{ $t("chatroom.button.got_it") }}</button>
        </div>
    </div></TransitionGroup>
</template>

<style>
</style>