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
        ValidarNeg();
    }

    IngresarNeg(){
        var mail = this.email;
        var password = this.pass;
        var auth = new Auth();
        auth.LoginEmailPass(mail, password);
        ValidarNeg();
    }
}
function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function (user){
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
        console.log("user: "+firebase.auth().currentUser);
        location.href="/html/negocioUI/pedidosNeg/pedPendientes.html";            
    } else {    
        // User is not signed in.
        console.log("user: "+firebase.auth().currentUser);
        alert("No Logeado");
    }
});
}