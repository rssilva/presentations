onmessage = function(e) {
  var diff = doDiff(e.data[0], e.data[1]);
  
  postMessage([diff, e.data[1]]);
}

function doDiff (previous, current) {
  var diff = [];
  var len = current.data.length;
  var diffObj = {};
  var i;

  if (previous && previous.data) {

    for (i = 0; i < len; i++) {
      diffObj = {};
      
      if (Math.abs(previous.data[i] - current.data[i]) > 2) {
        diffObj[i] = current.data[i];
        diff.push(diffObj);
      }
    }
  }

  return diff;
}