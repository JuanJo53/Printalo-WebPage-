class Autenticacion{
    autEmailPass (email,paswoord){

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

                        

    }
}