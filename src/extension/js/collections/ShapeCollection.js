/* jshint node:true */
'use strict';

/** 
 * Collection of all shapes on the video
 */

var Backbone = require('backbone-shim').Backbone,
  Shape = require('models/Shape');

module.exports = Backbone.Collection.extend({
  model: Shape,
});