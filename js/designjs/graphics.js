//validar status de sesion
window.onload = ValidarNeg();
//para que se vea la grafica
//window.onload = read();
var x1;
var x2;
function read() {
  var cont1=0;
  var cont2=0;
  var fechaActual = new Date();
  var dd = fechaActual.getDate(); 
  var mm = fechaActual.getMonth()+1;
  var yyyy = fechaActual.getFullYear();
  var timestampSistema=dd+"/"+mm+"/"+yyyy;
  var timestampPedido;
  var pedNormal;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  var docRef = bd
  .collection("Venta")
    .where("negocioID", "==", userid)
    .where("metodoPago", "==", "personal")//aqui cambiar
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          timestamp = new Date(doc.data().fecha.toDate());
          
          timestampPedido =
            timestamp.getDate() +
            "/" +
            (timestamp.getMonth() + 1) +
            "/" +
            timestamp.getFullYear();
            console.log(timestampPedido+"-"+timestampSistema);
            if(timestampPedido===timestampSistema){
              //tamanio de query
              console.log("entro al contador");
              cont1++;
              //pedNormal = querySnapshot.size;
            }
        } else {
          console.log("No such document!");
        }
      });
      x1 = cont1;
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
        if (doc.exists) {
          timestamp = new Date(doc.data().fecha.toDate());
          
          timestampPedido =
            timestamp.getDate() +
            "/" +
            (timestamp.getMonth() + 1) +
            "/" +
            timestamp.getFullYear();
            console.log(timestampPedido+"-"+timestampSistema);
            if(timestampPedido===timestampSistema){
              //tamanio de query
              console.log("entro al contador");
              cont2++;
              //pedNormal = querySnapshot.size;
            }
        } else {
          console.log("No such document!");
        }
      });
      x2 = cont2;
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
function ultimos7dias() {
  var fechaActual = new Date();
  var dd = fechaActual.getDate(); 
  var mm = fechaActual.getMonth()+1;
  var yyyy = fechaActual.getFullYear();
  var diaBusq=dd-7;
  console.log(mm+"/"+diaBusq+"/"+yyyy);

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
    /*var docRef2 = bd
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
    });*/
}
//end read
