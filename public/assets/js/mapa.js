var map = {};
var latitud, longitud, miUbicacion;
var inputPartida = document.getElementById("input-origen");
var inputDestino = document.getElementById("input-destino");

function initMap() {
  var laboratoriaLima = {lat: -12.1191427, lng: -77.0349046};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: laboratoriaLima,
    disableDefaultUI: true
  });

  // var markerLaboratoria = new google.maps.Marker({
  //   position: laboratoriaLima,
  //   map: map
  // });

  //-------- Añadiendo autocompletado--//
  new google.maps.places.Autocomplete(inputPartida);
  new google.maps.places.Autocomplete(inputDestino);

  map.setOptions({styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]});

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
  }

  function funcionExito(posi){
    latitud = posi.coords.latitude;
    longitud = posi.coords.longitude;

    miUbicacion = new google.maps.Marker({
      position: {lat:latitud, lng:longitud},
      map: map
    });

    map.setZoom(18);
    map.setCenter({lat:latitud, lng:longitud}); //Asignamos un nuevo centro del mapa
  }

  function funcionError(error){
    alert("Tenemos un problema con encontrar tu ubicación");
  }
}

// --------Trazando Ruta------//
document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  directionsService.route({
      origin: inputPartida.value,
      destination: inputDestino.value,
      travelMode: 'DRIVING'
      }, function(response, status){
        if(status === 'OK'){
          var distancia = Number((response.routes[0].legs[0].distance.text.replace("km","")).replace(",","."));
          var costo = distancia*1.75;

          (function print(){
            swal({
              title: "Tarifa" + "<hr>",
              text: "<div style='text-align: left;'>"+
                      "<strong>Origen: </strong>" +
                      "<p>" + inputPartida.value  +"</p>" +
                      "<strong>Llegada: </strong>" +
                      "<p>" + inputDestino.value  +"</p>" +
                      "<hr>" +
                      "<strong>Costo: S/. " + parseInt(costo) +"</strong>" +
                    "</div>",
              html: true,
              type: "success",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Aceptar",
            });
          })();

          //console.log(response.routes[0].legs[0].distance.text);

          directionsDisplay.setDirections(response);
          // miUbicacion.setMap(null);
        }else{
          sweetAlert("No encontramos una ruta.","Verifica ingresando ambos datos", "error");
        }
      });
  directionsDisplay.setMap(map);
});
