/**
 * @author Martin Luz
 * @version 1.0
 * API Mercado libre
 * https://api.mercadolibre.com/sites/MLU/search?category=MLU1459
 */
 
; (function(w) {
    
    'use strict';
    
    function API() {
        
        var LOCATION = 'MLU'; //Uruguay
        var ENDPOINT = 'https://api.mercadolibre.com/';
        var CATEGORY = 'MLU1459' // inmuebles
        
        var self = this;
        
        self.getAllInmuebles = function() {
			
			$.ajax
			({
				type        : "GET",
				dataType    : "json",
				crossDomain : true,
				data        : {'category' : CATEGORY},
				url         : ENDPOINT +'sites/' +LOCATION +'/search',
				success     : onGetAllSuccess,
                error       : function(e) {
                    alert('Ha ocurrido un error con el servidor: '+e);
                }
			});
        }
        
        function onGetAllSuccess(response) {
            var db = app.getDB();
            db.populateInmuebles(response);
        }      

        this.getEndpoint = function() {
            return ENDPOINT;
        }
    }

    
    w.API = API;
    
}) (window);