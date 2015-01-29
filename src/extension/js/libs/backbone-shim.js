/* jshint node:true */

var _ = require('underscore');
window._ = _;
var $ = require('jquery');
window.$ = $;
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

module.exports = {
  Backbone: Backbone,
  Marionette: Backbone.Marionette
};