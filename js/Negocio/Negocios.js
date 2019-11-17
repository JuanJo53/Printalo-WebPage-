class Negocio{
    constructor(email, password, nombre, apellido, telef, nombreNeg, direccion,){
        this.email = email;
        this.password = password;
        this.nombre =nombre;
        this.apellido = apellido;
        this.telef = telef;
        this.nombreNeg = nombreNeg;
        this.direccion = direccion;

        //Instancia para valores de firestore
        this.bd = firebase.firestore();
        const settings = { timestampsInSnapshots : true}
        this.bd.settings(settings);
    }
    // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
    RegistrarNeg(){
        var auth = new Auth();
        auth.crearCuentaEmailPass(this.email,this.password);
        //TODO: Guardar los datos de registro extra en firebase
    }
    // Esta funcion pasa el email y su password a la clase Auth para login con firebase
    IngresarNeg(){
        var auth = new Auth();
        auth.LoginEmailPass(this.email,this.password);
    }
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    CerrarSecionCli(){
        var auth = new Auth();
        auth.Logout();
    }
}