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
    video: '#review-video',
  },

  events: {
    'click @ui.shareButton': 'shareVideo',
  },

  onShow: function() {
    this.getRegion("timeline").show(new ShapeCollectionView())
  },

  shareVideo: function () {
    $('.modal input').val(desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.downloadEndpoint + desktopCaptureApp.options.downloadSrc);
  },

});