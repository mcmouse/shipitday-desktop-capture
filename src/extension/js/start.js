/* jshint node:true */

var DesktopCaptureApp = require('DesktopCaptureApp');
window.Utilities = require('Utilities');
window.desktopCaptureApp = new DesktopCaptureApp();

$(function () {
  'use strict';
  window.desktopCaptureApp.start();
});