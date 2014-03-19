/* global describe, it, define, beforeEach, afterEach */
define(function (require) {
  'use strict';
  var _ = require('underscore');
  var Backbone = require('backbone');
  var sinon = require('sinon');
  var mocha = require('mocha').setup('bdd');
  var expect = require('chai').expect;
  var LiveCollection = require('backbone-live-collection');

  describe('export properties', function () {

    it('should export Mixin property', function () {

      expect(LiveCollection).to.have.property('Mixin');
    });
    it('should export Class property that extends Backbone.Collection', function () {

      expect(LiveCollection).to.be.a('function');
      expect(new LiveCollection()).to.be.an.instanceof(Backbone.Collection);
    });
  });

  describe('polling', function () {

    var CollectionClass, server, collection, clock, timestamp;

    beforeEach(function () {
      CollectionClass = Backbone.Collection.extend(_.extend(LiveCollection.Mixin, {
        initialize: function () {
          this.myFancyId = 1;
        },
        url: function () {
          return '/mock/' + this.myFancyId;
        }
      }));
      timestamp = (new Date()).getTime();
      server = sinon.fakeServer.create();
      clock = sinon.useFakeTimers(timestamp, 'setTimeout', 'clearTimeout', 'Date');
    });
    afterEach(function () {
      server.restore();
      collection.stopPolling();
      clock.restore();
    });
    it('should fetch on startPolling', function () {
      collection = new CollectionClass();
      collection.startPolling();
      expect(server.requests).to.have.length(1);
    });

    it('should default to 1000ms', function () {
      collection = new CollectionClass();
      collection.startPolling();
      clock.tick(500);
      expect(server.requests).to.have.length(1);
      clock.tick(1001);
      expect(server.requests).to.have.length(2);
    });

    it('should allow custom interval', function () {
      collection = new CollectionClass();
      collection.startPolling({ interval: 200 });
      clock.tick(100);
      expect(server.requests).to.have.length(1);
      clock.tick(101);
      expect(server.requests).to.have.length(2);
      clock.tick(201);
      expect(server.requests).to.have.length(3);
    });

    it('should add since parameter to fetch request', function () {
      collection = new CollectionClass();
      collection.startPolling();
      expect(server.requests[0].url).to.eq('/mock/1?since=' + timestamp);
    });

    it('should allow extension with custom query parameters', function () {
      collection = new CollectionClass();
      collection.startPolling({
        data: { email: 'nathan@bleigh.com' }
      });
      expect(server.requests[0].url)
        .to.eq('/mock/1?since=' + timestamp + '&email=nathan%40bleigh.com');
    });
  });
  mocha.run();
});
