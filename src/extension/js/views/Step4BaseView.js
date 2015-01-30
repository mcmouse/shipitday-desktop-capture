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
    nextButton: '.share-button',
    backButton: '.download-button',
    restartButton: '.download-button',
  },

});