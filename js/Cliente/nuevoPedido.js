window.onload=ValidarCli();

function getFileExtension(filename){
    return filename.split('.').pop();
}

var fileButton = document.getElementById('my-file');
fileButton.addEventListener('change',function (e){
    var storage = firebase.storage();
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    //Get file
    var file=e.target.files[0];

    var metadata={
        name: file.name,
        contentType: getFileExtension(file.name)
    };
    //Create a storage ref
    var storageRef = storage.ref();
    //Upload file
    var task=storageRef.child('docsPedidos/'+user.uid+'/'+file.name).put(file,metadata);
    var perc;
    task.on('state_changed', 
        function progress(snapshot){
            perc=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
            console.log(perc);
        }, 
        function error(err){
            console.log('Error: '+err);
        }, 
        function() {
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
            getDocData(file)
        });

});

function getDocData(file){
    var storage = firebase.storage();
    var user = firebase.auth().currentUser;
    var storageRef = storage.ref();
    var docData=storageRef.child('docsPedidos/'+user.uid+'/'+file.name);
    docData.getMetadata()
    .then(function(metadata){
        console.log('name: '+metadata.name);
        console.log('Type: '+metadata.contentType);
        setData(metadata.contentType,metadata.name);
    })
    .catch(function(error){
      console.log('Error al obtener la data: '+error);
    })
}

function setData(type,name){
    var bd=firebase.firestore();
    var storage=firebase.storage();
    var user=firebase.auth().currentUser;
    var userid=user.uid;
    var storageRef = storage.ref('docsPedidos/'+user.uid);
    console.log('HOLA: '+storageRef.name);

    var table=document.getElementsByTagName('table')[0];
    var newRow=table.insertRow(table.rows.length);
    
    var tipo=newRow.insertCell(0);
    var nombArch=newRow.insertCell(1);
    var solic=newRow.insertCell(2);
    var elim=newRow.insertCell(3);

    tipo.innerHTML=type;
    nombArch.innerHTML=name;

}

// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            //setData();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    }); 
}