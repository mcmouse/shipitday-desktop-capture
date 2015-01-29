/* jshint node:true */

var DesktopCaptureApp = require('DesktopCaptureApp');

window.desktopCaptureApp = new DesktopCaptureApp();

$(function () {
  'use strict';
  window.desktopCaptureApp.start();
});