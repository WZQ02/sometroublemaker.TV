import { reactive } from "vue";

const stp_store = reactive({
    settings: {
        stp_lang: {
            value: 0,
            toggle(value) {
                this.value = value;
                localStorage.setItem('stp_lang',value);
            }
        },
        stp_live_lin: {
            value: 0,
            toggle(value) {
                this.value = value;
                localStorage.setItem('stp_live_lin',value)
            }
        },
        stp_allow_pip: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('stp_allow_pip',new_value)
            }
        },
        browser_fullscreen: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('browser_fullscreen',new_value)
            }
        },
        danmaku_disabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('danmaku_disabled',new_value)
            }
        },
        adv_set_enabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('adv_set_enabled',new_value)
            }
        }
    },
    adv_settings: {
        disallow_auto_reload_video: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('disallow_auto_reload_video',new_value)
            }
        },
        enable_mpegts_player: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('enable_mpegts_player',new_value)
            }
        },
        player_native_controls: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('player_native_controls',new_value)
            }
        },
        allow_html_in_chat_content: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('allow_html_in_chat_content',new_value)
            }
        },
        custom_hls_url: {
            value: "",
            change(url) {
                this.value = url;
                localStorage.setItem('custom_hls_url',url)
            }
        },
        custom_ws_url: {
            value: "",
            change(url) {
                this.value = url;
                localStorage.setItem('custom_ws_url',url)
            }
        }
    },
    chatroom: {
        username: {
            value: "",
            change(name) {
                this.value = name;
                localStorage.setItem('chatUserName',name)
            }
        },
        dont_show_userinout: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('isshowuserinout',new_value)
            }
        },
        markdown_disabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('ismarkdown',new_value)
            }
        },
        allow_pic_upload: {
            value: 0
        }
    },
    session: {
        player_fullscreen: {
            value: 0,
            toggle() {
                if (this.value) {this.value = 0} else {this.value = 1};
            }
        }
    },
    others: {
        stp_dots_demo_mode: {
            value: 0
        }
    }
})

function load_data() {
    stp_store.settings.stp_lang.value = eval(localStorage.getItem('stp_lang'))||0;
    stp_store.settings.stp_live_lin.value = eval(localStorage.getItem('stp_live_lin'))||0;
    stp_store.settings.stp_allow_pip.value = eval(localStorage.getItem('stp_allow_pip'))||0;
    stp_store.settings.danmaku_disabled.value = eval(localStorage.getItem('danmaku_disabled'))||0;
    stp_store.settings.adv_set_enabled.value = eval(localStorage.getItem('adv_set_enabled'))||0;
    stp_store.adv_settings.disallow_auto_reload_video.value = eval(localStorage.getItem('disallow_auto_reload_video'))||0;
    stp_store.adv_settings.enable_mpegts_player.value = eval(localStorage.getItem('enable_mpegts_player'))||0;
    stp_store.adv_settings.player_native_controls.value = eval(localStorage.getItem('player_native_controls'))||0;
    stp_store.adv_settings.allow_html_in_chat_content.value = eval(localStorage.getItem('allow_html_in_chat_content'))||0;
    stp_store.settings.browser_fullscreen.value = eval(localStorage.getItem('browser_fullscreen'))||0;
    stp_store.adv_settings.custom_hls_url.value = localStorage.getItem('custom_hls_url');
    stp_store.adv_settings.custom_ws_url.value = localStorage.getItem('custom_ws_url');
    stp_store.chatroom.username.value = localStorage.getItem('chatUserName');
    stp_store.chatroom.dont_show_userinout.value = eval(localStorage.getItem('isshowuserinout'))||0;
    stp_store.chatroom.markdown_disabled.value = eval(localStorage.getItem('ismarkdown'))||0;
    stp_store.chatroom.allow_pic_upload.value = eval(localStorage.getItem('allow_pic_upload'))||0;
    stp_store.others.stp_dots_demo_mode.value = localStorage.getItem('dots_demo_mode');
}

export { stp_store,load_data }