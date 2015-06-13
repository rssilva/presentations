function isEmpty (arr) {
  return arr.length == 0;
}

function isEmpty2 () {
  return this.length == 0;
}

Array.prototype.isEmpty = Array.prototype.isEmpty || isEmpty2;

var nums = [1, 2, 3, 4];
var other = [];

if (nums.length > 0) {
  console.log('nao vazio')
}

if (nums.length) {
  console.log('nao vazio, sem o operador ">"')
}

console.log(isEmpty(nums));

console.log(other.isEmpty())

console.log(nums.isEmpty());

console.log(isEmpty2.apply(nums));
