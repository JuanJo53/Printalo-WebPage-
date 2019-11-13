class Auth{
    crearCuentaEmailPass(email,password){
        alert("email:"+email+" pass: "+password);
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }
    LoginEmailPass(email,password){
        alert("email:"+email+" pass: "+password);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
          });       
    }

    Logout(){
        //Copiar desde aqui
        firebase.auth().signOut()
        .then(function(){
            console.log("Salir");
        })
        .catch(function(error){
            console.log(error);
        }) //Hasta aqui para desloguearse 
    }

    //TODO: Programar la verificacion de las cuentas nuevas
}
