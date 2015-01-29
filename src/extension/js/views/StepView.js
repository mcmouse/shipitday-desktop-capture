/* jshint node:true */

'use strict';

/** The root LayoutView that contains all of the top-level app regions */

var Marionette = require('backbone-shim').Marionette,
  StepTemplate = require('templates/StepTemplate.html');

module.exports = Marionette.ItemView.extend({
  template: StepTemplate
});