/* globals desktopCaptureApp */
/* jshint node:true */

'use strict';

/**
 * Manages step 2 by displaying video and passing it to the server
 */

var Marionette = require('backbone-shim').Marionette,
  Utilities = require('Utilities');

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    this.view = options.view;
    this.recorder = desktopCaptureApp.models.Video.get('recorder');
    this.setupEvents();

    this.recorder.getDataURL(function (url) {
      this.view.setVideoSrc(url);
    }.bind(this));
  },

  setupEvents: function () {
    this.listenTo(this.view, 'submit', this.submitVideo);
    this.listenTo(this.view, 'restart', desktopCaptureApp.restart);
  },

  submitVideo: function () {
    var files = {};

    var audioDataURL = '',
      videoDataURL;

    desktopCaptureApp.models.Video.get('recorder').getDataURL(function (dataURL) {
      videoDataURL = dataURL;
    });

    files.video = {
      name: Utilities.getName() + '.webm',
      type: 'video/webm',
      contents: videoDataURL,
    };

    files.audio = {
      name: Utilities.getName() + '.wav',
      type: 'audio/wav',
      contents: audioDataURL,
    };
  },
});