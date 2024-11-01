var url = "https://solucionesaiapps.com/web/api/cars/";
var urlImage = "https://solucionesaiapps.com/web/";

var version = "1.5";

var apikey;
var email_webmaster;

var seleccion = {
    marca: {},
    modelo: {},
    mes: {},
    anyo: {},
    motor: {},
    potencia: {},
    km: 0,
    version: {},
    email: '',
    telefono: ''
};

var mesSeleccionado = false;
var anyoSeleccionado = false;


function scrollToAnchor(aid){
    jQuery(function($){
        var aTag = $("#"+aid);
        $('html,body').animate({scrollTop: (aTag.offset().top - 160)},'slow');
    });
}

function showModalInfo(titulo, texto) {
    jQuery(function($) {
        $('#tituloInfoModal').html(titulo);
        $('#textoInfoModal').html(texto);
        $('#infoModal').modal('show');
    });
}

function ocultarTodo() {
    jQuery(function($){
        // OCULTO ANTES DE CARGAR
        $("#modelAnchor").addClass('opacityContent');
        $(".btnModel").attr("disabled", true);

        // OCULTO LOS MESES
        $("#monthAnchor").addClass('opacityContent');
        $(".btnMes").attr("disabled", true);

        // OCULTO LOS AÑOS
        $("#yearAnchor").addClass('opacityContent');
        $(".btnYear").attr("disabled", true);

        // OCULTO LOS MOTORES
        $("#engineAnchor").addClass('opacityContent');
        $(".btnEngine").attr("disabled", true);

        // OCULTO LAS POTENCIAS
        $("#powerAnchor").addClass('opacityContent');
        $(".btnPower").attr("disabled", true);

        // OCULTO LOS KM
        $("#kmAnchor").addClass('opacityContent');
        $(".btnKM").attr("disabled", true);
        $('#inputKM').val('');

        // OCULTO LAS VERSIONES
        $("#versionAnchor").addClass('opacityContent');
        $(".btnVersion").attr("disabled", true);

        // OCULTO COMPROBAR RESULTADO
        $("#resultAnchor").addClass('opacityContent');
        $(".btnResult").attr("disabled", true);
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;
    });
}

function newValuation() {
    jQuery(function($){

        ocultarTodo();

        $('.btnBrand').removeClass('btnActivo');
        $('.btnModel').removeClass('btnActivo');
        $('.btnMes').removeClass('btnActivo');
        $('.btnYear').removeClass('btnActivo');
        $('.btnEngine').removeClass('btnActivo');
        $('.btnPower').removeClass('btnActivo');
        $('.btnVersion').removeClass('btnActivo');

        $('#inputKM').val('');
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;

        scrollToAnchor('brandAnchor');
    });
}

function showResult() {
    jQuery(function($) {
        // ELIMINO POR SI SE HA ENTRADO ANTERIORMENTE
        $('.rowResult').remove();

        $('#resultContainer').append([
            '<div class="row rowResult">'+
            '<div class="col-xs-12 col-sm-6 col-md-4 marginFinalResult">'+
            '<div alt="" class="imgBrand" style="background-image: url('+urlImage+seleccion.marca.icon_url+')"></div>'+
            '</div>'+
            '<div class="col-xs-12 col-sm-6 col-md-8 marginFinalResult centerText">'+
            '<p class="textValue">'+seleccion.version.value+'</p>'+
            '</div>'+
            '</div>',
            '<ul class="list-group rowResult" id="resultGroupContainer"></ul>'
        ]);

        $('#resultGroupContainer').append(
            [
                '<li id="backgroundListDetail" class="list-group-item"><strong>Información detallada:</strong></li>',
                '<li class="list-group-item"><strong>Marca: </strong> '+seleccion.marca.name+'</li>',
                '<li class="list-group-item"><strong>Modelo: </strong> '+seleccion.modelo.name+'</li>',
                '<li class="list-group-item"><strong>Antigüedad: </strong> '+seleccion.mes.mes +' '+seleccion.anyo.anyo+'</li>',
                '<li class="list-group-item"><strong>Tipo motor: </strong> '+seleccion.motor.description+'</li>',
                '<li class="list-group-item"><strong>Potencia: </strong> '+seleccion.potencia+'</li>',
                '<li class="list-group-item"><strong>Kilómetros: </strong> '+seleccion.km+'</li>',
                '<li class="list-group-item"><strong>Versión: </strong> '+seleccion.version.name+'</li>'
            ]
        );
    });
}

