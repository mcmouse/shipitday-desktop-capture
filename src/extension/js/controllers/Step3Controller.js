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

    this.recorder = desktopCaptureApp.models.Video.get('recorder');
    this.audioRecorder = desktopCaptureApp.models.Audio.get('recorder');

    this.recorder.getDataURL(function (url) {
      this.view.setVideoSrc(url);
      this.view.bindEndEvent();
      this.setupVideo();
    }.bind(this));

    this.hasAudio = false;

    if (this.audioRecorder) {
      this.hasAudio = true;
      this.audioRecorder.getDataURL(function (url) {
        this.view.setAudioSrc(url);
        this.view.bindPlayEvents();
      }.bind(this));
    }
    window.s3controller = this;
  },

  setupEvents: function () {
    this.listenTo(this.view, 'show', this.setupEditor);
    this.listenTo(this.view, 'addShape', this.addShape);
    this.listenTo(this.view, 'playing', this.draw);
    this.listenTo(this.view, 'mediaLoaded', this.draw);
    if (this.view._isShown) {
      this.setupEditor();
    }
  },

  addShape: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    newShape.initializeShape({
      type: 'arrow',
      color: 'red',
    }, this.addShapeToCanvas.bind(this));

    this.collection.add(newShape);
  },

  addShapeToCanvas: function (shape) {
    this.canvas.add(shape);
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
  },

  setupVideo: function () {
    this.video = new fabric.Image(this.view.getVideo(), {
      left: 0,
      top: 0,
      'selectable': false,
      width: 640,
      height: 480
    });

    this.canvas.add(this.video);

    setTimeout(function () {
      this.draw();
    }.bind(this), 1000);
  },

  draw: function () {
    if (s3controller.view.isPlaying()) {
      requestAnimationFrame(s3controller.draw);
    }
    s3controller.canvas.renderAll();
    s3controller.updateBarPosition();
  },

  updateBarPosition: function () {

  },

  seekVideo: function () {

  }
});