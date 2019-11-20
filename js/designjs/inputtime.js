var $input = $('.clock').clockpicker({
    default:          'default time',
    placement:        'bottom', 
    align:            'left',
    donetext:         'Listo',
    autoclose:        false,
    vibrate:          true,
    fromnow:          0,
    init:             function () { console.log('iniciado') },
    beforeShow:       function () { console.log('antes de mostrarse') },
    afterShow:        function () { console.log('después de mostrarse') },
    beforeHide:       function () { console.log('antes de ocultarse') },
    afterHide:        function () { console.log('después de ocultarse') },
    beforeHourSelect: function () { console.log('antes de seleccionar la hora') },
    afterHourSelect:  function () { console.log('después de seleccionar la hora') },
    beforeDone:       function () { console.log('antes de finalizar') },
    afterDone:        function () { console.log('después de finalizar') }
});

$input.clockpicker('hide');