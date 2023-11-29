<script setup>
    import { ref,getCurrentInstance } from 'vue'
    const num = ref(114514)
    const test_1 = ref("")
    const gCI = getCurrentInstance()
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="test_container">
        <h1>{{ $t("testpage.title.fun_test") }}</h1>
        <h4>{{ num }}</h4>
        <h4>{{ test_1 }}</h4>
        <h4>{{ $t("testpage.message.test") }}</h4>
        <p><input id="testpge_input" class="text_input" v-model="test_1"></p>
        <a class="c" @click="num++">{{ $t("testpage.button.num_plus_1") }}</a><br><br>
        <a class="c" @click="gCI.proxy?.$bus.emit('trigger_popup','这是一个测试通知，啊呃呃呃呃鹅鹅鹅饿')">{{ $t("testpage.button.popup_test") }}</a>
    </div></TransitionGroup>
</template>

<style>
#testpge_input {
    font-size: 16px;
    width: 264px;
    line-height: 28px;
}
</style>