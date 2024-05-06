<script setup>
    import { onMounted,ref,onDeactivated,onActivated,getCurrentInstance } from 'vue';
    import Dot from '../components/dots/dot.vue'
    import { stp_store } from '../store.js'

    const gCI = getCurrentInstance()
    const dots_bg = ref(null)
    const all_dots = ref([])
    const demo_dots = ref([])
    const show_exit_demo_btn = ref(0)

    let sl = {}
    let dots_bg_fade

    function gen_dot(id) {
        all_dots.value.push({id: id})
    }
    function remove_dot(id) {
        for (let i=0;i<all_dots.value.length;i++) {
            if (Object.values(all_dots.value[i])[0] == [id][0]) {
                all_dots.value.splice(i,1)
                i--
            }
        }
    }
    function send_beacon() {
        gCI.proxy?.$bus.emit('chat_send_beacon')
    }
    function dots_bg_fade_timeout() {
        if (dots_bg_fade) {
            clearTimeout(dots_bg_fade)
        }
        dots_bg_fade = setTimeout(()=>{dots_bg.value.style.backgroundColor = ""},5000)
    }

    function exit_demo() {
        localStorage.removeItem("dots_demo_mode");
        demo_dots.value = []
        show_exit_demo_btn.value = 0;
    }

    gCI.proxy?.$bus.on('dots_update',(sid_list)=>{
        let conc = Object.assign({},sl,sid_list)
        let gen = Object.assign({},conc)
        let rem = Object.assign({},conc)
        for (let i in sl) {
            delete gen[i]
        }
        for (let i in sid_list) {
            delete rem[i]
        }
        for (let i in gen) {
            gen_dot(i)
        }
        for (let i in rem) {
            remove_dot(i)
        }
        sl = Object.assign({},sid_list)
    })
    gCI.proxy?.$bus.on('chat_receive_beacon',(sid)=>{
        let bg_r = Math.floor(atob(sid).slice(1,2).charCodeAt(0)*.15);
        let bg_g = Math.floor(atob(sid).slice(2,3).charCodeAt(0)*.15);
        let bg_b = Math.floor(atob(sid).slice(3,4).charCodeAt(0)*.15);
        dots_bg.value.style.backgroundColor = `rgb(${bg_r},${bg_g},${bg_b})`;
        dots_bg_fade_timeout()
    })

    onMounted(() => {
        gCI.proxy?.$bus.emit('req_chatserverbknd',1)
        if (stp_store.others.stp_dots_demo_mode.value) {
            let count = Number(stp_store.others.stp_dots_demo_mode.value)
            if (!count || count < 1) {
                exit_demo();
            } else {
                for (let i=0;i<count;i++) {
                    demo_dots.value.push({id: ""})
                }
                show_exit_demo_btn.value = 1;
            }
        }
    })

    onDeactivated(() => {
        dots_bg.value.style.opacity = ''
        gCI.proxy?.$bus.emit('dots_deactivate')
        clearTimeout(dots_bg_fade)
        dots_bg.value.style.backgroundColor = ""
    })
    onActivated(() => {
        setTimeout(()=>{dots_bg.value.style.opacity = '1'},50)
        gCI.proxy?.$bus.emit('dots_activate')
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="dots_container" key="dots_container">
        <div id="dots_bg" ref="dots_bg" @click="send_beacon()">
            <TransitionGroup name="dot_fade">
                <Dot v-for="dot in all_dots" :key="dot.id" :id="dot.id" :title="$t('dots.1')+dot.id"/>
                <Dot v-for="dot in demo_dots" :key="dot.id" />
            </TransitionGroup>
        </div>
        <a class="c" id="exit_dmm_btn" @click="exit_demo()" v-show="show_exit_demo_btn">{{$t('dots.2')}}</a>
    </div></TransitionGroup>
</template>

<style scoped>
    #dots_container,#dots_bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        overflow: hidden;
    }
    #dots_bg {
        background-color: #000;
        opacity: 0;
        transition: 1s;
    }
    #exit_dmm_btn {
        position: absolute;
        left: calc(50% - 56px);
        bottom: 16px;
        opacity: 1;
        z-index: 1;
    }
    .dot_fade-enter-active,
    .dot_fade-leave-active {
        transition: opacity 2s !important;
    }
    .dot_fade-enter-from,
    .dot_fade-leave-to {
        opacity: 0;
    }
</style>