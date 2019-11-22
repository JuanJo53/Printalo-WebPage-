// Evento de Boton Registrar
function Registrar(){
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    const negocio = new Negocio(email,pass,nombreDueño,apellidoDueño,num,nombreNeg,dir);
    negocio.RegistrarNeg(dir,email,num,nombreNeg,apellidoDueño,nombreDueño);
};
// Evento de Boton Ingresar
function Ingresar(){
    var email = document.getElementById("txtEmailIng").value;
    var pass = document.getElementById("txtPasswordIng").value;
<<<<<<< HEAD
<<<<<<< HEAD:js/Negocios.js
    var auth = new Auth();
    auth.LoginEmailPass(email,pass);
=======
    const negocio = new Negocio();
    negocio.IngresarNeg(email,pass);
>>>>>>> 99bd30ef7ec1d7550c6602461bde55f11982f0d2:js/Negocio/IndexNeg.js
=======
    const negocio = new Negocio(email,pass,"","","","","");
    negocio.IngresarNeg();
>>>>>>> b0870a63748b1c2939c3a45d2841b003d3d62323
    ValidarNeg();
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado"); 
            location.href="/html/negocioUI/pedidosNeg/pedSolicitudes.html"
        } else {
            // User is not signed in.
            alert("No Logeado");
        }
    });
}