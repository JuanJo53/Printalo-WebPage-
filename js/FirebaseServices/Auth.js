class Auth {
	crearCuentaEmailPass(email, password) {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
			});
	}
	LoginEmailPass(email, password) {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
			});
	}

	Logout() {
		firebase
			.auth()
			.signOut()
			.then(function() {
				console.log("Salir");
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	//TODO: Programar la verificacion de las cuentas nuevas
}
