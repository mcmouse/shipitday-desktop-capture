/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
  Step4Template = require('templates/Step4Template.html');

module.exports = Marionette.ItemView.extend({
  template: Step4Template,

  attributes: {
    classes: 'step-inner',
  },

  ui: {
    video: '#review-video',
    shareButton: '.share-button',
    downloadButton: '.download-button',
    restartButton: '.restart-button',
  },

  events: {
    'click @ui.shareButton': 'shareVideo',
    'click @ui.downloadButton': 'downloadVideo',
    'click @ui.restartButton': 'restartVideo',
  },

  shareVideo: function () {
    //this.trigger('submit');
  },

  downloadVideo: function () {
    this.trigger('download');
  },

  restartVideo: function () {
    this.trigger('restart');
  },

  setVideoSrc: function (src) {
    var video = this.ui.video[0];
    video.src = src;
    video.play();
  },

});