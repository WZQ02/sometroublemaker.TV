<script>
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="wel_container">
        <span id="stp_wel_title1" class="stp_wel_title"><p>你来到了<br>sometroublemaker's playground。</p></span>
        <span id="stp_wel_title2" class="stp_wel_title"><p>↑ 使用顶栏以进行导航</p></span>
    </div></TransitionGroup>
</template>

<style>
.stp_wel_title {
    display: flex;
    position: relative;
    /*top: calc(50vh - 128px);*/
    align-items: center;
    justify-content: center;
    user-select: none;
}
#stp_wel_title1 {
    font-size: 48px;
    font-weight: bold;
}
#stp_wel_title2 {
    font-size: 20px;
    opacity: 0.6;
}
@media screen and (max-width: 540px) {
    #stp_wel_title1 {
        font-size: 32px;
        font-weight: bold;
    }
}
</style>