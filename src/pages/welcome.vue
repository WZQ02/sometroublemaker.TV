<script>
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="wel_container">
        <span id="stp_wel_title1" class="stp_wel_title"><p>{{ $t("wel.title1.1") }}<br>{{ $t("wel.title1.2") }}</p></span>
        <span id="stp_wel_title2" class="stp_wel_title"><p>{{ $t("wel.title2") }}</p></span>
    </div></TransitionGroup>
</template>

<style>
.stp_wel_title {
    display: flex;
    position: relative;
    align-items: center;
    user-select: none;
}
#stp_wel_title1 {
    font-size: 48px;
    font-weight: bold;
}
#stp_wel_title2 {
    font-size: 20px;
    opacity: 0.6;
    justify-content: center;
}
@media screen and (max-width: 540px) {
    #stp_wel_title1 {
        font-size: 32px;
        font-weight: bold;
    }
}
</style>