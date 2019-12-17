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
            nombre: n,
            negocioID: user.uid
          })
          .then(function(){
            firebase
              .firestore()
              .collection("Negocios")
              .doc(user.uid)
              .set({
                dir: d,
                email: e,
                fono: t,
                nombreNeg: nn,
                costoBN: 0,
                costoColor: 0,
                NIT: "",
                costoTamHoja:{
                  A4: 0,
                  Carta: 0,
                  Oficio: 0
                },
                costoTipoHoja:{
                  normal: 0,
                  reutilizable: 0
                },
                horario:{
                  jueves: {
                    horaEntrada: 0,
                    horaSalida: 0
                  },
                  lunes: {
                    horaEntrada: 0,
                    horaSalida: 0
                  },
                  martes: {
                    horaEntrada: 0,
                    horaSalida: 0
                  },
                  miercoles: {
                    horaEntrada: 0,
                    horaSalida: 0
                  },
                  sabado: {
                    horaEntrada: 0,
                    horaSalida: 0
                  },
                  viernes: {
                    horaEntrada: 0,
                    horaSalida: 0
                  }
                }
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
  async IngresarNeg() {    
    var c=0; 
    var negs= [];  
    var nomb=this.nombre;  
    var email=this.email; 
    var password=this.password; 
    var bd=firebase.firestore();
    var conf=false;
    if(nomb!=""){
      await bd.collection("Negocios")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){  
          negs.push(doc.data().nombreNeg);
          c++;          
        });       
      })
      .catch(function(error){
        console.log(`Error al Ingresar: ${error}`);
      })
      for(var i=0;i<c-1;i++){
        if(negs[i]===nomb){            
            var auth = new Auth();  
            auth.LoginEmailPass(email, password);
            conf=true;
            break;
          }else{
            conf=false;
          }
      }
      if(conf===false)
        alert("Nombre de Negocio Incorrecto"); 
    }else{
      alert("Porfavor Ingrese el Nombre de Negocio");
    }   
     
  }  
  // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
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
      contraseniaNegocio,
      nitNegocio;
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
          nitNegocio=doc.data().NIT;
          //console.log("muestra datos negocio");
          //contraseniaNegocio = doc.data().fono;
          document.getElementById("nombreNegocio").value = nombreNegocio;
          document.getElementById("direccionNegocio").value = dirNegocio;
          document.getElementById("telefonoNegocio").value = fonoNegocio;
          document.getElementById("emailNegocio").value = emailNegocio;
          document.getElementById("nitNegocio").value = nitNegocio;
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
      .collection("Administrador")
      .where('negocioID','==',userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
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
  // set datos de horario
  setHorarioNegocio() {
    var lunEnt, lunSal;
    var marEnt, marSal;
    var mieEnt, mieSal;
    var jueEnt, jueSal;
    var vieEnt, vieSal;
    var sabEnt, sabSal;
    var user = firebase.auth().currentUser;
    //console.log(user);
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Negocios").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          lunEnt = doc.data().horario.lunes.horaEntrada;
          lunSal = doc.data().horario.lunes.horaSalida;
          marEnt = doc.data().horario.martes.horaEntrada;
          marSal = doc.data().horario.martes.horaSalida;
          mieEnt = doc.data().horario.miercoles.horaEntrada;
          mieSal = doc.data().horario.lunes.horaSalida;
          jueEnt = doc.data().horario.miercoles.horaEntrada;
          jueSal = doc.data().horario.jueves.horaSalida;
          vieEnt = doc.data().horario.viernes.horaEntrada;
          vieSal = doc.data().horario.viernes.horaSalida;
          sabEnt = doc.data().horario.sabado.horaEntrada;
          sabSal = doc.data().horario.sabado.horaSalida;
          document.getElementById("lunesEntrada").value = lunEnt;
          document.getElementById("lunesSalida").value = lunSal;
          document.getElementById("martesEntrada").value = marEnt;
          document.getElementById("martesSalida").value = marSal;
          document.getElementById("miercolesEntrada").value = mieEnt;
          document.getElementById("miercolesSalida").value = mieSal;
          document.getElementById("juevesEntrada").value = jueEnt;
          document.getElementById("juevesSalida").value = jueSal;
          document.getElementById("viernesEntrada").value = vieEnt;
          document.getElementById("viernesSalida").value = vieSal;
          document.getElementById("sabadoEntrada").value = sabEnt;
          document.getElementById("sabadoSalida").value = sabSal;
        } else {
          console.log("No existe el documento!");
        }
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
  
  //Esta funcion guarda los cambio de los datos generales del objeto
  GuardarCambiosNegocioGenerales() {
    //console.log("click");
    var telNeg, dirNeg, nomNeg, emailNeg,nitNeg;
    telNeg = document.getElementById("telefonoNegocio").value;
    dirNeg = document.getElementById("direccionNegocio").value;
    nomNeg = document.getElementById("nombreNegocio").value;
    emailNeg = document.getElementById("emailNegocio").value;
    nitNeg = document.getElementById("nitNegocio").value;
    var nombreNegocio,
      dirNegocio,
      fonoNegocio,
      emailNegocio,
      contraseniaNegocio,
      nitNegocio;
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
          nitNegocio = doc.data().NIT;
          if (
            telNeg === fonoNegocio &&
            dirNeg === dirNegocio &&
            nomNeg === nombreNegocio &&
            emailNeg === emailNegocio &&
            nitNeg === nitNegocio
          ) {
            console.log("los datos son los mismos en datos generales");
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
      .collection("Administrador")
      .where('negocioID','==',userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
          nombreAdm = doc.data().nombre;
          apellidoAdm = doc.data().apellido;
          if (nombreAdm === nomAdm && apellidoAdm === apelAdm) {
            console.log("los datos son lso mismos en admin");
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

  //guarda datos horarios
  GuardarCambiosHorario() {
    //console.log("click");
    var lunEntNew,
      lunSalNew,
      marEntNew,
      marSalNew,
      mieEntNew,
      mieSalNew,
      jueEntNew,
      jueSalNew,
      vieEntNew,
      vieSalNew,
      sabEntNew,
      sabSalNew;
    var lunEntDb,
      lunSalDb,
      marEntDb,
      marSalDb,
      mieEntDb,
      mieSalDb,
      jueEntDb,
      jueSalDb,
      vieEntDb,
      vieSalDb,
      sabEntDb,
      sabSalDb;
    lunEntNew = document.getElementById("lunesEntrada").value;
    lunSalNew = document.getElementById("lunesSalida").value;
    marEntNew = document.getElementById("martesEntrada").value;
    marSalNew = document.getElementById("martesSalida").value;
    mieEntNew = document.getElementById("miercolesEntrada").value;
    mieSalNew = document.getElementById("miercolesSalida").value;
    jueEntNew = document.getElementById("juevesEntrada").value;
    jueSalNew = document.getElementById("juevesSalida").value;
    vieEntNew = document.getElementById("viernesEntrada").value;
    vieSalNew = document.getElementById("viernesSalida").value;
    sabEntNew = document.getElementById("sabadoEntrada").value;
    sabSalNew = document.getElementById("sabadoSalida").value;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Negocios").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          lunEntDb = doc.data().horario.lunes.horaEntrada;
          lunSalDb = doc.data().horario.lunes.horaSalida;
          marEntDb = doc.data().horario.martes.horaEntrada;
          marSalDb = doc.data().horario.martes.horaSalida;
          mieEntDb = doc.data().horario.miercoles.horaEntrada;
          mieSalDb = doc.data().horario.miercoles.horaSalida;
          jueEntDb = doc.data().horario.jueves.horaEntrada;
          jueSalDb = doc.data().horario.jueves.horaSalida;
          vieEntDb = doc.data().horario.viernes.horaEntrada;
          vieSalDb = doc.data().horario.viernes.horaSalida;
          sabEntDb = doc.data().horario.sabado.horaEntrada;
          sabSalDb = doc.data().horario.sabado.horaSalida;
         
          //console.log(lunEntNew);
          //console.log(lunEntDb);
          if (lunEntDb === lunEntNew && lunSalDb === lunSalNew && marEntDb === marEntNew && marSalDb === marSalNew && mieEntDb === mieEntNew && mieSalDb === mieSalNew && jueEntDb === jueEntNew && jueSalDb === jueSalNew && vieEntDb === vieEntNew && vieSalDb === vieSalNew && sabEntDb === sabEntNew && sabSalDb === sabSalNew ) {
            console.log("los datos son los mismos en horarios");
          } else {
            //console.log("son distintos");
            actualizarDatosHorario();
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
}
//esta funcion actualiza los datos de datos generales
function actualizarDatosGeneralesNegocio() {
  //console.log("entro a cambiar datos de negocio");
  var nombreNegocio, dirNegocio, fonoNegocio, emailNegocio, contraseniaNegocio,nitNegocio;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  fonoNegocio = document.getElementById("telefonoNegocio").value;
  nomNegocio = document.getElementById("nombreNegocio").value;
  dirNegocio = document.getElementById("direccionNegocio").value;
  emailNegocio = document.getElementById("emailNegocio").value;
  nitNegocio = document.getElementById("nitNegocio").value;
  if (
    //verifica que no esten vacios los campos
    fonoNegocio !== "" &&
    nomNegocio !== "" &&
    dirNegocio !== "" &&
    emailNegocio !== "" &&
    nitNegocio!==""
  ) {
    //console.log("no estan vacios");
    bd.collection("Negocios")
      .doc(user.uid)
      .update({
        fono: fonoNegocio,
        dir: dirNegocio,
        nombreNeg: nomNegocio,
        email: emailNegocio,
        NIT:nitNegocio
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
      .collection("Administrador")
      .where('negocioID','==', userid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var administradorId = doc.id;
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
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  } else {
    console.log("los campos estan vacios");
  }
}
//esta funcion actualiza los datos del horario
function actualizarDatosHorario() {
  //console.log("entro a cambiar datos de negocio");
  var lunEnt, lunSal;
  var marEnt, marSal;
  var mieEnt, mieSal;
  var jueEnt, jueSal;
  var vieEnt, vieSal;
  var sabEnt, sabSal;
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var userid = user.uid;
  lunEnt = document.getElementById("lunesEntrada").value;
  lunSal = document.getElementById("lunesSalida").value;
  marEnt = document.getElementById("martesEntrada").value;
  marSal = document.getElementById("martesSalida").value;
  mieEnt = document.getElementById("miercolesEntrada").value;
  mieSal = document.getElementById("miercolesSalida").value;
  jueEnt = document.getElementById("juevesEntrada").value;
  jueSal = document.getElementById("juevesSalida").value;
  vieEnt = document.getElementById("viernesEntrada").value;
  vieSal = document.getElementById("viernesSalida").value;
  sabEnt = document.getElementById("sabadoEntrada").value;
  sabSal = document.getElementById("sabadoSalida").value;
  //verifica que no esten vacios
  if (
    lunEnt !== "" &&
    lunSal !== "" &&
    marEnt !== "" &&
    marSal !== "" &&
    mieEnt !== "" &&
    mieSal !== "" &&
    jueEnt !== "" &&
    jueSal !== "" &&
    vieEnt !== "" &&
    vieSal !== "" &&
    sabEnt !== "" &&
    sabSal !== ""
  ) {
    //console.log("no estan vacios");
    var docRef = bd
      .collection("Negocios")
      .doc(user.uid)
      .update({
        horario:{
          lunes: {
            horaEntrada: lunEnt,
            horaSalida: lunSal
          },
          martes: {
            horaEntrada: marEnt,
            horaSalida: marSal
          },
          miercoles: {
            horaEntrada: mieEnt,
            horaSalida: mieSal
          },
          jueves: {
            horaEntrada: jueEnt,
            horaSalida: jueSal
          },
          viernes: {
            horaEntrada: vieEnt,
            horaSalida: vieSal
          },
          sabado: {
            horaEntrada: sabEnt,
            horaSalida: sabSal
          }
        }
        
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
