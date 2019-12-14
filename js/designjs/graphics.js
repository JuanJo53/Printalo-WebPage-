function read() {
    var x1=12;
    var x2=25;
  document.getElementById(
    "chart"
  ).innerHTML = `<canvas id="myChart"></canvas>`;
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Transacciones Normales", "Transacciones Online"],
      datasets: [
        {
          label: "Normales vs Online",
          data: [x1,x2],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)"
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}
//end read
