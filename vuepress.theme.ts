import { plumeTheme } from 'vuepress-theme-plume'
import notes from './vuepress.notes'
import sidebar from './vuepress.sidebar'

export default plumeTheme({
  profile: {
    name: '红枫',
    description: '红枫de~su!',
    avatar: '/MapleLeaf.webp',
    // 这里自动引用了gayhub的头像
    location: 'Somewhere on the internet',
    organization: 'Shimakaze.Org',
    circle: true,
    layout: 'right',
  },
  social: [
    {
      icon: 'bilibili',
      link: 'https://space.bilibili.com/172514568',
    },
    {
      icon: 'github',
      link: 'https://github.com/HongFengRM',
    },
    {
      icon: 'qq',
      link: '596891218',
    },
  ],
  footer: {
    copyright: 'Copyright © 2024-present HongFengRM 保留一切权利',
  },
  blog: {
    postList: false,
    link: '/',
    tagsLink: '/tags/',
    categoriesLink: '/categories/',
    archivesLink: '/archives/',
  },
  contributors: {
    avatar: true,
    mode: 'inline',
    info: [
      {
        username: 'frg2089',
        alias: ['舰队的偶像-岛风酱!', '舰队的偶像-岛风酱！'],
        name: '舰队的偶像-岛风酱!',
      },
      {
        username: 'HongFengRM',
        name: '红枫',
      },
    ],
  },
  copyright: 'CC-BY-NC-SA-4.0',
  docsBranch: 'master',
  docsDir: 'docs',
  docsRepo: 'HongFengRM/HongFengRM.github.io',
  home: '/',
  hostname: 'HongFengRM.github.io',
  logo: '/favicon.ico',
  navbar: [
    { text: '首页', link: '/' },
    { text: '友情链接', link: '/friends/' },
    { text: '博客', link: '/blog/' },
    { text: '标签', link: '/blog/tags/' },
    { text: '分类', link: '/blog/categories/' },
    { text: '归档', link: '/blog/archives/' },
  ],
  notes,
  plugins: {
    comment: {
      provider: 'Giscus',
      comment: true,
      repo: 'HongFengRM/HongFengRM.github.io',
      repoId: 'R_kgDONU6osg',
      category: 'Comments',
      categoryId: 'DIC_kwDONU6oss4Cko0i',
      mapping: 'pathname',
      strict: true,
      reactionsEnabled: true,
      inputPosition: 'top',
      lazyLoading: true,
    },
    git: true,
    markdownEnhance: {
      gfm: true,
      align: true,
      attrs: true,
      sup: true,
      sub: true,
      footnote: true,
      mark: true,
      tasklist: true,
      component: true,
      chart: false,
      echarts: false,
      mermaid: true,
      spoiler: true,
    },
    markdownImage: {
      figure: true,
      lazyload: true,
      mark: true,
      size: true,
    },
    shiki: {
      theme: {
        light: 'light-plus',
        dark: 'dark-plus',
      },
      lineNumbers: true,
      collapsedLines: true,
      whitespace: true,
    },
  },
  sidebar,
})
