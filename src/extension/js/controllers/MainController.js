/* jshint node:true */

'use strict';

/** 
 * Controls the main app state
 */

var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Marionette.Object.extend({

  initialize: function () {
    chatApp.currentStep = 1;
    this.showStep(1);
  },
  showStep: function () {

  },
});