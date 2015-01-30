/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
  Step3Template = require('templates/Step3Template.html'),
  ShapeCollectionView = require('views/ShapeCollectionView');

module.exports = Marionette.LayoutView.extend({
  template: Step3Template,

  regions: {
    timeline: "#timeline"
  },

  attributes: {
    classes: 'step-inner',
  },

  ui: {
    video: '#hidden-video',
    addShape: '#add-shape',
    canvas: '#canvas',
  },

  events: {
    'click @ui.addShape': 'addShape',
  },

  onShow: function () {
    this.trigger('show');
  },

  addShape: function () {
    this.trigger('addShape');
  },

  initializeCollection: function (collection) {
    this.getRegion("timeline").show(new ShapeCollectionView({
      collection: collection
    }));
  },

  //Returns current time in MS
  getCurrentTime: function () {
    return this.ui.video[0].currentTime * 1000;
  },

  //Returns video duration in MS
  getMaxTime: function () {
    return this.ui.video[0].duration * 1000;
  }

});