/*TODO: replicar metodo de isersion de inicial al cargar la pagina
window.onload=ValidarNeg();

function SetInicialNeg(){
    
}
*/

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