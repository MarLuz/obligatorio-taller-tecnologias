; (function(window) {
	/***
	 * Utils
	 * @constructor
     */
	function Utils() {
		var self         	   = this;
		var regExpEmail  	   = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
		var regExpUrl    	   = new RegExp(/^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?$/i);
		var regExpTel    	   = new RegExp(/^\d+$/);
		var regExpCel    	   = new RegExp(/^\d{9}$/);
		//var regExpName 	       = new RegExp(/^[A-Z][-'a-zA-Z]+,?\s[A-Z][-'a-zA-Z]{0,19}$/);
		var regExpName         = new RegExp(/^([a-z ñáéíóú]{2,60})$/i);
		var regExpDate   	   = new RegExp(/^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/);
		var regExpCodigoPostal = new RegExp("\\d{5}(-\d{4})?");
		var regExpYear         = new RegExp(/^19[0-9]{2}|2[0-9]{3}$/);
		var regExpUserName     = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/);
		var regExpPrice        = new RegExp(/^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/);
		/**
		 * [validEmail description]
		 * @param  {[type]} email [description]
		 * @return {[type]}       [description]
		 */
		self.validEmail = function(email) {
    		return regExpEmail.test(email);
		}
		/**
		 *
		 * @param codigo
		 * @returns {boolean}
         */
		self.validCodigoPostal = function(codigo) {
			return regExpCodigoPostal.test(codigo);
		}
		/**
		 *
		 * @param year
		 * @returns {boolean}
         */
		self.validYear = function(year) {
			return regExpYear.test(year);
		}

		/**
		 * [validUrl description]
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		self.validUrl = function(url) {
			return regExpUrl.test(url);
		}
		/**
		 * [validTel description]
		 * @param  {[type]} tel [description]
		 * @return {[type]}     [description]
		 */
		self.validPhone = function(tel) {
            tel = tel.replace(/(\()|(\))|(\-)|(\.)|(\+)|(\ )/g,'');
            if(tel.length != 8) {
				return false;
			} else {
				return regExpTel.test(tel);
			}
		}
		/**
		 *
		 * @param tel
		 * @returns {boolean}
         */
		self.validCel = function(tel) {
			tel = tel.replace(/(\()|(\))|(\-)|(\.)|(\+)|(\ )/g,'');
			return regExpCel.test(tel);
		}
		/**
		 *
		 * @param string
		 * @returns {boolean}
         */
		self.validUserName = function(string) {
			return regExpUserName.test(string);
		}

		/**
		 * [validNombre description]
		 * @param  {[type]} str [description]
		 * @return {[type]}     [description]
		 */
		self.validName = function(str) {
			return regExpName.test(str);
		}

		function capitalizeFirstLetter(str) {
			str = str.toLowerCase().split(' ');

			for(var i = 0; i < str.length; i++){
				str[i] = str[i].split('');
				str[i][0] = str[i][0].toUpperCase();
				str[i] = str[i].join('');
			}
			return str.join(' ');
		}
	    /**
	     * [validPass description]
	     * @param  {[type]} pass [description]
	     * @return {[type]}      [description]
	     */
	    self.validPass = function (pass) {
	        reNum = /[0-9]/;
	        reAlf = /[a-z]/;

	        return reNum.test(pass) && reAlf.test(pass);
	    }

		self.validatePrice = function (price) {
			return regExpPrice.test(price);
		}

		/**
		 * [configAjax description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		self.configAjax = function(callback) {
			$.ajaxStart(function() {
				callback();
			});

			$.ajaxStop(function(callback) {
				callback();
			});
		}

		/**
		 * [validDate description]
		 * @param  {[type]} date [description]
		 * @return {[type]}      [description]
		 */
		self.validDate = function(date) {

			if(!regExpDate.test(date)) {
				return false;
			}

			var arr        = date.split('/');
			var actualDate = new Date();
			var year       = actualDate.getFullYear();

			var compareDate = actualDate.getDate() + '/' + (actualDate.getMonth() + 1) + '/' + actualDate.getFullYear();

			if(arr.length < 3)
				return false;

			if(typeof arr == 'undefined') {
				return false;
			}

			if(arr[0] < 1 || arr[0] > 31) {
				return false;
			}

			if(arr[1] < 1 || arr[1] > 12) {
				return false;
			}


			if(arr[2] < 1 || arr[2] < year) {
				return false;
			}

			if(new Date(arr[2], (arr[1] - 1), arr[0]) < actualDate.setHours(0,0,0,0)) {
				return false;
			}

			return true;
		}
		/**
		 * [validNacimiento description]
		 * @param  {[type]} date [description]
		 * @return {[type]}      [description]
		 */
		self.validNacimiento = function(date) {
			var arr        = date.split('/');
			var actualDate = new Date();
			var year       = actualDate.getFullYear();

			var compareDate = actualDate.getDate() + '/' + (actualDate.getMonth() + 1) + '/' + actualDate.getFullYear();

			if(arr.length < 3) {
				return false;
			}
			if(typeof arr == 'undefined') {
				return false;
			}

			if(arr[0] < 1 || arr[0] > 31) {
				return false;
			}

			if(arr[1] < 1 || arr[1] > 12) {
				return false;
			}

			if(arr[2] < 1 || arr[2] > year) {
				return false;
			}

			return true;
		}

		/**
		 * [getActualDate description]
		 * @return {[type]} [description]
		 */
		self.getActualDate = function() {
			var actualDate = new Date();
			return actualDate.getDate() + '/' + (actualDate.getMonth() + 1) + '/' + actualDate.getFullYear();
		}
		/**
		 * [getTomorrowDate description]
		 * @return {[type]} [description]
		 */
		self.getTomorrowDate = function() {
			var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			return tomorrow.getDate() + '/' + (tomorrow.getMonth() + 1) + '/' + tomorrow.getFullYear();
		}
		/**
		 * [optimizeUrl description]
		 * @param  {[type]} text [description]
		 * @return {[type]}      [description]
		 */
		self.optimizeUrl = function(text)
		{
			//return $.trim(text).replace(/ /g, '-').toLowerCase();
			txt = $.trim(text).replace(/ /g, '-');
			txt = txt.replace(/ó/g, 'o');
			txt = txt.replace(/á/g, 'a');
			txt = txt.replace(/í/g, 'i');
			txt = txt.replace(/é/g, 'e');
			txt = txt.replace(/\(|\)/g, '');
			txt = txt.replace(/\./g,'');
			txt = txt.replace(/\//g, "-");

			return txt.toLowerCase();
		}
		/**
		 *
		 * @param text
		 * @returns {string}
         */
		self.keyOptimize = function(text) {
			txt = $.trim(text).replace(/ /g, '');
			txt = txt.replace(/ó/g, 'o');
			txt = txt.replace(/á/g, 'a');
			txt = txt.replace(/í/g, 'i');
			txt = txt.replace(/é/g, 'e');
			txt = txt.replace(/\(|\)/g, '');
			txt = txt.replace(/\./g,'');
			txt = txt.replace(/\//g, "-");

			return txt.toLowerCase();
		}

		/**
		 * Retorna un booleano dependiendo de si es o no ie
		 * @param userAgent
		 * @returns {boolean}
         */
		self.isIE = function (userAgent) {
			userAgent = userAgent || navigator.userAgent;
			return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
		}
		/**
		 * Valida un formulario en cuestion
		 * @param $form
		 * @returns {boolean}
         */
		self.validateForm = function ( $form ) {

			var ok  = true;
			var msg = '';

			$form.find('div.msg').find('p').text('');
			$form.find('div.msg').removeClass('active');
			$form.find('label.label-check').removeClass('error');
			$form.find('input').removeClass('error');
			$form.find('textarea').removeClass('error');

			$form.find('input').each(function() {

				if(eval($(this).data('required')) && ok) {

					if(ok) {
						switch($(this).data('validate')) {
							case 'name' :
								if(!self.validName($(this).val()) || $.trim($(this).val()).length == 0) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
							break;

							case 'username' :
								if(!self.validUserName($(this).val()) || $.trim($(this).val()).length == 0) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'password' :
								if(!self.validPass($(this).val()) || $.trim($(this).val()).length == 0) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'email' :
								if(!self.validEmail($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'year' :
								if(!self.validYear($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'number' :
								if(!self.validatePrice($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'tel' :
								if(!self.validPhone($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'cel' :
								if(!self.validCel($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'zipcode' :
								if(!self.validCodigoPostal($(this).val())) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
								break;

							case 'checkbox' :

								if(!$(this).prop( "checked" )) {
									$(this).parent().addClass('error');
									$(this).focus();
									ok = false;
								}
							break;


							default :
								if( $.trim($(this).val()).length == 0 ) {
									$(this).addClass('error');
									$(this).focus();
									ok = false;
								}
						}
					}

					if(!ok) {
						msg = $(this).data('error');
					}
				}
			});

			if(ok) {
				$form.find('textarea').each(function() {

					if(eval($(this).data('required')) && ok) {
						if($.trim($(this).val()).length == 0) {
							$(this).addClass('error');
							$(this).focus();
							ok = false;
						}
					}

					if(!ok) {
						msg = $(this).data('error');
					}
				});
			}

			if(ok) {
				$form.find('select').each(function() {

					if(eval($(this).data('required')) && ok) {
						if($(this).val() == 0) {
							$(this).addClass('error');
							$(this).focus();
							ok = false;
						}
					}

					if(!ok) {
						msg = $(this).data('error');
					}
				});
			}

			if(!ok) {
				$form.prepend('<div class="alert alert-danger" role="alert" id="errorMessage"><strong>Oops!</strong> '+msg+'</div>');

				setTimeout(function () {
					$form.find('div#errorMessage').remove();
					$form.find('input').removeClass('error');
				}, 3000);
			}

			return ok;
		}
		/**
		 * Limpia los inputs/textares/etc
		 * @param $form
         */
		self.empty = function ($form) {
			console.log($form);
			$form.find('input').each(function() {
				$(this).val('');
				$(this).parent().removeClass('input--filled');
			});

			$form.find('textarea').each(function() {
				$(this).val('');
			});

			$form.find('select').each(function() {
				$(this).val(0);
			});

			$form.find('input[type="radio"]').each(function() {
				$(this).prop('checked' , '');
			});

			$form.find('input[type="checkbox"]').each(function() {
				$(this).prop('checked' , '');
			});
		}

		self.urlClean = function (str) {

			str = str.replace(/\./g,' ');
			str = str.replace(/\//g, ' ');
			str = str.replace(/\"/g, ' ');

			return str;
		}
	}

	window.Utils = Utils;

})(window);


var isMobile = 
{
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

/**
 * [calculateReadingTime description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function calculateReadingTime(id) 
{
	var palabrasporminuto = 300;
	var imagenesporminuto = 30;
	var contenidopost = document.getElementById(id);

	var img    = contenidopost.getElementsByTagName("img");
	var numimg = img.length;
	var strx   = contenidopost.innerHTML;
	
	if(strx.indexOf("<")!=-1) 
	{
		var s = strx.split("<");
		for(var i=0;i<s.length;i++)
		{
			if(s[i].indexOf(">")!=-1)
			{
				s[i] = s[i].substring(s[i].indexOf(">")+1,s[i].length);
			}
		}
		strx = s.join("");
	}

	var blancoinicial = /^ /;
	var blancofinal = / $/;
	var blancosjuntos = /[ ]+/g;
	strx = strx.replace(blancosjuntos," ");
	strx = strx.replace(blancoinicial,"");
	strx = strx.replace(blancofinal,"");

	var palabras = strx.split(" ");
	var numpalabras = palabras.length;

	var minutos = parseInt((numpalabras/palabrasporminuto)+(numimg/imagenesporminuto));
	var segundos = parseInt((((numpalabras/palabrasporminuto)+(numimg/imagenesporminuto))-minutos)*60);
	segundos= ("0" + segundos).slice (-2);

	return minutos;
}

function ucwords(str)
{
	return (str + '')
		.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
			return $1.toUpperCase();
		});
}
