

// Evento de Boton Cerrar Secion
function Salir(){
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    var auth = new Auth();
    auth.Logout();
    ValidarNeg();
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado");
        } else {
            // User is not signed in.
            alert("No Logeado");
            location.href="/html/index/negocioIndex/indexNeg.html"
        }
    });
}