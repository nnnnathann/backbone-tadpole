/*global define*/
define(function (require) {
  'use strict';
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Mixin = {
    startPolling: function (options) {
      options = options || {};
      this.options = _.extend({ interval: 1000 }, options);
      this.options.data = options.data || {};
      this.pollBind = _.bind(this.autoPoll,this);
      this.stopped = false;
      this.poll();
    },
    autoPoll: function () {
      if(this.stopped) {
        return;
      }
      return this.poll();
    },
    poll: function () {
      if(this._previousFetch){
        this.options.data.since = this._previousFetch;
      }
      this.fetch(this.options);
      this._previousFetch = (new Date()).getTime();
      this._timeout = setTimeout(this.pollBind, this.options.interval);
    },
    stopPolling: function () {
      this.stopped = true;
      if(this._timeout){
        clearTimeout(this._timeout);
      }
    }
  };
  var Class = Backbone.Collection.extend(Mixin);
  Class.Mixin = Mixin;
  return Class;
});
