
const users = [
  {
    caption: 'Allan Hortle',
    image: '/img/docusaurus.svg',
    infoLink: 'github.com/allanhortle',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Enty',
  tagline: `Normalized Entity Management`,
  url: 'https://enty.blueflag.codes',
  baseUrl: '/',
  projectName: '',
  docsSideNavCollapsible: true,
  organizationName: 'Blue Flag',
  headerLinks: [
    {doc: 'introduction', label: 'Tutorial'},
    {doc: 'schemas/entity-schema', label: 'API'},
    {search: true}
  ],
  users,
  //headerIcon: 'img/docusaurus.svg',
  //footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#2f1e2e',
    secondaryColor: '#522e52'
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Blue Flag`,

  highlight: {
    theme: 'paraiso-dark',
  },

  // Add custom scripts here that would be placed in <script> tags.
  //scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,


  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
