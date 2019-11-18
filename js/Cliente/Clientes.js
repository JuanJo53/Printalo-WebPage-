class Cliente{
    constructor(email, password, nombre, apellido, telefono){
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;

        //Instancia para valores de firestore
        this.bd = firebase.firestore();
    }
    // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
    RegistrarCli(a,e,n,t){        
        var auth = new Auth();
        auth.crearCuentaEmailPass(this.email, this.password);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var user = firebase.auth().currentUser;
                console.log(user);
                firebase.firestore().collection('Clientes').doc(user.uid).set({
                    Apellido: a,
                    email: e,
                    Nombre: n,
                    telefono: t
                }).then(e => {
                    alert("Logeado");
                    location.href="/html/usuarioUI/documentosCli/porEnviar.html";
                }).catch(e=>{
                   console.log(`Error creando cliente: ${error}`);
                })                       
            } else {
                // User is not signed in.
                alert("No Logeado");
            }
        });        
    }
    // Esta funcion pasa el email y su password a la clase Auth para login con firebase
    IngresarCli(){
        var auth = new Auth();
        auth.LoginEmailPass(this.email, this.password);
    }

    SetInicial(){
        var inicial=this.nombre.charAt(0);
        document.getElementById('IncialUser').innerHTML = inicial;
    }
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    CerrarSecionCli(){
        var auth = new Auth();
        auth.Logout();
    }
}
