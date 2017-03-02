'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = exports.createRequest = exports.fromNode = exports.uniq = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CHROME_UA = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3)', 'AppleWebKit/537.36 (KHTML, like Gecko)', 'Chrome/56.0.2924.87', 'Safari/537.36'].join(' ');

const uniq = exports.uniq = arr => {
  const uniqs = [];
  for (const a of arr) {
    if (!uniqs.includes(a)) {
      uniqs.push(a);
    }
  }
  return uniqs;
};

const fromNode = exports.fromNode = fn => new Promise((resolve, reject) => {
  fn((err, value) => err ? reject(err) : resolve(value));
});

const createRequest = exports.createRequest = () => {
  const jar = _request2.default.jar();
  const req = (method, url, { body, form } = {}) => fromNode(cb => {
    (0, _request2.default)({
      method,
      url,
      body,
      jar,
      form,
      followRedirect: true,
      followAllRedirects: true,
      headers: {
        'User-Agent': CHROME_UA
      }
    }, cb);
  });

  return {
    get: (...args) => req('GET', ...args),
    post: (...args) => req('POST', ...args)
  };
};

const sleep = exports.sleep = ms => new Promise(resolve => {
  setTimeout(resolve, ms);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJDSFJPTUVfVUEiLCJqb2luIiwidW5pcSIsImFyciIsInVuaXFzIiwiYSIsImluY2x1ZGVzIiwicHVzaCIsImZyb21Ob2RlIiwiZm4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImVyciIsInZhbHVlIiwiY3JlYXRlUmVxdWVzdCIsImphciIsInJlcSIsIm1ldGhvZCIsInVybCIsImJvZHkiLCJmb3JtIiwiY2IiLCJmb2xsb3dSZWRpcmVjdCIsImZvbGxvd0FsbFJlZGlyZWN0cyIsImhlYWRlcnMiLCJnZXQiLCJhcmdzIiwicG9zdCIsInNsZWVwIiwibXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVBLE1BQU1BLFlBQVksQ0FDaEIsaURBRGdCLEVBRWhCLHdDQUZnQixFQUdoQixxQkFIZ0IsRUFJaEIsZUFKZ0IsRUFLaEJDLElBTGdCLENBS1gsR0FMVyxDQUFsQjs7QUFPTyxNQUFNQyxzQkFBT0MsT0FBTztBQUN6QixRQUFNQyxRQUFRLEVBQWQ7QUFDQSxPQUFLLE1BQU1DLENBQVgsSUFBZ0JGLEdBQWhCLEVBQXFCO0FBQ25CLFFBQUksQ0FBQ0MsTUFBTUUsUUFBTixDQUFlRCxDQUFmLENBQUwsRUFBd0I7QUFDdEJELFlBQU1HLElBQU4sQ0FBV0YsQ0FBWDtBQUNEO0FBQ0Y7QUFDRCxTQUFPRCxLQUFQO0FBQ0QsQ0FSTTs7QUFVQSxNQUFNSSw4QkFBV0MsTUFBTSxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQzdESCxLQUFHLENBQUNJLEdBQUQsRUFBTUMsS0FBTixLQUFnQkQsTUFBTUQsT0FBT0MsR0FBUCxDQUFOLEdBQW9CRixRQUFRRyxLQUFSLENBQXZDO0FBQ0QsQ0FGNkIsQ0FBdkI7O0FBSUEsTUFBTUMsd0NBQWdCLE1BQU07QUFDakMsUUFBTUMsTUFBTSxrQkFBWUEsR0FBWixFQUFaO0FBQ0EsUUFBTUMsTUFBTSxDQUFDQyxNQUFELEVBQVNDLEdBQVQsRUFBYyxFQUFFQyxJQUFGLEVBQVFDLElBQVIsS0FBaUIsRUFBL0IsS0FBc0NiLFNBQVNjLE1BQU07QUFDL0QsMkJBQVk7QUFDVkosWUFEVTtBQUVWQyxTQUZVO0FBR1ZDLFVBSFU7QUFJVkosU0FKVTtBQUtWSyxVQUxVO0FBTVZFLHNCQUFnQixJQU5OO0FBT1ZDLDBCQUFvQixJQVBWO0FBUVZDLGVBQVM7QUFDUCxzQkFBY3pCO0FBRFA7QUFSQyxLQUFaLEVBV0dzQixFQVhIO0FBWUQsR0FiaUQsQ0FBbEQ7O0FBZUEsU0FBTztBQUNMSSxTQUFLLENBQUMsR0FBR0MsSUFBSixLQUFhVixJQUFJLEtBQUosRUFBVyxHQUFHVSxJQUFkLENBRGI7QUFFTEMsVUFBTSxDQUFDLEdBQUdELElBQUosS0FBYVYsSUFBSSxNQUFKLEVBQVksR0FBR1UsSUFBZjtBQUZkLEdBQVA7QUFJRCxDQXJCTTs7QUF1QkEsTUFBTUUsd0JBQVFDLE1BQU0sSUFBSXBCLE9BQUosQ0FBWUMsV0FBVztBQUNoRG9CLGFBQVdwQixPQUFYLEVBQW9CbUIsRUFBcEI7QUFDRCxDQUYwQixDQUFwQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBub2RlUmVxdWVzdCBmcm9tICdyZXF1ZXN0J1xuXG5jb25zdCBDSFJPTUVfVUEgPSBbXG4gICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8zKScsXG4gICdBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKScsXG4gICdDaHJvbWUvNTYuMC4yOTI0Ljg3JyxcbiAgJ1NhZmFyaS81MzcuMzYnXG5dLmpvaW4oJyAnKVxuXG5leHBvcnQgY29uc3QgdW5pcSA9IGFyciA9PiB7XG4gIGNvbnN0IHVuaXFzID0gW11cbiAgZm9yIChjb25zdCBhIG9mIGFycikge1xuICAgIGlmICghdW5pcXMuaW5jbHVkZXMoYSkpIHtcbiAgICAgIHVuaXFzLnB1c2goYSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaXFzXG59XG5cbmV4cG9ydCBjb25zdCBmcm9tTm9kZSA9IGZuID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgZm4oKGVyciwgdmFsdWUpID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSh2YWx1ZSkpXG59KVxuXG5leHBvcnQgY29uc3QgY3JlYXRlUmVxdWVzdCA9ICgpID0+IHtcbiAgY29uc3QgamFyID0gbm9kZVJlcXVlc3QuamFyKClcbiAgY29uc3QgcmVxID0gKG1ldGhvZCwgdXJsLCB7IGJvZHksIGZvcm0gfSA9IHt9KSA9PiBmcm9tTm9kZShjYiA9PiB7XG4gICAgbm9kZVJlcXVlc3Qoe1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsLFxuICAgICAgYm9keSxcbiAgICAgIGphcixcbiAgICAgIGZvcm0sXG4gICAgICBmb2xsb3dSZWRpcmVjdDogdHJ1ZSxcbiAgICAgIGZvbGxvd0FsbFJlZGlyZWN0czogdHJ1ZSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1VzZXItQWdlbnQnOiBDSFJPTUVfVUFcbiAgICAgIH1cbiAgICB9LCBjYilcbiAgfSlcblxuICByZXR1cm4ge1xuICAgIGdldDogKC4uLmFyZ3MpID0+IHJlcSgnR0VUJywgLi4uYXJncyksXG4gICAgcG9zdDogKC4uLmFyZ3MpID0+IHJlcSgnUE9TVCcsIC4uLmFyZ3MpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNsZWVwID0gbXMgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpXG59KVxuIl19