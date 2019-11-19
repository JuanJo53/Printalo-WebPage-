//Set inicial en avatar de web
var user = firebase.auth().currentUser;
var userid= user.uid;
console.log(userid);
//var inicial=this.nombre.charAt(0);
//document.getElementById('IncialUser').innerHTML = inicial;



// Evento de Boton Cerrar Secion
function Salir(){
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    var auth = new Auth();
    auth.Logout();
    ValidarCli();
};

// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado"); 
            location.href="/html/usuarioUI/documentosCli/porEnviar.html"
        }else{
            // User is not signed in.
            alert("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}