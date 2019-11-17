// Evento de Boton Registrar
var Registrar = document.getElementById("btnRegistrarNegocio");
Registrar.addEventListener("click", e=>{
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    const negocio = new Negocio();
    negocio.RegistrarNeg(email,pass);
    ValidarNeg();
});
// Evento de Boton Ingresar
var Ingresar = document.getElementById("btnIngresarNeg");
Ingresar.addEventListener("click", e=>{
    var nombreNeg = document.getElementById("txtNameIng").value;
    var email = document.getElementById("txtEmailIng").value;
    var pass = document.getElementById("txtPasswordIng").value;
<<<<<<< HEAD:js/Negocios.js
    var auth = new Auth();
    auth.LoginEmailPass(email,pass);
=======
    const negocio = new Negocio();
    negocio.IngresarNeg(email,pass);
>>>>>>> 99bd30ef7ec1d7550c6602461bde55f11982f0d2:js/Negocio/IndexNeg.js
    ValidarNeg();
});

// Esta funcion ejecuta el observador de firebase
function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado"); 
            location.href="/html/negocioUI/pedidosNeg/pedPendientes.html"
        } else {
            // User is not signed in.
            alert("No Logeado");
        }
    });
}