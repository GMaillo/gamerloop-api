'use strict';

const i18n = require('i18n');
const path = require('path');

module.exports = function () {
  i18n.configure({
      locales: ['en', 'es'],
      directory: path.join(__dirname, '..', 'locales'),
      defaultLocale: 'en',
      autoReload: true,
      syncFiles: true,
      cookie: 'gamerloop-locale'
  });
  // i18n.setLocale('en');
  return i18n;
};