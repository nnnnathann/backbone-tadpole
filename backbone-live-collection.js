/*global define*/
define(function (require) {
  'use strict';
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Mixin = {
    startPolling: function (options) {
      var since = (new Date()).getTime();
      options = options || {};
      this.options = _.extend({ interval: 1000 }, options);
      this.options.data = _.extend({ since: since }, options.data || {});
      this.pollBind = _.bind(this.poll,this);
      this.poll();
    },
    poll: function () {
      this.fetch(this.options);
      this.timeout = setTimeout(this.pollBind, this.options.interval);
    },
    stopPolling: function () {
      if(this.timeout){
        clearTimeout(this.timeout);
      }
    }
  };
  var Class = Backbone.Collection.extend(Mixin);
  Class.Mixin = Mixin;
  return Class;
});
