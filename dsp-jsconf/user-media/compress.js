

function compress (arr) {
  var buffer = arr[0];
  var compressed = [];
  var currentRepeated;
  var repeatedIndex = null;
  var isEqual;
  var isRepeated;
  var counter = 0;
  var len = arr.length;
  var index;

  for (index = 0; index < len; index++) {
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
      compressed.push(arr[index]);
    }
  }

  // arr.forEach(function (item, index) {
  //   isEqual = arr[index - 1] === arr[index];
    
  //   if (isEqual) {
  //     repeatedIndex = repeatedIndex != null ? repeatedIndex : index - 1;
  //     counter++;

  //   } else {
  //     if (repeatedIndex != null) {
  //       compressed.pop();
  //       compressed.push(arr[repeatedIndex] + ' ' + counter);
  //     }

  //     counter = 1;
  //     repeatedIndex = null;
  //     compressed.push(item);
  //   }
  // });

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
  var endMatch;

  compressed.forEach(function (item, index) {
    if (typeof item === 'string') {
      endMatch = item.match(/ [0-9]{1,}$/g);

      if (endMatch) {
        endVal = Number(endMatch[0]);
        value = (item.match(/[0-9\.\-]{1,} /)[0].replace(' ', ''));

        for (i = 0; i < endVal; i++) {
          decompressed.push(value);
        }

      } else {
        decompressed.push(item);
      }


    } else {
      decompressed.push(item);
    }
  });

  return decompressed;
}

