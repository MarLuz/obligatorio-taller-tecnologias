/**
 * @author Martin Luz
 * @version 1.0
 * Model User 
 */
 
;(function(w) {
    
    'use strict';
    
    function User() {
        
        var self = this;
        var db   = app.getDB();
        
        //Fields
        var name;
        var surname;
        var email;
        var username;
        var password;
        var phone;
        
        self.load = function(data) {
           name     = data.name;
           surname  = data.surname;
           username = data.username;
           email    = data.email;
           phone    = data.phone;            
        }
        
        self.findByUserAndPass = function(user, pass) {
            
            db.getAccess().transaction(function(tx){
            
                tx.executeSql('SELECT * FROM usuarios WHERE username=? AND password=?', [user, md5(pass)], function(tx, result){
                   if(result.rows.length == 0) {
                        app.showLoginAlert(false, 'El usuario y/o contraseña no son correctos.');  
                   } else {
                       
                       self.load(result.rows[0]);
                       localStorage.setItem('user', self.getPlainObj());
                       app.showLoginAlert(true, 'Login realizado correctamente, redirigiendo...');
                   }
                   
                }, function error(tx, err) {
                    //alert("Ha ocurrido un error. Vuelve a intentar más tarde");
                    console.log(err);

                });
            });
        }
        
        self.getPlainObj = function() {
            return JSON.stringify({
                'name'     : name,
                'surname'  : surname,
                'username' : username,
                'email'    : email,
                'phone'    : phone
            });
        }
        
    }
    
    User.getStaticUsers = [
        {'name' : 'Martín', 'surname' : 'Luz', 'email' : 'mluzdesign@gmail.com', 'phone' : '123456', 'username' : 'mluz', 'password' : md5('123') ,'datecreated' : new Date() }
    ];
    
    w.User = User;
    
})(window);