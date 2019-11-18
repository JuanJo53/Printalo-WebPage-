// Evento de Boton Cerrar Secion
var close = document.getElementById("btnLogout");
close.addEventListener("click", e =>{
    const cliente = new Cliente();
    cliente.CerrarSecionCli();
    ValidarCli();
});

// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado"); 
            location.href="/html/usuarioUI/documentosCli/porEnviar.html"
        } else {
            // User is not signed in.
            alert("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}