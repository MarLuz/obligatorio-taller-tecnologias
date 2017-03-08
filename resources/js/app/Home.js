/**
 * @author Martin Luz
 * @version 1.0
 * Controlador de la seccion home
 */
; (function(w){
    
    'use strict';
    
    function Home() {
        
        var self       = this;
        var $slider    = $('#sliderHome');
        var $lasts     = $('ul#lasts');
        var $select    = $('#selectDptos');
        var $quickMenu = $('select#quickMenu');
        var db         = app.getDB();
        
        
        $quickMenu.on('change' , onQuickMenuChange);
        
        // Populate select deptos    
        db.getAccess().transaction(function(tx){
            tx.executeSql('SELECT DISTINCT (city) FROM inmuebles ORDER BY city', [], function(tx, results) {

                var l = results.rows.length;
                var i   = 0;
                
                for ( ; i < l ; i++ ) {
                    $select.append('<option value="'+results.rows.item(i).city+'">'+results.rows.item(i).city+'</option>')
                }
            });
        });
        
        self.build = function() {
                            
            $slider.bxSlider({
                auto    : true,
                captions: false
            });
            
            try {
                var arrDistance = new Array();
                var coords;

                navigator.geolocation.getCurrentPosition(function(position) {
                    // just to show how to access latitute and longitude
                    coords = [position.coords.latitude, position.coords.longitude];
                    db.getAccess().transaction(function(tx){
                        tx.executeSql('SELECT * FROM inmuebles WHERE lat !=? AND long !=?', ['', ''], function(tx, results) {

                            var l = results.rows.length;
                            var i   = 0;
                            
                            for ( ; i < l ; i++ ) {
                                var distance = parseInt(calcCrow(coords[0], coords[1], results.rows.item(i).lat, results.rows.item(i).long));
                                arrDistance.push({"distance" : distance, "inmueble" : results.rows.item(i)});
                            }

                            sorting(arrDistance, 'distance');

                            for ( var k = 0; k <= 6 ; k++ ) {
                                var item = arrDistance[k].inmueble;
                                $lasts.append('<li class="item"><a href="#detalle-propiedad?id='+item.id_api+'" class="item-propiedad"><img src="'+item.thumb+'" /></a></li>');
                            }

                            $lasts.bxSlider({
                                minSlides   : 3,
                                maxSlides   : 4,
                                slideWidth  : 170,
                                slideMargin : 5
                            });
                        });

                    });  
                },
                function(error) {

                    db.getAccess().transaction(function(tx){
                        tx.executeSql('SELECT * FROM inmuebles ORDER BY rowid DESC LIMIT 6', [], function(tx, results) {

                            var l = results.rows.length;
                            var i   = 0;
                            
                            for ( ; i < l ; i++ ) {
                                $lasts.append('<li class="item"><a href="#detalle-propiedad?id='+results.rows.item(i).id_api+'" class="item-propiedad"><img src="'+results.rows.item(i).thumb+'" /></a></li>')
                            }
                            
                            $lasts.bxSlider({
                                minSlides   : 3,
                                maxSlides   : 4,
                                slideWidth  : 170,
                                slideMargin : 5
                            });
                        });
                    });
                }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 }); 

            } catch(e) {
                alert('Error build')
            }

        }
 
        self.init = function() {

            $('div[data-role="footer"]').find('a[href="#inicio"]').addClass('ui-btn-active');
            try {
                setTimeout(function() {
                    $slider.reloadSlider();
                    $lasts.reloadSlider();
                    $(w).trigger('resize');                
                }, 500);
            } 
            catch(e) {}finally{
                app.hideLoader();
            }
        }

        function sorting(json_object, key_to_sort_by) {
            function sortByKey(a, b) {
                var x = a[key_to_sort_by];
                var y = b[key_to_sort_by];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            json_object.sort(sortByKey);
        }

        self.out = function() {
            $('div[data-role="footer"]').find('a[href="#inicio"]').removeClass('ui-btn-active');
            $quickMenu.find('option').removeAttr('selected');
            $quickMenu.find('option[value="0"]').attr('selected');
        }
    
            
        function onQuickMenuChange() {
            if($(this).val() != 0 ) {
                window.location.hash = $(this).val();
            }  
        }  

        function calcCrow(lat1, lon1, lat2, lon2) {
              var R = 6371; // km
              var dLat = toRad(lat2-lat1);
              var dLon = toRad(lon2-lon1);
              var lat1 = toRad(lat1);
              var lat2 = toRad(lat2);

              var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var d = R * c;
              return d;
        } 
        
        function toRad(Value) {
            return Value * Math.PI / 180;
        }
    }
    
    w.Home = Home;
}) (window);