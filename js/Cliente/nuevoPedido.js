window.onload=ValidarCli();
//Esta funcion optiene la extension del documento.
function getFileExtension(filename){
    return filename.split('.').pop();
}
//Evento al añadir nuevo documento.
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
//Coloca la imagen y nombre de los negocios disponibles.
function setNegocios(){
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    var string="";
    bd.collection('Negocios').get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            string+=`<div class="pb-3 text-center puesto" data-dismiss="modal" data-toggle="modal"
                        data-target="#configurarPedido">
                        <div id="`+doc.data().nombreNeg+`" onclick="getNeg(this)" class="card negocioIcon mx-auto">
                            <div class="img-puesto">
                                <!--img del negocio-->
                                <img src="../../../img/pcs.jpg" alt="" class="card-img-top">
                                <!--//img del negocio-->
                            </div>
                            <div class="card-footer">
                                <!--nombre del negocio-->
                                <h5  class="my-auto text-light">`+doc.data().nombreNeg+`</h5>
                                <!--//nombre del negocio-->
                            </div>
                        </div>
                    </div>`
            var negocios=document.getElementById('Negocios');
            negocios.innerHTML=string;
        })
    })
    .catch(function(error){
        console.log("Error obteniendo los negocios: ", error);
    });    
}

function getDocData(){
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    bd.collection('Pedido').where('clienteID','==',user.uid)
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
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

    var table=document.getElementsByTagName('table')[0];
    var newRow=table.insertRow(1);
    //console.log(table.rows.length);

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
    tipo.className="text-center";
    
    nombArch.className="text-center";
    nombArch.innerHTML=name;

    solic.className="text-center";
    solic.innerHTML=`<button id="btnSol/`+(table.rows.length-1)+`" onclick="getDocNomb(this)" 
                        class="btn positive bg-printalo-greenDetail text-light" data-toggle="modal" data-target="#escogerLocal">
                        Solicitar
                    </button>`;
    elim.className="text-center";
    elim.innerHTML=`<button class="btn negative bg-printalo-blueDetail text-light" data-toggle="modal" data-target="#checkAlert">
                        Eliminar
                    </button>`;
    
}
var negocioID;
//Al apretar alguno de los documentos para solicitar.
function getDocNomb(_this){
    var nomb=getRowSelected(_this);
    console.log(nomb);
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed){
    var a=objectPressed.parentNode.parentNode;
    var nomb=a.getElementsByTagName("td")[1].innerHTML;
    return nomb;
}
//Obtiene el Negocio elegido.
function getNeg(objectPressed){
    negocioID=objectPressed.id;
    console.log(negocioID);
}

function getColor(){
    if(document.getElementById("color").checked){
        console.log('a color');
    }else{
        console.log('blanco y negro');
    }    
}

function getTamaño(){
    if(document.getElementById("carta").checked){
        console.log('carta');
    }else if(document.getElementById("oficio").checked){
        console.log('oficio');
    }else{
        console.log('A4');
    }    
}

function getImpresion(){
    if(document.getElementById("impresion").checked){
        console.log('intercalado');
    }else{
        console.log('anv');
    }    
}

function getAcabado(){
    if(document.getElementById("acabado").checked){
        console.log('engrampado');
    }else{
        console.log('nomal');
    }    
}

function getTipoHoja(){
    if(document.getElementById("TipoHoja").checked){
        console.log('normal');
    }else{
        console.log('reutilizado');
    }    
}
// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            getDocData();
            setNegocios();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    }); 
}