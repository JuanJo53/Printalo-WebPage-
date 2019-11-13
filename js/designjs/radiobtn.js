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