/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
  Step2Template = require('templates/Step2Template.html');

module.exports = Marionette.ItemView.extend({
  template: Step2Template,

  attributes: {
    classes: 'step-inner',
  },

  ui: {
    video: '#review-video',
    audio: '#review-audio',
    nextButton: '.next-button',
    backButton: '.back-button',
    toolTip: '.tooltipped'
  },

  events: {
    'click @ui.nextButton': 'submitVideo',
    'click @ui.backButton': 'restart',
  },

  onShow: function () {
    this.ui.toolTip.tooltip({
      delay: 50
    });
  },

  submitVideo: function () {
    this.trigger('submit');
  },

  restart: function () {
    this.trigger('restart');
  },

  setVideoSrc: function (src) {
    var video = this.ui.video[0];
    if (typeof video === "object") {
      video.src = src;
      this.trigger('mediaLoaded', 'video');
    }
  },

  setAudioSrc: function (src) {
    var audio = this.ui.audio[0];
    if (typeof audio === "object") {
      audio.src = src;
      this.trigger('mediaLoaded', 'audio');
    }
  },

  play: function () {
    this.ui.video[0].onplay = function () {
      this.ui.audio[0].play();
    }.bind(this);

    this.ui.video[0].onpause = function () {
      if (this.ui.audio[0].pause) {
        this.ui.audio[0].pause();
      }
    }.bind(this);

    this.ui.video[0].play();
  },

  toggleControls: function () {
    this.ui.video[0].controls = true;
  },
});