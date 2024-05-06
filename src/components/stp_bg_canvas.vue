<script setup>
    import { onMounted, ref, watch, getCurrentInstance } from 'vue'
    import { stp_store } from '../store.js'
    import '../assets/styles/vbg.css'
    const cv = ref(null)
    const cv_dis_condition0 = ref(1)
    const cv_dis_condition1 = ref(0)
    const cv_dis_condition2 = ref(0)
    //const cv_display = ref(cv_dis_condition0.value&&cv_dis_condition1.value)
    const gCI = getCurrentInstance()

    let vbg_first_time = 0
    let sva
    let bg_framerate = Number(stp_store.adv_settings.vid_bg_framerate.value)||24

    const app = document.getElementById('app')

    watch(() => gCI.proxy?.$route,(to) => {//监听路由，如果在video页面则指定cv_dis_condition0为0
        if (to.path == '/player') {
            cv_dis_condition0.value = 0
        } else {
            cv_dis_condition0.value = 1
        }
    })
    
    if (stp_store.settings.show_vid_as_bg.value) {
        cv_dis_condition1.value = 1
        app.classList.add('vbg')
        vbg_first_time = 1
    } else {
        cv_dis_condition1.value = 0
    }

    onMounted(() => {
        const ctx = cv.value.getContext('2d')
        /* load an image on canvas for testing */
        /*let bg = new Image()
        bg.src = "https://image.baidu.com/search/down?url=https://tvax3.sinaimg.cn//large/0072Vf1pgy1foxkcdzoirj31kw0w0x32.jpg"
        bg.onload = () => {
            cv.value.width = bg.width;
            cv.value.height = bg.height;
            ctx.drawImage(bg,0,0)
            adjustcvsize()
        }*/
        /* load video frame on canvas, each .04s */
        function showvidasbg(cancel,framerate) {
            if (cancel) {
                clearInterval(sva)
                return
            }
            sva = setInterval(()=>{
                if (!(cv_dis_condition0.value&&cv_dis_condition1.value)) {
                    return
                }
                try {
                    const video = document.getElementById('video')
                    if (video.readyState) {
                        if ((cv.value.width != video.videoWidth)||(cv.value.height != video.videoHeight)) {
                            cv.value.width = video.videoWidth
                            cv.value.height = video.videoHeight
                            adjustcvsize()
                        }
                        ctx.drawImage(video,0,0)
                        //ctx.filter = "blur(16px)"
                        cv_dis_condition2.value = 1
                    }
                } catch(err) {
                    cv_dis_condition2.value = 0
                }
                //console.log("show_active")
            },1000/framerate)
        }
        if (vbg_first_time) {
            showvidasbg(0,bg_framerate)
        }

        function adjustcvsize() {
            const cv_ar = cv.value.width/cv.value.height
            const win_ar = window.innerWidth/window.innerHeight
            //canvas长宽比大于window，canvas高度设为100%，裁切长度
            if (cv_ar > win_ar) {
                cv.value.style.height = '100%'
                cv.value.style.width = 'auto'
                cv.value.style.left = `${(1-cv_ar/win_ar)*50}%`
                cv.value.style.top = '0px'
            //反之
            } else {
                cv.value.style.width = '100%'
                cv.value.style.height = 'auto'
                cv.value.style.top = `${(1-win_ar/cv_ar)*50}%`
                cv.value.style.left = '0px'
            }
        }

        window.addEventListener('resize',()=>{
            adjustcvsize()
        })

        gCI.proxy?.$bus.on('show_vid_as_bg_toggle',(e)=>{
            if (e) {
                cv_dis_condition1.value = 1
                app.classList.add('vbg')
                showvidasbg(0,bg_framerate)
            } else {
                cv_dis_condition1.value = 0
                app.classList.remove('vbg')
                showvidasbg(1)
            }
        })
    })
</script>

<template>
    <Transition name="fade">
        <canvas id="stp_bg_canvas" ref="cv" v-show="cv_dis_condition0&&cv_dis_condition1&&cv_dis_condition2"></canvas>
    </Transition>
</template>

<style>
    #stp_bg_canvas {
        position: absolute;
        z-index: inherit;
        opacity: .7;
    }
</style>