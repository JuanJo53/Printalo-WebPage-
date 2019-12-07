window.onload = ValidarCli();
//Coloca la imagen y nombre de los negocios disponibles.
function setNegocios() {
	var bd = firebase.firestore();
	var string = "";
	bd.collection("Negocios")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				string +=
					`<div class="pb-3 text-center puesto" data-dismiss="modal" data-toggle="modal"
                        data-target="#configurarPedido">
                        <div id="` +
					doc.data().nombreNeg +
					`" onclick="getNeg(this)" class="card negocioIcon mx-auto">
                            <div class="img-puesto">
                                <!--img del negocio-->
                                <img src="../../../img/pcs.jpg" alt="" class="card-img-top">
                                <!--//img del negocio-->
                            </div>
                            <div class="card-footer">
                                <!--nombre del negocio-->
                                <h5  class="my-auto text-light">` +
					doc.data().nombreNeg +
					`</h5>
                                <!--//nombre del negocio-->
                            </div>
                        </div>
                    </div>`;
				var negocios = document.getElementById("Negocios");
				negocios.innerHTML = string;
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los negocios: ", error);
		});
}
//Obtiene el Negocio elegido.
function getNeg(objectPressed) {
	negocioID = objectPressed.id;
	console.log(negocioID);
}

function ValidarCli() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			setNegocios();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
