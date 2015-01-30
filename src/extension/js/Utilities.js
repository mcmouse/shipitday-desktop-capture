/* jshint node:true */
'use strict';

//Global utility functions go here (generating UUIDs, naming things, converting things, etc)

module.exports = {
  getRandomName: function () {
    return Math.random().toString(36).slice(2);
  }
};