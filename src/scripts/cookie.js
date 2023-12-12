const setCookie = (cname,cvalue,exdays) => {
    let d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    let expires = "expires="+d.toString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i=0; i<ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
const C2Stransfer = (cname) => {
    let olddata = getCookie(cname);
    if (olddata != "") {
        localStorage.setItem(cname,olddata)
        setCookie(cname,"",-1)
    }
}

export { setCookie,getCookie,C2Stransfer };