/*class Negocio{

}*/
// Evento de Boton Registrar
var Registrar = document.getElementById("btnRegistrarNegocio");
Registrar.addEventListener("click", RegistrarNeg);
// Evento de Boton Ingresar
var Ingresar = document.getElementById("btnIngresarNeg");
Ingresar.addEventListener("click", IngresarNeg);

function RegistrarNeg(){
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    const auth = new Auth();
    auth.crearCuentaEmailPass(email,pass,nombreNeg);  
    ValidarNeg();
}

function IngresarNeg(){
    var nombreNeg = document.getElementById("txtNameIng").value;
    var email = document.getElementById("txtEmailIng").value;
    var pass = document.getElementById("txtPasswordIng").value;
    const auth = new Auth();
    auth.LoginEmailPass(email,pass,nombreNeg);
    ValidarNeg();
}

function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            console.log("Logeado");
            console.log(user);
            location.href="/html/negocioPage/pedidos/pedPendientes.html";
        } else {    
            // User is not signed in.
            console.log("No Logeado");
        }
      });
}