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
    this.recorder = desktopCaptureApp.models.Video.get('recorder');
    this.setupEvents();

    this.recorder.getDataURL(function (url) {
      this.view.setVideoSrc(url);
    }.bind(this));
  },

  setupEvents: function () {
    this.listenTo(this.view, 'submit', this.submitVideo);
    this.listenTo(this.view, 'restart', desktopCaptureApp.restart.bind(desktopCaptureApp));
  },

  submitVideo: function () {
    var files = {};

    desktopCaptureApp.models.Video.get('recorder').getDataURL(function (dataURL) {

      files.video = {
        name: Utilities.getRandomName() + '.webm',
        type: 'video/webm',
        contents: dataURL,
      };

      console.log(files);
      //showLoader()

      $.ajax({
        url: desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.uploadEndpoint,
        data: JSON.stringify(files),
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        success: function (response) {
          desktopCaptureApp.options.downloadSrc = response;
          desktopCaptureApp.showStep(4);
        },
        error: function (xhr, status, error) {
          console.log(status, error);
        }
      });
    });
  },
});