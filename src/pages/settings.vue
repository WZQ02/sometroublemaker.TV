<script setup>
    import { onMounted, ref, getCurrentInstance } from 'vue'
    //import { setCookie,getCookie } from '../scripts/cookie.js'

    import { useI18n } from 'vue-i18n'
    const { locale } = useI18n()

    const ipt1 = ref(null)
    const ipt2 = ref(null)
    const ipt3 = ref(null)
    const ipt4 = ref(null)
    const ipt5 = ref(null)
    const ipt6 = ref(null)
    const ipt7 = ref(null)

    const gCI = getCurrentInstance()

    let init = () => {
        //let stp_lang = getCookie('stp_lang');
        let stp_lang = localStorage.getItem('stp_lang');
        if (stp_lang == 1) {
            ipt2.value.checked = 1;
        } else if (stp_lang == 2) {
            ipt3.value.checked = 1;
        } else {
            ipt1.value.checked = 1;
        }
        //let stp_live_lin = getCookie('stp_live_lin');
        let stp_live_lin = localStorage.getItem('stp_live_lin');
        if (stp_live_lin == 1) {
            ipt5.value.checked = 1;
        } else if (stp_live_lin == 2) {
            ipt6.value.checked = 1;
        } else {
            ipt4.value.checked = 1;
        }
        //let stp_allow_pip = getCookie('stp_allow_pip');
        let stp_allow_pip = localStorage.getItem('stp_allow_pip');
        if (stp_allow_pip == 1) {
            ipt7.value.checked = 1;
        }
    }

    let ipt1_select = () => {
        locale.value = (navigator.language || 'zh').toLocaleLowerCase().split('-')[0]
        //setCookie('stp_lang',0,365)
        localStorage.setItem('stp_lang',0)
    }
    let ipt2_select = () => {
        locale.value = 'zh'
        //setCookie('stp_lang',1,365)
        localStorage.setItem('stp_lang',1)
    }
    let ipt3_select = () => {
        locale.value = 'en'
        //setCookie('stp_lang',2,365)
        localStorage.setItem('stp_lang',2)
    }
    let ipt4_select = () => {
        //setCookie('stp_live_lin',0,365)
        localStorage.setItem('stp_live_lin',0)
    }
    let ipt5_select = () => {
        //setCookie('stp_live_lin',1,365)
        localStorage.setItem('stp_live_lin',1)
    }
    let ipt6_select = () => {
        //setCookie('stp_live_lin',2,365)
        localStorage.setItem('stp_live_lin',2)
    }
    let ipt7_select = () => {
        gCI.proxy?.$bus.emit('change_pip_setting',ipt7.value.checked)//告知video组件画中画设置发生变更
        if (ipt7.value.checked == 1) {
            //setCookie('stp_allow_pip',1,365)
            localStorage.setItem('stp_allow_pip',1)
        } else {
            //setCookie('stp_allow_pip',0,365)
            localStorage.setItem('stp_allow_pip',0)
        }
    }

    onMounted(() => {
        init();
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="home_container">
        <h1>{{$t("settings.title")}}</h1>
        <div id="settings_options">
            <p>
                {{$t("settings.message.1")}}
                <input type="radio" ref="ipt1" name="lang_setting" value="1" @click="ipt1_select">{{$t("settings.message.2")}}
                <input type="radio" ref="ipt2" name="lang_setting" value="2" @click="ipt2_select">简体中文&nbsp;
                <input type="radio" ref="ipt3" value="3" name="lang_setting" @click="ipt3_select">English
            </p>
            <p>
                {{$t("settings.message.3")}}
                <input type="radio" ref="ipt4" name="live_lin" value="1" @click="ipt4_select">{{$t("settings.message.4")}}
                <input type="radio" ref="ipt5" name="live_lin" value="2" @click="ipt5_select">{{$t("settings.message.5")}}&nbsp;
                <input type="radio" ref="ipt6" name="live_lin" value="3" @click="ipt6_select">{{$t("settings.message.6")}}
            </p>
            <p>
                {{$t("settings.message.9")}}
                <input type="checkbox" ref="ipt7" class="settings_checkbox" @click="ipt7_select">
            </p>
            <p>{{$t("settings.message.7")}}</p>
        </div>
    </div></TransitionGroup>
</template>

<style scoped>
#settings_options {
    animation: appear .6s ease 1;
}
</style>