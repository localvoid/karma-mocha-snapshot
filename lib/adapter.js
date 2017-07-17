(function (window) {
  "use strict";

  var Runnable = window.Mocha.Runnable;

  var _context = {
    runnable: null,
    title: '',
    index: 0,
  };

  var snapshotState = window.__snapshot_state__;
  var snapshot = window.__snapshot__;
  var chai = window.chai;

  var _run = Runnable.prototype.run;
  Runnable.prototype.run = function () {
    _context.runnable = this;
    _context.index = 0;
    return _run.apply(this, arguments);
  };

  chai.util.addMethod(chai.Assertion.prototype, 'matchSnapshot', function (update) {
    var obj = chai.util.flag(this, 'object');
    var ssfi = chai.util.flag(this, 'ssfi')

    var snapshotName = _context.runnable.title + ' ' + _context.index++;
    snapshotState.visited[snapshotName] = true;

    if (!update && !snapshotState.update && snapshot.hasOwnProperty(snapshotName)) {
      var s = snapshot[snapshotName];
      if (obj !== s) {
        throw new chai.AssertionError('Received value does not match stored snapshot "' + snapshotName + '".', {
          actual: obj,
          expected: s,
          showDiff: true
        }, ssfi);
      }
    } else {
      snapshotState.dirty = true;
      snapshot[snapshotName] = obj;
    }
  });
})(window);
