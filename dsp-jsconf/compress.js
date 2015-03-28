var arr = [];
var col = [];

for (var i = 0; i < 50; i++) {
  col.push(i);
  arr.push(Math.round(2 + 3* Math.random()*Math.sin(i/100)));
}

var compressed = compress(arr);
var decompressed = decompress(compressed);

function compress (arr) {
  var buffer = arr[0];
  var compressed = [];
  var currentRepeated;
  var repeatedIndex = null;
  var isEqual;
  var isRepeated;
  var counter = 0;

  arr.forEach(function (item, index) {
    isEqual = arr[index - 1] === arr[index];
    
    if (isEqual) {
      repeatedIndex = repeatedIndex != null ? repeatedIndex : index - 1;
      counter++;

    } else {
      if (repeatedIndex != null) {
        compressed.pop();
        compressed.push(arr[repeatedIndex] + ' ' + counter);
      }

      counter = 1;
      repeatedIndex = null;
      compressed.push(item);
    }
  });

  if (repeatedIndex != null) {
    compressed.pop();
    compressed.push(arr[repeatedIndex] + ' ' + counter);
  }

  return compressed;
}

function decompress (compressed) {
  var value;
  var to;
  var i;
  var endVal;
  var decompressed = [];

  compressed.forEach(function (item, index) {
    if (typeof item === 'string') {
      
      endVal = Number(item.match(/[0-9]{1,}$/g)[0]);

      value = (item.match(/[0-9\.\-]{1,} /)[0].replace(' ', ''));
      
      for (i = 0; i < endVal; i++) {
        decompressed.push(value);
      }
    } else {
      decompressed.push(item);
    }
  });

  return decompressed;
}

// console.log(col)
console.log(arr)
// console.log(JSON.stringify(compressed), JSON.stringify(compressed).length)
// console.log(compressed)
console.log(decompressed)

// console.log(JSON.stringify(arr).length, JSON.stringify(compressed).length)
console.log(JSON.stringify(compressed).length/JSON.stringify(arr).length)

arr.forEach(function (item, index) {
  if (item != decompressed[index]) {
    console.error('WARNING', item, index)
  }
})