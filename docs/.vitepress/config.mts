import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'ContextJS',
  description: 'The official documentation for the ContextJS ecosystem',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          link: '/guide',
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Packages', link: '/guide/packages' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'Philosophy & OOP', link: '/guide/oop' },
            { text: 'CLI Usage', link: '/guide/cli' }
          ]
        },
        {
          text: 'Project types',
          link: '/guide/projects',
          items: [
            { text: 'WebAPI', link: '/guide/projects/webapi' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          link: '/api',
          items: [
            { text: '@contextjs/context', link: '/api/context' },
            { text: '@contextjs/collections', link: '/api/collections' },
            // { text: '@contextjs/compiler', link: '/api/compiler' },
            // { text: '@contextjs/configuration', link: '/api/configuration' },
            // { text: '@contextjs/di', link: '/api/di' },
            // { text: '@contextjs/io', link: '/api/io' },
            // { text: '@contextjs/routing', link: '/api/routing' },
            // { text: '@contextjs/symplex', link: '/api/symplex' },
            // { text: '@contextjs/system', link: '/api/system' },
            // { text: '@contextjs/text', link: '/api/text' },
            // { text: '@contextjs/webserver', link: '/api/webserver' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/contextjs/context' }
    ],

    search: {
      provider: 'local'
    }
  }
});