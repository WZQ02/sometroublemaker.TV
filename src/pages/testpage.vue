<script setup lang="ts">
    import { ref } from 'vue'
    const num = ref(114514)
    const test_1 = ref("")
</script>

<template>
    <div id="container">
        <h1>test</h1>
        <h4>{{ num }}</h4>
        <h4>{{ test_1 }}</h4>
        <p><input v-model="test_1"></p>
        <a @click="num++">数字加1</a>
    </div>
</template>

<style>
input {
    font-size: 16px;
    width: 264px;
    line-height: 32px;
    border: 1px #aaa;
    border-radius: 6px;
}
</style>