jQuery(function($) {
    $("#formResult").submit(function(e) {
        seleccion.email = $('#inputEmail').val();
        seleccion.telefono = $('#inputTelefono').val();

        if(seleccion.email=='') {
            showModalInfo("Error del formulario", "Debes introducir un email para continuar");
        }
        else if(seleccion.telefono.length!=9) {
            showModalInfo("Error del formulario", "Debes introducir un teléfono válido para continuar");
        } else if(!$("#checkTerminos").is(':checked')) {
            showModalInfo("Error del formulario", "Debes aceptar las condiciones para continuar");
        } else {

            var botonComprobar = $('#botonComprobar');

            //ENVIAR EMAIL
            $.ajax({
                url: url + "requestValuation/?apikey=" + apikey,
                type: "POST",
                data: {
                    id_coche: seleccion.version.id,
                    email_usr: seleccion.email,
                    email_webmaster: email_webmaster,
                    km: seleccion.km,
                    mes: seleccion.mes,
                    anyo: seleccion.anyo.anyo,
                    telefono: seleccion.telefono
                },
                beforeSend: function() {
                    botonComprobar.button('loading');
                },
                complete: function(){
                    botonComprobar.button('reset');
                },
                success: function(data) {
                    seleccion.version.value = data.value;

                    showResult();

                    $('#finalResultModal').modal('show');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                    $('#errorModal').modal('show');
                    botonComprobar.button('reset');
                }
            });
        }

        e.preventDefault();
    });
});

function selectVersion(element, id, name){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnVersion').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO EL MODELO SELECCIONADO
            seleccion.version = {
                id: id,
                name: name
            };

            scrollToAnchor("resultAnchor");

            // MUESTRO COMPROBAR RESULTADO
            $("#resultAnchor").removeClass('opacityContent');
            $(".btnResult").attr("disabled", false);
        }
    });
}

function getVersions() {
    jQuery(function($) {
        // OCULTO LAS VERSIONES
        $("#versionAnchor").addClass('opacityContent');
        $(".btnVersion").attr("disabled", true);

        // OCULTO COMPROBAR RESULTADO
        $("#resultAnchor").addClass('opacityContent');
        $(".btnResult").attr("disabled", true);
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;

        $.ajax({
            url: url + "car/?model_id="+seleccion.modelo.id+"&year="+seleccion.anyo.anyo+"&enginetype="+seleccion.motor.id+"&cv_id="+seleccion.potencia+"&apikey=" + apikey,
            type: "GET",
            beforeSend: function() {
                $("#versionLoader").fadeIn("slow");
            },
            complete: function(){
                $("#versionLoader").hide();
            },
            success: function(data) {

                if(data.length>0) {
                    // ELIMINO LAS POTENCIAS QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD 
                    $(".divVersion").remove();
                    $("#versionAnchor").removeClass('opacityContent');

                    $.each(data, function (index) {
                        $('#versionContainter').append(
                            '<div class="col-xs-6 col-sm-6 col-md-6 rowElements divVersion">' +
                            '<button id="power' + data[index].id + '" class="btn btn-default btnNormal btnVersion" onclick="selectVersion(this,\'' + data[index].id + '\',\'' + data[index].name + '\');">' +
                            '<span>' + data[index].name + '</span>' +
                            '</button>' +
                            '</div>'
                        )
                    });
                }
                else
                    showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                $('#errorModal').modal('show');
                $("#versionLoader").hide();
            }
        });
    });
}

jQuery(function($){
    $("#formKM").submit(function(e) {

        var km = $('#inputKM').val();

        if(km=='') {
            showModalInfo("Error del formulario","Debes indicar los kilómetros para continuar");
        } else if(km<=0) {
            showModalInfo("Error del formulario","Los kilómetros introducidos son incorrectos");
        }
        else {
            seleccion.km = parseInt(km);

            scrollToAnchor("versionAnchor");
            getVersions();
        }
        e.preventDefault();
    });
});

function selectPower(element, power){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnPower').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO EL MODELO SELECCIONADO
            seleccion.potencia = parseInt(power);

            // MUESTRO LOS KM
            $("#kmAnchor").removeClass('opacityContent');
            $(".btnKM").attr("disabled", false);

            scrollToAnchor("kmAnchor");

            // OCULTO LAS VERSIONES
            $("#versionAnchor").addClass('opacityContent');
            $(".btnVersion").attr("disabled", true);

            // OCULTO COMPROBAR RESULTADO
            $("#resultAnchor").addClass('opacityContent');
            $(".btnResult").attr("disabled", true);
            $('#inputEmail').val('');
            $('#inputTelefono').val('');
            $('#checkTerminos')[0].checked = false;
        }
    });
}

