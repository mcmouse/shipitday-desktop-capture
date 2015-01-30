/* jshint node:true */
/* globals desktopCaptureApp */

'use strict';

/** The root LayoutView that contains all of the top-level app regions */

var Marionette = require('backbone-shim').Marionette;
var RootTemplate = require('templates/RootTemplate.html');

var Step1BaseView = require('views/Step1BaseView');
var Step2BaseView = require('views/Step2BaseView');
var Step3BaseView = require('views/Step3BaseView');
var Step4BaseView = require('views/Step4BaseView');

var Step1Controller = require('controllers/Step1Controller');
var Step2Controller = require('controllers/Step2Controller');
var Step3Controller = require('controllers/Step3Controller');
var Step4Controller = require('controllers/Step4Controller');
//Some childviews - item, collection, or layout - here

module.exports = Marionette.LayoutView.extend({
  el: '#app',

  template: RootTemplate,

  ui: {
    overlay: '.overlay'
  },

  regions: {
    step1: '#step-1',
    step2: '#step-2',
    step3: '#step-3',
    step4: '#step-4',
  },

  initialize: function () {},

  showStep: function (step) {
    this.fadeOut(step);
  },

  setStep: function (step) {
    switch (step) {
    case 1:
      var s1v = new Step1BaseView();
      // fadeInOut(this.ui);
      this.getRegion('step' + step).show(
        s1v
      );
      new Step1Controller({
        view: s1v
      });
      break;
    case 2:
      var s2v = new Step2BaseView();
      // fadeInOut(this.ui);
      this.getRegion('step' + step).show(
        s2v
      );
      new Step2Controller({
        view: s2v
      });
      break;
    case 3:
      var s3v = new Step3BaseView();
      // fadeInOut(this.ui);
      this.getRegion('step' + step).show(
        s3v
      );
      new Step3Controller({
        view: s3v
      });
      break;
    case 4:
      var s4v = new Step4BaseView();
      // fadeInOut(this.ui);
      this.getRegion('step' + step).show(
        s4v
      );
      new Step4Controller({
        view: s4v
      });
      break;
    }

    desktopCaptureApp.currentStep = step;
  },

  fadeOut: function (stepToShow) {
    this.ui.overlay.addClass('hide');
    setTimeout(function (stepToShow) {
      this.getRegion('step' + desktopCaptureApp.currentStep).empty();
      this.setStep(stepToShow);
      this.fadeIn();
    }.bind(this), 300, stepToShow);
  },

  fadeIn: function () {
    this.ui.overlay.removeClass('hide');
  }
});