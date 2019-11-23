window.onload=ValidarCli();
//Esta funcion optiene la extension del documento.
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
    //Agrega metadata al documento por subir
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
                    nombreDoc: file.name, 
                    paginas: true,
                    tamañoHoja: "",
                    tipoDoc: getFileExtension(file.name),
                    tipoHoja: ""
                })
            })
            
        })
        setData(getFileExtension(file.name),file.name);
});


function getDocData(){
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    bd.collection('Pedido').where('clienteID','==',user.uid)
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            console.log(doc.id, " => ", doc.data());
            setData(doc.data().tipoDoc,doc.data().nombreDoc);
        })
    })
    .catch(function(error){
        console.log("Error obteniendo los documentos: ", error);
    });
}

function setData(type,name){
    var bd=firebase.firestore();
    var storage=firebase.storage();
    var user=firebase.auth().currentUser;
    var userid=user.uid;
    var storageRef = storage.ref('docsPedidos/'+user.uid);
    console.log('HOLA: '+storageRef.name);

    var table=document.getElementsByTagName('table')[0];
    var newRow=table.insertRow(1);
    console.log(table.rows.length);
    var tipo=newRow.insertCell(0);
    var nombArch=newRow.insertCell(1);
    var solic=newRow.insertCell(2);
    var elim=newRow.insertCell(3);
    var icon=document.createElement('i');
    if(type==='pdf'){
        // TODO: Configurar para multiples iconos
        icon.className='far fa-file-pdf fa-3x';
        tipo.appendChild(icon);
    }
    nombArch.className="text-center";
    nombArch.innerHTML=name;
    solic.innerHTML='<a id="btnSolicitar" class="btn positive bg-printalo-greenDetail text-light" data-toggle="modal" data-target="#escogerLocal">Solicitar</a>';
    elim.innerHTML='<a class="btn negative bg-printalo-blueDetail text-light" data-toggle="modal" data-target="#checkAlert">Eliminar</a>'
    
}

// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            getDocData();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    }); 
}