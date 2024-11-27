import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import theme from './vuepress.theme'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  theme,

  base: '/',

  locales: {
    '/': {
      lang: 'zh-CN',
      title: '红枫的博客',
      description: '这里是红枫的个人博客网站',
    },
  },

  temp: '.temp',
  cache: '.cache',
  public: 'public',
  dest: 'dist',

  shouldPrefetch: true,
})
