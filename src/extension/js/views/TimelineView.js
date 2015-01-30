/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
    TimelineTemplate = require('templates/TimelineTemplate.html');

module.exports = Marionette.ItemView.extend({
  template: TimelineTemplate,
  attributes: {
  	classes: "rangeBarWrapper"
  },
  onShow: function() {
  	this.model.initializeRangeBar();
  	this.$ButtonClick = $('<button>X</button>')
  	this.$el.append(this.$ButtonClick.get(0));
  	this.$ButtonClick.click(function(){
  		this.$ButtonClick.parent().remove();

  		this.model.get('Shape').animate('opacity', 0,{
  			onChange: s3controller.canvas.renderAll.bind(s3controller.canvas),
  			duration: 250,
  			onComplete: function() {
  				s3controller.canvas.remove(this.model.get('Shape'));
  			}.bind(this)
		});
  	}.bind(this));

  	this.$el.append(this.model.getRangeBar());
  }
});