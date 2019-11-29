window.onload=ValidarCli();

function getDocData(){
    var user = firebase.auth().currentUser;
    var bd = firebase.firestore();
    bd.collection('Pedido').where('clienteID','==',user.uid).where('estado','==','solicitado').orderBy('fecha')
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
    var table=document.getElementsByTagName('table')[0];
    var newRow=table.insertRow(1);

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
                        Detalles
                    </button>`;
    elim.className="text-center";
    elim.innerHTML=`<button onclick="delPedido(this)" class="btn negative bg-printalo-blueDetail text-light" data-toggle="modal" data-target="#checkAlert">
                        Eliminar
                    </button>`;
    
}
//Borra el pedido seleccionado.
function delPedido(_this){    
    var bd=firebase.firestore();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var nomb=getRowSelected(_this);
    console.log(nomb);
    var user=firebase.auth().currentUser;

    var query = bd.collection('Pedido').where('nombreDoc','==',nomb);
    query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            console.log('Documento se borro correctamente');
            var docRef = storageRef.child('docsPedidos/'+user.uid+'/'+nomb);
            docRef.delete().then(function() {
                alert('El documento se borro exitosamente!');
                location.reload();
            }).catch(function(error) {
                alert('Hubo un error en borrar el documento!');
            });
        });
    }).catch(function(error){
        console.log('Documento no se borro correctamente');
    });
    
}  
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed){
    var a=objectPressed.parentNode.parentNode;
    var nomb=a.getElementsByTagName("td")[1].innerHTML;
    return nomb;
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