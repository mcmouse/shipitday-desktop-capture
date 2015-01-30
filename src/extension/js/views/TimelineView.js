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
  	this.$el.append(this.model.getRangeBar());
  }
});