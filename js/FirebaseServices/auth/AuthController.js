$(() => {    

    //$("#authFB").click(() => );

    $("#btnRegistrarNegocio").click(() => {
        var nombreDueño = $('#name').val();
        var apellidoDueño = $('#LastName').val();
        var nombreNeg = $('#NegName').val();
        var dir = $('#dir').val();
        var num = $('#num').val();
        var email = $('#email').val();
        var pass = $('#password').val();
        alert("email: "+email+" pass: "+pass);
        const auth = new Auth()
        auth.crearCuentaEmailPass(email,pass,nombreNeg)
    });
/*
    $("#btnInicioEmail").click(() => {
        const email = $('#emailSesion').val();
        const password = $('#passwordSesion').val();
        // TODO : LLamar auth cuenta con email
    });

    //$("#authGoogle").click(() => //AUTH con GOOGLE);

    //$("#authTwitter").click(() => //AUTH con Twitter);

    $('#btnRegistrarse').click(() => {
        $('#modalSesion').modal('close');
        $('#modalRegistro').modal('open');
    });

    $('#btnIniciarSesion').click(() => {
        $('#modalRegistro').modal('close');
        $('#modalSesion').modal('open');
    });
*/
});