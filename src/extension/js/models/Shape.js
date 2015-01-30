/* jshint node:true */

'use strict';

/** Contains Fabric object and information about shape */

var Backbone = require('backbone-shim').Backbone,
  RangeBar = require('elessar');

module.exports = Backbone.Model.extend({
  initializeShape: function (options, callback) {

    this.on('shapeLoaded', function (shape) {
      this.set('Shape', shape);
      callback(shape);
    });

    switch (options.type) {
    case 'square':
      var shape = new fabric.Rect({
        fill: options.color,
        width: 100,
        height: 100
      });

      this.trigger('shapeLoaded', shape);
      break;

    case 'box':
      var shape = new fabric.Rect({
        fill: 'rgba(0,0,0,0)',
        width: 125,
        height: 125,
        stroke: 'red',
        strokeWidth: 5
      });

      this.trigger('shapeLoaded', shape);
      break;

    case 'text':
      var shape = new fabric.IText("Hello world!", {
        fill: options.color,
        fontSize: 20
      });

      this.trigger('shapeLoaded', shape);
      break;

    case 'arrow':
      new fabric.loadSVGFromURL("/img/arrow.svg", function (objects) {
        var group = new fabric.PathGroup(objects, {
          width: 30,
          height: 40,
          fill: 'red'
        });
        this.trigger('shapeLoaded', group);
      }.bind(this));
      break;

    case 'triangle':
      var shape = new fabric.Triangle({
        fill: options.color,
        width: 100,
        height: 100
      });

      this.trigger('shapeLoaded', shape);
      break;
    }
  },

  //currentTime and maxTime will be passed in when the models are created
  initializeRangeBar: function () {
    this.set('RangeBar', new RangeBar({
      maxRanges: 1,
      min: 0,
      max: this.get('maxTime'),
      values: [
        [this.get('currentTime'),
          Math.min(this.get('currentTime') + 100, this.get('maxTime'))
        ]
      ]
    }));
  },

  getRangeBar: function () {
    return this.get('RangeBar').$el;
  },

  getBounds: function () {
    var bounds = this.get('RangeBar').val();
    return {
      start: bounds[0][0],
      end: bounds[0][1]
    };
  }
  //Data for a range bar
  //Data for holding a shape
});