var fileButton = document.getElementById('my-file');
fileButton.addEventListener('change',function (e){
    var storage = firebase.storage();
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    //Get file
    var file=e.target.files[0];
    console.log(file);
    //Create a storage ref
    var storageRef = storage.ref('docsPedidos/'+user.uid+'/'+file.name);
    //Upload file
    storageRef.put(file);
    var task=storageRef.put(file);
    
    task.on('state_changed', null, null, function() {
        task.snapshot.ref.getDownloadURL()
        .then(url=>{
            console.log("Mostrar: "+url);
            bd.collection('Pedido').add({
                blancoYnegro: false,
                cantidad: 0,
                clienteID: user.uid,
                docID: url,
                engrampado: false,
                estado: "porEnviar",
                fecha: firebase.firestore.FieldValue.serverTimestamp(),
                fechaEntrega: firebase.firestore.FieldValue.serverTimestamp(),
                ladosImpre: "",
                metodoPago: "",
                negocioID: "",
                paginas: true,
                tamañoHoja: "",
                tipoHoja: ""
            })
        })
        
      });
    
});
// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}