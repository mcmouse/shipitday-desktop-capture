/* jshint node:true */

'use strict';

/** The root LayoutView that contains all of the top-level app regions */

var Marionette = require('backbone-shim').Marionette,
  Step1Template = require('templates/Step1Template.html');

module.exports = Marionette.ItemView.extend({
  template: Step1Template,

  ui: {
    record: '.record',
  },

  events: {
    'click @ui.record': 'recordVideo',
  },

  recordVideo: function () {
  	console.log("First");
    this.trigger('record');
  },
});