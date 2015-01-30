/* jshint node:true */

'use strict';

/** The root LayoutView that contains all of the top-level app regions */

var Marionette = require('backbone-shim').Marionette,
  Step1Template = require('templates/Step1Template.html');

module.exports = Marionette.ItemView.extend({
  template: Step1Template,

  ui: {
    record: '.record',
    previewVideo: '#previewvideo',
    stop: '.stop',
    audio: '.mic',
    audioEl: '#previewaudio',
  },

  events: {
    'click @ui.record': 'recordVideo',
    'click @ui.stop': 'stopVideo',
    'click @ui.audio': 'recordAudio',
  },

  recordAudio: function () {
    this.trigger('audio');
  },

  recordVideo: function () {
    this.trigger('record');
    this.ui.record.hide();
    this.ui.stop.show();
  },

  stopVideo: function () {
    this.trigger('stop');
  },

  setVideoSrc: function (src) {
    var video = this.ui.previewVideo[0];
    video.src = src;
    video.play();
  },

  setAudioSrc: function (src) {
    var audio = this.ui.audioEl[0];
    audio.src = src;
    audio.play();
  }
});