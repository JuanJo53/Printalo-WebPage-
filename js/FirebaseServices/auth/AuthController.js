var RegistrarNeg = document.getElementById("btnRegistrarNegocio");
RegistrarNeg.addEventListener("click", Verf);
function Verf(){
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    const auth = new Auth()
    auth.crearCuentaEmailPass(email,pass,nombreNeg)
    
}