/*class Negocio{

}*/

var RegistrarNeg = document.getElementById("btnRegistrarNegocio");
RegistrarNeg.addEventListener("click", RegistrarNeg);
var IngresarNeg = document.getElementById("btnIngresarNeg");
IngresarNeg.addEventListener("click", IngresarNeg);

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
}

function IngresarNeg(){
    var nombreNeg = document.getElementById("txtNameIng").value;
    var email = document.getElementById("txtEmailIng").value;
    var pass = document.getElementById("txtPasswordIng").value;
    const auth = new Auth();
    
}