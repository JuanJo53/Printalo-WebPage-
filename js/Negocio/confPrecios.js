//Apenas cargue la pagina
window.onload=ValidarNeg();
var precioBN,precioColor,precioOficio,precioA4,precioCarta,precioNorm,precioReu;
//Setea los precios actuales de la base de datos
function setPreciosAct(){
    var user = firebase.auth().currentUser;
    var bd=firebase.firestore();
    var userid= user.uid;
    var docRef = bd.collection('Negocios').doc(userid);    
    docRef.get().then(function(doc){
        if (doc.exists){
            console.log("Datos de Admin:", doc.data());
            precioBN=doc.data().costoBN;
            precioColor=doc.data().costoColor;
            precioOficio=doc.data().costoTamHoja.Oficio;
            precioCarta=doc.data().costoTamHoja.Carta;      
            precioA4=doc.data().costoTamHoja.A4;
            precioNorm=doc.data().costoTipoHoja.normal;
            precioReu=doc.data().costoTipoHoja.reutilizable;
            document.getElementById('txtPrecioBN').value = precioBN;
            document.getElementById('txtPrecioColor').value = precioColor;  
            document.getElementById('txtPrecioOficio').value = precioOficio;
            document.getElementById('txtPrecioCarta').value = precioCarta;
            document.getElementById('txtPrecioA4').value = precioA4;
            document.getElementById('txtHojaNorm').value = precioNorm;
            document.getElementById('txtHojaReu').value = precioReu;
        }else{
            console.log("No existe el documento!");
        }
    }).catch(function(error){
        console.log("Error al obtener los datos:", error);
    })
}
//Esta funcion habilita el input para editar Impresiones a Blanco y Negro
function enableBN(){
    if(document.getElementById("txtPrecioBN").disabled === false){
        document.getElementById("txtPrecioBN").disabled = true;
    }else{
        document.getElementById("txtPrecioBN").disabled = false;
    }    
}
//Esta funcion habilita el input para editar Impresiones a Color
function enableColor(){
    if(document.getElementById("txtPrecioColor").disabled === false){
        document.getElementById("txtPrecioColor").disabled = true;
    }else{
        document.getElementById("txtPrecioColor").disabled = false;
    }    
}
//Esta funcion habilita los inputs para editar Tamaños de Hoja
function enableTamHoja(){
    if(document.getElementById("txtPrecioOficio").disabled === false){
        document.getElementById("txtPrecioOficio").disabled = true;
        document.getElementById("txtPrecioCarta").disabled = true;
        document.getElementById("txtPrecioA4").disabled = true;
    }else{
        document.getElementById("txtPrecioOficio").disabled = false;
        document.getElementById("txtPrecioCarta").disabled = false;
        document.getElementById("txtPrecioA4").disabled = false;
    } 
}
//Esta funcion habilita los inputs para editar Tipos de Hoja
function enableTipHoja(){
    if(document.getElementById("txtHojaNorm").disabled === false){
        document.getElementById("txtHojaNorm").disabled = true;
        document.getElementById("txtHojaReu").disabled = true;
    }else{
        document.getElementById("txtHojaNorm").disabled = false;
        document.getElementById("txtHojaReu").disabled = false;
    } 
}
//Esta funcion verifica si existen cambios en los campos, para luego almacenarlos
function GuardarCambPrecios(){
    //Verifica si estan habilitados los cambpos de impresion Blanco y Negro
    if(document.getElementById("txtPrecioBN").disabled === false){
        if(precioBN!=document.getElementById("txtPrecioBN").value){
            cambiarBN();
        }else{
            alert("El campo de impresiones a blanco y nego no sufrio cambios");
        }        
    }
    if(document.getElementById("txtPrecioColor").disabled === false){
        if(precioColor!=document.getElementById("txtPrecioColor").value){
            cambiarColor();
        }else{
            alert("El campo de impresiones a color no sufrio cambios");
        }    
    }
    if(document.getElementById("txtPrecioA4").disabled === false){
        var A4=false;
        var Oficio=false;
        var Carta=false;
        if(precioOficio!=document.getElementById("txtPrecioOficio").value){
            Oficio=true;
        }
        if(precioA4!=document.getElementById("txtPrecioA4").value){
            A4=true;
        }           
        if(precioCarta!=document.getElementById("txtPrecioCarta").value){
            Carta=true;
        }     
        cambiarTamHoja(A4,Oficio,Carta);        
    }
    if(document.getElementById("txtHojaNorm").disabled === false){
        var norm=false;
        var reu=false;
        if(precioNorm!=document.getElementById("txtHojaNorm").value){
            norm=true;
        }
        if(precioReu!=document.getElementById("txtHojaReu").value){
            reu=true;
        }
        cambiarTipoHoja(norm,reu);
    }
}

