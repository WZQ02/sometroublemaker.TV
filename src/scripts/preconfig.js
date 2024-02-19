let preconfigdata_noparse = [];

function load_preconfig() {
    let preconfigdata = {}
    if (new URLSearchParams(window.location.search).get('preconfig')) {
        try {
            let preconfigdata_noconvert = new URLSearchParams(window.location.search).get('preconfig');
            preconfigdata_noparse = preconfigdata_noconvert.split(";");
            for (let i=0; i<preconfigdata_noparse.length; i++) {
                let data = preconfigdata_noparse[i].split(':');
                localStorage.setItem(data[0],data[1]);
                preconfigdata[data[0]] = data[1]
            }
            let url = window.location.href;
            url = url.slice(0,url.indexOf('?preconfig'))+url.slice(url.indexOf('#'))
            window.history.pushState({},0,url);
            console.log("已读取预配置："+JSON.stringify(preconfigdata))
        } catch(err) {
            console.log("预配置读取失败。")
        }
    }
}

export { preconfigdata_noparse,load_preconfig }