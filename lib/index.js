'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (input) {
  var parsed_input = parseInput(input);

  if (parsed_input !== null) {
    var value = parsed_input.value;
    var unit = parsed_input.unit;

    return relative_time_units[unit] * value;
  }

  return null;
};

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

var re = new RegExp('^\\s*' + // any whitespace
'(\\+|\\-)*' + // (optional) operator, positive or negative sign
'\\s*' + // any whitespace
'(\\d+)' + // (required) value
'\\s*' + // any whitespace
'(' + units + ')' + // (required) unit
's*' + // plural
'\\s*$' // any whitespace
);

function parseInput(input) {
  var match = re.exec(input);

  if (match !== null) {
    /* eslint-disable no-unused-vars */

    var _match = _slicedToArray(match, 4);

    var original = _match[0];
    var operator = _match[1];
    var value = _match[2];
    var unit = _match[3];
    /* eslint-enable no-unused-vars */

    value = parseInt(value, 10);

    if (operator === '-') {
      value = value * -1;
    }

    return {
      value: value,
      unit: unit
    };
  }

  return null;
}

/**
 * Parse simple relative time in human readable format to milliseconds.
 * @name parseRelativeTime
 * @param {string} input Human readable format of relative time
 * @returns {null|number}
 * @example
 * parseRelativeTime('2 days');  // --> 172800000
 */