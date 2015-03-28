var arr = [];

for (var i = 0; i < 20; i++) {
  arr.push(Math.round(1 + Math.random()*Math.sin(i/2)));
}

var compressed = compress(arr);
var decompressed = decompress(compressed);

function compress (arr) {
  var buffer = arr[0];
  var compressed = [];
  var currentRepeated;
  var repeatedIndex;
  var isEqual;
  var isRepeated;

  arr.forEach(function (item, index) {
    isEqual = arr[index - 1] === arr[index];

    if (isEqual) {
      isRepeated = item === currentRepeated;

      repeatedIndex !== undefined ? compressed[repeatedIndex][0] = index : null;

      if (!isRepeated) {
        currentRepeated = item;
        repeatedIndex = index - 1;

        compressed[index - 1] = [index, item];
      }
    } else {
      currentRepeated = undefined;
      repeatedIndex = undefined;
      // compressed.push(item);
      compressed[index] = item;
    }
  });

  return compressed;
}

function decompress (compressed) {
  var value;
  var to;
  var i;
  var endVal;
  var decompressed = [];

  compressed.forEach(function (item, index) {
    if (typeof item === 'object') {
      
      endVal = item[0] ;

      for (i = index; i <= endVal; i++) {
        decompressed[i] = item[1];
      }
    } else {
      decompressed.push(item);
    }
  });

  return decompressed;
}


// var compressed = compressed.filter(function (item) {
//   if (item) {
//     return item
//   }
// });

console.log(JSON.stringify(compressed))
console.log(arr)
console.log(decompressed)

// console.log(JSON.stringify(arr).length, JSON.stringify(compressed).length)
console.log(JSON.stringify(compressed).length/JSON.stringify(arr).length)

arr.forEach(function (item, index) {
  if (item != decompressed[index]) {
    console.error('WARNING', item, index)
  }
})