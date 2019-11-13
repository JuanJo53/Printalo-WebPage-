class Negocio{
    constructor(nombreDueño, apellidoDueño, nombreNeg, dir, num, email , pass){
        this.nombreDueño = nombreDueño;
        this.apellidoDueño = apellidoDueño;
        this.nombreNeg = nombreNeg;
        this.dir = dir;
        this.num = num;
        this.email = email;
        this.pass = pass;
    }    

    RegistrarNeg(){
        var auth = new Auth();
        auth.crearCuentaEmailPass(`${this.email}`, `${this.pass}`);  
        this.ValidarNeg();
    }

    IngresarNeg(){
        const auth = new Auth();
        auth.LoginEmailPass(`${this.email}`, `${this.pass}`);
        this.ValidarNeg();  
    }
    
    ValidarNeg(){
        firebase.auth().onAuthStateChanged(firebaseUser=>{
        if (firebaseUser) {
            // User is signed in.
            var displayName = firebaseUser.displayName;
            var email = firebaseUser.email;
            var emailVerified = firebaseUser.emailVerified;
            var photoURL = firebaseUser.photoURL;
            var isAnonymous = firebaseUser.isAnonymous;
            var uid = firebaseUser.uid;
            var providerData = firebaseUser.providerData;
            alert("Logeado");
            console.log("user: "+firebase.auth().currentUser);
            location.href="/html/negocioUI/pedidosNeg/pedPendientes.html";            
        } else {    
            // User is not signed in.
            console.log("user: "+firebase.auth().currentUser);
            alert("No Logeado");
        }
        });
    }
}
