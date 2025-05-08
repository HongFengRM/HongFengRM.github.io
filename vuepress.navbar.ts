import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  {
    text: '首页',
    link: '/',
    icon: 'material-symbols:home-outline-rounded',
  },

  {
    text: '博客',

    icon: 'material-symbols:article-outline-rounded',
    items: [
      {
        text: '标签',
        link: '/tags/',
        icon: 'material-symbols:tag-rounded',
      },
      {
        text: '分类',
        link: '/categories/',
        icon: 'material-symbols:category-outline-rounded',
      },
      {
        text: '归档',
        link: '/archives/',
        icon: 'material-symbols:lists',
      },
    ],
  },

  {
    text: '杂谈',
    link: '/MISC/intro/',
    icon: 'material-symbols:lab-profile-outline-rounded',
  },
  {
    text: 'MOD文档',
    link: '/MOD/intro/',
    icon: 'material-symbols:gamepad-outline-rounded',
  },
  {
    text: '生活',
    link: '/Life/intro/',
    icon: 'material-symbols:fastfood-rounded',
  },
  {
    text: '外链',
    icon: 'material-symbols:linked-services-outline',
    items: [
      {
        text: '红枫的MOD',
        link: 'https://www.moddb.com/mods/imperial-instinct',
        icon: 'material-symbols:videogame-asset-outline-rounded',
      },
      {
        text: '红枫的网盘',
        link: 'http://hongfeng.ysepan.com/',
        icon: 'material-symbols:hard-disk-outline-rounded',
      },
      {
        text: '红枫的B站',
        link: 'https://space.bilibili.com/172514568',
        icon: 'simple-icons:bilibili',
      },
      {
        text: '红枫的D站',
        link: 'https://www.deviantart.com/hongfengrm',
        icon: 'simple-icons:deviantart',
      },
    ],
  },
  {
    text: '友链',
    link: '/friends/',
    icon: 'material-symbols:link',
  },
])
