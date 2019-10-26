//NO TOCAR ESTOS ARCHIVOS SE REQUIEREN MODIFICACIONES DEBIDO A CAMBIOS EN ARCHIVOS DE FRONTEND
var firebaseConfig = {
    apiKey: "AIzaSyAEFS51wASyzXFPRgosvru8FHm-zvaMzAI",
    authDomain: "printalo-ef2bc.firebaseapp.com",
    databaseURL: "https://printalo-ef2bc.firebaseio.com",
    projectId: "printalo-ef2bc",
    storageBucket: "",
    messagingSenderId: "917705384239",
    appId: "1:917705384239:web:c7bb0ff68990454d84c1da"
};
firebase.initializeApp(firebaseConfig);
/*
function enviar(){
    var email=document.getElementById('email').value;
    var pass=document.getElementById('password').value;
    alert("email "+email+" pass "+pass);
    firebase.auth().createUserWithEmailAndPassword(email,pass)
    .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}*/