import { defineNotesConfig } from 'vuepress-theme-plume'

export default defineNotesConfig({
  dir: '/notes/',
  link: '/',
  notes: [
    {
      dir: 'MISC',
      link: '/MISC/',
      sidebar: 'auto',
    },
    {
      dir: 'MOD',
      link: '/MOD/',
      sidebar: 'auto',
    },
  ],
})
