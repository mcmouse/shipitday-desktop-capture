/* globals desktopCaptureApp */
/* jshint node:true */

'use strict';

/**
 * Manages step 2 by displaying video and passing it to the server
 */

var Marionette = require('backbone-shim').Marionette;

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    this.view = options.view;
    var serverRoot = desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.downloadEndpoint + desktopCaptureApp.options.downloadSrc;
    this.view.setVideoSrc(serverRoot);
    this.setupEvents();
  },

  setupEvents: function () {
    this.listenTo(this.view, 'record', this.recordVideo);
  },

  recordVideo: function () {
  },
});