const testDigit = function(digit) {
  return /^\d$/.test(digit);
};

const abs = function(number) {
  if (typeof number === "undefined") {
    return;
  }
  const bigNumber = BigNumber(number);
  bigNumber.sign = 1;
  return bigNumber;
};

const isValidType = function(number) {
  return [
    typeof number === "number",
    typeof number === "string" && number.length > 0,
    Array.isArray(number) && number.length > 0,
    number instanceof BigNumber
  ].some(bool => bool === true);
};

const errors = {
  invalid: "Invalid Number",
  divisionZero: "Division By Zero"
};

function BigNumber(initialNumber) {
  if (!(this instanceof BigNumber)) {
    return new BigNumber(initialNumber);
  }

  this.number = [];
  this.sign = 1;
  this.rest = 0;

  if (!isValidType(initialNumber)) {
    this.number = errors["invalid"];
    return;
  }

  if (Array.isArray(initialNumber)) {
    if (initialNumber.length && ["+", "-"].includes(initialNumber[0])) {
      this.sign = initialNumber[0] === "+" ? 1 : -1;
      initialNumber.shift(0);
    }
    for (let index = initialNumber.length - 1; index >= 0; index--) {
      if (!this.addDigit(initialNumber[index])) return;
    }
  } else {
    initialNumber = initialNumber.toString();
    const first = initialNumber.charAt(0);
    if (["+", "-"].includes(first)) {
      this.sign = first === "+" ? 1 : -1;
      initialNumber = initialNumber.substring(1);
    }

    for (let index = initialNumber.length - 1; index >= 0; index--) {
      if (!this.addDigit(parseInt(initialNumber.charAt(index), 10))) {
        return;
      }
    }
  }
}

BigNumber.prototype.addDigit = function(digit) {
  if (!testDigit(digit)) {
    this.number = errors["invalid"];
    return false;
  }
  this.number.push(digit);
  return this;
};

BigNumber.prototype.isEven = function() {
  return this.number[0] % 2 === 0;
};

BigNumber.prototype._compare = function(number) {
  if (!isValidType(number)) return null;
  const bigNumber = BigNumber(number);

  if (this.sign !== bigNumber.sign) return this.sign;

  let offset = this.number.length - bigNumber.number.length;
  if (offset !== 0) return (this.sign * offset) / Math.abs(offset);

  for (let index = this.number.length - 1; index >= 0; index--) {
    offset = this.number[index] - bigNumber.number[index];
    if (offset !== 0) return (this.sign * offset) / Math.abs(offset);
  }

  return 0;
};

BigNumber.prototype.gt = function(number) {
  return this._compare(number) > 0;
};

BigNumber.prototype.gte = function(number) {
  return this._compare(number) >= 0;
};

BigNumber.prototype.equals = function(number) {
  return this._compare(number) === 0;
};

BigNumber.prototype.lte = function(number) {
  return this._compare(number) <= 0;
};

BigNumber.prototype.lt = function(number) {
  return this._compare(number) < 0;
};

BigNumber.prototype.add = function(number) {
  if (typeof number === "undefined") return this;
  const bigNumber = BigNumber(number);

  if (this.sign !== bigNumber.sign) {
    const numbers = [bigNumber, this];
    const index = this.sign > 0 ? [0, 1] : [1, 0];
    numbers[index[0]].sign = 1;
    return numbers[index[1]].minus(numbers[index[0]]);
  }

  this.number = BigNumber._add(this, bigNumber);
  return this;
};

BigNumber.prototype.subtract = function(number) {
  if (typeof number === "undefined") return this;
  const bigNumber = BigNumber(number);
  if (this.sign !== bigNumber.sign) {
    this.number = BigNumber._add(this, bigNumber);
    return this;
  }
  this.sign = this.lt(bigNumber) ? -1 : 1;
  this.number = abs(this).lt(abs(bigNumber))
    ? BigNumber._subtract(bigNumber, this)
    : BigNumber._subtract(this, bigNumber);
  return this;
};

BigNumber._add = function(a, b) {
  const length = Math.max(a.number.length, b.number.length);
  for (let index = 0, remainder = 0; index < length || remainder > 0; index++) {
    remainder += (a.number[index] || 0) + (b.number[index] || 0);
    a.number[index] = remainder % 10;
    remainder = Math.floor(remainder / 10);
  }
  return a.number;
};

