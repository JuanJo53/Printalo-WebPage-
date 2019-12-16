//contarDatos de tipo de pedidos
function contarDatosTipoPedido() {
  var pedNormal;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  var docRef = bd
    .collection("Pedido")
    .where('negocioID','==',userid)
    where('metodoPago', "==", "personal")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
        pedNormal=querySnapshot.size;
        console.log(pedNormal);
      });
    })
    .catch(function(error) {
      console.log("Error al obtener los datos:", error);
    });
}

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
            "#24c4a6",
            "#364c68"
          ],
          borderColor: ["#30e2c2", "#253449"],
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
