class Empleado extends Usuario {
	constructor(nombre, apellido, correo, negocioID, telefono) {
		super(nombre, apellido, correo);
		this.negocioID = negocioID;
		this.telefono = telefono;
	}
	registrar(password) {
		console.log(this.nombre, this.apellido, this.telefono, this.correo, password, this.negocioID);
		var auth = new Auth();
		var bd = firebase.firestore();
		var apellido = this.apellido,
			correo = this.correo,
			nombre = this.nombre,
			telefono = this.telefono,
			negocioID = this.negocioID;
		var firebaseConfig = {
			apiKey: "AIzaSyAEFS51wASyzXFPRgosvru8FHm-zvaMzAI",
			authDomain: "printalo-ef2bc.firebaseapp.com",
			databaseURL: "https://printalo-ef2bc.firebaseio.com",
			projectId: "printalo-ef2bc",
			storageBucket: "printalo-ef2bc.appspot.com",
			messagingSenderId: "917705384239",
			appId: "1:917705384239:web:c7bb0ff68990454d84c1da"
		};
		var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
		secondaryApp
			.auth()
			.createUserWithEmailAndPassword(this.correo, password)
			.then(function(firebaseUser) {
				console.log("User " + firebaseUser.uid + " created successfully!");
			});
		bd.collection("Empleados")
			.add({
				Apellido: apellido,
				email: correo,
				Nombre: nombre,
				telefono: telefono,
				negocioID: negocioID,
				contraseña: password
			})
			.then(e => {
				location.reload();
				alert("Empleado Añadido!");
			})
			.catch(e => {
				console.log(`Error añadiendo empleado:\n ${error}`);
			});
	}
}
