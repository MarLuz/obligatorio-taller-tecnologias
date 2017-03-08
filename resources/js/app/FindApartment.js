/**
 * @author Martin Luz
 * @version 1.0
 * Controlador de la seccion buscar apartamento
 */
; (function(w){
    
    /*global app $*/
    
    'use strict';
    
    function FindApartment() {
        
        var self         = this;
        var db           = app.getDB();
        var $wrapper     = $('#resultsApartments');
        var $selectOrder = $('#selectOrderApartments'); 
    
        var defaultOrder    = 'rowid';
        var defaultCriteria = 'DESC';
        var type            = 'Apartamento';
        var where           = 'WHERE type=? ';
        var dataParts       = [type];    
            
        $selectOrder.on('change', onChangeSelect);

        self.init = function(o) {
            $('select#type').find('option').removeAttr('selected');
            $('select#type').find('option[value="Apartamento"]').attr('selected', 'selected');
            
            if(o != null) {
                
                if(o.localidad != undefined && o.localidad != 0) {
                    where += 'AND city=? ';
                    dataParts.push(o.localidad);
                } 
                
                if(o.operation != undefined && o.operation != 0) {
                    where += 'AND operation=? ';
                    dataParts.push(o.operation);
                } 
                
                if(o.condition != undefined && o.condition != 0) {
                    where += 'AND condition=? ';
                    dataParts.push(o.condition);
                }  
                
                console.log(where);
                console.log(dataParts);
                
            }
            
            load();
        }
        
        function load() {
            db.getAccess().transaction(function(tx){
            
                tx.executeSql('SELECT * FROM inmuebles '+where+' ORDER BY '+defaultOrder+' '+defaultCriteria, dataParts, function(tx, results){
                    onSuccess(tx, results);
                }, function error(tx, err) {
                    //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                    console.log(err);
                });
            });
        }
        
        self.out = function() {
            console.log('Saliendo de seccion apartamentos');
        }
        
        function onSuccess(tx, results) {

            $wrapper.empty();
            // Reseteo los valores originales
            where      = 'WHERE type=? ';
            dataParts  = [type];
            
            var l = results.rows.length;
            var i = 0;
            
            if(l == 0) {
                $wrapper.append('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> Parece que no hay resultados para tu busqueda</div>')
            } else {
                
                for ( ; i < l ; i++ ) {
                    var inmueble = new Inmueble();
                    inmueble.load(results.rows.item(i));
                    $wrapper.append(inmueble.getHtmlItem());
                }
            }
            
            app.hideLoader();
        }
        
        function onChangeSelect(e) {
            if( $(this).val() != 0 ) {
                defaultOrder    = 'price';
                defaultCriteria = $(this).val(); 
                load();
            }
        }
    }
    
    w.FindApartment = FindApartment;
}) (window);