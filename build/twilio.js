'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = sendMessage;

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _twilio2.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendMessage(to, message) {
  return (0, _utils.fromNode)(cb => {
    client.sendMessage({
      to: to,
      from: process.env.TWILIO_PHONE,
      body: message
    }, cb);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90d2lsaW8uanMiXSwibmFtZXMiOlsic2VuZE1lc3NhZ2UiLCJjbGllbnQiLCJwcm9jZXNzIiwiZW52IiwiVFdJTElPX0FDQ09VTlRfU0lEIiwiVFdJTElPX0FVVEhfVE9LRU4iLCJ0byIsIm1lc3NhZ2UiLCJjYiIsImZyb20iLCJUV0lMSU9fUEhPTkUiLCJib2R5Il0sIm1hcHBpbmdzIjoiOzs7OztRQVNzQkEsVyxHQUFBQSxXOztBQVR0Qjs7OztBQUVBOzs7O0FBRUEsTUFBTUMsU0FBUyxxQkFDYkMsUUFBUUMsR0FBUixDQUFZQyxrQkFEQyxFQUViRixRQUFRQyxHQUFSLENBQVlFLGlCQUZDLENBQWY7O0FBS08sZUFBZUwsV0FBZixDQUE0Qk0sRUFBNUIsRUFBZ0NDLE9BQWhDLEVBQXlDO0FBQzlDLFNBQU8scUJBQVNDLE1BQU07QUFDcEJQLFdBQU9ELFdBQVAsQ0FBbUI7QUFDakJNLFVBQUlBLEVBRGE7QUFFakJHLFlBQU1QLFFBQVFDLEdBQVIsQ0FBWU8sWUFGRDtBQUdqQkMsWUFBTUo7QUFIVyxLQUFuQixFQUlHQyxFQUpIO0FBS0QsR0FOTSxDQUFQO0FBT0QiLCJmaWxlIjoidHdpbGlvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFR3aWxpbyBmcm9tICd0d2lsaW8nXG5cbmltcG9ydCB7IGZyb21Ob2RlIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgY2xpZW50ID0gbmV3IFR3aWxpbyhcbiAgcHJvY2Vzcy5lbnYuVFdJTElPX0FDQ09VTlRfU0lELFxuICBwcm9jZXNzLmVudi5UV0lMSU9fQVVUSF9UT0tFTlxuKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE1lc3NhZ2UgKHRvLCBtZXNzYWdlKSB7XG4gIHJldHVybiBmcm9tTm9kZShjYiA9PiB7XG4gICAgY2xpZW50LnNlbmRNZXNzYWdlKHtcbiAgICAgIHRvOiB0byxcbiAgICAgIGZyb206IHByb2Nlc3MuZW52LlRXSUxJT19QSE9ORSxcbiAgICAgIGJvZHk6IG1lc3NhZ2VcbiAgICB9LCBjYilcbiAgfSlcbn1cbiJdfQ==