/* jshint node:true */

var _ = require('underscore');
window._ = _;
var Backbone = require('backbone');
Backbone.$ = window.$;
var Marionette = require('backbone.marionette');

module.exports = {
  Backbone: Backbone,
  Marionette: Backbone.Marionette
};