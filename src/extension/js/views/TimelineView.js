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
  		s3controller.canvas.remove(this.model.get('Shape'));
  	}.bind(this));

  	this.$el.append(this.model.getRangeBar());
  }
});