<script setup>
    import { app_name } from '../assets/json/app_name.json'
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="home_container">
        <h1><span style="font-kerning:none">{{ app_name }} {{$t("home.title.overview")}}</span></h1>
        <p><span style="font-kerning:none">{{ app_name }}</span> {{$t("home.message.1")}}</p>
        <p>{{$t("home.message.2")}}</p><br>
        <a class="c" href="https://wzq02.top/#/tv">{{$t("home.button.3")}}</a>
    </div></TransitionGroup>
</template>

<style>
</style>