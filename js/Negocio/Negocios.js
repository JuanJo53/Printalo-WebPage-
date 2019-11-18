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
    }
    // Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
    RegistrarNeg(d,e,t,nn,a,n){
        var auth = new Auth();
        auth.crearCuentaEmailPass(this.email,this.password);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var user = firebase.auth().currentUser;
                console.log(user);
                firebase.firestore().collection('Administrador').add({
                    apellido: a,
                    nombre: n             
                }).then(refDoc => {
                    var adminID= refDoc.id;
                    firebase.firestore().collection('Negocios').doc(user.uid).set({
                        adminID: adminID,
                        costoUni: 0,
                        dir: d,
                        email: e,
                        fono: t,
                        nombreNeg: nn              
                    }).then(e => {
                        alert("Logeado");
                        location.href="/html/negocioUI/pedidosNeg/pedPendientes.html"
                    }).catch(e=>{
                       console.log(`Error creando cliente: ${error}`);
                    })
                }).catch(e=>{
                   console.log(`Error creando cliente: ${error}`);
                })                                       
            } else {
                // User is not signed in.
                alert("No Logeado");
            }
        });  
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