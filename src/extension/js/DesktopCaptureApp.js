/* jshint node:true */

'use strict';

/** Creates the main application, setting up all app globals and keeping track of current state. */

var Marionette = require('backbone-shim').Marionette,
  RootView = require('views/RootView');

module.exports = Marionette.Application.extend({
  container: '#app',

  initialize: function () {
    //Register globals - this object is exposed to the window
    this.currentStep = 1;

    this.RootView = new RootView().render();

    this.on('start', function () {
      this.RootView.showStep(1);
    });
  },

  //This function is global
  showStep: function (step) {
    this.RootView.showStep(step);
    this.currentStep = step;
  }
});