function getPowers() {
    jQuery(function($) {
        // OCULTO LAS POTENCIAS
        $("#powerAnchor").addClass('opacityContent');
        $(".btnPower").attr("disabled", true);

        // OCULTO LOS KM
        $("#kmAnchor").addClass('opacityContent');
        $(".btnKM").attr("disabled", true);
        $('#inputKM').val('');

        // OCULTO LAS VERSIONES
        $("#versionAnchor").addClass('opacityContent');
        $(".btnVersion").attr("disabled", true);

        // OCULTO COMPROBAR RESULTADO
        $("#resultAnchor").addClass('opacityContent');
        $(".btnResult").attr("disabled", true);
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;

        $.ajax({
            url: url + "cv/?model_id="+seleccion.modelo.id+"&year="+seleccion.anyo.anyo+"&enginetype="+seleccion.motor.id+"&apikey=" + apikey,
            type: "GET",
            beforeSend: function() {
                $("#powerLoader").fadeIn("slow");
            },
            complete: function(){
                $("#powerLoader").hide();
            },
            success: function(data) {

                if(data.length>0) {
                    // ELIMINO LAS POTENCIAS QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD
                    $(".divPower").remove();
                    $("#powerAnchor").removeClass('opacityContent');

                    $.each(data, function (index) {
                        $('#powerContainer').append(
                            '<div class="col-xs-6 col-sm-4 col-md-3 rowElements divPower">' +
                            '<button id="power' + data[index] + '" class="btn btn-default btnNormal btnPower" onclick="selectPower(this,\'' + data[index] + '\');">' +
                            '<span>' + data[index] + '</span>' +
                            '</button>' +
                            '</div>'
                        )
                    });
                }
                else
                    showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");

            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                $('#errorModal').modal('show');
                $("#powerLoader").hide();
            }
        });
    });
}

function selectEngine(element, id, code, description){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnEngine').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO EL MODELO SELECCIONADO
            seleccion.motor = {
                id: id,
                code: code,
                description: description
            };

            scrollToAnchor("powerAnchor");
            getPowers();
        }
    });
}

function hideElementIncorrectYear() {
    jQuery(function($) {
        // OCULTO LOS MOTORES
        $("#engineAnchor").addClass('opacityContent');
        $(".btnEngine").attr("disabled", true);

        // OCULTO LAS POTENCIAS
        $("#powerAnchor").addClass('opacityContent');
        $(".btnPower").attr("disabled", true);

        // OCULTO LOS KM
        $("#kmAnchor").addClass('opacityContent');
        $(".btnKM").attr("disabled", true);
        $('#inputKM').val('');

        // OCULTO LAS VERSIONES
        $("#versionAnchor").addClass('opacityContent');
        $(".btnVersion").attr("disabled", true);

        // OCULTO COMPROBAR RESULTADO
        $("#resultAnchor").addClass('opacityContent');
        $(".btnResult").attr("disabled", true);
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;
    });
}

function getEngines() {
    jQuery(function($) {
        hideElementIncorrectYear();

        $.ajax({
            url: url + "enginetypes/?model_id="+seleccion.modelo.id+"&year="+seleccion.anyo.anyo+"&apikey=" + apikey,
            type: "GET",
            beforeSend: function() {
                $("#engineLoader").fadeIn("slow");
            },
            complete: function(){
                $("#engineLoader").hide();
            },
            success: function(data) {

                if(data.length>0) {
                    // ELIMINO LOS AÑOS QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD
                    $(".divEngine").remove();
                    $("#engineAnchor").removeClass('opacityContent');

                    $.each(data, function (index) {
                        $('#engineContainer').append(
                            '<div class="col-xs-6 col-sm-4 col-md-4 rowElements divEngine">' +
                            '<button id="engine' + data[index].id + '" class="btn btn-default btnNormal btnEngine" onclick="selectEngine(this,\'' + data[index].id + '\',\'' + data[index].code + '\',\'' + data[index].description + '\');">' +
                            '<span>' + data[index].description + '</span>' +
                            '</button>' +
                            '</div>'
                        )
                    });
                }
                else
                    showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                $('#errorModal').modal('show');
                $("#engineLoader").hide();
            }
        });
    });
}

