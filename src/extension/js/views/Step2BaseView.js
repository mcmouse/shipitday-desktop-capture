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
    nextButton: '.next-button',
    backButton: '.back-button',
  },

  events: {
    'click @ui.nextButton': 'submitVideo',
    'click @ui.backButton': 'restart',
  },

  submitVideo: function () {
    this.trigger('submit');
  },

  restart: function () {
    this.trigger('restart');
  }
});