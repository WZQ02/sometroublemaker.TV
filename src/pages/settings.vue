<script setup>
    import { onMounted, ref } from 'vue'
    import { setCookie,getCookie } from '../scripts/cookie.js'

    import { useI18n } from 'vue-i18n'
    const { locale } = useI18n()

    const ipt1 = ref(null)
    const ipt2 = ref(null)
    const ipt3 = ref(null)
    const ipt4 = ref(null)
    const ipt5 = ref(null)
    const ipt6 = ref(null)

    let init = () => {
        let stp_lang = getCookie('stp_lang');
        if (stp_lang == 1) {
            ipt2.value.checked = 1;
        } else if (stp_lang == 2) {
            ipt3.value.checked = 1;
        } else {
            ipt1.value.checked = 1;
        }
        let stp_live_lin = getCookie('stp_live_lin');
        if (stp_live_lin == 1) {
            ipt5.value.checked = 1;
        } else if (stp_live_lin == 2) {
            ipt6.value.checked = 1;
        } else {
            ipt4.value.checked = 1;
        }
    }

    let ipt1_select = () => {
        ipt2.value.checked = 0;
        ipt3.value.checked = 0;
        locale.value = (navigator.language || 'zh').toLocaleLowerCase().split('-')[0]
        setCookie('stp_lang',0,365)
    }
    let ipt2_select = () => {
        ipt1.value.checked = 0;
        ipt3.value.checked = 0;
        locale.value = 'zh'
        setCookie('stp_lang',1,365)
    }
    let ipt3_select = () => {
        ipt1.value.checked = 0;
        ipt2.value.checked = 0;
        locale.value = 'en'
        setCookie('stp_lang',2,365)
    }
    let ipt4_select = () => {
        ipt5.value.checked = 0;
        ipt6.value.checked = 0;
        setCookie('stp_live_lin',0,365)
    }
    let ipt5_select = () => {
        ipt4.value.checked = 0;
        ipt6.value.checked = 0;
        setCookie('stp_live_lin',1,365)
    }
    let ipt6_select = () => {
        ipt4.value.checked = 0;
        ipt5.value.checked = 0;
        setCookie('stp_live_lin',2,365)
    }

    onMounted(() => {
        init();
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="home_container">
        <h1>{{$t("settings.title")}}</h1>
        <p>{{$t("settings.message.1")}}<input type="radio" ref="ipt1" @click="ipt1_select">{{$t("settings.message.2")}}<input type="radio" ref="ipt2" @click="ipt2_select">简体中文&nbsp;&nbsp;<input type="radio" ref="ipt3" @click="ipt3_select">English</p>
        <p>{{$t("settings.message.3")}}<input type="radio" ref="ipt4" @click="ipt4_select">{{$t("settings.message.4")}}<input type="radio" ref="ipt5" @click="ipt5_select">{{$t("settings.message.5")}}<input type="radio" ref="ipt6" @click="ipt6_select">{{$t("settings.message.6")}}</p>
        <p>{{$t("settings.message.7")}}</p>
        <!--<a class="c" @click="this.$router.go(0)">{{$t("settings.message.8")}}</a>-->
    </div></TransitionGroup>
</template>

<style>
</style>