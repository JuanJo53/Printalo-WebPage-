// Evento de Boton Cerrar Secion
function Salir(){
    const negocio = new Negocio();
    negocio.CerrarSecionCli();
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