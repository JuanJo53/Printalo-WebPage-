class Auth{
    crearCuentaEmailPass(email,password){
        alert("email:"+email+" pass: "+password);
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
    }
    LoginEmailPass(email,password){
<<<<<<< HEAD
        alert("email: "+email+" pass: "+password);
=======
        alert("email:"+email+" pass: "+password);
>>>>>>> 99bd30ef7ec1d7550c6602461bde55f11982f0d2
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });       
    }

    Logout(){
        firebase.auth().signOut()
        .then(function(){
            console.log("Salir");
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //TODO: Programar la verificacion de las cuentas nuevas
}
