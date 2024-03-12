'use strict';
importScripts('/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: '/',
});
self.addEventListener('fetch',()=>{});