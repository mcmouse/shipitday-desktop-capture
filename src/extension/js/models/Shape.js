/* jshint node:true */

'use strict';

/** Contains Fabric object and information about shape */

var Backbone = require('backbone-shim').Backbone,
  RangeBar = require('elessar');

module.exports = Backbone.Model.extend({
  initializeShape: function (options) {
    var shape = 0;

    switch(options.type) {
    	case 'square':
	    	shape = new fabric.Rect({
	        fill: options.color,
	        width: 100,
	        height: 100
	      });
    	break;

    	case 'box':
	    	shape = new fabric.Rect({
			  fill: 'rgba(0,0,0,0)',
			  width: 125,
			  height: 125,
			  stroke: 'red',
			  strokeWidth: 5
			});
    	break;

    	case 'text':
    		shape = new fabric.IText("Hello world!",{
        	fill: options.color,
        	fontSize: 20
      		});
    	break;

    	case 'arrow':
    		new fabric.Image.fromURL("../img/arrow.png", function(oImg) {
				  shape = oImg;
				}.bind(this));
    	break;

    	case 'triangle':
    		shape = new fabric.Triangle({
    			fill: options.color,
    			width: 100,
    			height: 100
    		});
    	break;
    }

    set('Shape', this.shape);
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
          Math.min(this.get('currentTime') + 5000, this.get('maxTime'))
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