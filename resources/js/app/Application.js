/**
 * @author Martin Luz
 * @version 1.0
 * Application es el controlador de la aplicacion
 */
 
var app;

; (function(w) {
   'use strict';
   
   /* global $ DataBaseManager localStorage API GoogleMap Connection, navigator FindApartment*/
   
   Application.Utils;
   Application.Debug = false;
   Application.hasConnection;
   
   function Application(argument) {
       
       var self             = this;
       var $loaderWrapper   = $('#loader');
       var $menuBtn         = $('#menuBtn');
       var $slider          = $('.bxslider');
       var $btnApplyFilters = $('#btnApplyFilters');
       var $btnLogin        = $('#btnLogin');
       var $loginForm       = $('#loginForm');
       var $btnRegistro     = $('#btnRegistro');
       var $btnLogout       = $('#btnLogout');
       var $btnStreetView   = $('#btnStreetView');
       var $sliderDetalle   = null;

       var windowWidth  = window.innerWidth;
       var windowHeight = window.innerHeight;
       
       var templates        = [
           'inicio',
           'buscar-casas',
           'buscar-apartamentos',
           'detalle-propiedad'
       ]
        
       //Utils
       var dbManager = null;
       var api       = null; 
       
       Application.Utils = new Utils();
       
       //Controladores de seccion
       var home            = null;
       var finderHome      = null;
       var finderApartment = null;
       var favorites       = null;
       var filters         = null;
       var currentUser     = null;
       //Comienzo mostrando el cargador
       showLoader();
       
       document.addEventListener('deviceready', onDeviceReady, false);

       this.init = function() {
          
          if(localStorage.getItem('user') != null) {
             currentUser = JSON.parse(localStorage.getItem('user'));
             changeView();
             console.log('Existe usuario');
          }
            
          //Init Mercado libre API
          api = new API();
                      
          initDb();
          populateDB();
          
          // Creo los controladores de las secciones    
          home            = new Home();
          favorites       = new Favorites();
          finderHome      = new FindHome();
          finderApartment = new FindApartment();
          
          home.build();
          
          $sliderDetalle = $('#sliderDetalle').bxSlider({
            auto    : true,
            captions: false
          });
          
          
          $(w).on('hashchange' , onHashChange); 
          $btnApplyFilters.on('click' , onApplyFilters);
          $(document).on('click', 'li.item a.item-propiedad' , onItemPropiedadClick);
          $(document).on('click','a.addFav' , onAddFav);    
          $btnLogin.on('click' , onClickLogin); 
          $btnRegistro.on('click', onClickRegistro);
          $btnLogout.on('click' , onLogOut);
          $btnStreetView.on('click', onClickStreetView); 
          $('#wrapper-streetview').css({'height' : windowHeight, 'width' : '100%'});
           
          $(function(){
           	$( "[data-role='header'], [data-role='footer']" ).toolbar();
          });
          
          resolveMenuClick();
          $(w).trigger('hashchange');
          
       }
        
       self.getSliderDetalle = function() {
           return $sliderDetalle;
       }    
        
       function onClickLogin(e) {
           e.preventDefault();
           
           var error = false;
           var msg   = '';
           
           if($.trim($('#login').find('input[name="user"]').val()) == '') {
               
               $('#login').find('input[name="user"]').addClass('error');
               $('#login').find('input[name="user"]').focus();
               
               error = true;
               msg   = 'Debes ingresar tu nombre de usuario.';

           } else if($.trim($('#login').find('input[name="pass"]').val()) == '') {
               
               $('#login').find('input[name="pass"]').addClass('error');
               $('#login').find('input[name="pass"]').focus();
               error = true;
               msg   = 'Debes ingresar tu contraseña';
           } 
             
           if(error) {
               self.showLoginAlert(false, msg);    
           } else {
               
                showLoader();
                var user     = new User();
                user.findByUserAndPass($('#login').find('input[name="user"]').val(), $('#login').find('input[name="pass"]').val());
           }
       }    
       
       function onLogOut(e) {
           e.preventDefault();
           showLoader();
           localStorage.removeItem('user');
           window.location.reload();
       }
       
       function onClickRegistro(e) {
           e.preventDefault();
           
           if(Application.Utils.validateForm($('form#registroForm'))) {

               showLoader();
               dbManager.getAccess().transaction(function(tx){
    
    		        var sql  = 'INSERT INTO usuarios ( name, surname, email, phone, username, password, datecreated ) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    var data = $('form#registroForm').serializeArray(); 
                    
                    tx.executeSql(sql,[data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, md5(data[5].value), new Date()], function(tx, results){
                        
                       hideLoader();    
                       $('form#registroForm').prepend('<div class="alert alert-success" role="alert"><strong>Yeyy!</strong> Usuario guardado correctamente, ya puedes iniciar sesión.</div>');
                       Application.Utils.empty($('form#registroForm'));
                       setTimeout(function() {
                        window.history.back();  
                       }, 4000);
                    
                    }, function error(tx, err) {
                        $('form#registroForm').prepend('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> Ha ocurrido un error, intenta más tarde. </div>');
                        hideLoader();
                    });
               }); 
               
           }
       }
       
       function onAddFav(e) {
            e.preventDefault();
            
            var $target    = $(this);
            var $container = $('div#detalle-propiedad').find('div[role="main"]');
            var id_api     = $(this).data('id-item');
            
            console.log(id_api);
            
            if(app.getUser() == null) { // Usuario no logeado
                window.location.hash = '#login';
            } else {
                
                if($target.hasClass('active')) {

                    dbManager.getAccess().transaction(function(tx){
                        
                        tx.executeSql('DELETE FROM favorites WHERE username=? AND id_api=?', [app.getUser().username, id_api], function(tx, results){
                            $container.prepend('<div class="alert alert-success" role="alert"><strong>Yeyy!</strong> Removido de tus favoritos! </div>');
                            $target.removeClass('active'); 
                        
                        }, function error(tx, err) {
                            $container.prepend('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> Ha ocurrido un error, intenta más tarde. </div>');
                            console.log(err);
                        });
                    });                  
                     
                } else {
                  
                    dbManager.getAccess().transaction(function(tx){
                        
                        tx.executeSql('INSERT INTO favorites (username, id_api, datecreated) VALUES(?,?,?)', [app.getUser().username, id_api, new Date()], function(tx, results){
                            $container.prepend('<div class="alert alert-success" role="alert"><strong>Yeyy!</strong> Guardado en favoritos! </div>');
                            $target.addClass('active');
                        
                        }, function error(tx, err) {
                            $container.prepend('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> Ha ocurrido un error, intenta más tarde. </div>');
                            console.log(err);
                        });
                    });
                }
                setTimeout(function() {
                   $container.find('div.alert').remove();
                }, 3000);
            }
        }
        
       function onClickStreetView(e) {
            e.preventDefault();
            
            $('#wrapper-streetview').empty();
            
            var lat = $(this).data('lat');
            var lng = $(this).data('lng');            
            
            //Map Instance
            var map  = new GoogleMap ({
                'lat'         : lat,
                'long'        : lng,
                'zoom'        : 14,
                'wrapper'     : 'wrapper-streetview'
            });

            //Map initialization
            map.initMap();
            map.streetView();
            window.location.hash = '#streetView';
       }        
        
       function onItemPropiedadClick(e) {
           e.preventDefault();
           window.location.hash = $(this).attr('href');
       }
           
       function onApplyFilters(e) {
           e.preventDefault();
            
           if($('select#type').val() != 0) {        
               var hash   = '';
               var params = 0;
               
               if($('select#type').val() == 'Casa') {
                   hash = '#buscar-casas';
               } else {
                   hash = '#buscar-apartamentos';
               }
               
               filters = {
                   'localidad' : $('select#localidad').val(),
                   'operation' : $('select#operation').val(),
                   'condition' : $('select#condition').val()
               }
               /**
               if($('select#localidad').val() != 0) {
                   params++;
                   hash += '?loc='+$('select#localidad').val();
               }
               
               if($('select#operation').val() != 0 ) {
                   params++;
                   hash += ( params > 0) ? '&operation='+$('select#operation').val() : '?operation='+$('select#operation').val();
               }

               if($('select#condition').val() != 0 ) {
                   params++;
                   hash += ( params > 0) ? '&condition='+$('select#condition').val() : '?condition='+$('select#condition').val();
               }*/
               
               window.location.hash = hash;
               
           } else {
               $('#filters').prepend('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> Debes seleccionar un tipo de propiedad</div>') 
           
               setTimeout(function(){
                   $('#filters').find('div.alert').remove();
               }, 3000);
           }
       }
       
       function initDb() {
           dbManager = new DataBaseManager();
           dbManager.connect({'db' : 'db_casas', 'version' : '1.0',  'description' : 'BDCasas', 'size' : 1024*1024*5});
       }
       
       function initSlider(){
         $slider.bxSlider({
             auto: true
          });
       }
       
       function onHashChange(e) {
           var hash    = window.location.hash;
           var arrHash = null;
           
           showLoader();
           resolveMenuClick();
 
           if(hash != '') {
               var arrHash = hash.split('?');
               hash = arrHash[0];
           }   
           
           if(hash == '') { //inicio
              home.init();
              favorites.out();
              
           } else if(hash == '#buscar-casas') { // buscar casas
               home.out();   
               favorites.out();
               finderApartment.out();
               finderHome.init(filters);
               
           } else if(hash == '#buscar-apartamentos') { // buscar apartamentos
               finderHome.out();
               favorites.out();
               finderApartment.init(filters);
               
           } else if(hash == '#favoritos') {
               
               if(currentUser == null) {
                   window.location.hash = '#inicio';
                   return;
               }
               
               home.out();   
               finderApartment.out();              
               finderHome.out();
               favorites.init();
               
           } else if(hash == '#detalle-propiedad') { // detalle propiedad
              finderHome.out();
              favorites.out();
              finderApartment.out();
              
              if(arrHash[1] != undefined) {
                 
                 var str      = arrHash[1].split('=');
                 var inmueble = new Inmueble();    
                 inmueble.loadDetail(str[1]);
              }  
           } else if(hash == '#filtrosCasas' || hash == '#login' || hash == '#registro' || hash == '#perfil') {
               
               if(hash == '#perfil' && currentUser == null) {
                   window.location.hash = '#inicio';
                   return;
               }
               
               hideLoader();
           }
           
           //Vacio los filtros
           filters = null;
       }
       
       function showLoader() {
            $.mobile.loading( "show", {
                textVisible: true,
                text : "Cargando...",
                theme: "a"
            });
       }
       
       function hideLoader() {
           setTimeout(function () {
               $.mobile.loading('hide');
           }, 1000);
       }
       
       function resolveMenuClick() {
            
           setTimeout(function() {

               var id = $('div[data-role="page"].ui-page-active').find('div[data-role="panel"]').attr('id');
               $menuBtn.attr('href' , '#'+id);
               console.log('Resolviendo', id);
               
           }, 800);    
       }
       
       function populateDB() {
            //Populate inmuebles
            api.getAllInmuebles();
            //Populate usuarios
            dbManager.populateUsers();
            dbManager.createFavoritesTable();
            
            // Populate select deptos    
            dbManager.getAccess().transaction(function(tx){
                tx.executeSql('SELECT DISTINCT (city) FROM inmuebles ORDER BY city', [], function(tx, results) {
    
                    var l = results.rows.length;
                    var i   = 0;
                    
                    for ( ; i < l ; i++ ) {
                        $('select#localidad').append('<option value="'+results.rows.item(i).city+'">'+results.rows.item(i).city+'</option>')
                    }
                });
            });
            
            // Populate select operation    
            dbManager.getAccess().transaction(function(tx){
                tx.executeSql('SELECT DISTINCT (operation) FROM inmuebles ORDER BY operation', [], function(tx, results) {
    
                    var l = results.rows.length;
                    var i   = 0;
                    
                    for ( ; i < l ; i++ ) {
                        $('select#operation').append('<option value="'+results.rows.item(i).operation+'">'+results.rows.item(i).operation+'</option>')
                    }
                });
            });
            
            // Populate select condition    
            dbManager.getAccess().transaction(function(tx){
                tx.executeSql('SELECT DISTINCT (condition) FROM inmuebles ORDER BY condition', [], function(tx, results) {
    
                    var l = results.rows.length;
                    var i   = 0;
                    
                    for ( ; i < l ; i++ ) {
                        $('select#condition').append('<option value="'+results.rows.item(i).condition+'">'+self.fixConditionName(results.rows.item(i).condition)+'</option>')
                    }
                });
            });
       }
       
       function changeView() {
           
            $('#loginButton').css({'display' : 'none'});
            $('#header-username').css({'display' : 'inline-block'});
            $('#header-username').text('Hola '+currentUser.name+'!');
            $('div[data-role="footer"]').find('div[data-role="navbar"]').find('ul').prepend('<li class="ui-block-a"><a href="#favoritos" data-icon="star" class="ui-link ui-btn ui-icon-star ui-btn-icon-top">Favs</a></li>');
            $('#favoritos').find('p.titulo').text('Tus propiedades favoritas '+currentUser.name+':');
            $('div#menu-inicio').find('a[href="#registro"]').parent().css({'display' : 'none'});
            
            // Datos del perfil
            $('#perfil-name').text(currentUser.name);
            $('#perfil-surname').text(currentUser.surname);
            $('#perfil-email').html('<a href="mailto:'+currentUser.email+'">'+currentUser.email+'</a>');
            $('#perfil-phone').html('<a href="tel:'+currentUser.phone+'">'+currentUser.phone+'</a>');            
            $('#perfil-username').text(currentUser.username);      
            
            $('#inicio').trigger('create');
       }
       
       self.fixConditionName = function(str) {
            if(str == 'new') {
                return 'Nuevo';
            } 
            
            if(str == 'used') {
                return 'Usado';
            }
            
            if(str == 'not_specified') {
                return 'No especificado';
            }
            
            return str;
       }
       // Public methods
       self.hideLoader = function (argument) {
           hideLoader();
       }
       
       self.getDB = function () {
           return dbManager;
       }
       
       self.showLoginAlert = function(status, msg) {
           if(status) {
               $loginForm.prepend('<div class="alert alert-success" role="alert"><strong>Yeyy!</strong> '+msg+'</div>');
               window.history.back();
               setTimeout(function() {
                 window.location.reload();
               }, 1000)
               
           } else {
               $loginForm.prepend('<div class="alert alert-danger" role="alert"><strong>Oops!</strong> '+msg+'</div>');
           }
           
           setTimeout(function() {
               $('#login').find('input').removeClass('error');
               $('#login').find('div.alert').remove();
           }, 3000);
       }
       
       self.getUser = function() {
           return currentUser;
       }
       
       self.getAPI = function() {
           return api;
       }
       
       //PhoneGap functions
       function onDeviceReady() {
            self.init();
       }
       
       function getConnection() {
			
			try { 
			    var networkState = navigator.connection.type;
			    
			} catch(e){
			    return true
			}
			
			var states = {};
			states[Connection.UNKNOWN]  = 'Unknown connection';
			states[Connection.ETHERNET] = 'Ethernet connection';
			states[Connection.WIFI]     = 'WiFi connection';
			states[Connection.CELL_2G]  = 'Cell 2G connection';
			states[Connection.CELL_3G]  = 'Cell 3G connection';
			states[Connection.CELL_4G]  = 'Cell 4G connection';
			states[Connection.CELL]     = 'Cell generic connection';
			states[Connection.NONE]     = 'No network connection';
		
			if(networkState == Connection.WIFI ||  networkState == Connection.CELL_3G || networkState == Connection.CELL_4G || networkState == Connection.WIFI) {
				return true
			}
		
			return false
	    }
   }
    
    window.App = Application;

    $(document).ready(function(){
        app = new App()
    });
    
}) (window);