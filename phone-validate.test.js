const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isValidUSPhone } = require('./phone-validate.js');

test('rejects the wrong length after stripping formatting and an optional leading 1', () => {
  assert.equal(isValidUSPhone(''), false);
  assert.equal(isValidUSPhone('952'), false);
  assert.equal(isValidUSPhone('952-258-310'), false);
  assert.equal(isValidUSPhone('952258310012'), false);
  assert.equal(isValidUSPhone('+44 20 7946 0958'), false);
  assert.equal(isValidUSPhone('call me'), false);
});

test('rejects an area code or exchange that starts with 0 or 1', () => {
  assert.equal(isValidUSPhone('052-258-3100'), false);
  assert.equal(isValidUSPhone('152-258-3100'), false);
  assert.equal(isValidUSPhone('952-058-3100'), false);
  assert.equal(isValidUSPhone('952-158-3100'), false);
});

test('rejects N11 area codes and N11 exchanges', () => {
  const codes = ['211', '311', '411', '511', '611', '711', '811', '911'];
  for (const code of codes) {
    assert.equal(isValidUSPhone(code + '-201-4455'), false, code + ' area');
    assert.equal(isValidUSPhone('952-' + code + '-4455'), false, code + ' exchange');
  }
});

test('rejects only the fictional 555-0100 through 555-0199 range', () => {
  assert.equal(isValidUSPhone('612-555-0100'), false);
  assert.equal(isValidUSPhone('612-555-0150'), false);
  assert.equal(isValidUSPhone('612-555-0199'), false);
  assert.equal(isValidUSPhone('(612) 555-0100'), false);
  assert.equal(isValidUSPhone('+1 (612) 555-0100'), false);
});

test('rejects sequential fakes and full 10-digit runs, not a short sequence inside a real number', () => {
  assert.equal(isValidUSPhone('123-456-7890'), false);
  assert.equal(isValidUSPhone('234-567-8901'), false);
  assert.equal(isValidUSPhone('234-567-8911'), false);
  assert.equal(isValidUSPhone('987-654-3210'), false);
  assert.equal(isValidUSPhone('0123456789'), false);
  assert.equal(isValidUSPhone('952-258-1234'), true);
  assert.equal(isValidUSPhone('612-345-6789'), true);
});

test('rejects all-identical digits, including area, exchange, and line of one digit', () => {
  for (let n = 0; n <= 9; n++) {
    assert.equal(isValidUSPhone(String(n).repeat(10)), false, 'digit ' + n);
  }
  assert.equal(isValidUSPhone('222-222-2222'), false);
  assert.equal(isValidUSPhone('(555) 555-5555'), false);
  assert.equal(isValidUSPhone('222-222-2223'), true);
});

test('accepts real-looking numbers, including 555 outside 01xx and a leading +1', () => {
  assert.equal(isValidUSPhone('952-258-3100'), true);
  assert.equal(isValidUSPhone('612-555-0234'), true);
  assert.equal(isValidUSPhone('612-555-0200'), true);
  assert.equal(isValidUSPhone('763-201-4455'), true);
  assert.equal(isValidUSPhone('+1 (651) 288-1234'), true);
  assert.equal(isValidUSPhone('1-651-288-1234'), true);
  assert.equal(isValidUSPhone('952.474.9900'), true);
  assert.equal(isValidUSPhone('+19522583100'), true);
});
