class Cliente {
  constructor(email, password, nombre, apellido, telefono) {
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;

    //Instancia para valores de firestore
    this.bd = firebase.firestore();
  }
  // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
  RegistrarCli(a, e, n, t) {
    var auth = new Auth();
    auth.crearCuentaEmailPass(this.email, this.password);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;
        console.log(user);
        firebase
          .firestore()
          .collection("Clientes")
          .doc(user.uid)
          .set({
            Apellido: a,
            email: e,
            Nombre: n,
            telefono: t
          })
          .then(e => {
            alert("Logeado");
            location.href = "/html/usuarioUI/documentosCli/porEnviar.html";
          })
          .catch(e => {
            console.log(`Error creando cliente: ${error}`);
          });
      } else {
        // User is not signed in.
        alert("No Logeado");
      }
    });
  }
  // Esta funcion pasa el email y su password a la clase Auth para login con firebase
  IngresarCli() {
    var auth = new Auth();
    auth.LoginEmailPass(this.email, this.password);
  }
  //funcion de cerrar sesion aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //Setea los datos actuales del usuario
  setDatosPerfilUsuarioAct() {
    var nombreUsuario, apellidoUsuario, fonoUsuario, emailUsuario;
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var userid = user.uid;
    var docRef = bd.collection("Clientes").doc(userid);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          nombreUsuario = doc.data().Nombre;
          apellidoUsuario = doc.data().Apellido;
          fonoUsuario = doc.data().telefono;
          emailUsuario = doc.data().email;
          //console.log("muestra datos negocio");
          //contraseniaNegocio = doc.data().fono;
          document.getElementById("nombreUsuario").value = nombreUsuario;
          document.getElementById("apellidoUsuario").value = apellidoUsuario;
          document.getElementById("telefonoUsuario").value = fonoUsuario;
          document.getElementById("emailUsuario").value = emailUsuario;
        } else {
          console.log("No existe el documento!");
        }
      })
      .catch(function(error) {
        console.log("Error al obtener los datos:", error);
      });
  }
}
