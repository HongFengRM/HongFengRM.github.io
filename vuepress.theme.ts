import { plumeTheme } from 'vuepress-theme-plume'
import navbar from './vuepress.navbar'
import notes from './vuepress.notes'
import sidebar from './vuepress.sidebar'

export default plumeTheme({
  profile: {
    name: '红枫',
    description:
      'RA3 mod开发者，前RA2 mod开发者，业余建模爱好者，博客拥有者（确信）',
    avatar: '/MapleLeaf.webp',
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
  navbar,
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
      markmap: true,
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
    readingTime: {
      wordPerMinute: 300,
    },
  },
  sidebar,
})
