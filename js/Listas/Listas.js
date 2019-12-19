class Lista {
  constructor(
    dueño,
    timestamp,
    materia,
    titulo,
    nroHojas,
    precio,
    acabado,
    tipoHoja,
    impresion,
    tamaño,
    color
  ) {
    this.dueño = dueño;
    this.timestamp = timestamp;
    this.materia = materia;
    this.titulo = titulo;
    this.nroHojas = nroHojas;
    this.precio = precio;
    this.acabado = acabado;
    this.tipoHoja = tipoHoja;
    this.impresion = impresion;
    this.tamaño = tamaño;
    this.color = color;
  }
  nuevoDoc() {
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    bd.collection("Listas")
      .add({
        dueño: this.dueño,
        estado: "disponible",
        fecha: this.timestamp,
        materia: this.materia,
        precio: this.precio,
        negocioID: userid,
        color: this.color,
        impresion: this.impresion,
        acabado: this.acabado,
        numHojas: this.nroHojas,
        tamañoHoja: this.tamaño,
        tipoHoja: this.tipoHoja,
        nombreDoc: this.titulo
      })
      .then(function() {
        alert("Añadido a Lista!");
        location.href = "/html/negocioUI/publicacionesNeg/pubLista.html";
      })
      .catch(function(error) {
        console.error("Error creando venta: ", error);
      });
  }
  eliminarDoc(dueño, titulo) {
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    bd.collection("Listas")
      .where("negocioID", "==", userid)
      .where("dueño", "==", dueño)
      .where("nombreDoc", "==", titulo)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            bd.collection("Listas")
              .doc(doc.id)
              .delete()
              .then(function() {
                alert("Documento se borro correctamente");
                location.reload();
              });
          } else {
            alert("Documento no encontrado!");
          }
        });
      })
      .catch(function(error) {
        alert("Documento no se borro correctamente!\n" + error);
      });
  }
  async getDocData(dueño, titulo) {
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var nroHojas = 0,
      precio = 0.0,
      fecha,
      hora,
      timestamp,
      color,
      tamaño,
      impresion,
      acabado,
      tipoHoja,
      materia;
    await bd
      .collection("Listas")
      .where("negocioID", "==", userid)
      .where("dueño", "==", dueño)
      .where("nombreDoc", "==", titulo)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            nroHojas = doc.data().numHojas;
            precio = doc.data().precio;
            dueño = doc.data().dueño;
            materia = doc.data().materia;
            titulo = doc.data().nombreDoc;
            timestamp = new Date(doc.data().fecha.toDate());
            fecha =
              timestamp.getDate() +
              "/" +
              (timestamp.getMonth() + 1) +
              "/" +
              timestamp.getFullYear();
            hora = timestamp.getHours() + ":" + timestamp.getMinutes();
            color = doc.data().color;
            tamaño = doc.data().tamañoHoja;
            impresion = doc.data().impresion;
            acabado = doc.data().acabado;
            tipoHoja = doc.data().tipoHoja;
          } else {
            alert("Documento no encontrado!");
          }
        });
      })
      .catch(function(error) {
        alert("Documento no se obtuvo correctamente!\n" + error);
      });
    document.getElementById("numHojas").value = nroHojas;
    document.getElementById("precio").value = precio;
    document.getElementById("dueño").value = dueño;
    document.getElementById("fecha").value = fecha;
    document.getElementById("hora").value = hora;
    document.getElementById("materia").value = materia;
    document.getElementById("tituloDoc").value = titulo;
    if (color === "color") {
      document.getElementById("color").checked = true;
    } else {
      document.getElementById("BN").checked = true;
    }
    if (tamaño === "carta") {
      document.getElementById("carta").checked = true;
    } else if (tamaño === "oficio") {
      document.getElementById("oficio").checked = true;
    } else {
      document.getElementById("a4").checked = true;
    }
    if (impresion === "intercalado") {
      document.getElementById("intercalado").checked = true;
    } else {
      document.getElementById("anv/rev").checked = true;
    }
    if (acabado === "engrampado") {
      document.getElementById("intercalado").checked = true;
    } else {
      document.getElementById("normal").checked = true;
    }
    if (tipoHoja === "normal") {
      document.getElementById("hojaNormal").checked = true;
    } else {
      document.getElementById("hojaReutilizada").checked = true;
    }
  }
  editarDoc(dueño, titulo) {
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    bd.collection("Listas")
      .where("negocioID", "==", userid)
      .where("dueño", "==", dueño)
      .where("nombreDoc", "==", titulo)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            document.getElementById("numHojas").value = nroHojas;
            document.getElementById("precio").value = precio;
            document.getElementById("dueño").value = dueño;
            document.getElementById("fecha").value = fecha;
            document.getElementById("materia").value = materia;
            document.getElementById("tituloDoc").value = titulo;
          } else {
            alert("Documento no encontrado!");
          }
        });
      })
      .catch(function(error) {
        alert("Documento no se borro correctamente!\n" + error);
      });
  }
  setDetDoc(dueño, titulo, materia) {
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var timestamp;
    bd.collection("Listas")
      .where("dueño", "==", dueño)
      .where("nombreDoc", "==", titulo)
      .where("materia", "==", materia)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            if (doc.data().color === "color") {
              document.getElementById("color").checked = true;
            } else {
              document.getElementById("bn").checked = true;
            }
            if (doc.data().tamañoHoja === "carta") {
              document.getElementById("carta").checked = true;
            } else if (doc.data().tamañoHoja === "oficio") {
              document.getElementById("oficio").checked = true;
            } else {
              document.getElementById("a4").checked = true;
            }
            if (doc.data().impresion === "intercalado") {
              document.getElementById("intercalado").checked = true;
            } else {
              document.getElementById("anv/rev").checked = true;
            }
            if (doc.data().acabado === "normal") {
              document.getElementById("normal").checked = true;
            } else {
              document.getElementById("engrampado").checked = true;
            }
            if (doc.data().tipoHoja === "normal") {
              document.getElementById("hojaNormal").checked = true;
            } else {
              document.getElementById("hojaReutilizada").checked = true;
            }
            document.getElementById("paginas").value = doc.data().numHojas;
            document.getElementById("dueño").innerHTML =
              `<span class="font-weight-bold">Nombre:  </span>` +
              doc.data().dueño;
            timestamp = new Date(doc.data().fecha.toDate());
            var fecha =
              timestamp.getDate() +
              "/" +
              (timestamp.getMonth() + 1) +
              "/" +
              timestamp.getFullYear();
            var hora = timestamp.getHours() + ":" + timestamp.getMinutes();
            document.getElementById("fecha").innerHTML =
              `<span class="font-weight-bold">Fecha de Recepcion:  </span>` +
              fecha;
            document.getElementById("hora").innerHTML =
              `<span class="font-weight-bold">Hora de Recepcion:  </span>` +
              hora;
          } else {
            alert("Documento no encontrado!");
          }
        });
      })
      .catch(function(error) {
        alert("Documento no se borro correctamente!\n" + error);
      });
  }
  GuardarCambiosArchivo() {
    //console.log("click");
    var nhojas, prec;
    nhojas = document.getElementById("numHojas").value;
    prec = document.getElementById("precio").value;
    var auxNumHojas, auxPrecio;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    console.log("userid : " + userid);
    var docRef = bd
      .collection("Listas")
      .where("negocioID", "==", userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          auxNumHojas = doc.data().numHojas;
          auxPrecio = doc.data().precio;
          if (auxNumHojas === nhojas && auxPrecio === prec) {
            console.log("los datos son lso mismos en admin");
          } else {
            //console.log("son distintos");
            actualizarDatosArchivo();
            console.log("Se guardo cambios");
          }
        });
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }

  GuardarCambiosFormulario() {
    //console.log("click");
    var duenio, materia, titulo;
    duenio = document.getElementById("dueño").value;
    materia = document.getElementById("materia").value;
    titulo = document.getElementById("tituloDoc").value;
    var auxDuenio, auxMateria, auxTitulo;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    console.log("userid : " + userid);
    var docRef = bd
      .collection("Listas")
      .where("negocioID", "==", userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          auxDuenio = doc.data().dueño;
          auxMateria = doc.data().materia;
          auxTitulo = doc.data().nombreDoc;
          if (
            auxDuenio === duenio &&
            auxMateria === materia &&
            auxTitulo === titulo
          ) {
            console.log("los datos son lso mismos en admin");
          } else {
            //console.log("son distintos");
            actualizarDatosFormulario();
            console.log("Se guardo cambios");
          }
        });
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
}
function actualizarDatosArchivo() {
  //console.log("entro a cambiar datos de negocio");
  var nroHojas, precio, duenio, titulo,materia;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  nroHojas = document.getElementById("numHojas").value;
  precio = document.getElementById("precio").value;
  duenio = document.getElementById("dueño").value;
  titulo = document.getElementById("tituloDoc").value;
  materia = document.getElementById("materia").value;
  if (
    //verifica que no esten vacios los campos
    nroHojas !== "" &&
    precio !== ""
  ) {
    //console.log("no estan vacios");
    bd.collection("Listas")
      .where("negocioID", "==", userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var listaId = doc.id;
		  var auxDuenio = doc.data().dueño;
		  var auxTitulo = doc.data().nombreDoc;
		  var auxMateria = doc.data().materia;
          if (duenio === auxDuenio && titulo===auxTitulo && materia==auxMateria) {
            console.log("duenio : " + duenio);
            var docref2 = bd
              .collection("Listas")
              .doc(listaId)
              .update({
                precio: precio,
                numHojas: nroHojas
              })
              .then(e => {
                console.log("Datos Guardados Exitosamente de administrador");
              })
              .catch(e => {
                alert(`Error Guardando Datos: ${error}`);
              });
          }
        });
      });
  }
}

function actualizarDatosFormulario() {
  //console.log("entro a cambiar datos de negocio");
  var duenio, materia, titulo;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  duenio = document.getElementById("dueño").value;
  materia = document.getElementById("materia").value;
  titulo = document.getElementById("tituloDoc").value;
  if (
    //verifica que no esten vacios los campos
    duenio !== "" &&
    materia !== "" &&
    titulo !== ""
  ) {
    //console.log("no estan vacios");
    bd.collection("Listas")
      .where("negocioID", "==", userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var listaId = doc.id;
          var docref2 = bd
            .collection("Listas")
            .doc(listaId)
            .update({
              dueño: duenio,
              materia: materia,
              tituloDoc: titulo
            })
            .then(e => {
              console.log("Datos Guardados Exitosamente de administrador");
            })
            .catch(e => {
              alert(`Error Guardando Datos: ${error}`);
            });
        });
      });
  }
}
