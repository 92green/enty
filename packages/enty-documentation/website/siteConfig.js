
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
  tagline: `Normalized State Management`,
  url: 'https://enty.blueflag.codes',
  baseUrl: '/',
  projectName: '',
  //docsSideNavCollapsible: true,
  organizationName: 'Blue Flag',
  headerLinks: [
    {doc: 'introduction', label: 'Tutorial'},
    {doc: 'schemas/entity-schema', label: 'API'},
    //{doc: 'glossary', label: 'Glossary'},
    {search: true}
  ],
  users,
  headerIcon: 'img/icon/logo.svg',
  favicon: 'favicon.ico',
  colors: {
    primaryColor: '#2d2b57',
    secondaryColor: '#534e94'
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
    defaultLang: 'javascript',
    version: '9.14.2',
    theme: 'shades-of-purple',
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
  repoUrl: 'https://github.com/blueflag/enty',
};

module.exports = siteConfig;
