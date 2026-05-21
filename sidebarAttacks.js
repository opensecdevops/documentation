/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  appSidebar: [{
    type: 'doc',
    id: 'README',
  },
  {
    type: 'category',
    label: 'Brute Force',
    link: {
      type: 'doc',
      id: 'brute-force/README',
    },
    items: [
      'brute-force/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'Command Injection',
    link: {
      type: 'doc',
      id: 'command-injection/README',
    },
    items: [
      'command-injection/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'CSRF',
    link: {
      type: 'doc',
      id: 'CSRF/README',
    },
    items: [
      'CSRF/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'File inclusion',
    link: {
      type: 'doc',
      id: 'file-inclusion/README',
    },
    items: [
      'file-inclusion/local-inclusion',
      'file-inclusion/remote-inclusion',
      'file-inclusion/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'File Upload',
    link: {
      type: 'doc',
      id: 'file-upload/README',
    },
    items: [
      'file-upload/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'SQLi',
    link: {
      type: 'doc',
      id: 'sqli/README',
    },
    items: [
      'sqli/union',
      'sqli/blind',
      'sqli/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'XSS',
    link: {
      type: 'doc',
      id: 'XSS/README',
    },
    items: [
      'XSS/reflected',
      'XSS/storage',
      'XSS/DOM',
      'XSS/correct-code'
    ]
  },
  {
    type: 'category',
    label: 'Open Http Redirect',
    link: {
      type: 'doc',
      id: 'open-http-redirect/README',
    },
    items: [
      'open-http-redirect/correct-code'
    ]
  },
  ],

  // But you can create a sidebar manually



};

module.exports = sidebars;
