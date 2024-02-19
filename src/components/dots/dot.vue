<script setup>
    import { onMounted,ref,onDeactivated,onActivated,onUnmounted } from 'vue';
    const dot = ref(null)
    const props = defineProps(['id'])

    let inter_anim,inter_time = Math.floor(5+Math.random()*10);
    function dot_move() {
        dot.value.style.transform = `translate(${window.innerWidth*(Math.random()-.5)*.75}px,${window.innerHeight*(Math.random()-.5)*.75}px)`
    }

    onMounted(() => {
        dot.value.id = props.id;
        let dot_size = Math.floor(32 + Math.random()*64)
        dot.value.style.position = "absolute";
        dot.value.style.width = dot.value.style.height = dot_size+"px";
        dot.value.style.top = dot.value.style.left = "calc(50% - "+dot_size/2+"px)";
        dot.value.style.borderRadius = dot_size/2+"px";
        let dot_r = Math.floor(127 + Math.random()*127);
        let dot_g = Math.floor(127 + Math.random()*127);
        let dot_b = Math.floor(127 + Math.random()*127);
        let dot_a = (0.4 + Math.random()*0.5);
        dot.value.style.backgroundColor = `rgba(${dot_r},${dot_g},${dot_b},${dot_a})`;
        dot.value.style.filter = `blur(${(1-dot_a)*dot_size/4}px)`;
        dot_move();
        setTimeout(()=>{dot_move()},16)
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
    <div class="dot_cont">
        <div class="dot" ref="dot"></div>
        </div>
</template>

<style scoped>
    .dot {
        position: absolute;
    }
</style>