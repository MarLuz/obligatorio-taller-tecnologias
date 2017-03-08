/**
 * @author Martin Luz
 * @version 1.0
 * Model Inmueble 
 */
 
;(function(w) {
    /* global $  */
    
    'use strict';
    
    Inmueble.DEFAULT_LAT  = '-34.909051';
    Inmueble.DEFAULT_LONG = '-56.205128';
    
    function Inmueble() {
        
        var self           = this;
        var htmlItem       = '';
        var htmlItemDetail = '';
        var db             = app.getDB();
        var api            = app.getAPI();
        var $container     = $('div#detalle-propiedad').find('div[role="main"]');
        var $wrapperMap    = $('#wrapper-map');
        var $slider        = app.getSliderDetalle();
        
        //Fields 
        var id_api;
        
        var monthNames = [
            "Enero", 
            "Febrero", 
            "Marzo",
            "Abril", 
            "Mayo", 
            "Junio", 
            "Julio",
            "Agosto", 
            "Setiembre", 
            "Octubre",
            "Noviembre", 
            "Diciembre"
        ];

        self.load = function(data) {
            
            htmlItem =  '<li class="item">';
            htmlItem += '<div class="columns twelve general">';
			htmlItem += '<div class="item-block">';
		    htmlItem += '<a href="#detalle-propiedad?id='+data.id_api+'" class="item-propiedad">';
		    htmlItem += '<p class="name">'+data.title+'</p><p class="name-2">'+data.city+'</p>';
		    htmlItem += '</a>';
            htmlItem += '</div>';
            htmlItem += '<div class="row contenedor">';
			htmlItem += '<div class="columns twelve imagen">'   
			htmlItem += '<a href="#detalle-propiedad?id='+data.id_api+'" class="item-propiedad">';
			htmlItem += '<div class="image-block" style="background-image: url('+data.thumb+'); background-size: cover;"></div>';
            htmlItem += '</a>';
            htmlItem += '</div>';
            htmlItem += '<div class="contenedor-precio-dato"><div class="columns twelve  precio"><p><span>$'+data.price+'</span></p></div>';
            htmlItem += '<div class="columns twelve  datos">';
            htmlItem += '<div class="calif caball"> Tipo<span>'+data.type+'</span></div>';
            htmlItem += '<div class="columns four  caball">Operación<span>'+data.operation+'</span></div>';
            htmlItem += '<div class="columns four  rend">Estado. <span>'+app.fixConditionName(data.condition)+'</span></div>';
			htmlItem += '</div></div></div>'
			htmlItem +='</div>'
			htmlItem +='</li>'
        }
        
        self.loadDetail = function(id) {
             $wrapperMap.empty();
        
            db.getAccess().transaction(function(tx){
            
                tx.executeSql('SELECT * FROM inmuebles WHERE id_api=?', [id], function(tx, results){
                    onSuccess(tx, results);
                }, function error(tx, err) {
                    //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                    console.log(err);
                });
            });
        }
        

        function onSuccess(tx, result) {
            var data = result.rows[0];
            id_api   = data.id_api;
                        
            $container.find('p.name').text(data.title);
            $container.find('p.name-2').text(data.city);
            $container.find('div.precio').find('span').text('$'+data.price);
            $container.find('span.operation-data').text(data.operation);
            $container.find('span.type-data').text(data.type);
            $container.find('span.condition-data').text(app.fixConditionName(data.condition));
            $container.find('div.image-block').css({'background-image' : 'url('+data.thumb+')'});
            $container.find('div.image-block').css({'background-size'  : 'cover'});
            
            var sellerData = JSON.parse(data.seller_contact);
            var name       = (sellerData.contact == '') ? 'No disponible' : sellerData.contact;
            var email      = (sellerData.email == '') ? 'No disponible' : sellerData.email;
            var phone      = (sellerData.phone == '') ? 'No disponible' : sellerData.phone;
            var area       = (sellerData.area_code == '') ? 'No disponible' : sellerData.area_code;
            
            $container.find('td.contact-detail-name').text(name);
            $container.find('td.contact-detail-email').text(email);
            $container.find('td.contact-detail-area').text(area);
            
            if(phone == 'No disponible') {
                $container.find('td.contact-detail-phone').text(phone);
            } else {
               $container.find('td.contact-detail-phone').html('<a href="tel:'+phone+'">'+phone+'</a>'); 
            }
            
            $container.find('a.addFav').attr('data-id-item', data.id_api);
            
            //2018-02-15T10:28:56.000Z	
            var dateEnd   = '';
            if(data.stop_time != '') {
                var dateParse = new Date(data.stop_time);
                
                var day        = dateParse.getDate();
                var monthIndex = dateParse.getMonth();
                var year       = dateParse.getFullYear();    
                
                dateEnd = day+' de '+monthNames[monthIndex]+' del '+year;
                $container.find('div.dateend').text('La oferta termina el : '+dateEnd);
            }
            
            
            //Init map
            var coords = null;
            
            if(data.lat != '' && data.long != '') {
                coords = { 'lat' : data.lat, 'lng' : data.long}; 
                initGoogleMap(coords);
                $('#content-ubicacion').css({'display' : 'block'});
            } else {
                console.log('no mapa');
                $('#content-ubicacion').css({'display' : 'none'});
            }
            
            
            if(app.getUser() != null) { //si el usuario está logeado verifico si lo tiene como favorito
                db.getAccess().transaction(function(tx){
                
                    tx.executeSql('SELECT * FROM favorites WHERE id_api=? AND username=?', [id_api, app.getUser().username], function(tx, results){
                        if(results.rows.length > 0) {
                            $container.find('a.addFav').addClass('active');
                        } else {
                            $container.find('a.addFav').removeClass('active');
                        }
                    }, function error(tx, err) {
                        //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                        console.log(err);
                    });
                });                
            }
            
            $('#sliderDetalle').empty();

			$.ajax
			({
				type        : "GET",
				dataType    : "json",
				crossDomain : true,
				url         : api.getEndpoint() +'items/'+id_api,
				success     : function (response) {
				    app.hideLoader();
				    if(response.pictures.length > 0) {
				        response.pictures.forEach(function(item, index){
				            $('#sliderDetalle').append('<li><img src="'+item.url+'" class="galeria-detalle"/></li>');
				        })
				    } else {
	                    $('#sliderDetalle').append('<li><img src="'+data.thumb+'" class="galeria-detalle"/></li>');
				    }
				    $slider.reloadSlider();
				}
			});
        }
        
        function initGoogleMap(coords) {
            
            $('#wrapper-map').empty();
            
            var lat = (coords != null) ? coords.lat : Inmueble.DEFAULT_LAT;
            var lng = (coords != null) ? coords.lng : Inmueble.DEFAULT_LONG;
            
            $('#btnStreetView').attr('data-lat', lat);
            $('#btnStreetView').attr('data-lng', lng);
            
            //Map Instance
            var map  = new GoogleMap ({
                'lat'         : lat,
                'long'        : lng,
                'zoom'        : 14,
                'wrapper'     : 'wrapper-map',
                'scrollwheel' : false,
                'scaleControl': true,
                'disableUI'   : false,
                'theme'       : 'grey'
            });

            //Map initialization
            map.initMap();
            
            if(coords != null) {
                //Set marker
            
                map.setMarker({
                    'lat'  : lat,
                    'long' : lng
                });               
            }
            
            setTimeout(function() {
                $(window).trigger('resize');
            }, 800);
        }
        
        
        self.getHtmlItem = function() {
            return htmlItem;
        }
        
        self.destroy = function() {
            var obj = self;
            for(var prop in obj){
                var property = obj[prop];
                if(property != null && typeof(property) == 'object') {
                    self.destroy(property);
                }
                else {
                    obj[prop] = null;
                }
            }
        }
    }
    
    w.Inmueble = Inmueble;
    
})(window);