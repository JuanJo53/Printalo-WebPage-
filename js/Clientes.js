class Cliente{

    RegistrarCli(e,p){        
        const auth = new Auth();
        auth.crearCuentaEmailPass(e,p);
        this.ValidarCli();
    }

    IngresarCli(e,p){
        var auth = new Auth();
        auth.LoginEmailPass(e,p);
        this.ValidarCli();
    }

    CerrarSecionCli(){
        var auth = new Auth();
        auth.Logout();
        this.ValidarCli();
    }

    ValidarCli(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                alert("Logeado"); 
                location.href="/html/usuarioUI/documentosCli/porEnviar.html"
            } else {
                // User is not signed in.
                alert("No Logeado");
            }
        });
    }
}
