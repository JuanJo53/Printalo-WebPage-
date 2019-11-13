
function login(){
    alert("email:"+email+" pass: "+pass);
    const email = document.getElementById("txtEmailIng").value;
    const pass = document.getElementById("txtPasswordIng").value;      
    console.log("email:"+email+" pass: "+pass);
    
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage)
      });  
}
// Evento de Boton Registrar
const btnRegistrar = document.getElementById("btnRegistrarNegocio");
const btnIngresar = document.getElementById("btnIngresarNeg");
const txtemail = document.getElementById("txtEmailIng");
const txtpass = document.getElementById("txtPasswordIng");
const txtnombreNeg = document.getElementById("txtNameIng");
btnRegistrar.addEventListener('click', RegistrarNeg=>{
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

btnIngresar.addEventListener('click',login);


    /*const email = "alvin@gmail.com";
    const pass = "alvinperra";
    const auth = firebase.auth();
    const promise=auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e=> console.log(e.errorMessage)); */
firebase.auth().onAuthStateChanged(firebaseUser=>{
    if (firebaseUser) {
        // User is signed in.
        console.log(firebaseUser);
        console.log("Logeado");
        alert("entreOnStage");
        location.href="/html/negocioUI/pedidosNeg/pedPendientes.html";            
    } else {    
        // User is not signed in.
        console.log(firebaseUser);
        console.log("No Logeado");
    }
});
