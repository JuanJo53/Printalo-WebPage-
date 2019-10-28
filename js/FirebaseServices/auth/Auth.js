class Auth{
    crearCuentaEmailPass(email,password, nombre){
        alert("email: "+email+" pass: "+password);
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }
    LoginEmailPass(email,password, nombre){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
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

/*    autEmailPass (email,paswoord){

    }

    crearCuentaEmailPass (email,password, nombres){
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(result=>{
                result.user.updateProfile({
                    displayName : nombres
                })

                const configuracion = {
                    url: '' 
                }

                result.user.sendEmail.Verification()
                .catch(error=>{
                    console.error(error)
                    Materialize.toast(error.message, 4000)
                })

                firebase.auth().signOut()
                Materialize.toast(
                    'Bienbenido ${nombres}, debes realizar el proceso de verificacion',
                    4000
                )
                $('.modal').modal('close')

            })
            .catch(error=>{
                console.error(error)
                Materialize.toast(error.message, 4000)
            })
    }*/
}
