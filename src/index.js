const relative_time_units = {
  second : 1000,
  minute : 1000 * 60,
  hour   : 1000 * 60 * 60,
  day    : 1000 * 60 * 60 * 24,
  week   : 1000 * 60 * 60 * 24 * 7,
  month  : 1000 * 60 * 60 * 24 * 30,
  year   : 1000 * 60 * 60 * 24 * 365
};


const units = Object.keys(relative_time_units).join('|');


const re = new RegExp(
  '^\\s*'           +       // any whitespace
  '(\\+|\\-)*'      +       // (optional) operator, positive or negative sign
  '\\s*'            +       // any whitespace
  '(\\d+)'          +       // (required) value
  '\\s*'            +       // any whitespace
  '(' + units + ')' +       // (required) unit
  's*'              +       // plural
  '\\s*$'                   // any whitespace
);


function parseInput (input) {
  const match = re.exec(input);

  if (match !== null) {
    /* eslint-disable no-unused-vars */
    let [original, operator, value, unit] = match;
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
export default function (input) {
  const parsed_input = parseInput(input);

  if (parsed_input !== null) {
    const {value, unit} = parsed_input;
    return relative_time_units[unit] * value;
  }

  return null;
}
