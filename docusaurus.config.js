// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

const baseUrl = '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Open SecDevOps',
  tagline: 'OSDO: Zero to Secure DevOps en 5 minutos',
  favicon: 'img/favicon.ico',
  staticDirectories: [
    'static',
    // ... other static directories
  ],
  // Set the production url of your site here
  url: 'https://opensecdevops.gitlab.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Open SecDevOps', // Usually your GitHub org/user name.
  projectName: 'documentation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://gitlab.com/-/ide/project/opensecdevops/documentation/edit/master/-/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'app',
        path: 'app',
        routeBasePath: 'app',
        sidebarPath: './sidebarsApp.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'attacks',
        path: 'attacks',
        routeBasePath: 'attacks',
        sidebarPath: './sidebarAttacks.js',
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'OSDO',
        logo: {
          alt: 'Open SecDevOps Logo',
          src: 'img/logo/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/attacks', label: 'Ataques', position: 'left' },
          {
            type: 'dropdown',
            label: 'App',
            position: 'left',
            items: [
              {
                label: 'Docs',
                to: '/app',
              },
              {
                href: 'https://app.opensecdevops.com',
                label: 'OSDO-APP',
              },
            ],
          }, {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://gitlab.com/opensecdevops/www',
            label: 'GitLab',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs',
              },
            ],
          },
          {
            title: 'Comunidad',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'Más',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitLab',
                href: 'https://gitlab.com/opensecdevops/documentation',
              },
            ],
          },
          {
            title: 'Colaboradores',
            items: [
              {
                html: `<a target="_blank" href="https://ast.aragon.es/"><img src="/img/sponsors/ast_cert.png" alt="AST.CERT"></a>`
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Open SecDevOps. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['php', 'javascript', 'bash', 'docker', 'groovy'],
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),
};

module.exports = config;
