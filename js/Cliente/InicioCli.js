window.onload=ValidarCli();
//Set inicial en avatar de web
function SetInicial(){
    var user = firebase.auth().currentUser;
    var bd=firebase.firestore();
    var userid= user.uid;
    var nombre;
    console.log(userid);
    var docRef = bd.collection('Clientes').doc(userid);
    docRef.get().then(function(doc){
        if (doc.exists){
            console.log("Datos de Clientes:", doc.data());
            nombre=doc.data().Nombre;
            var inicial=nombre.charAt(0);
            document.getElementById('InicialCliente').innerHTML  = inicial;
        }else{
            console.log("No such document!");
        }
    }).catch(function(error){
        console.log("Error al obtener los datos:", error);
    })   
}
// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            SetInicial();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}