/* jshint node:true */
var something = 'what';
if (something) {
  console.log('great');
}

var DesktopCaptureApp = require('DesktopCaptureApp');
window.Utilities = require('Utilities');
window.desktopCaptureApp = new DesktopCaptureApp();

$(function () {
  'use strict';
  window.desktopCaptureApp.start();
});
