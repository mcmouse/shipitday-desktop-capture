/* jshint node:true */

'use strict';

/** Contains Fabric object and information about shape */

var Backbone = require('backbone-shim').Backbone,
  RangeBar = require('elessar');

module.exports = Backbone.Model.extend({
  initializeShape: function (options) {
    var shape;
    if (options.type === 'square') {
      shape = new fabric.Rect({
        fill: options.color,
        width: 100,
        height: 100
      });
      this.set('Shape', shape);
    }

    return shape;
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