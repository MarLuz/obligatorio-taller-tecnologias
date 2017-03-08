/**
 * @author Martin Luz
 * @version 1.0
 * Favorites controller 
 */
 
;(function(w) {
    
    'use strict';
    
    function Favorites() {
        
        var self     = this;
        var db       = app.getDB();
        var user     = app.getUser();
        var $content = $('div#favoritos');
        
        self.init = function() {
            
            $('div[data-role="footer"]').find('a[href="#favoritos"]').addClass('ui-btn-active');
            $content.trigger('create');
            
            db.getAccess().transaction(function(tx){
            
                tx.executeSql('SELECT * FROM favorites WHERE username=? ORDER BY datecreated DESC', [user.username], function(tx, results){
                    onSuccess(tx, results);
                }, function error(tx, err) {
                    //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                    console.log(err);
                });
            });
        }
        
        self.out = function (argument) {
            $('div[data-role="footer"]').find('a[href="#favoritos"]').removeClass('ui-btn-active');
        }
        
        function onSuccess(tx, results) {
            
            $content.find('ul.seleccion').empty();
            var l = results.rows.length;
            var i = 0;
            
            if( l == 0 ) {
                $content.append('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> De momento no tienes favoritos :(</div>');
            } else {
                $content.find('alert').remove();
                for ( ; i < l ; i++ ) {
                    
                    tx.executeSql('SELECT * FROM inmuebles WHERE id_api=?', [results.rows.item(i).id_api], function(tx, results){
                        
                        var inmueble = new Inmueble();
                        inmueble.load(results.rows[0]);
                        $content.find('ul.seleccion').append(inmueble.getHtmlItem());
     
                    }, function error(tx, err) {
                        console.log(err);
                    });
                }
            }
            
            app.hideLoader();
        }
    }
    

    w.Favorites = Favorites;
    
})(window);