import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import handlebars from 'vite-plugin-handlebars'


// ищем все html файлы в корне
const htmlFiles = readdirSync(__dirname).filter(f => f.endsWith('.html'))

const input = htmlFiles.reduce((entries, file) => {
    const name = file.replace('.html', '')
    entries[name] = resolve(__dirname, file)
    return entries
}, {})


export default defineConfig({
    plugins: [
        handlebars({
            // Указываем несколько директорий с partials
            partialDirectory: [
                resolve(__dirname, 'src/blocks'),
                resolve(__dirname, 'src/layout')
            ]
        })
    ],
    build: {
        outDir: 'dist',
        cssCodeSplit: true,
        rollupOptions: {
            input,
            output: {
                entryFileNames: 'assets/js/[name].js',
                chunkFileNames: 'assets/js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'assets/css/[name][extname]'
                    }
                    return 'assets/[name][extname]'
                }
            }
        }
    },
    server: {
        open: '/index.html'
    },

})



