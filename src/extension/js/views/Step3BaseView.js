/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
  Step3Template = require('templates/Step3Template.html'),
  ShapeCollectionView = require('views/ShapeCollectionView');

module.exports = Marionette.LayoutView.extend({
  template: Step3Template,

  regions: {
    timeline: "#timeline"
  },

  attributes: {
    classes: 'step-inner',
  },

  ui: {
    video: '#hidden-video',
    audio: '#hidden-audio',
    addShape: '#add-shape',
    canvas: '#canvas',
    play: '.play-button',
    edit: '.edit-button',
    toolTip: '.tooltipped'
  },

  events: {
    'click @ui.addShape': 'addShape',
    'click @ui.play': 'togglePlaying',
    'click @ui.edit': 'toolNavToggle'
  },

  onShow: function () {
    this.trigger('show');
    this.ui.edit.sideNav();
    this.ui.toolTip.tooltip({delay: 50});
  },

  addShape: function () {
    this.trigger('addShape');
  },

  initializeCollection: function (collection) {
    this.getRegion("timeline").show(new ShapeCollectionView({
      collection: collection
    }));
  },

  isPlaying: function () {
    var video = this.ui.video[0];
    return (!video.paused && !video.ended);
  },

  togglePlaying: function () {
    if (this.isPlaying()) {
      this.ui.video[0].pause();
      this.ui.play.text('Play');
      this.trigger('paused');
    } else {
      this.ui.video[0].play();
      this.ui.play.text('Pause');
      this.trigger('playing');
    }
  },

  toolNavToggle: function () {
    // this.ui.edit.sideNav('show');
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

  bindPlayEvents: function () {
    this.ui.video[0].onplay = function () {
      this.ui.audio[0].play();
    }.bind(this);

    this.ui.video[0].onpause = function () {
      this.ui.audio[0].pause();
    }.bind(this);
  },

  bindEndEvent: function () {
    this.ui.video[0].onended = function () {
      this.ui.play.text('Play');
    }.bind(this);
  },

  //Returns current time in MS
  getCurrentTime: function () {
    return this.ui.video[0].currentTime * 1000;
  },

  //Returns video duration in MS
  getMaxTime: function () {
    return this.ui.video[0].duration * 1000;
  },

  getVideo: function () {
    return this.ui.video[0];
  }

});