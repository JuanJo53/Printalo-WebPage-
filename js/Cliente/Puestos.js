window.onload = ValidarCli();
//Coloca la imagen y nombre de los negocios disponibles.
async function setNegocios() {
	var arrayPuestos = [];
	var cont=0;
	var bd = firebase.firestore();
	var string = "";
	await bd.collection("Negocios")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				string +=
					`<a href="./listasPuesto.html">
					<div class="pb-3 text-center puesto">
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
					</div>
					</a>`;
				//
				//
				//console.log(cont);
				//
				arrayPuestos.push(string);
				//if(cont==3){
				//	cont=0;
				//}
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los negocios: ", error);
		});
		console.log("puestos "+arrayPuestos.length);
		for(var i=0;i<arrayPuestos.length;i++){
			cont++;
			var negocios = document.getElementById("Negocios"+cont);
			console.log(arrayPuestos[i]);
			negocios.innerHTML = arrayPuestos[i];
			if(cont==3){
				cont=0;
			}
		}

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
