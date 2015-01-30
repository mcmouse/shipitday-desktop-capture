/* globals desktopCaptureApp, chrome */
/* jshint node:true */

'use strict';

/**
 * Manages step 2 by displaying video and passing it to the server
 */

var Marionette = require('backbone-shim').Marionette;

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    this.view = options.view;
    this.downloadLink = desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.downloadEndpoint + desktopCaptureApp.options.downloadSrc;
    this.view.setVideoSrc(this.downloadLink);
    this.setupEvents();
  },

  setupEvents: function () {
    this.listenTo(this.view, 'restart', desktopCaptureApp.restart.bind(desktopCaptureApp));
    this.listenTo(this.view, 'share', this.shareVideo);
    this.listenTo(this.view, 'download', this.downloadVideo);
  },

  shareVideo: function () {

  },

  downloadVideo: function () {
    window.open(this.downloadLink);
  }

});