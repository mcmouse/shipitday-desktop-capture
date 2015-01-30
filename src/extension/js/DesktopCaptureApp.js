/* jshint node:true */

'use strict';

/** Creates the main application, setting up all app globals and keeping track of current state. */

var Marionette = require('backbone-shim').Marionette,
  RootView = require('views/RootView'),
  AudioModel = require('models/Audio'),
  VideoModel = require('models/Video');

module.exports = Marionette.Application.extend({
  container: '#app',

  initialize: function () {
    //Register globals - this object is exposed to the window
    this.currentStep = 1;

    this.RootView = new RootView().render();

    this.on('start', function () {
      this.RootView.showStep(1);
    });

    this.setupOptions();
    this.setupModels();
  },

  //This function is global
  showStep: function (step) {
    this.RootView.showStep(step);
  },

  restart: function () {
    this.showStep(1);
  },

  setupModels: function () {
    this.models = {
      Audio: new AudioModel(),
      Video: new VideoModel()
    };
  },

  setupOptions: function () {
    this.options = {
      serverRoot: 'http://localhost:3200/',
      uploadEndpoint: 'upload',
      downloadEndpoint: 'data/'
    };
  }
});