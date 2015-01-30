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
    this.setupEvents();
  },

  setupEvents: function () {
    this.listenTo(this.view, 'record', this.recordVideo);
    this.listenTo(this.view, 'stop', this.stopVideo);
  },

  recordVideo: function () {
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window"], this.onAccessApproved.bind(this));
  },

  stopVideo: function() {
    this.stream.stop();
  },

  onAccessApproved: function(id) {
    if(!id) {
      console.log("Access denied.");
    }

    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: id
        }
      }
    }, this.gotStream.bind(this), this.getUserMediaError.bind(this));
  },

  gotStream: function(stream) {
    this.stream = stream;
    this.view.setVideoSrc(URL.createObjectURL(stream));
    stream.onended = this.streamEnded.bind(this);

    this.recorder = RecordRTC(stream, {
      type: "video"
    });
    desktopCaptureApp.models.Video.set('recorder', this.recorder);
    this.recorder.startRecording();
  },

  getUserMediaError: function() {
    console.log("User media error.")
  },

  streamEnded: function() {
    this.recorder.stopRecording();
    this.recorder.getDataURL(function(url){
      this.view.toggleControls();
      this.view.setVideoSrc(url);
    }.bind(this));
  }
});