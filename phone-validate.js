/* Shared US phone check for Green Key lead forms.
   One function, used by the page and by phone-validate.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.isValidUSPhone = api.isValidUSPhone;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  // Named fakes that are not a pure +1/-1 run (9 wraps to 0, or the line repeats).
  var NAMED_RUNS = {
    '1234567890': 1,
    '2345678901': 1,
    '2345678911': 1,
    '9876543210': 1
  };

  function nationalDigits(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d;
  }

  // Full 10-digit ascending or descending run only. A short sequence inside
  // a real number (the last four digits, for example) is not a run.
  function isClearRun(d) {
    if (NAMED_RUNS[d]) return true;
    var up = true, down = true, i, diff;
    for (i = 1; i < 10; i++) {
      diff = d.charCodeAt(i) - d.charCodeAt(i - 1);
      if (diff !== 1) up = false;
      if (diff !== -1) down = false;
    }
    return up || down;
  }

  function isValidUSPhone(raw) {
    var d = nationalDigits(raw);
    var area, exchange, line;
    if (d.length !== 10) return false;
    area = d.slice(0, 3);
    exchange = d.slice(3, 6);
    line = d.slice(6);
    // Area code and exchange must start with 2-9.
    if (area.charAt(0) < '2' || exchange.charAt(0) < '2') return false;
    // N11 service codes: 211, 311, 411, 511, 611, 711, 811, 911.
    if (area.charAt(1) === '1' && area.charAt(2) === '1') return false;
    if (exchange.charAt(1) === '1' && exchange.charAt(2) === '1') return false;
    // Reserved fiction range only. Other 555 lines can be real.
    if (exchange === '555' && line.slice(0, 2) === '01') return false;
    // All ten digits the same, including 222-222-2222.
    if (/^(\d)\1{9}$/.test(d)) return false;
    if (isClearRun(d)) return false;
    return true;
  }

  return { isValidUSPhone: isValidUSPhone };
});