BigNumber._subtract = function(a, b) {
  for (
    let index = 0, remainder = 0, length = a.number.length;
    index < length;
    index++
  ) {
    a.number[index] -= (b.number[index] || 0) + remainder;
    remainder = a.number[index] < 0 ? 1 : 0;
    a.number[index] += remainder * 10;
  }
  let index = 0;
  const length = a.number.length - 1;
  while (a.number[length - index] === 0 && length - index > 0) {
    index++;
  }
  if (index > 0) {
    a.number.splice(-index);
  }
  return a.number;
};

BigNumber.prototype.multiply = function(number) {
  if (typeof number === "undefined") return this;
  const bigNumber = BigNumber(number);

  if (this.isZero() || bigNumber.isZero()) return BigNumber(0);

  this.sign *= bigNumber.sign;

  const result = [];
  for (let index = 0; index < this.number.length; index++) {
    for (
      let remainder = 0, givenNumberIndex = 0;
      givenNumberIndex < bigNumber.number.length || remainder > 0;
      givenNumberIndex++
    ) {
      remainder +=
        (result[index + givenNumberIndex] || 0) +
        this.number[index] * (bigNumber.number[givenNumberIndex] || 0);
      result[index + givenNumberIndex] = remainder % 10;
      remainder = Math.floor(remainder / 10);
    }
  }

  this.number = result;
  return this;
};

BigNumber.prototype.divide = function(number) {
  if (typeof number === "undefined") return this;

  const bigNumber = BigNumber(number);

  if (bigNumber.isZero()) {
    this.number = errors["divisionZero"];
    return this;
  } else if (this.isZero()) {
    this.rest = BigNumber(0);
    return this;
  }

  this.sign *= bigNumber.sign;
  bigNumber.sign = 1;

  if (bigNumber.number.length === 1 && bigNumber.number[0] === 1) {
    this.rest = BigNumber(0);
    return this;
  }
  const result = [];
  const rest = BigNumber(0);
  for (let index = this.number.length - 1; index >= 0; index--) {
    rest.multiply(10);
    rest.number[0] = this.number[index];
    result[index] = 0;
    while (bigNumber.lte(rest)) {
      result[index]++;
      rest.subtract(bigNumber);
    }
  }

  let index = 0;
  const length = result.length - 1;
  while (result[length - index] === 0 && length - index > 0) {
    index++;
  }
  if (index > 0) {
    result.splice(-index);
  }

  this.rest = rest;
  this.number = result;
  return this;
};

BigNumber.prototype.mod = function(number) {
  return this.divide(number).rest;
};

BigNumber.prototype.power = function(number) {
  if (typeof number === "undefined") return;
  if (!isValidType(number)) {
    this.number = errors["invalid"];
    return;
  }

  const bigNumberPower = BigNumber(number);
  if (bigNumberPower.isZero()) return BigNumber(1);
  if (bigNumberPower.val() === "1") return this;

  const bigNumber = BigNumber(this);

  this.number = [1];
  while (bigNumberPower.gt(0)) {
    if (!bigNumberPower.isEven()) {
      this.multiply(bigNumber);
      bigNumberPower.subtract(1);
      continue;
    }
    bigNumber.multiply(bigNumber);
    bigNumberPower.div(2);
  }
  return this;
};

BigNumber.prototype.abs = function() {
  this.sign = 1;
  return this;
};

BigNumber.prototype.isZero = function() {
  var index;
  for (index = 0; index < this.number.length; index++) {
    if (this.number[index] !== 0) {
      return false;
    }
  }
  return true;
};

BigNumber.prototype.toString = function() {
  if (typeof this.number === "string") return this.number;
  let str = "";
  for (let index = this.number.length - 1; index >= 0; index--) {
    str += this.number[index];
  }
  return this.sign > 0 ? str : "-" + str;
};

BigNumber.prototype.plus = BigNumber.prototype.add;
BigNumber.prototype.minus = BigNumber.prototype.subtract;
BigNumber.prototype.div = BigNumber.prototype.divide;
BigNumber.prototype.mult = BigNumber.prototype.multiply;
BigNumber.prototype.pow = BigNumber.prototype.power;
BigNumber.prototype.valueOf = BigNumber.prototype.toString;

export default BigNumber;
