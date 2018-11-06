"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @typedef {'+' | '-' | ''} operator_keyword
 */

/**
 * @typedef {'ago' | ''} post_keyword
 */

/**
 * @typedef {object} parsed_input
 * @property {number} value
 * @property {string} unit
 */
var relative_time_units = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365
};
var units = Object.keys(relative_time_units).join('|');
var re_content = '' // any whitespace
+ '^\\s*' // pre-keyword (e.g. "in")
+ '(in)*' // (optional) operator-keyword, positive or negative sign
+ '(\\+|\\-|)*' // any whitespace
+ '\\s*' // (required) value
+ '(\\d+)' // any whitespace
+ '\\s*' // (required) unit
+ '(' + units + ')' // plural
+ 's*' // any whitespace
+ '\\s*' // post-keyword (e.g. "ago")
+ '(ago)*' // any whitespace
+ '\\s*$';
var re = new RegExp(re_content);
/**
 * Parses value and unit from human-readable relative time.
 * @param {string} input
 * @return {parsed_input | null} Returns `null` if input can not be parsed.
 */

function parseInput(input) {
  var match = re.exec(input);

  if (match !== null) {
    var _match = _slicedToArray(match, 6),
        pre_keyword = _match[1],
        operator_keyword = _match[2],
        value = _match[3],
        unit = _match[4],
        post_keyword = _match[5];

    if (pre_keyword && post_keyword || pre_keyword && operator_keyword || post_keyword && operator_keyword) {
      return null;
    }

    return {
      value: sanitizeValue({
        value: value,
        operator_keyword: operator_keyword,
        post_keyword: post_keyword
      }),
      unit: unit
    };
  }

  return null;
}
/**
 * Makes sure that the value is a number.
 * @param {object} config
 * @param {string} config.value
 * @param {operator_keyword} [config.operator_keyword]
 * @param {post_keyword} [config.post_keyword]
 * @return {number}
 */


function sanitizeValue(_ref) {
  var value = _ref.value,
      operator_keyword = _ref.operator_keyword,
      post_keyword = _ref.post_keyword;
  return parseInt(value, 10) * getMultiplier({
    operator_keyword: operator_keyword,
    post_keyword: post_keyword
  });
}
/**
 * Gets multiplier based on whether the value is in past or future.
 * @param {object} config
 * @param {operator_keyword} config.operator_keyword
 * @param {post_keyword} config.post_keyword
 * @return {number}
 */


function getMultiplier(_ref2) {
  var operator_keyword = _ref2.operator_keyword,
      post_keyword = _ref2.post_keyword;
  return operator_keyword === '-' || post_keyword === 'ago' ? -1 : 1;
}
/**
 * Parse simple relative time in human readable format to milliseconds.
 * @name parseRelativeTime
 * @param {string} input - Human readable format of relative time
 * @returns {null | number}
 * @example
 * parseRelativeTime('2 days');  // --> 172800000
 * parseRelativeTime('-2 days');
 * parseRelativeTime('in 2 days');
 * parseRelativeTime('2 days ago');
 */


function _default(input) {
  var parsed_input = parseInput(input);

  if (parsed_input !== null) {
    var value = parsed_input.value,
        unit = parsed_input.unit;
    return relative_time_units[unit] * value;
  }

  return null;
}