class Negocio {
  constructor(
    email,
    password,
    nombre,
    apellido,
    telef,
    nombreNeg,
    direccion,
    precioBN,
    precioColor,
    precioOficio,
    precioA4,
    precioCarta,
    precioNorm,
    precioReu
  ) {
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telef = telef;
    this.nombreNeg = nombreNeg;
    this.direccion = direccion;
    this._precioBN = precioBN;
  }
  get precioBN() {
    return this._precioBN;
  }
  set precioBN(newPrecio) {
    this._precioBN = newPrecio;
  }
  // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
  RegistrarNeg(d, e, t, nn, a, n) {
    var auth = new Auth();
    auth.crearCuentaEmailPass(this.email, this.password);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;
        console.log(user);
        firebase
          .firestore()
          .collection("Administrador")
          .add({
            apellido: a,
            nombre: n
          })
          .then(refDoc => {
            var adminID = refDoc.id;
            firebase
              .firestore()
              .collection("Negocios")
              .doc(user.uid)
              .set({
                adminID: adminID,
                costoUni: 0,
                dir: d,
                email: e,
                fono: t,
                nombreNeg: nn
              })
              .then(e => {
                alert("Logeado");
                location.href = "/html/negocioUI/pedidosNeg/pedPendientes.html";
              })
              .catch(e => {
                console.log(`Error creando negocio: ${error}`);
              });
          })
          .catch(e => {
            console.log(`Error creando cliente: ${error}`);
          });
      } else {
        // User is not signed in.
        alert("No Logeado");
      }
    });
    //TODO: Guardar los datos de registro extra en firebase
  }
  // Esta funcion pasa el email y su password a la clase Auth para login con firebase
  IngresarNeg() {
    var auth = new Auth();
    auth.LoginEmailPass(this.email, this.password);
  }

  CerrarSecion() {
    var auth = new Auth();
    auth.Logout();
  }
  //Setea los precios actuales de la base de datos
  setPreciosAct() {
    var precioBN,
      precioColor,
      precioOficio,
      precioA4,
      precioCarta,
      precioNorm,
      precioReu;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Negocios").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          precioBN = doc.data().costoBN;
          precioColor = doc.data().costoColor;
          precioOficio = doc.data().costoTamHoja.Oficio;
          precioCarta = doc.data().costoTamHoja.Carta;
          precioA4 = doc.data().costoTamHoja.A4;
          precioNorm = doc.data().costoTipoHoja.normal;
          precioReu = doc.data().costoTipoHoja.reutilizable;
          document.getElementById("txtPrecioBN").value = precioBN;
          document.getElementById("txtPrecioColor").value = precioColor;
          document.getElementById("txtPrecioOficio").value = precioOficio;
          document.getElementById("txtPrecioCarta").value = precioCarta;
          document.getElementById("txtPrecioA4").value = precioA4;
          document.getElementById("txtHojaNorm").value = precioNorm;
          document.getElementById("txtHojaReu").value = precioReu;
        } else {
          console.log("No existe el documento!");
        }
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }

  //Esta funcion verifica si existen cambios en los campos, para luego almacenarlos
  GuardarCambPrecios() {
    var precioBN,
      precioColor,
      precioOficio,
      precioA4,
      precioCarta,
      precioNorm,
      precioReu;
    //Verifica si estan habilitados los cambpos de impresion Blanco y Negro
    if (document.getElementById("txtPrecioBN").disabled === false) {
      if (precioBN != document.getElementById("txtPrecioBN").value) {
        this.cambiarBN();
      } else {
        alert("El campo de impresiones a blanco y nego no sufrio cambios");
      }
    }
    if (document.getElementById("txtPrecioColor").disabled === false) {
      if (precioColor != document.getElementById("txtPrecioColor").value) {
        this.cambiarColor();
      } else {
        alert("El campo de impresiones a color no sufrio cambios");
      }
    }
    if (document.getElementById("txtPrecioA4").disabled === false) {
      var A4 = false;
      var Oficio = false;
      var Carta = false;
      if (precioOficio != document.getElementById("txtPrecioOficio").value) {
        Oficio = true;
      }
      if (precioA4 != document.getElementById("txtPrecioA4").value) {
        A4 = true;
      }
      if (precioCarta != document.getElementById("txtPrecioCarta").value) {
        Carta = true;
      }
      this.cambiarTamHoja(A4, Oficio, Carta);
    }
    if (document.getElementById("txtHojaNorm").disabled === false) {
      var norm = false;
      var reu = false;
      if (precioNorm != document.getElementById("txtHojaNorm").value) {
        norm = true;
      }
      if (precioReu != document.getElementById("txtHojaReu").value) {
        reu = true;
      }
      this.cambiarTipoHoja(norm, reu);
    }
  }
  //Esta funcion verifica la validez de los cambios en el precio Blanco y Negro y los guarda luego de validarlos.
  cambiarBN() {
    var bd = firebase.firestore();
    var user = firebase.auth().currentUser;
    const precio = parseFloat(document.getElementById("txtPrecioBN").value);
    if (precio > 0) {
      bd.collection("Negocios")
        .doc(user.uid)
        .update({
          costoBN: precio
        })
        .then(e => {
          alert("Datos Guardados Exitosamente");
        })
        .catch(e => {
          alert(`Error Guardando Datos: ${error}`);
        });
    } else {
      alert("Valor invalido");
    }
  }
  //Esta funcion verifica la validez de los cambios en el precio a Color y los guarda luego de validarlos.
  cambiarColor() {
    var bd = firebase.firestore();
    var user = firebase.auth().currentUser;
    const precio = parseFloat(document.getElementById("txtPrecioColor").value);
    if (precio > 0) {
      bd.collection("Negocios")
        .doc(user.uid)
        .update({
          costoColor: precio
        })
        .then(e => {
          alert("Datos Guardados Exitosamente");
        })
        .catch(e => {
          alert(`Error Guardando Datos: ${error}`);
        });
    } else {
      alert("Valor invalido");
    }
  }
  //Esta funcion verifica la validez de los cambios en el precio por tamaño de hoja y los guarda luego de validarlos.
  cambiarTamHoja(cambA4, cambOf, cambCart) {
    if (cambA4 === true && cambOf === true && cambCart === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pA4 = parseFloat(document.getElementById("txtPrecioA4").value);
      const pCarta = parseFloat(
        document.getElementById("txtPrecioCarta").value
      );
      const pOficio = parseFloat(
        document.getElementById("txtPrecioOficio").value
      );
      if (pA4 > 0 && pCarta > 0 && pOficio > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            costoTamHoja: {
              A4: pA4,
              Carta: pCarta,
              Oficio: pOficio
            }
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos");
      }
    } else if (cambA4 === true && cambOf === true && cambCart === false) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pA4 = parseFloat(document.getElementById("txtPrecioA4").value);
      const pOficio = parseFloat(
        document.getElementById("txtPrecioOficio").value
      );
      if (pA4 > 0 && pOficio > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.A4": pA4,
            "costoTamHoja.Oficio": pOficio
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos2");
      }
    } else if (cambA4 === true && cambOf === false && cambCart === false) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pA4 = parseFloat(document.getElementById("txtPrecioA4").value);
      if (pA4 > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.A4": pA4
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos3");
      }
    } else if (cambA4 === false && cambOf === true && cambCart === false) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pOficio = parseFloat(
        document.getElementById("txtPrecioOficio").value
      );
      if (pOficio > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.Oficio": pOficio
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos3");
      }
    } else if (cambA4 === false && cambOf === false && cambCart === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pCarta = parseFloat(
        document.getElementById("txtPrecioCarta").value
      );
      if (pCarta > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.Carta": pCarta
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos3");
      }
    } else if (cambA4 === true && cambOf === false && cambCart === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pA4 = parseFloat(document.getElementById("txtPrecioA4").value);
      const pCarta = parseFloat(
        document.getElementById("txtPrecioCarta").value
      );
      if (pA4 > 0 && pCarta > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.A4": pA4,
            "costoTamHoja.Carta": pCarta
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos3");
      }
    } else if (cambA4 === false && cambOf === true && cambCart === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pOfi = parseFloat(document.getElementById("txtPrecioOficio").value);
      const pCarta = parseFloat(
        document.getElementById("txtPrecioCarta").value
      );
      if (pOfi > 0 && pCarta > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTamHoja.Carta": pCarta,
            "costoTamHoja.Oficio": pOfi
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert("Valores invalidos3");
      }
    } else if (cambA4 === false && cambOf === false && cambCart === false) {
      alert("No existen cambios por tamaño de hoja");
    }
  }
  //Esta funcion verifica la validez de los cambios en el preciopor tipo de hoja y los guarda luego de validarlos.
  cambiarTipoHoja(normal, reuti) {
    if (normal === true && reuti === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pNorm = parseFloat(document.getElementById("txtHojaNorm").value);
      const pReu = parseFloat(document.getElementById("txtHojaReu").value);
      if (pNorm > 0 && pReu > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            costoTipoHoja: {
              normal: pNorm,
              reutilizable: pReu
            }
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert(
          "Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0"
        );
      }
    } else if (normal === true && reuti === false) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pNorm = parseFloat(document.getElementById("txtHojaNorm").value);
      if (pNorm > 0) {
        console.log("normal");
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTipoHoja.normal": pNorm
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert(
          "Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0"
        );
      }
    } else if (normal === false && reuti === true) {
      var bd = firebase.firestore();
      var user = firebase.auth().currentUser;
      const pReu = parseFloat(document.getElementById("txtHojaReu").value);
      if (pReu > 0) {
        bd.collection("Negocios")
          .doc(user.uid)
          .update({
            "costoTipoHoja.reutilizable": pReu
          })
          .then(e => {
            alert("Datos Guardados Exitosamente");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      } else {
        alert(
          "Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0"
        );
      }
    } else if (normal === false && reuti === false) {
      alert("No hay cambios en los precios por tipo de hoja");
    }
  }
  /*------------------------CONFIGURACIONES GENERALES---------------------------- */
  //Setea los precios actuales de la base de datos
  setDatosGeneralesAct() {
    var nombreNegocio,
      dirNegocio,
      fonoNegocio,
      emailNegocio,
      contraseniaNegocio;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Negocios").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          nombreNegocio = doc.data().nombreNeg;
          dirNegocio = doc.data().dir;
          fonoNegocio = doc.data().fono;
          emailNegocio = doc.data().email;
          //console.log("muestra datos negocio");
          //contraseniaNegocio = doc.data().fono;
          document.getElementById("nombreNegocio").value = nombreNegocio;
          document.getElementById("direccionNegocio").value = dirNegocio;
          document.getElementById("telefonoNegocio").value = fonoNegocio;
          document.getElementById("emailNegocio").value = emailNegocio;
        } else {
          console.log("No existe el documento!");
        }
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
  //configuracion de datos del administrador
  setDatosGeneralesAdministradorAct() {
    var nombreAdm, apellidoAdm;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd
      .collection("Negocios")
      .doc(userid)
      .get()
      .then(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var administradorId = doc.data().adminID;
        var docref2 = bd
          .collection("Administrador")
          .doc(administradorId)
          .get()
          .then(function(doc) {
            nombreAdm = doc.data().nombre;
            apellidoAdm = doc.data().apellido;
            document.getElementById("nombreAdm").value = nombreAdm;
            document.getElementById("apellidoAdm").value = apellidoAdm;
          });
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
  //Esta funcion guarda los cambio de los datos generales del objeto
  GuardarCambiosNegocioGenerales() {
    //console.log("click");
    var telNeg, dirNeg, nomNeg, emailNeg;
    telNeg = document.getElementById("telefonoNegocio").value;
    dirNeg = document.getElementById("direccionNegocio").value;
    nomNeg = document.getElementById("nombreNegocio").value;
    emailNeg = document.getElementById("emailNegocio").value;
    var nombreNegocio,
      dirNegocio,
      fonoNegocio,
      emailNegocio,
      contraseniaNegocio;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Negocios").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          nombreNegocio = doc.data().nombreNeg;
          dirNegocio = doc.data().dir;
          fonoNegocio = doc.data().fono;
          emailNegocio = doc.data().email;
          if (
            telNeg === fonoNegocio &&
            dirNeg === dirNegocio &&
            nomNeg === nombreNegocio &&
            emailNeg === emailNegocio
          ) {
            console.log("los datos son lso mismos");
          } else {
            //console.log("son distintos");
            actualizarDatosGeneralesNegocio();
            console.log("Se guardo cambios");
          }
        } else {
          console.log("No existe el documento!");
        }
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }

  //guarda datos generales de admnistrador
  GuardarCambiosAdministrador() {
    //console.log("click");
    var apelAdm, nomAdm;
    var nombreAdm, apellidoAdm;
    apelAdm = document.getElementById("apellidoAdm").value;
    nomAdm = document.getElementById("nombreAdm").value;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd
      .collection("Negocios")
      .doc(userid)
      .get()
      .then(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var administradorId = doc.data().adminID;
        var docref2 = bd
          .collection("Administrador")
          .doc(administradorId)
          .get()
          .then(function(doc) {
            nombreAdm = doc.data().nombre;
            apellidoAdm = doc.data().apellido;
            
            if (nombreAdm === nomAdm && apellidoAdm === apelAdm) {
              console.log("los datos son lso mismos");
            } else {
              //console.log("son distintos");
              actualizarDatosAdministrador();
              console.log("Se guardo cambios");
            }
          });
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
}
//esta funcion actualiza los datos de datos generales
function actualizarDatosGeneralesNegocio() {
  //console.log("entro a cambiar datos de negocio");
  var nombreNegocio, dirNegocio, fonoNegocio, emailNegocio, contraseniaNegocio;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  fonoNegocio = document.getElementById("telefonoNegocio").value;
  nomNegocio = document.getElementById("nombreNegocio").value;
  dirNegocio = document.getElementById("direccionNegocio").value;
  emailNegocio = document.getElementById("emailNegocio").value;
  if (
    fonoNegocio !== "" &&
    nomNegocio !== "" &&
    dirNegocio !== "" &&
    emailNegocio !== ""
  ) {
    //console.log("no estan vacios");
    bd.collection("Negocios")
      .doc(user.uid)
      .update({
        fono: fonoNegocio,
        dir: dirNegocio,
        nombreNeg: nomNegocio,
        email: emailNegocio
      })
      .then(e => {
        console.log("Datos Guardados Exitosamente datos generales");
      })
      .catch(e => {
        alert(`Error Guardando Datos: ${error}`);
      });
  } else {
    console.log("los campos estan vacios");
  }
}

//esta funcion actualiza los datos de administrador
function actualizarDatosAdministrador() {
  //console.log("entro a cambiar datos de negocio");
  var nomAdm, apelAdm;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  nomAdm = document.getElementById("nombreAdm").value;
  apelAdm = document.getElementById("apellidoAdm").value;
  if (nomAdm !== "" && apelAdm !== "") {
    //console.log("no estan vacios");
    var docRef = bd
      .collection("Negocios")
      .doc(userid)
      .get()
      .then(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var administradorId = doc.data().adminID;
        var docref2 = bd
          .collection("Administrador")
          .doc(administradorId)
          .update({
            nombre: nomAdm,
            apellido: apelAdm
          })
          .then(e => {
            console.log("Datos Guardados Exitosamente de administrador");
          })
          .catch(e => {
            alert(`Error Guardando Datos: ${error}`);
          });
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  } else {
    console.log("los campos estan vacios");
  }
}
