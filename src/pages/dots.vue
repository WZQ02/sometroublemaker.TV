<script setup>
    import { onMounted,ref,onDeactivated,onActivated,getCurrentInstance } from 'vue';
    import Dot from '../components/dots/dot.vue'

    const gCI = getCurrentInstance()
    const dots_bg = ref(null)
    const all_dots = ref([])

    let sl = {}

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

    onMounted(() => {
        gCI.proxy?.$bus.emit('req_chatserverbknd',1)
        //gen_dot("00000000")
    })

    onDeactivated(() => {
        dots_bg.value.style.opacity = ''
        gCI.proxy?.$bus.emit('dots_deactivate')
    })
    onActivated(() => {
        setTimeout(()=>{dots_bg.value.style.opacity = '1'},50)
        gCI.proxy?.$bus.emit('dots_activate')
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="dots_container" key="dots_container">
        <div id="dots_bg" ref="dots_bg">
            <TransitionGroup name="dot_fade">
                <Dot v-for="dot in all_dots" :key="dot.id"/>
            </TransitionGroup>
            </div>
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
        transition: opacity 1s;
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