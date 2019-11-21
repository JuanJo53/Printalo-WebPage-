$(document).ready(function () {
    $("#personal").click(function () {
        $("#personaldiv:hidden").show('slow');
        $("#tarjetadiv").hide();
    });
    $("#personal").click(function () {
        if ($("#personal").prop('checked') === false) {
            $("#personaldiv").hide();
        }
    });
    $("#tarjeta").click(function () {
        $("#tarjetadiv:hidden").show('slow');
        $("#personaldiv").hide();
    });
    $("#tarjeta").click(function () {
        if ($("#tarjeta").prop('checked') === false) {
            $("#tarjetadiv").hide();
        }
    });
});
$(document).ready(function () {
    $("#personal2").click(function () {
        $("#personaldiv2:hidden").show('slow');
        $("#tarjetadiv2").hide();
    });
    $("#personal2").click(function () {
        if ($("#personal2").prop('checked') === false) {
            $("#personaldiv2").hide();
        }
    });
    $("#tarjeta2").click(function () {
        $("#tarjetadiv2:hidden").show('slow');
        $("#personaldiv2").hide();
    });
    $("#tarjeta2").click(function () {
        if ($("#tarjeta2").prop('checked') === false) {
            $("#tarjetadiv2").hide();
        }
    });
});

$(document).ready(function () {
    $("#rangos").click(function () {
        $("#rangodiv").show('slow');
        $("#preciounicodiv").hide();
    });
    $("#rangos").click(function () {
        if ($("#rangos").prop('checked') === false) {
            $("#rangodiv").hide();
        }
    });
    $("#preciounico").click(function () {
        $("#preciounicodiv").show('slow');
        $("#rangodiv").hide();
    });
    $("#preciounico").click(function () {
        if ($("#preciounico").prop('checked') === false) {
            $("#preciounicodiv").hide();
        }
    });
});

$(document).ready(function () {
    $("#rangosColor").click(function () {
        $("#rangodivcolor").show('slow');
        $("#preciounicodivcolor").hide();
    });
    $("#rangosColor").click(function () {
        if ($("#rangosColor").prop('checked') === false) {
            $("#rangodivcolor").hide();
        }
    });
    $("#preciounicoColor").click(function () {
        $("#preciounicodivcolor").show('slow');
        $("#rangodivcolor").hide();
    });
    $("#preciounicoColor").click(function () {
        if ($("#preciounicocolor").prop('checked') === false) {
            $("#preciounicodivcolor").hide();
        }
    });
});

//radio button's choice todo-personalizado
$(document).ready(function () {
    $("#todo").click(function () {
        $("#tododiv:hidden").show('slow');
        $("#personalizadodiv").hide();
    });
    $("#todo").click(function () {
        if ($("#todo").prop('checked') === false) {
            $("#tododiv").hide();
        }
    });
    $("#personalizado").click(function () {
        $("#personalizadodiv:hidden").show('slow');
        $("#tododiv").hide();
    });
    $("#personalizado").click(function () {
        if ($("#personalizado").prop('checked') === false) {
            $("#personalizadodiv").hide();
        }
    });
});
//radio button's choice todo-personalizado

//radio button's choice todo-personalizado en seccion enviados
$(document).ready(function () {
    $("#todoe").click(function () {
        $("#todoediv:hidden").show('slow');
        $("#personalizadoediv").hide();
    });
    $("#todoe").click(function () {
        if ($("#todoe").prop('checked') === false) {
            $("#todoediv").hide();
        }
    });
    $("#personalizadoe").click(function () {
        $("#personalizadoediv:hidden").show('slow');
        $("#todoediv").hide();
    });
    $("#personalizadoe").click(function () {
        if ($("#personalizadoe").prop('checked') === false) {
            $("#personalizadoediv").hide();
        }
    });
});
//radio button's choice todo-personalizado en seccion enviados

//radio button's de configuracion pubAgregar documento o fotocopia
$(document).ready(function () {
    $("#fotocopia").click(function () {
        $("#fotocopiadiv:hidden").show('slow');
        $("#documentodiv").hide();
    });
    $("#fotocopia").click(function () {
        if ($("#fotocopia").prop('checked') === false) {
            $("#fotocopiadiv").hide();
        }
    });
    $("#documento").click(function () {
        $("#documentodiv:hidden").show('slow');
        $("#fotocopiadiv").hide();
    });
    $("#documento").click(function () {
        if ($("#documento").prop('checked') === false) {
            $("#documentodiv").hide();
        }
    });
});
//radio button's choice todo-personalizado en seccion enviados