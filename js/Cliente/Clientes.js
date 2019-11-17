class Cliente{
    constructor(email, password, nombre, apellido, telefono){
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
    }
    // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
    RegistrarCli(){        
        var auth = new Auth();
        auth.crearCuentaEmailPass(this.email, this.password);
    }
    // Esta funcion pasa el email y su password a la clase Auth para login con firebase
    IngresarCli(){
        var auth = new Auth();
        auth.LoginEmailPass(this.email, this.password);
    }
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    CerrarSecionCli(){
        var auth = new Auth();
        auth.Logout();
    }
}
