backbone-tadpole
========================

Backbone Tadpole is a tiny set of functions to enable
continuous updates from a backend service.  Specifically, live
collection can help you by handling the polling loops,
and adding some default parameters that make supporting
polling updates easier on the back end.

### Usage

#### As a Sub-Class

```javascript
var Tadpole = require('backbone-tadpole');
var MyClass = Tadpole.extend({
  url: '/api/zings',
  initialize: function () {
    this.startPolling({ interval: 1000 });
  }
});
// Will now poll /api/tweets?since=[timestamp]
```

#### As a Mixin

```javascript
var Tadpole = require('backbone-tadpole');
var MyClass = Backbone.Collection.extend(
  _.extend(Tadpole.Mixin, {
    url: '/api/zings',
    initialize: function () {
      this.startPolling({ interval: 2000, data: { user: 'foo' } });
    }
  })
);
```