// COMPRUEBO QUE NO SE PERMITA TASAR VEHÍCULOS EN MESES QUE TODAVÍA NO HAN PASADO
function isFutureDate($) {
    var isFuture = false;

    if (anyoSeleccionado && mesSeleccionado) {
        var year = seleccion.anyo.anyo;
        var month = seleccion.mes.id;

        var currentYear = (new Date()).getFullYear();
        var currentMonth = (new Date()).getMonth();

        if (year == currentYear) {
            if (month >= (currentMonth+1)) {
                // UNSELECT A LOS DOS BOTONES YA QUE LA FECHA SELECCIONADA ES INCORRECTA
                anyoSeleccionado = false;
                mesSeleccionado = false;

                $('.btnYear').removeClass('btnActivo');
                $('.btnMes').removeClass('btnActivo');
                hideElementIncorrectYear();

                isFuture = true;
            }
        }
    }

    return isFuture
}

function selectYear(element, id, anyo, anyoActual){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnYear').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            var buttons = $('.btnYear');

            if(buttons[0].id == element.id) {
                $('.btnYear').removeClass('btnActivo');
                anyoSeleccionado = false;
                showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");
                hideElementIncorrectYear();
            } else if((buttons[buttons.length-1].id == element.id) && !anyoActual) {
                $('.btnYear').removeClass('btnActivo');
                anyoSeleccionado = false;
                showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");
                hideElementIncorrectYear();
            } else {
                // ALMACENO EL AÑO SELECCIONADO
                seleccion.anyo = {
                    id: id,
                    anyo: parseInt(anyo)
                };

                anyoSeleccionado = true;

                if(isFutureDate($))
                    showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");

                if(mesSeleccionado) {
                    scrollToAnchor("engineAnchor");
                    getEngines();
                } else {
                    scrollToAnchor("monthAnchor");
                }
            }
        }
    });
}

function selectMonth(element, mes){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            //QUITO LA CLASE A TODOS
            $('.btnMes').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO EL MES SELECCIONADO
            seleccion.mes = {
                id: parseInt((element.id).substr(3)),
                mes: mes
            };

            mesSeleccionado = true;

            if(isFutureDate($))
                showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");

            if(anyoSeleccionado) {
                scrollToAnchor("engineAnchor");
                getEngines();
            } else {
                scrollToAnchor("yearAnchor");
            }
        }
    });
}

