/**
 * @author Martin Luz
 * @version 2.0
 * @description Interactua con la Api de google maps
 * @param  window
 *
 * Url Google API @link http://maps.google.com/maps/api/js?sensor=false&libraries=places,geometry
 */

(function( window ) {

	function GoogleMap( params ) {

		var o        = params;
		var map      = null;
		var panorama = null;
		var self     = this;
		var latLong  = null;
		var wrapper  = '';
		/**
         * Direction service controller
         * @type {google.maps.DirectionsService}
         */
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        
		$(window).bind('resize' , onResize);
	
		wrapper = o.wrapper;
	
		/**
		 * [initMap inicializa el objeto]
		 * @return Google Map
		 */
		self.initMap = function() {
			
			var stylez;

			if(typeof o != 'object') {
				console.error('Error al inicializar el mapa - el contructor necesita recibir un object');
				return;
			}

			if(typeof o.wrapper == 'undefined' || typeof o.lat == 'undefined' || typeof o.long == 'undefined') {
				console.error('Error al inicializar el mapa - error en parametros');
				return;
			}	

			latLong = new google.maps.LatLng(Number(o.lat), Number(o.long));
			var options = {
				zoom              : Number(o.zoom),
				center            : latLong,
				mapTypeId         : google.maps.MapTypeId.ROADMAP,
				disableDefaultUI  : (typeof o.disableUI    == 'undefined') ? false : o.disableUI,
				scaleControl      : (typeof o.scaleControl == 'undefined') ? false : o.scaleControl,
				scrollwheel       : (typeof o.scrollwheel  == 'undefined') ? false : o.scrollwheel,
				mapTypeControl    : false,
				size              : new google.maps.Size(40,46),
				scaledSize        : new google.maps.Size(40,46),
				gestureHandling   : 'cooperative'
			}
			
		    map = new google.maps.Map(document.getElementById(o.wrapper), options);
			var stylez = [
				{
					"featureType": "all",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"saturation": 36
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 40
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 20
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						},
						{
							"weight": 1.2
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 20
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 21
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 29
						},
						{
							"weight": 0.2
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 18
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 19
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						}
					]
				}
			];
			var mapType = new google.maps.StyledMapType(stylez, { name : 'Grey' });

			map.mapTypes.set('theme', mapType);
			map.setMapTypeId('theme');
		}

		/**
		 * [setMarker description]
		 * @param {[type]} o [description]
		 */
		self.setMarker = function( o ) {

			if(typeof o != 'object') {
				console.error('Error al inicializar el marker');
				return;
			}

			var latLong = new google.maps.LatLng(Number(o.lat), Number(o.long));
			var marker  = new google.maps.Marker({
				position  : latLong,
				draggable : false,
				animation : google.maps.Animation.DROP,
				icon      : o.icon
			});	

			if(map != null) {
				marker.setMap(map);
				map.setCenter(latLong);
			}
		}
		/**
		 * [onResize description]
		 * @return {[type]} [description]
		 */
		function onResize() {
			map.setCenter(latLong);
		}
		
		
        this.streetView = function() {

            panorama = map.getStreetView();
            panorama.setPosition(latLong);
            panorama.setPov(({
                heading : 340,
                pitch   : 5
            }));

            panorama.setVisible(true);
            panorama.addListener('position_changed', function() {
                var currentPos = panorama.getPosition();
                $(self).trigger('pano_position_changed' , panorama.getPosition());
            });

            panorama.addListener('pov_changed', function() {
                $(self).trigger('pov_position_changed' , panorama.getPov());
            });

        }
	}
	
	window.GoogleMap = GoogleMap;
	
})(window);