function cambiarBN(){
    var bd = firebase.firestore();
    var user = firebase.auth().currentUser;
    const precio=parseFloat(document.getElementById("txtPrecioBN").value);
    if(precio>0){
        bd.collection('Negocios').doc(user.uid).update({
            costoBN: precio
        }).then(e => {
            alert("Datos Guardados Exitosamente");
        }).catch(e=>{
            alert(`Error Guardando Datos: ${error}`);
        })
    }else{        
        alert("Valor invalido");
    }
}

function cambiarColor(){
    var bd = firebase.firestore();
    var user = firebase.auth().currentUser;
    const precio=parseFloat(document.getElementById("txtPrecioColor").value);
    if(precio>0){
        bd.collection('Negocios').doc(user.uid).update({
            costoColor: precio
        }).then(e => {
            alert("Datos Guardados Exitosamente");
        }).catch(e=>{
            alert(`Error Guardando Datos: ${error}`);
        })
    }else{
        alert("Valor invalido");
    }
}

function cambiarTamHoja(cambA4,cambOf,cambCart){
    if(cambA4===true && cambOf===true && cambCart===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pA4=parseFloat(document.getElementById("txtPrecioA4").value);
        const pCarta=parseFloat(document.getElementById("txtPrecioCarta").value);
        const pOficio=parseFloat(document.getElementById("txtPrecioOficio").value);
        if(pA4>0 && pCarta>0 && pOficio>0){
            bd.collection('Negocios').doc(user.uid).update({
                costoTamHoja: {
                    A4: pA4,
                    Carta: pCarta,
                    Oficio: pOficio
                }                
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos");
        }    
    }else if(cambA4===true && cambOf===true && cambCart===false){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pA4=parseFloat(document.getElementById("txtPrecioA4").value);
        const pOficio=parseFloat(document.getElementById("txtPrecioOficio").value);
        if(pA4>0 && pOficio>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.A4': pA4,
                'costoTamHoja.Oficio': pOficio
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos2");
        }
    }else if(cambA4===true && cambOf===false && cambCart===false){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pA4=parseFloat(document.getElementById("txtPrecioA4").value);
        if(pA4>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.A4': pA4               
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos3");
        }
    }else if(cambA4===false && cambOf===true && cambCart===false){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pOficio=parseFloat(document.getElementById("txtPrecioOficio").value);
        if(pOficio>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.Oficio': pOficio             
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos3");
        }
    }else if(cambA4===false && cambOf===false && cambCart===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pCarta=parseFloat(document.getElementById("txtPrecioCarta").value);
        if(pCarta>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.Carta': pCarta       
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos3");
        }
    }else if(cambA4===true && cambOf===false && cambCart===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pA4=parseFloat(document.getElementById("txtPrecioA4").value);
        const pCarta=parseFloat(document.getElementById("txtPrecioCarta").value);
        if(pA4>0 && pCarta>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.A4': pA4,                    
                'costoTamHoja.Carta': pCarta        
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos3");
        }
    }else if(cambA4===false && cambOf===true && cambCart===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pOfi=parseFloat(document.getElementById("txtPrecioOficio").value);
        const pCarta=parseFloat(document.getElementById("txtPrecioCarta").value);
        if(pOfi>0 && pCarta>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTamHoja.Carta': pCarta,
                'costoTamHoja.Oficio': pOfi                
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos3");
        }
    }else if(cambA4===false && cambOf===false && cambCart===false){
        alert("No existen cambios por tamaño de hoja");
    }
}

function cambiarTipoHoja(normal,reuti){    
    if(normal===true && reuti===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pNorm=parseFloat(document.getElementById("txtHojaNorm").value);
        const pReu=parseFloat(document.getElementById("txtHojaReu").value);
        if(pNorm>0 && pReu>0){
            bd.collection('Negocios').doc(user.uid).update({
                costoTipoHoja: {
                    normal: pNorm,
                    reutilizable: pReu
                }                
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0");
        } 
    }else if(normal===true && reuti===false){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pNorm=parseFloat(document.getElementById("txtHojaNorm").value);
        if(pNorm>0){
            console.log("normal");
            bd.collection('Negocios').doc(user.uid).update({
                'costoTipoHoja.normal': pNorm             
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0");
        }
    }else if(normal===false && reuti===true){
        var bd = firebase.firestore();
        var user = firebase.auth().currentUser;
        const pReu=parseFloat(document.getElementById("txtHojaReu").value);
        if(pReu>0){
            bd.collection('Negocios').doc(user.uid).update({
                'costoTipoHoja.reutilizable': pReu               
            }).then(e => {
                alert("Datos Guardados Exitosamente");
            }).catch(e=>{
                alert(`Error Guardando Datos: ${error}`);
            })
        }else{
            alert("Valores invalidos \n Verifique que los datos ingresados son numeros mayores a 0");
        }
    }else if(normal===false && reuti===false){
        alert("No hay cambios en los precios por tipo de hoja");
    }    
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.   
            setPreciosAct();
            console.log("Logeado");
        } else {
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/negocioIndex/indexNeg.html"
        }
    });
}