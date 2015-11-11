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
    this.audioStream = false;
    this.setupEvents();
  },

  setupEvents: function () {
    this.listenTo(this.view, 'record', this.recordVideo);
    this.listenTo(this.view, 'stop', this.stopVideo);
    this.listenTo(this.view, 'audio', this.recordAudio);
  },

  recordAudio: function () {
    navigator.webkitGetUserMedia({
      audio: true,
    }, this.gotAudio.bind(this), this.getUserMediaError.bind(this));
  },

  gotAudio: function (stream) {
    this.audioStream = stream;
    stream.onended = this.audioStreamEnded.bind(this);
    this.view.audioRecorder = this.audioRecorder = RecordRTC(stream, {
      bufferSize: 16384
    });
    desktopCaptureApp.models.Audio.set('recorder', this.audioRecorder);
  },

  audioStreamEnded: function () {
    this.audioRecorder.stopRecording();
  },

  recordVideo: function () {
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window"], this.onAccessApproved.bind(this));
  },

  stopVideo: function () {
    this.stream.stop();
    if (this.audioStream) {
      this.audioStream.stop();
    }
    desktopCaptureApp.showStep(2);
  },

  onAccessApproved: function (id) {
    if (!id) {
      console.log("Access denied.");
    }

    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: id,
          maxWidth: 1920,
          maxHeight: 1200,
          minFrameRate: 30
        }
      }
    }, this.gotStream.bind(this), this.getUserMediaError.bind(this));
  },

  gotStream: function (stream) {
    this.stream = stream;
    this.view.setVideoSrc(URL.createObjectURL(stream));
    stream.onended = this.streamEnded.bind(this);

    this.recorder = RecordRTC(this.stream, {
      type: "video",
      canvas: {
        width: 1280,
        height: 720
      },
      video: {
        width: 1280,
        height: 720
      }
    });

    //May want to change how we pass models
    this.view.recorder = this.recorder;

    desktopCaptureApp.models.Video.set('recorder', this.recorder);
    this.recorder.startRecording();
    if (this.audioStream) {
      this.audioRecorder.startRecording();
    }
  },

  getUserMediaError: function () {
    console.log("User media error.");
    desktopCaptureApp.reset();
  },

  streamEnded: function () {
    this.recorder.stopRecording();
    if (this.audioStream) {
      this.audioRecorder.stopRecording();
    }
    desktopCaptureApp.showStep(2);
  }
});