function getYears() {
    jQuery(function($) {
        // OCULTO LOS AÑOS
        $("#yearAnchor").addClass('opacityContent');
        $(".btnYear").attr("disabled", true);

        // OCULTO LOS MESES
        $("#monthAnchor").addClass('opacityContent');
        $(".btnMes").attr("disabled", true);

        // OCULTO LOS MOTORES
        $("#engineAnchor").addClass('opacityContent');
        $(".btnEngine").attr("disabled", true);

        // OCULTO LAS POTENCIAS
        $("#powerAnchor").addClass('opacityContent');
        $(".btnPower").attr("disabled", true);

        // OCULTO LOS KM
        $("#kmAnchor").addClass('opacityContent');
        $(".btnKM").attr("disabled", true);
        $('#inputKM').val('');

        // OCULTO LAS VERSIONES
        $("#versionAnchor").addClass('opacityContent');
        $(".btnVersion").attr("disabled", true);

        // OCULTO COMPROBAR RESULTADO
        $("#resultAnchor").addClass('opacityContent');
        $(".btnResult").attr("disabled", true);
        $('#inputEmail').val('');
        $('#inputTelefono').val('');
        $('#checkTerminos')[0].checked = false;

        $.ajax({
            url: url + "years/?model_id="+seleccion.modelo.id+"&apikey=" + apikey,
            type: "GET",
            beforeSend: function() {
                $("#yearLoader").fadeIn("slow");
            },
            complete: function(){
                $("#yearLoader").hide();
            },
            success: function(anyo) {

                if(anyo.start_year<=anyo.end_year) {
                    // ELIMINO LOS AÑOS QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD
                    $(".divYear").remove();
                    $("#yearAnchor").removeClass('opacityContent');

                    // ELIMINO LOS MESES QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD
                    $("#monthAnchor").removeClass('opacityContent');
                    $(".btnMes").attr("disabled", false);

                    var anyoActual;

                    // OBTENGO EL AÑO ACTUAL
                    var currentYear = (new Date()).getFullYear();

                    // OBTENGO EL LISTADO DE AÑOS
                    var anyos = [];

                    var indice = -1;
                    for (i = anyo.start_year - 1; i <= anyo.end_year; i++) {
                        indice++;
                        anyos.push({id: indice, anyo: i.toString()})
                    }

                    // AJUSTO LOS LÍMITES DE AÑO
                    anyoActual = true;
                    anyos[0].anyo += " <";
                    if (anyo.end_year < currentYear) {
                        anyoActual = false;
                        anyos.push({id: anyos.length + 1, anyo: "> " + (anyo.end_year + 1)})
                    }

                    $.each(anyos, function (index) {
                        $('#yearContainer').append(
                            '<div class="col-xs-6 col-sm-4 col-md-4 rowElements divYear">' +
                            '<button id="year' + anyos[index].id + '" class="btn btn-default btnNormal btnYear" onclick="selectYear(this,\'' + anyos[index].id + '\',\'' + anyos[index].anyo + '\',' + anyoActual + ');">' +
                            '<span>' + anyos[index].anyo + '</span>' +
                            '</button>' +
                            '</div>'
                        )
                    });
                } else {
                    $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                    $('#errorModal').modal('show')
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                $('#errorModal').modal('show');
                $("#yearLoader").hide();
            }
        });
    });
}

function selectModel(element, id, name) {
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnModel').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO EL MODELO SELECCIONADO
            seleccion.modelo = {
                id: id,
                name: name
            };

            scrollToAnchor('monthAnchor');

            // OCULTO LOS AÑOS
            $("#yearAnchor").addClass('opacityContent');
            $(".btnYear").attr("disabled", true);

            // OCULTO LOS MESES
            $("#monthAnchor").addClass('opacityContent');
            $(".btnMes").attr("disabled", true);

            // OCULTO LOS MOTORES
            $("#engineAnchor").addClass('opacityContent');
            $(".btnEngine").attr("disabled", true);

            // OCULTO LAS POTENCIAS
            $("#powerAnchor").addClass('opacityContent');
            $(".btnPower").attr("disabled", true);

            // OCULTO LOS KM
            $("#kmAnchor").addClass('opacityContent');
            $(".btnKM").attr("disabled", true);
            $('#inputKM').val('');

            // OCULTO LAS VERSIONES
            $("#versionAnchor").addClass('opacityContent');
            $(".btnVersion").attr("disabled", true);

            // OCULTO COMPROBAR RESULTADO
            $("#resultAnchor").addClass('opacityContent');
            $(".btnResult").attr("disabled", true);
            $('#inputEmail').val('');
            $('#inputTelefono').val('');
            $('#checkTerminos')[0].checked = false;

            // CARGO FECHAS & MESES
            mesSeleccionado = false;
            anyoSeleccionado = false;
            $('.btnMes').removeClass('btnActivo');
            getYears();
            scrollToAnchor("monthAnchor");
        }
    });
}

