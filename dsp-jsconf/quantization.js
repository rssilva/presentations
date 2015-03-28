var arr = [];
var cols = [];

for (var i = 0; i < 100; i++) {
  cols.push(i);
  arr.push((5 * Math.random()*Math.sin(i)));
}

// arr = SAMPLE.splice(6000,100);
// console.log(arr)
B = _.countBy(SAMPLE, function(n) {
  return Math.round(n);
});
console.log(B)

var quantized = [];

arr.forEach(function (item, index) {
  if (item > 4) {
    item = 4;
  }
  quantized.push(Math.round(item))
});



var data = {
    labels: cols,
    datasets: [
        {
            label: "Original Data",
            fillColor: "rgba(256,256,256,0)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: arr
        },
        {
            label: "Original Data",
            fillColor: "rgba(100,100,100,0)",
            strokeColor: "rgba(15,15,150,1)",
            pointColor: "rgba(15,15,150,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: quantized
        },
    ]
};
var ctx = document.getElementById("myChart").getContext("2d");
var myLineChart = new Chart(ctx).Line(data, {});