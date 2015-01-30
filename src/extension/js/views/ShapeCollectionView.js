/* jshint node:true */

'use strict';

/** Base view for step 2 */

var Marionette = require('backbone-shim').Marionette;

module.exports = Marionette.CollectionView.extend({
  childView: TimelineView,

});