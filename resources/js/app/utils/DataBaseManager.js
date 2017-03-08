/**
 * @author Martin Luz
 * @version 1.0
 * DataBaseManager es el controlador de la base de datos
 */
; (function(w) {
    
   /*global User*/
       
   'use strict';
   
    function DataBaseManager(argument) {
        var self = this;
        var db   = null;
        
        /**
         *  Database name
         *  Version number
         *  Text description
         *  Estimated size of database 
         */
        self.connect = function(o){
			db = window.openDatabase(o.db, o.version, o.description, o.size);
        }
        
        self.populateUsers = function() {
            
            if(db == null) {
                alert('No se ha podido conectar a la base de datos');
                return;
            }
			db.transaction(function(tx){
			    //tx.executeSql('DROP TABLE IF EXISTS usuarios');
				tx.executeSql("CREATE TABLE IF NOT EXISTS usuarios ( name, surname, email, phone, username, password, datecreated )", [], function(tx, results){
				    
				    User.getStaticUsers.forEach(function(item, index) {
				        
				        //Verifico si existe el usuario
				        tx.executeSql('SELECT * FROM usuarios WHERE username=?', [item.username], function(tx, results) {
				        
				            if(results.rows.length == 0) {
        				        var sql = 'INSERT INTO usuarios ( name, surname, email, phone, username, password, datecreated ) VALUES (?, ?, ?, ?, ?, ?, ?)';
        				        tx.executeSql(sql, [item.name, item.surname, item.email, item.phone, item.username, item.password, item.datecreated]);				                
				            }
				        });
				    });
				});
			});
        }
        
        self.createFavoritesTable = function() {
            
			db.transaction(function(tx){
			    //tx.executeSql('DROP TABLE IF EXISTS favorites');
				tx.executeSql("CREATE TABLE IF NOT EXISTS favorites ( username, id_api, datecreated )", [], function(tx, results){
				    console.log('Tabla favoritos creada correctamente');
				});
			});            
        }
        
        self.populateInmuebles = function( data ) {
            if(data == null) {
                return;
            } else {
                
                var results = data.results;
            
    			db.transaction(function(tx){
                    
                    tx.executeSql('DROP TABLE IF EXISTS inmuebles');
                    var sql = 'CREATE TABLE inmuebles (id_api , title, condition, price , city , lat, long, seller, seller_contact, thumb, type, operation , stop_time)';
                    
                    tx.executeSql(sql);
                    
                    results.forEach(function( item, index) {
                        var sql = 'INSERT INTO inmuebles (id_api , title, condition, price , city , lat, long, seller, seller_contact, thumb, type, operation , stop_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        var arr = [];
                        
                        arr.push(item.id);
                        arr.push(item.title);
                        arr.push(item.condition);
                        arr.push(item.price);
                        arr.push(item.address.city_name);
                        arr.push(item.location.latitude);
                        arr.push(item.location.longitude);
                        arr.push(item.seller.id);                         
                        arr.push(JSON.stringify(item.seller_contact));   
                        arr.push(item.thumbnail);
                        
                        var attributes = item.attributes;
                        var type       = attributes[0].value_name;
                        var operation  = attributes[1].value_name;
                        
                        arr.push(type);
                        arr.push(operation);
                        arr.push(item.stop_time);
                        
                        tx.executeSql(sql, arr, function(txt, results) {
                            //console.log(results);
                        });
                    });
                    
                }, function error(tx, err) {
                    //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                    console.log(err);
                });
            }
        }
        
        /**
         * Otorga un acceso desde afuera a la base 
         */
        self.getAccess = function() {
            return db;
        }
    }
    
    w.DataBaseManager = DataBaseManager;
}) (window);