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

const relative_time_units = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365
};

const units = Object.keys(relative_time_units).join('|');

const re_content = ''
  // any whitespace
  + '^\\s*'
  // pre-keyword (e.g. "in")
  + '(in)*'
  // (optional) operator-keyword, positive or negative sign
  + '(\\+|\\-|)*'
  // any whitespace
  + '\\s*'
  // (required) value
  + '(\\d+)'
  // any whitespace
  + '\\s*'
  // (required) unit
  + '(' + units + ')'
  // plural
  + 's*'
  // any whitespace
  + '\\s*'
  // post-keyword (e.g. "ago")
  + '(ago)*'
  // any whitespace
  + '\\s*$';

const re = new RegExp(re_content);

/**
 * Parses value and unit from human-readable relative time.
 * @param {string} input
 * @return {parsed_input | null} Returns `null` if input can not be parsed.
 */
function parseInput (input) {
  const match = re.exec(input);

  if (match !== null) {
    const [, pre_keyword, operator_keyword, value, unit, post_keyword] = match;

    if (
      (pre_keyword && post_keyword)
      || (pre_keyword && operator_keyword)
      || (post_keyword && operator_keyword)
    ) {
      return null;
    }

    return {
      value: sanitizeValue({value, operator_keyword, post_keyword}),
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
function sanitizeValue ({value, operator_keyword, post_keyword}) {
  return parseInt(value, 10) * getMultiplier({operator_keyword, post_keyword});
}

/**
 * Gets multiplier based on whether the value is in past or future.
 * @param {object} config
 * @param {operator_keyword} config.operator_keyword
 * @param {post_keyword} config.post_keyword
 * @return {number}
 */
function getMultiplier ({operator_keyword, post_keyword}) {
  return (operator_keyword === '-' || post_keyword === 'ago')
    ? -1
    : 1;
}

/**
 * Parse simple relative time in human readable format to milliseconds.
 * @name parseRelativeTime
 * @param {string} input - Human readable format of relative time
 * @returns {null | number}
 * @example
 * parseRelativeTime('2 days');  // --> 172800000
 */
export default function (input) {
  const parsed_input = parseInput(input);

  if (parsed_input !== null) {
    const {value, unit} = parsed_input;
    return relative_time_units[unit] * value;
  }

  return null;
}
