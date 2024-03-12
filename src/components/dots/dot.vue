<script setup>
    import { onMounted,ref,onDeactivated,onActivated,onUnmounted,getCurrentInstance } from 'vue';
    const dot = ref(null)
    const dot_in = ref(null)
    const props = defineProps(['id'])
    const gCI = getCurrentInstance()

    let inter_anim,inter_time
    function dot_move() {
        dot.value.style.transform = `translate(${window.innerWidth*(Math.random()-.5)*.85}px,${window.innerHeight*(Math.random()-.5)*.85}px)`
    }
    function dot_highlight() {
        dot_in.value.style.backgroundColor = "#fff";
        setTimeout(()=>{dot_in.value.style.backgroundColor = ""},300)
    }
    gCI.proxy?.$bus.on('chat_receive_beacon',(sid)=>{
        if (sid == props.id) {
            dot_highlight();
        }
    })

    onMounted(() => {
        dot.value.id = props.id;
        let seeds = [];
        if (props.id) {//根据id生成seeds
             let id_tostr = atob(props.id);
            for (let i=0;i<id_tostr.length;i++) {
                seeds.push(id_tostr.charCodeAt(i))
            }
        } else {//id不存在时，另外随机生成seeds
            seeds = new Uint8Array(6)
            crypto.getRandomValues(seeds)
        }
        let dot_size = Math.floor(32 + seeds[0]/4)
        dot.value.style.position = "absolute";
        dot.value.style.width = dot.value.style.height = dot_size+"px";
        dot.value.style.top = dot.value.style.left = "calc(50% - "+dot_size/2+"px)";
        let dot_r = Math.floor(127 + seeds[1]/2);
        let dot_g = Math.floor(127 + seeds[2]/2);
        let dot_b = Math.floor(127 + seeds[3]/2);
        let dot_a = (0.4 + seeds[4]*0.5/256);
        dot.value.style.backgroundColor = `rgba(${dot_r},${dot_g},${dot_b},${dot_a})`;
        dot.value.style.filter = `blur(${(1-dot_a)*dot_size/4}px)`;
        dot_move();
        setTimeout(()=>{dot_move()},16)
        inter_time = Math.floor(5+seeds[5]*10/256);
        dot.value.style.transition = inter_time+"s cubic-bezier(0.2, 0, 0.8, 1)"
        inter_anim = setInterval(()=>{dot_move()},inter_time*1000)
    })
    onDeactivated(() => {
    })
    onActivated(() => {
        setTimeout(()=>{dot_move()},16)
    })
    onUnmounted(() => {
        clearInterval(inter_anim)
    })
</script>

<template>
    <div class="dot_cont" ref="dot_cont">
        <div class="dot" ref="dot">
            <div class="dot_in" ref="dot_in"></div>
        </div>
    </div>
</template>

<style scoped>
    .dot {
        position: absolute;
        border-radius: 50%;
    }
    .dot_in {
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0);
        transition: .3s;
        border-radius: 50%;
    }
</style>