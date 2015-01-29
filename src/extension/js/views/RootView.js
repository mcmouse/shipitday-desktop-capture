/* jshint node:true */
/* globals desktopCaptureApp */

'use strict';

/** The root LayoutView that contains all of the top-level app regions */

var Marionette = require('backbone-shim').Marionette;
var RootTemplate = require('templates/RootTemplate.html');
var StepView = require('views/StepView');
//Some childviews - item, collection, or layout - here

module.exports = Marionette.LayoutView.extend({
  el: '#app',

  template: RootTemplate,

  regions: {
    step1: '#step-1',
    step2: '#step-2',
    step3: '#step-3',
    step4: '#step-4',
  },

  initialize: function () {},

  showStep: function (step) {
    this.getRegion('step' + desktopCaptureApp.currentStep).empty();
    this.getRegion('step' + step).show(
      new StepView()
    );
  }
});