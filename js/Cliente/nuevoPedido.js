var fileButton = document.getElementById('my-file');
fileButton.addEventListener('change',function (e){
    var storage = firebase.storage();
    //Get file
    var file=e.target.files[0];
    console.log('hola');
    //Create a storage ref
    var storageRef = storage.ref('documentos/'+file);

    //Upload file
    storageRef.put(file);

    //Update progress bar

});
// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            getDoc();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}