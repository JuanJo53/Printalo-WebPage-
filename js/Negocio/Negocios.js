class Negocio{
    // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
    RegistrarNeg(e, p){
        var auth = new Auth();
        auth.crearCuentaEmailPass(e,p);
    }
    // Esta funcion pasa el email y su password a la clase Auth para login con firebase
    IngresarNeg(e, p){
        var auth = new Auth();
        auth.LoginEmailPass(e,p);
    }
    // Esta funcion pasa el email y su password a la clase Auth para logout con firebase
    CerrarSecionCli(){
        var auth = new Auth();
        auth.Logout();
    }
}