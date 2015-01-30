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
    this.audioRecorder = desktopCaptureApp.models.Audio.get('recorder');
    this.setupEvents();

    this.recorder.getDataURL(function (url) {
      this.view.setVideoSrc(url);
    }.bind(this));

    this.hasAudio = false;

    this.loadedMedia = {
      audio: false,
      video: false
    };

    if (this.audioRecorder) {
      this.hasAudio = true;
      this.audioRecorder.getDataURL(function (url) {
        this.view.setAudioSrc(url);
      }.bind(this));
    }
  },

  setupEvents: function () {
    this.listenTo(this.view, 'submit', this.submitVideo);
    this.listenTo(this.view, 'restart', desktopCaptureApp.restart.bind(desktopCaptureApp));
    this.listenTo(this.view, 'mediaLoaded', this.maybePlay);
  },

  maybePlay: function (media) {

    if (media === 'video' && !this.hasAudio) {
      this.view.play();
    } else {
      this.loadedMedia[media] = true;
      if (this.loadedMedia.audio && this.loadedMedia.video) {
        this.view.play();
      }
    }

  },

  submitVideo: function () {
    desktopCaptureApp.showStep(3);
  },
});