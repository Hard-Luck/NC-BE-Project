exports.isANumber = (x) => /^[0-9]+$/.test(x);

exports.isPositiveInteger = (x) => /^[0-9]+$/.test(x) && +x > 0;
