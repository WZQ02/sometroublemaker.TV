//针对Vercel部署版本进行一些功能上的调整
import { stp_store } from '../store.js'
import { app_name } from '../assets/json/app_name.json'
let isvercel
if (window.location.href.indexOf("vercel.app")!=-1) {
    isvercel = 1
    console.log("您正在访问 "+app_name+" 的镜像版本。本项目主地址在 https://play.wzq02.top/")
}

function thirdpartydeployadjusts() {
    if (isvercel) {
        if (!stp_store.settings.stp_live_lin.value) {
            stp_store.settings.stp_live_lin.value = 1
        }
    }
}
function thirdpartydeployadjusts2(hiddenelement) {
    if (isvercel) {
        hiddenelement.style = "display: none"
    }
}

export { thirdpartydeployadjusts,thirdpartydeployadjusts2 }