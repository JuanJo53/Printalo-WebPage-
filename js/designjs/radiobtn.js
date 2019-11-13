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