onmessage = function(e) {
  var dataArr = buildImgDiff(e.data[0], e.data[1]);
  
  postMessage([e.data[0], dataArr]);
}

function buildImgDiff (current, diff) {
  var dataArr = new Uint8ClampedArray(current.data.length);
  var counter = 0;
  var counter2 = 0;                                                                                                                                                                                         

  var key;
  
  for (var i = 0, len = current.data.length; i < len; i++) {
    key = null;

    if (diff[0]) {
      key = Object.keys(diff[0])[0]
    }

    if (i == key) {
      dataArr[i] = [diff[0][key]];
      diff.splice(0, 1);
    } else {
      dataArr[i] = 250;
    }
  }

  return dataArr;
}