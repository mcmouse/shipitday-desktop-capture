/* globals desktopCaptureApp */
/* jshint node:true */

'use strict';

/**
 * Manages step 2 by displaying video and passing it to the server
 */

var Backbone = require('backbone-shim').Backbone,
  Marionette = require('backbone-shim').Marionette,
  Shape = require('models/Shape');

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    this.view = options.view;
    this.collection = new Backbone.Collection();
    this.setupEvents();
  },

  setupEvents: function () {
    this.listenTo(this.view, 'show', this.setupEditor);
    this.listenTo(this.view, 'addShape', this.addShape);
    if (this.view._isShown) {
      this.setupEditor();
    }
  },

  addShape: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    this.canvas.add(newShape.initializeShape({
      type: 'square',
      color: 'red',
    }));

    newShape.initializeRangeBar();

    this.collection.add(
      newShape
    );
  },

  setupEditor: function () {
    this.setupCollection();
    this.setupCanvas();
  },

  setupCanvas: function () {
    this.canvas = new fabric.Canvas(this.view.ui.canvas.attr('id'), {
      width: 640,
      height: 480
    });
  },

  setupCollection: function () {
    this.view.initializeCollection(this.collection);
  }

});