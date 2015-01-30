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

    this.listenTo(this.view, 'addText', this.addText);
    this.listenTo(this.view, 'addBox', this.addBox);
    this.listenTo(this.view, 'addArrow', this.addArrow);
    this.listenTo(this.view, 'addTriangle', this.addTriangle);

    this.listenTo(this.view, 'submit', this.submitVideo);
    this.listenTo(this.view, 'restart', desktopCaptureApp.restart.bind(desktopCaptureApp));

    this.listenTo(this.view, 'sliderReady', this.setupSlider);
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
      type: 'square',
      color: 'red',
    });

    this.collection.add(newShape);
  },

  addText: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    newShape.initializeShape({
      type: 'text',
      color: 'red',
    });

    this.collection.add(newShape);
  },

  addBox: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    newShape.initializeShape({
      type: 'box',
      color: 'red',
    });

    this.collection.add(newShape);
  },

  addArrow: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    newShape.initializeShape({
      type: 'arrow',
      color: 'red',
    });

    this.collection.add(newShape);
  },

  addTriangle: function () {
    var newShape = new Shape({
      currentTime: this.view.getCurrentTime(),
      maxTime: this.view.getMaxTime()
    });

    newShape.initializeShape({
      type: 'triangle',
      color: 'red',
    });

    this.collection.add(newShape);
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

  updateShapes: function () {
    var currentTime = this.view.getCurrentTime();
    this.collection.each(function (model) {
      var bounds = model.getBounds();
      var showing = model.isShowing();
      if (bounds.start <= currentTime && bounds.end >= currentTime && !showing) {
        s3controller.canvas.add(model.get('Shape'));
        model.set('showing', true);
        model.showShape();
      } else if ((bounds.start > currentTime && showing) || (bounds.end < currentTime && showing)) {
        model.set('showing', false);
        model.hideShape();
      }
    });
    s3controller.updateBarPosition();
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
    s3controller.updateShapes();
    s3controller.updateBarPosition();
    s3controller.canvas.renderAll();
  },

  setupSlider: function () {
    this.slider = this.view.getSlider();
    this.slider.on('slide', function (time) {
      var video = this.view.getVideo();
      video.currentTime = time.value / 1000;
      video.pause();
      this.draw();
    }.bind(this));
  },

  updateBarPosition: function () {
    if (this.slider) {
      this.slider.bootstrapSlider('setValue', this.view.getCurrentTime(), false);
    }
  },

  submitVideo: function () {

    var files = {};

    desktopCaptureApp.RootView.showLoader();

    var video = this.view.getVideo();
    video.currentTime = 0;
    this.recorder = RecordRTC(this.view.ui.canvas[0], {
      type: "canvas",
      canvas: {
        width: 1280,
        height: 720
      },
      video: {
        width: 1280,
        height: 720
      }
    });
    this.canvas.deactivateAll().renderAll()
    this.recorder.startRecording();
    video.play();
    this.draw();
    video.onended = function () {
      this.recorder.stopRecording();
      this.recorder.getDataURL(function (dataURL) {

        files.video = {
          name: Utilities.getRandomName() + '.webm',
          type: 'video/webm',
          contents: dataURL,
        };

        console.log(files);

        if (this.hasAudio) {
          desktopCaptureApp.models.Audio.get('recorder').getDataURL(function (dataURL) {
            files.audio = {
              name: Utilities.getRandomName() + '.wav',
              type: 'audio/wav',
              contents: dataURL,
            };

            console.log(files);

            $.ajax({
              url: desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.uploadEndpoint,
              data: JSON.stringify(files),
              type: 'POST',
              contentType: 'application/json; charset=UTF-8',
              success: function (response) {
                desktopCaptureApp.options.downloadSrc = response;
                desktopCaptureApp.RootView.hideLoader();
                desktopCaptureApp.showStep(4);
              },
              error: function (xhr, status, error) {
                console.log(status, error);
              }
            });
          });
        } else {
          $.ajax({
            url: desktopCaptureApp.options.serverRoot + desktopCaptureApp.options.uploadEndpoint,
            data: JSON.stringify(files),
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            success: function (response) {
              desktopCaptureApp.options.downloadSrc = response;
              desktopCaptureApp.RootView.hideLoader();
              desktopCaptureApp.showStep(4);
            },
            error: function (xhr, status, error) {
              console.log(status, error);
            }
          });
        }
        //showLoader()
      }.bind(this));
    }.bind(this);
  },
});