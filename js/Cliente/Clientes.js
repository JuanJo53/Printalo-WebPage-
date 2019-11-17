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
    RegistrarCli(){        
        var auth = new Auth();
        auth.crearCuentaEmailPass(this.email, this.password);
        var user = firebase.auth().currentUser;
        console.log(user);
        this.bd.collection('Clientes').add({
            Apellido: this.apellido,
            Nombre: this.nombre,
            telefono: this.telefono

        }).then(refDoc => {
            console.log(`Id del cliente nuevo: ${refDoc.id}`);
        }).catch(e=>{
            console.log(`Error creando cliente: ${error}`);
        })
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
