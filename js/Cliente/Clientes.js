class Cliente extends Usuario {
	constructor(email, password, nombre, apellido, telefono) {
		super(apellido, nombre, email);
		this.email = email;
		this.password = password;
		this.nombre = nombre;
		this.apellido = apellido;
		this.telefono = telefono;

		//Instancia para valores de firestore
		this.bd = firebase.firestore();
	}
	// Esta funcion pasa el email y su password a la clase Auth para registrar un nuevo usuario en firebase
	RegistrarCli(a, e, n, t) {
		var auth = new Auth();
		auth.crearCuentaEmailPass(this.email, this.password);
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				var user = firebase.auth().currentUser;
				console.log(user);
				firebase
					.firestore()
					.collection("Clientes")
					.doc(user.uid)
					.set({
						Apellido: a,
						email: e,
						Nombre: n,
						telefono: t,
						nombTarjeta: "",
						numTarjeta: "",
						mesTarjeta: 0,
						anioTarjeta: 0,
						cvvTarjeta: 0
					})
					.then(e => {
						alert("Logeado");
						location.href = "/html/usuarioUI/documentosCli/porEnviar.html";
					})
					.catch(e => {
						console.log(`Error creando cliente: ${error}`);
					});
			} else {
				// User is not signed in.
				alert("No Logeado");
			}
		});
	}
	// Esta funcion pasa el email y su password a la clase Auth para login con firebase
	async IngresarCli() {
		var auth = new Auth();
		var bd = firebase.firestore();
		var users = [];
		var c = 0;
		var conf = false;
		await bd
			.collection("Clientes")
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					users.push(doc.data().email);
					c++;
				});
			})
			.catch(function(error) {
				console.error(`Error al obtener los datos:\n ${error}`);
			});
		for (var i = 0; i < c; i++) {
			if (users[i] === this.email) {
				conf = true;
				auth.LoginEmailPass(this.email, this.password);
				break;
			} else {
				conf = false;
			}
		}
		if (conf === false) alert("Email Incorrecto");
	}
	//funcion de cerrar sesion aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	//Setea los datos actuales del usuario
	setDatosPerfilUsuarioAct() {
		var nombreUsuario, apellidoUsuario, fonoUsuario, emailUsuario, nombTarjeta, numTarjeta, mesTarjeta, anioTarjeta, cvvTarjeta;
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		var docRef = bd.collection("Clientes").doc(userid);
		docRef
			.get()
			.then(function(doc) {
				if (doc.exists) {
					nombreUsuario = doc.data().Nombre;
					apellidoUsuario = doc.data().Apellido;
					fonoUsuario = doc.data().telefono;
					emailUsuario = doc.data().email;
					nombTarjeta = doc.data().nombTarjeta;
					numTarjeta = doc.data().numTarjeta;
					mesTarjeta = doc.data().mesTarjeta;
					anioTarjeta = doc.data().anioTarjeta;
					cvvTarjeta = doc.data().cvvTarjeta;
					document.getElementById("nombreUsuario").value = nombreUsuario;
					document.getElementById("apellidoUsuario").value = apellidoUsuario;
					document.getElementById("telefonoUsuario").value = fonoUsuario;
					document.getElementById("emailUsuario").value = emailUsuario;
					document.getElementById("Tnombre").value = nombTarjeta;
					document.getElementById("Tnumero").value = numTarjeta;
					document.getElementById("Tmes").value = mesTarjeta;
					document.getElementById("Tanio").value = anioTarjeta;
					document.getElementById("Tcvv").value = cvvTarjeta;
				} else {
					console.log("No existe el documento!");
				}
			})
			.catch(function(error) {
				console.log("Error al obtener los datos:", error);
			});
	}
	//guarda datos generales de admnistrador
	GuardarCambiosPerfilUsuario() {
		//console.log("click");
		var apelUsu, nomUsu, telUsu, corUsu, nombTar, numTar, mesTar, anioTar, cvvTar;
		var nombreUsuario,
			apellidoUsuario,
			telefonoUsuario,
			correoUsuario,
			nombTarjeta,
			numTarjeta,
			mesTarjeta,
			anioTarjeta,
			cvvTarjeta;
		nomUsu = document.getElementById("nombreUsuario").value;
		apelUsu = document.getElementById("apellidoUsuario").value;
		telUsu = document.getElementById("telefonoUsuario").value;
		corUsu = document.getElementById("emailUsuario").value;
		nombTar = document.getElementById("Tnombre").value;
		numTar = document.getElementById("Tnumero").value;
		mesTar = document.getElementById("Tmes").value;
		anioTar = document.getElementById("Tanio").value;
		cvvTar = document.getElementById("Tcvv").value;
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		var docRef = bd.collection("Clientes").doc(userid);
		docRef
			.get()
			.then(function(doc) {
				if (doc.exists) {
					nombreUsuario = doc.data().Nombre;
					apellidoUsuario = doc.data().Apellido;
					telefonoUsuario = doc.data().telefono;
					correoUsuario = doc.data().email;
					nombTarjeta = doc.data().Nombre;
					numTarjeta = doc.data().Apellido;
					mesTarjeta = doc.data().telefono;
					anioTarjeta = doc.data().email;
					cvvTarjeta = doc.data().email;
					if (
						nombreUsuario === nomUsu &&
						apellidoUsuario === apelUsu &&
						telefonoUsuario === telUsu &&
						correoUsuario === corUsu &&
						nombTarjeta === nombTar &&
						numTarjeta === numTar &&
						mesTarjeta === mesTar &&
						anioTarjeta === anioTar &&
						cvvTarjeta === cvvTar
					) {
						console.log("los datos son los mismos");
					} else {
						//console.log("son distintos");
						actualizarDatosPerfilUsuario();
						alert("Se guardo cambios");
					}
				} else {
					console.log("No existe el documento!");
				}
			})
			.catch(function(error) {
				console.log("Error al obtener los datos:", error);
			});
	}
}
//esta funcion actualiza los datos de datos generales
function actualizarDatosPerfilUsuario() {
	//console.log("entro a cambiar datos de negocio");
	var nombreUsuario, apellidoUsuario, fonoUsuario, emailUsuario, nombTarjeta, numTarjeta, mesTarjeta, anioTarjeta, cvvTarjeta;
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var userid = user.uid;
	nombreUsuario = document.getElementById("nombreUsuario").value;
	apellidoUsuario = document.getElementById("apellidoUsuario").value;
	fonoUsuario = document.getElementById("telefonoUsuario").value;
	emailUsuario = document.getElementById("emailUsuario").value;
	nombTarjeta = document.getElementById("Tnombre").value;
	numTarjeta = document.getElementById("Tnumero").value;
	mesTarjeta = document.getElementById("Tmes").value;
	anioTarjeta = document.getElementById("Tanio").value;
	cvvTarjeta = document.getElementById("Tcvv").value;
	//verifica que no este vacios los campos
	if (nombreUsuario !== "" && apellidoUsuario !== "" && fonoUsuario !== "" && emailUsuario !== "") {
		//console.log("no estan vacios");
		bd.collection("Clientes")
			.doc(user.uid)
			.update({
				Nombre: nombreUsuario,
				Apellido: apellidoUsuario,
				email: emailUsuario,
				telefono: fonoUsuario,
				nombTarjeta: nombTarjeta,
				numTarjeta: numTarjeta,
				mesTarjeta: mesTarjeta,
				anioTarjeta: anioTarjeta,
				cvvTarjeta: cvvTarjeta
			})
			.then(e => {
				console.log("Datos Guardados Exitosamente datos generales");
			})
			.catch(e => {
				alert(`Error Guardando Datos: ${error}`);
			});
	} else {
		console.log("los campos estan vacios");
	}
}
