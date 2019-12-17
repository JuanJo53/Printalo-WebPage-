//validar status de sesion
window.onload = ValidarNeg();
//para que se vea la grafica
//window.onload = read();
var x1;
var x2;
function read() {
  var pedNormal;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  var docRef = bd
    .collection("Venta")
    .where("negocioID", "==", userid)
    .where("metodoPago", "==", "personal")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        //tamanio de query
        pedNormal = querySnapshot.size;
      });
      x1 = pedNormal;
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
              data: [x1, x2],
              backgroundColor: ["#24c4a6", "#364c68"],
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
    })
    .catch(function(error) {
      console.log("Error al obtener los datos:", error);
    });



    var docRef2 = bd
    .collection("Venta")
    .where("negocioID", "==", userid)
    .where("metodoPago", "==", "personal")//aqui cambiar
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        //tamanio de query
        pedNormal = querySnapshot.size;
      });
      x2 = pedNormal;
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
              data: [x1, x2],
              backgroundColor: ["#24c4a6", "#364c68"],
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
    })
    .catch(function(error) {
      console.log("Error al obtener los datos:", error);
    });
}
//end read
//mostrar graficas
function mostrarGraficas() {
  read();
  console.log("x1 : " + x1);
  //new Negocio().contarDatosTipoNormal();
}