function getModels() {
    jQuery(function($) {
        // OCULTO TODOS LOS ELEMENTOS
        ocultarTodo();
        
        $.ajax({
            url: url + "models/?brand_id="+seleccion.marca.id+"&apikey=" + apikey,
            type: "GET",
            beforeSend: function() {
                $("#modelLoader").fadeIn("slow");
            },
            complete: function(){
                $("#modelLoader").hide();
            },
            success: function(data) {
                if(data.length>0) {
                    // ELIMINO LOS MODELOS QUE PUEDAN HABERSE AÑADIDO Y QUITO LA OPACIDAD
                    $(".divModel").remove();
                    $("#modelAnchor").removeClass('opacityContent');

                    $.each(data, function (index) {
                        $('#modelContainer').append(
                            '<div class="col-xs-6 col-sm-4 col-md-4 rowElements divModel">' +
                            '<button id="model' + data[index].id + '" class="btn btn-default btnNormal btnModel" onclick="selectModel(this,\'' + data[index].id + '\', \'' + data[index].name + '\');">' +
                            '<span>' + data[index].name + '</span>' +
                            '</button>' +
                            '</div>'
                        )
                    });
                } else {
                    showModalInfo("Tasación incorrecta","No se ha podido tasar su vehículo con los parámetros introducidos");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                $('#errorModal').modal('show');
                $("#modelLoader").hide();
            }
        });
    });
}

function selectBrand(element, id, name, icon_url){
    jQuery(function($) {
        // SI NO HA SIDO SELECCIONADO
        if (!$('#' + element.id).hasClass('btnActivo')) {

            // QUITO LA CLASE A TODOS
            $('.btnBrand').removeClass('btnActivo');
            $('#' + element.id).addClass('btnActivo');

            // ALMACENO MARCA SELECCIONADA
            seleccion.marca = {
                id: id,
                name: name,
                icon_url: icon_url
            };

            scrollToAnchor('modelAnchor');

            getModels();
        }
    });
}

function hideShowBrands() {
    jQuery(function($) {
        if($('#hiddenBrands').is(':visible')) {
            $("#hiddenBrands").slideUp();
        } else {
            $("#hiddenBrands").slideDown();
        }
    });
}

function getCochesBrands() {
    jQuery(function($){
        // OBTENER APIKEY & EMAIL
        apikey = $('#hiddenApikeyCoches').val();
        email_webmaster = $('#hiddenEmail').val();

        if(apikey != undefined) {
            $.ajax({
                url: url + "brands/?version=" + version + "&apikey=" + apikey,
                type: "GET",
                beforeSend: function () {
                    $("#brandLoader").fadeIn("slow");
                },
                complete: function () {
                    $("#brandLoader").hide();
                },
                success: function (data) {

                    var tamanoMostrar = 11;

                    // SI HAY MENOS MARCAS A MOSTRAR
                    if (data.length <= 11) {
                        $.each(data, function (index) {
                            $('#brandContainer').append(
                                '<div class="col-xs-6 col-sm-2 col-md-2 rowElements">' +
                                '<button id="brand' + data[index].id + '" title="' + data[index].name + '" class="btn btn-default btnBrand" onclick="selectBrand(this,\'' + data[index].id + '\', \'' + data[index].name + '\', \'' + data[index].icon_url + '\');">' +
                                '<div alt="" class="imgBrand" style="background-image: url(' + urlImage + data[index].icon_url + ')"></div>' +
                                '</button>' +
                                '</div>'
                            )
                        });
                    } else {
                        for (var i = 0; i < tamanoMostrar; i++) {
                            $('#brandContainer').append(
                                '<div class="col-xs-6 col-sm-2 col-md-2 rowElements">' +
                                '<button id="brand' + data[i].id + '" title="' + data[i].name + '" class="btn btn-default btnBrand" onclick="selectBrand(this,\'' + data[i].id + '\', \'' + data[i].name + '\', \'' + data[i].icon_url + '\');">' +
                                '<div alt="" class="imgBrand" style="background-image: url(' + urlImage + data[i].icon_url + ')"></div>' +
                                '</button>' +
                                '</div>'
                            )
                        }
                        $('#brandContainer').append(
                            '<div class="col-xs-6 col-sm-2 col-md-2 rowElements">' +
                            '<button id="buttonMore" type="button" class="btn btnBrand btnMore" onclick="hideShowBrands()">' +
                            '<div>' +
                            '<i class="fas fa-plus show-more"></i>' +
                            '<p>Otras marcas</p>' +
                            '</div>' +
                            '</button>' +
                            '</div>'
                        );
                        for (var j = tamanoMostrar; j < data.length; j++) {
                            $('#hiddenBrands').append(
                                '<div class="col-xs-6 col-sm-2 col-md-2 rowElements">' +
                                '<button id="brand' + data[j].id + '" title="' + data[j].name + '" class="btn btn-default btnBrand" onclick="selectBrand(this,\'' + data[j].id + '\', \'' + data[j].name + '\', \'' + data[j].icon_url + '\');">' +
                                '<div alt="" class="imgBrand" style="background-image: url(' + urlImage + data[j].icon_url + ')"></div>' +
                                '</button>' +
                                '</div>'
                            )
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status == 426) {
                        $('#modalTextError').html("Necesita actualizar el plugin para continuar, disculpe las molestias");
                    } else {
                        $('#modalTextError').html("Se ha producido un error, inténtelo más tarde o póngase en contacto con el administrador");
                    }
                    $('#errorModal').modal('show');
                    $("#brandLoader").hide();
                    // $("#buttonRetry").show();
                }
            });
        }
    });
}

// jQuery(function($){
//     $("#buttonRetry").click(function() {
//         $("#buttonRetry").hide();
//         getCochesBrands();
//     });
// });

jQuery(document).ready(function() {
    // LOAD A LANGUAGE
    numeral.language('es', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        currency: {
            symbol: '€'
        }
    });

    // SWITCH BETWEEN LANGUAGES
    numeral.language('es');

    getCochesBrands();

    jQuery('#modal-wrapper-container').appendTo(document.body);
});