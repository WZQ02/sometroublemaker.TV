<script setup>
    import { onMounted, ref, getCurrentInstance, watch } from 'vue'
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
    const ipt8 = ref(null)
    const ipt9 = ref(null)
    const advanced_settings = ref(null)
    const custom_hls_url = ref("")
    const custom_ws_url = ref("")

    const gCI = getCurrentInstance()

    let adv_settings_isdisplay = 1;
    const adv_options_editable = ref(null);
    adv_options_editable.value = 0;

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
        let adv_set_enabled = localStorage.getItem('adv_set_enabled');
        if (adv_set_enabled == 1) {
            ipt8.value.checked = 1;
            adv_options_editable.value = 1;
        }
        let enable_mpegts_player = localStorage.getItem('enable_mpegts_player');
        if (enable_mpegts_player == 1) {
            ipt9.value.checked = 1;
        }
        custom_hls_url.value = localStorage.getItem('custom_hls_url');
        custom_ws_url.value = localStorage.getItem('custom_ws_url');
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
    let ipt8_select = () => {
        if (ipt8.value.checked == 1) {
            localStorage.setItem('adv_set_enabled',1)
            adv_options_editable.value = 1;
        } else {
            localStorage.setItem('adv_set_enabled',0)
            adv_options_editable.value = 0;
        }
    }
    let ipt9_select = () => {
        if (ipt9.value.checked == 1) {
            localStorage.setItem('enable_mpegts_player',1)
        } else {
            localStorage.setItem('enable_mpegts_player',0)
        }
    }
    function display_adv_settings() {
        if (adv_settings_isdisplay) {
            adv_settings_isdisplay = 0;
            advanced_settings.value.style.display = "none";
        } else {
            adv_settings_isdisplay = 1;
            advanced_settings.value.style.display = "";
        }
    }

    onMounted(() => {
        init();
        if (adv_options_editable.value == 0) {
            display_adv_settings();
        }
        watch(() => custom_hls_url.value,() => {
            localStorage.setItem('custom_hls_url',custom_hls_url.value)
        })
        watch(() => custom_ws_url.value,() => {
            localStorage.setItem('custom_ws_url',custom_ws_url.value)
        })
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
            <br>
            <a class="c" @click="display_adv_settings()">{{$t("settings.button.1")}}</a>
        </div><br>
        <div id="advanced_settings" ref="advanced_settings">
            <p>{{$t("settings.message.10")}}</p>
            <p>
                {{$t("settings.message.11")}}
                <input type="checkbox" ref="ipt8" class="settings_checkbox" @click="ipt8_select">
            </p>
            <p v-bind:class="{uneditable:adv_options_editable==0}">
                {{$t("settings.message.14")}}
                <input type="checkbox" ref="ipt9" class="settings_checkbox" @click="ipt9_select" v-bind:disabled="adv_options_editable==0">
            </p>
            <p v-bind:class="{uneditable:adv_options_editable==0}">
                {{$t("settings.message.12")}}
                <p><input type="text" v-bind:placeholder="$t('settings.input.1')" v-model="custom_hls_url" v-bind:disabled="adv_options_editable==0"></p>
            </p>
            <p v-bind:class="{uneditable:adv_options_editable==0}">
                {{$t("settings.message.13")}}
                <p></p><input type="text" v-bind:placeholder="$t('settings.input.2')" v-model="custom_ws_url" v-bind:disabled="adv_options_editable==0"></p>
        </div>
    </div></TransitionGroup>
</template>

<style scoped>
#settings_options,#advanced_settings {
    animation: appear .6s ease 1;
}
#container {
    transition: height .6s ease;
}
#advanced_settings p {
    transition: 0.25s;
}
#advanced_settings p.uneditable {
    opacity: 0.25;
}
</style>