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
    stop: '.stop'
  },

  events: {
    'click @ui.record': 'recordVideo',
    'click @ui.stop': 'stopVideo',
  },

  recordVideo: function () {
    this.trigger('record');
  },

  stopVideo: function () {
    this.trigger('stop');
  }
});