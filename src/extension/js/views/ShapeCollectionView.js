/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette,
  TimelineView = require('views/TimelineView');

module.exports = Marionette.CollectionView.extend({
  childView: TimelineView,

});