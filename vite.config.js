import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'ie >= 11', 'chrome 49', 'firefox 52'],  
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks:true,
      polyfills:[
         'es.symbol',
         'es.array.filter',
         'es.promise',
         'es.promise.finally',
         'es/map',
         'es/set',
         'es.array.for-each',
         'es.object.define-properties',
         'es.object.define-property',
         'es.object.get-own-property-descriptor',
         'es.object.get-own-property-descriptors',
         'es.object.keys',
         'es.object.to-string',
         'web.dom-collections.for-each',
         'esnext.global-this',
         'esnext.string.match-all'
     ]
  })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "vue": "vue/dist/vue.esm-bundler.js"
    }
  }
})
