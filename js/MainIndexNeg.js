/*// Evento de Boton Registrar
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
}*/
// Evento de Boton Registrar
var Registrar = document.getElementById("btnRegistrarNegocio");
Registrar.addEventListener("click", RegistrarNeg=>{
    var nombreDueño = document.getElementById("txtNameReg").value;
    var apellidoDueño = document.getElementById("txtLastNameReg").value;
    var nombreNeg = document.getElementById("txtNegNameReg").value;
    var dir = document.getElementById("txtDirReg").value;
    var num = document.getElementById("txtNumReg").value;
    var email = document.getElementById("txtEmailReg").value;
    var pass = document.getElementById("txtPasswordReg").value;
    const auth = new Auth();
    auth.crearCuentaEmailPass(email,pass); 
});
// Evento de Boton Ingresar
var Ingresar = document.getElementById("btnIngresarNeg");
Ingresar.addEventListener('click', login=>{
    const nombreNeg = document.getElementById("txtNameIng").value;
    const email = document.getElementById("txtEmailIng").value;
    const pass = document.getElementById("txtPasswordIng").value;
    const auth = firebase.auth();
    alert("email:"+email+" pass: "+pass);
    const promise=auth.signInWithEmailAndPassword(email, pass)
        promise.catch(e=> console.log(e.errorMessage));  

});
firebase.auth().onAuthStateChanged(firebaseUser=>{
    if (firebaseUser) {
            // User is signed in.
            var displayName = firebaseUser.displayName;
            var email = firebaseUser.email;
            var emailVerified = firebaseUser.emailVerified;
            var photoURL = firebaseUser.photoURL;
            var isAnonymous = firebaseUser.isAnonymous;
            var uid = firebaseUser.uid;
            var providerData = firebaseUser.providerData;
            console.log("Logeado");
            console.log(firebaseUser);
            location.href="/html/negocioUI/pedidosNeg/pedPendientes.html";            
        } else {    
            // User is not signed in.
            console.log(firebaseUser);
            console.log("No Logeado");
        }
});

