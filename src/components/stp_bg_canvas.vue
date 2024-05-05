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
    } else {
        cv_dis_condition1.value = 0
    }
    gCI.proxy?.$bus.on('show_vid_as_bg_toggle',(e)=>{
        if (e) {
            cv_dis_condition1.value = 1
            app.classList.add('vbg')
        } else {
            cv_dis_condition1.value = 0
            app.classList.remove('vbg')
        }
    })

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
        function showvidasbg(cancel) {
            if (cancel) {
                clearInterval(sva)
                return
            }
            let sva = setInterval(()=>{
                if (!(cv_dis_condition0.value&&cv_dis_condition1.value)) {
                    return
                }
                try {
                    const video = document.getElementById('video')
                    if (video.readyState) {
                        cv.value.width = video.videoWidth
                        cv.value.height = video.videoHeight
                        ctx.drawImage(video,0,0)
                        //ctx.filter = "blur(16px)"
                        adjustcvsize()
                        cv_dis_condition2.value = 1
                    }
                } catch(err) {
                    cv_dis_condition2.value = 0
                    //console.log(err)
                }
            },40)
        }
        showvidasbg()

        function adjustcvsize() {
            const cv_ar = cv.value.width/cv.value.height
            const win_ar = window.innerWidth/window.innerHeight
            //canvas长宽比大于window，canvas高度设为100%，裁切长度
            if (cv_ar > win_ar) {
                cv.value.style.height = '100%'
                cv.value.style.width = 'auto'
                cv.value.style.left = `${(1-cv_ar/win_ar)*50}%`
            //反之
            } else {
                cv.value.style.width = '100%'
                cv.value.style.height = 'auto'
                cv.value.style.top = `${(1-win_ar/cv_ar)*50}%`
            }
            //console.log(cv.value.width,cv.value.height,cv_ar,win_ar)
        }

        window.addEventListener('resize',()=>{
            adjustcvsize()
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