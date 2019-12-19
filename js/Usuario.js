class Usuario {
	constructor(apellido, nombre, correo) {
		this.apellido = apellido;
		this.nombre = nombre;
		this.correo = correo;
	}
	logout() {
		var auth = new Auth();
		auth.Logout();
	}
}
