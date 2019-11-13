// Evento de Boton Registrar
var Registrar = document.getElementById("btnRegistrarNegocio");
Registrar.addEventListener("click", Signup);
// Evento de Boton Ingresar
var Ingresar = document.getElementById("btnIngresarNeg");
Ingresar.addEventListener("click", Login);
 
function Login(){
    var nombreNeg = document.getElementById("txtNameIng").value;    
    var email = document.getElementById("txtEmailIng").value;
    var pass = document.getElementById("txtPasswordIng").value;
    var negocio = new Negocio(" ", " ", nombreNeg, " ", " ", email, pass);
    negocio.IngresarNeg();
}

function Signup(){
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;    
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    var negocio = new Negocio(nombreDueño, apellidoDueño, nombreNeg, dir, num, email, pass);
    negocio.RegistrarNeg();
}

