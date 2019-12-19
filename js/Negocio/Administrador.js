class Administrador extends Usuario {
	constructor(nombre, apellido, correo, negocioID) {
		super(nombre, apellido, correo);
		this.negocioID = negocioID;
	}
	registrar() {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		bd.collection("Administrador").add({
			apellido: this.apellido,
			nombre: this.nombre,
			negocioID: user.uid
		});
	}
}
