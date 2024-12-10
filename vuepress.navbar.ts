import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  {
    text: '首页',
    link: '/',
  },
  '/friends/',
  '/tags/',
  '/categories/',
  '/archives/',
  {
    text: '红枫的MOD',
    link: 'https://www.moddb.com/mods/imperial-instinct',
  },
  {
    text: '红枫的永硕网盘',
    link: 'http://hongfeng.ysepan.com/',
  },
])
