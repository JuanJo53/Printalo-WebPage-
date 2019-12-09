class Pedido {
	//Borra el pedido seleccionado.
	eliminarPedido(_this) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var storage = firebase.storage();
		var storageRef = storage.ref();
		var nomb = getRowSelected(_this);
		console.log(nomb);
		var user = firebase.auth().currentUser;

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", nomb)
			.where("clienteID", "==", user.uid);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					doc.ref.delete();
					console.log("Documento se borro correctamente");
					var docRef = storageRef.child("docsPedidos/" + user.uid + "/" + nomb);
					docRef
						.delete()
						.then(function() {
							alert("El documento se borro exitosamente!");
							location.reload();
						})
						.catch(function(error) {
							alert("Hubo un error en borrar el documento!");
						});
				});
			})
			.catch(function(error) {
				console.log("Documento no se borro correctamente");
			});
	}
	//Cancela el pedido seleccionado que ya se envio.
	cancelarPedido(_this) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var nomb = getRowSelected(_this);
		console.log(nomb);
		var user = firebase.auth().currentUser;

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", nomb)
			.where("clienteID", "==", user.uid);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					bd.collection("Pedido")
						.doc(doc.id)
						.update({
							estado: "porEnviar"
						})
						.then(function() {
							location.reload();
						});
				});
			})
			.catch(function(error) {
				console.log("Documento no se borro correctamente");
			});
	}
	rechazarPedido(doc, user, precio, cant, pago, fecha, hora) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var storage = firebase.storage();
		var storageRef = storage.ref();
		console.log(doc, user, precio, cant, pago, fecha, hora);
		var user = firebase.auth().currentUser;

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", doc)
			.where("negocioID", "==", user.uid);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {});
			})
			.catch(function(error) {
				console.log("Documento no se rechazo correctamente");
			});
	}
}
