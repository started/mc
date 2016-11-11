[include "/js/comparator.js"]


var Marketcar = (function($, Fizzmod, window, undefined){

	var self;



	var Marketcar = {

		initialize: function() {
			self = this;

			Marketcar.headerShowed = false;
			self.mouseIsOverMenu = false;
			self.mouseIsOverSubMenu = false;

			self.productsArray = [];

			self.setHBHelpers();

			$(document).ready(self.documentReady);

			self.chosenFilters = "{";

			return self;
		},

		documentReady: function() {
			self.menuMobile();
			self.searchWord();
			self.searchAutocomplete();
			self.setChecboxes();
			self.addArrows();
			self.setMainSlider();
			self.setFilters();
			self.updateMiniCart();
			self.setProductSliders();

			$(".resultados").perfectScrollbar();
			$("header .nav-1 .pre-cart ul").perfectScrollbar();

			Fizzmod.MasterData.setStore("marketcar");

			$(document)
				.on("submit", "header .search", self.search)
				.on("submit", "footer .newsletter form", self.suscribeNewsletter)
				.on("click", "footer .retry", function(){
					$("footer .newsletter").removeClass("hide");
					$("footer .wrong-email, footer .fail").addClass("hide");
				})
				.on("click",".btn-mp", self.toggleMercadoPago)
				.on("click", ".selector .label", Selector.toggleDisplay)
				.on("click", ".selector .option", Selector.selectOption)
				.on("click", "body", Selector.closeOnClickOutside)
				.on("click", ".chosen-container .chosen-results li.active-result", self.chooseFilters)
				.on("click", ".home #tabs-1 .col-4 button", function(e){
					e.preventDefault();
					self.sendFilters();
				})
				.on("click",".btn.chat",self.openChat)
				.on("mouseenter", "header .nav-2.menu-desplegable", function(){
					self.mouseIsOverMenu = true;
				})
				.on("mouseleave", "header .nav-2.menu-desplegable", function(){
					self.mouseIsOverMenu = false;

					setTimeout(function(){
						if(!self.mouseIsOverMenu && !self.mouseIsOverSubMenu && Marketcar.headerShowed){
							$(".detalle .header-detalle").slideDown();
							$(".list-page.stick-filters .modulo.filtros").css({'visibility': 'visible'});;
						}
					},300)

				})
				.on("mouseenter", "header .sub-menu.menu-desplegable", function(){
					self.mouseIsOverSubMenu = true;
				})
				.on("mouseleave", "header .sub-menu.menu-desplegable", function(){
					self.mouseIsOverSubMenu = false;

					setTimeout(function(){
						if(!self.mouseIsOverMenu && !self.mouseIsOverSubMenu && Marketcar.headerShowed){
							$(".detalle .header-detalle").slideDown();
							$(".list-page.stick-filters .modulo.filtros").css({'visibility': 'visible'});;
						}
					},300)

				});

		},

		openChat: function() {
			$(".zopim").eq(0).find("iframe").contents().find(".meshim_widget_components_chatButton_Button").click();
		},

		setProductSliders: function(){
			if($("body").hasClass("home") || $("body").hasClass("product")){
				$(".helperComplement").remove();

				slider = $('.product-list > ul').bxSlider({
					slideWidth:201,
					minSlides:5,
					maxSlides:5,
					moveSlides:1
				});
				
			}
		},

		search: function(e){
			e.preventDefault();
			console.log("SEARCH:")
			console.log($this);
			window.location.href = "/" + encodeURI($(this).find("input").val());
		},

		menuMobile: function(){
			
			$(".btn-productos").on('click', function(event) {
				event.preventDefault();
				console.log("click menu");
				$('.menu-desplegable').toggleClass('show-menu');
				$('.search.stick').toggleClass('hide');
			});
		},

		searchWord: function(){
			if (!($("body").hasClass("search-result") || $("body").hasClass("busqueda-vacia"))) return;

			var searchWord = decodeURI(window.location.href.split("/")[3]) != "Sistema" ? decodeURI(window.location.href.split("/")[3]) : window.location.href.split("=")[1];

			if(searchWord.match(/(=|\{|\}|\?|\(|\)|:|\&)/g))
				$(".list-page .modulo.resultado .titulo-sessao").text("Resultados de Búsqueda");
			else{
				$(".busqueda-vacia .empty-search .search-word").text('"' + searchWord + '"')
				$(".list-page .modulo.resultado .titulo-sessao").text("Resultados de Búsqueda para: " + searchWord);
			}

		},

		searchAutocomplete: function() {

			var noResults = '<p>No se encontraron resultados</div>';
			var delay = (function(){
				var timer = 0;
				return function(callback, ms){
					clearTimeout (timer);
					timer = setTimeout(callback, ms);
				};
			})();
			var searchAutocomplete;
			$("header .nav-2 .search input").keyup(function(event) {

				var t = $(this);
				var p = $(".resultados");
				var val = t.val();
				var quantity = 10;
				if(val != "") {
					delay(function(){
						if(searchAutocomplete != undefined) {
							searchAutocomplete.abort();
						}
						searchAutocomplete = $.ajax({
							url: '/api/catalog_system/pub/products/search?ft=' + encodeURIComponent(val),
							type: 'GET',
							beforeSend: function(){
								//reset results
								p.find(".item").remove();
								p.removeClass("ready");
								p.addClass("loading");
								p.show();
							},
							success: function(res){

								p.removeClass("loading");
								p.addClass("ready");

								if(res.length > 0){
									$.each(res, function(index,item){
										p.append('<a href="' + item.link + '" class="item"><p>' +
												  item.brand.toUpperCase() + ' - ' +
												  item.productName.replace(" - "," ") +
												  '</p></a>')
									});
									$(".resultados").perfectScrollbar("update");
								}
								else {
									p.append('<p class="item">No se encontraron resultados</p>');
								}
							}
						});
					}, 750);
				}
				else {
					p.removeClass("ready loading");
					p.hide();
				}
			})
			.focus(function(event){
				$(".resultados").show();
			})
			.click(function(){
				$(".resultados").show();
			});

			$(document).on("mouseleave", ".search", function(){
				$(".resultados").hide();
			});
		},

        updateMiniCart: function(){

			if(!$("header .nav-1 .pre-cart .script").length) $("header .nav-1 .pre-cart ul").before('<script id="item-mini-cart" type="text/x-jquery-tmpl"><li><a href="${link}"><img src="${img}" /></a><div class="detalle"><h2 class="tit productName">${name}</h2><h3 class="descripcion">${description}</h3><p class="cantidad">Cantidad: ${qty}</p><p class="precio bestPrice">${price}</p></div><div class="cerrar"></div></li></script>');

			var totalValue = 0;

			// Update total price and quantity badge
        	function updatePriceQty (orderForm){
			    var itemsQty = 0;
				$.each(orderForm.items, function(i){
					itemsQty += orderForm.items[i].quantity;
					totalValue += (orderForm.items[i].price * orderForm.items[i].quantity);
				})

				$("header .nav-1 .pre-cart .total .numero, header .nav-1 .carrito .info p+p").text(Fizzmod.Utils.formatPrice(totalValue / 100, ',', '.', 2, "$"));
				$("header .nav-1 .carrito .icono .num p").text(itemsQty);
        	}


			vtexjs.checkout.getOrderForm().done(function(orderForm){
				var data;
				$("header .nav-1 .pre-cart ul").empty();

				if(orderForm.items.length) $("header .nav-1 .pre-cart ul").addClass("has-items");
				else $("header .nav-1 .pre-cart ul").removeClass("has-items");


				$.each(orderForm.items, function(i){
					var item = this;
					data = {
						skuId: item.id,
						name: item.name,
						description: item.additionalInfo.brandName,
						price: Fizzmod.Utils.formatPrice(item.price / 100, ',', '.', 2),
						img: item.imageUrl,
						link: item.detailUrl,
						qty: item.quantity,
						index: i
					}
					$("#item-mini-cart").tmpl(data).appendTo($("header .nav-1 .pre-cart ul"));
				})

				$("header .nav-1 .pre-cart ul li .cerrar").on("click", self.removeItemMiniCart);
				$("header .nav-1 .pre-cart ul.has-items").perfectScrollbar("update")

				updatePriceQty(orderForm);
			});

        },

        removeItemMiniCart: function(){
        	var index = $(this).parents('li').data('index');

        	$(this).parent().children().css("opacity",".3").end().prepend('<div class="cssload-loader"></div>');

			vtexjs.checkout.getOrderForm().then(function(orderForm){
			    var item = orderForm.items[index];
			    item.index = index;
			    return vtexjs.checkout.removeItems([item]);
			}).done(function(orderForm){
				self.updateMiniCart();
			});

        },


		setFilters: function(){
			if($("body").hasClass("home")){
				$.get("http://www.marketcar.vtexcommercestable.com.br/api/catalog_system/pub/facets/search/neumaticos/?map=c", function(res){
					for(var filterName in res.SpecificationFilters){
						for(var filterOption in res.SpecificationFilters[filterName]){

							var filters = res.SpecificationFilters[filterName];

							if(filters[filterOption].Name){
								var filterOption = filters[filterOption];

								$('#tabs-1 select[data-filter-name="' + filterName +'"]')
								.append('<option data-filter-option=' +
										filterOption.Name +
										' data-filter-link=' +
										filterOption.Link +'>' +
										filterOption.Name
										+ '</option>');
							}
						}
					}

					// Sort filter's option

					$("#tabs-1 select").each(function(){
						options = $(this).find("option")
						options.sort(function(a,b){
						    a = a.value;
						    b = b.value;

						    return a - b;
						});
						$(this).html(options);
						$(this).prepend('<option selected>Seleccione...</option>');
					})

					/*chosen-select*/
					$(".chosen-select").chosen({disable_search_threshold: 10});
				});
			}
		},

		chooseFilters: function() {

			if($("body").hasClass("mis-pedidos")) return;

			var i = $(this).data("option-array-index")
			var filter = $(this).parents(".col").find("select option").eq(i).data("filter-link").split("_")[1];
			var option = $(this).parents(".col").find("select option").eq(i).data("filter-option");

			if(!Number(option)){
				if(option.indexOf(",") == -1){
					option = '"' + option + '"';
				}
				else
					option = parseFloat(option.replace(",","."))
			}

			if(self.chosenFilters.length != 1){
				self.chosenFilters = self.chosenFilters.slice(0,-1);
				self.chosenFilters += ',"' + filter + '":' + option;
			}
			else
				self.chosenFilters += '"' + filter + '":' + option;

			self.chosenFilters += "}";
		},

		sendFilters: function(){
			if(self.chosenFilters.length > 1)
				window.location.href = "/neumaticos?filters=true&" + self.chosenFilters;
		},

		setHBHelpers: function() {
			Handlebars.registerHelper("inc", function(value, options)
			{
			    return parseInt(value) + 1;
			});
		},

		setMainSlider: function() {
			var controls = false;
			if($('#main-slider').children().length > 1) controls = true;
			$('#main-slider').bxSlider({
				auto: true,
				pause: 4000,
				mode: 'fade',
				controls: controls
			});

		},

		setChecboxes: function(){
			//icheck
			$('input').iCheck({
				checkboxClass: 'icheckbox',
				radioClass: 'iradio',
				hoverClass: 'ihover',
				labelHoverClass: 'ihover',
			});
		},

		addArrows: function(){
			$( ".modulo.detalle-producto .economia-de" ).append( '<div class="punta"></div>' );
		},

		toggleMercadoPago: function(e){
			e.preventDefault();
			$('.mp').slideToggle("slow","swing", function(){
				$(".wrap-scroll").getNiceScroll().resize();
				$('.wrap-scroll').scrollTo($('.wrap-scroll iframe'), 800);
			});
		},

		onClickNav: function() {
			var data = $(this).data();
			$(this).addClass("stores-nav-active");
			$(".stores-nav-buttons").not($(this)).removeClass("stores-nav-active");

			$(".stores-subnav-buttons").removeClass('stores-subnav-active');
			$(".stores-box").removeClass('stores-box-active');
		},

		suscribeNewsletter: function(e) {
			e.preventDefault();
			if (Fizzmod.Utils.isEmail($("footer .newsletter input").val())){
				Fizzmod.MasterData.newsletter($("footer .newsletter input").val()).done(function(res) {
					$("footer .newsletter").addClass("hide");
					$("footer .success").removeClass("hide");
				}).fail(function(error) {
					$("footer .newsletter").addClass("hide");
					$("footer .fail").removeClass("hide");
				});
			}
			else {
				$("footer .newsletter").addClass("hide");
				$("footer .wrong-email").removeClass("hide");
			}
		}
	};

	var Selector = {

		slideSpeed: 250,

		toggleDisplay: function() {
			var $this = $(this),
				$wrapper = $this.closest(".selector")

			$wrapper
				.toggleClass("active")
				.children(".options")
				.stop(true, true)
				.slideToggle(Selector.slideSpeed, function() {$(this).css("overflow", "")});
		},

		selectOption: function() {
				var $this = $(this);

				$this
					.closest(".selector")
					.find(".label .value")
					.text($this.text())
					.click();
		},

		closeOnClickOutside: function(event) {
			$(".selector.active").each(function() {
				var $selector = $(this);

				if(!$selector.has(event.target).length) {
					$selector
						.removeClass("active")
						.children(".options")
						.stop(true, true)
						.slideUp(Selector.slideSpeed);
				}
			});
		}
	};

	return Marketcar.initialize();



})(jQuery, Fizzmod, window);



$(document).ready(function(){

	/********** generales ***********/
	//agregar flecha / detalle


	$('.pre-cart').on('click', function(e) {
		e.stopPropagation();
	});

	$(document).on('click', function(e) {
		$('.pre-cart').hide();
	});

	//fancybox
	$(".fancybox").fancybox({
		padding : 0,
		scrolling   : 'no',
		width: 650,
		autoHeight: true,
		autoSize : false,
		helpers : {
			overlay : {
				css : {
					'background' : 'rgba(35, 31, 32, 0.5)'
				},
				locked: true
			}
		},
		afterShow : function(){
			$('html').removeClass('popup-off');

			//nicescroll
			$(".wrap-scroll").niceScroll({
				cursorcolor:"#d0d2d3",
				cursorborder: 0,
				cursorborderradius:3,
				cursorwidth:'5px',
				background: '#f8f8f8',
				autohidemode: false
			}).resize();
		},
		afterClose : function(){
			$(".wrap-scroll").getNiceScroll().remove();
			$('.popup.banco').hide();
		},
		beforeClose : function(){
			$('html').addClass('popup-off');
		}
	});


	/*btn abrir segundo popup*/
	$(document).on('click',".btn-banco", function(evento){
		evento.preventDefault();
		$(this).closest('.wrap-banco').find('.popup.banco').show();
		$(".wrap-scroll").getNiceScroll().hide();
	});

	/*btn cerrar segundo popup*/
	$(document).on('click',".wrap-banco .btn.cerrar", function(evento){
		evento.preventDefault();
		$(this).closest('.wrap-banco').find('.popup.banco').hide();
		$(".wrap-scroll").getNiceScroll().show();
	});



	//accordion
	$("body").not(".mis-pedidos").find(".accordion").accordion({heightStyle: "content", collapsible: true});

	//datepicker
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '<Ant',
		nextText: 'Sig>',
		currentText: 'Hoy',
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['es']);
	$( ".datepicker" ).datepicker({
		beforeShow: function (input, inst) {
			setTimeout(function () {
				inst.dpDiv.css({
					top: '+=10px',
					left: '-=15px'
				});
			}, 0);
		}
	});

	//spinner
	$( ".spinner" ).spinner();

	/*home tabs*/
	$( "#home-tabs, #menu-tabs, #slider-tabs, #detalle-tabs" ).tabs({hide: 'fade', show: 'fade'});


	/*sub menu hover*/
	$('header .menu-desplegable li .wrap-hover').hover(
		//in
		function () {
			var item = $(this).closest('li').attr('class');
			$('.lista-preview .'+item).css({visibility: 'visible', opacity:'1'});
			$(this).closest('li').find('.wrap-hover').addClass('activo');
			$('.nav-2').find('.'+item).find('.wrap-hover').addClass('activo');
		},
		//out
		function () {
			var item = $(this).closest('li').attr('class');
			$('.lista-preview .'+item).css({visibility: 'hidden', opacity:'0'});
			$(this).closest('li').find('.wrap-hover').removeClass('activo');
			$('.nav-2').find('.'+item).find('.wrap-hover').removeClass('activo');
		}
	);

	/*btn filtro listado*/
	$(document).on('click',".filtro-1 .btn", function(evento){
		evento.preventDefault();
		$(this).closest('.filtro-1').toggleClass('active');
		$(this).closest('.filtro-1').find('.cols').slideToggle(500);
		return false;
	});

	/*menu btn*/
	$(document).on('click',"header li .btn", function(evento){
		evento.preventDefault();
		$(this).closest('li').toggleClass('active');
		$(this).closest('li').find('.dropdown, .pre-cart').toggle();
		return false;
	});

	//waypoints
	$('#waypoint').waypoint(function(direction){
		if(direction === 'down'){
			$("header").addClass('stick');
		}else if(direction === 'up'){
			$("header").removeClass('stick');
		}
	}, {
	  offset: '0'
	});

	//slider detalle producto
	$('.detalle-slider').bxSlider({
		pagerCustom: '#detalle-pager',
		controls:false
	});

	/*slider principal*/
	$('.slider-principal .slider').bxSlider({
		pager: false,
		nextSelector: '.slider-next-principal',
		prevSelector: '.slider-prev-principal',
		nextText: '',
		prevText: ''
	});

	/*slider 1*/
	$('.slider-1').bxSlider({
		minSlides: 2,
		maxSlides: 7,
		slideWidth: 135,
		slideMargin: 5,
		pager: false,
		nextSelector: '.slider-next-1',
		prevSelector: '.slider-prev-1',
		nextText: '',
		prevText: ''
	});

	/********** pagina listado ***********/
	//waypoints

	$('#filtros-waypoint').waypoint(function(direction){
		if ($(window).width() > 768) {
			if(direction === 'down'){
				Marketcar.headerShowed = true;
				$("body").addClass('stick-filters');
				if(window.location.href.indexOf("comparator") > -1){
					$(".footer-productos").addClass('stick');
					var topStick = window.innerHeight - 57 + "px";
		            $('.footer-productos.stick').animate({'top' : topStick},300);
				}
			}else if(direction === 'up'){
				Marketcar.headerShowed = false;
				$("body").removeClass('stick-filters');
	            $('.footer-productos.stick').animate({'top' : '100%'},300, function(){
					$(".footer-productos").removeClass('stick');
	            });
			}
		}
	}, {
	  offset: '0'
	});

	//show/hide head listado
	$('.modulo.productos li .btn.comparar input').on('ifChecked', function(event){
		$(".seccion.listado .header-listado").slideDown();
	});

	$('.modulo.productos li .btn.comparar input').on('ifUnchecked', function(event){

		var num = 0;
		$(this).closest('.modulo.productos').find(".btn.comparar input").each(function() {
			if($(this).closest('.icheckbox').hasClass('checked')){
				num++;
			}
		});

		num = num-1;
		if(num < 1){
			$(".seccion.listado .header-listado").slideUp();
		}
	});


	/********** pagina comparador ***********/
	//waypoints
	$('#waypoint-comparador').waypoint(function(direction){
		if(direction === 'down'){
			$(".header-comparador").addClass('stick').slideDown();
		}else if(direction === 'up'){
			$(".header-comparador").removeClass('stick').slideUp();
		}
	}, {
	  offset: '100'
	});

	//waypoints
	$('#waypoint-comparador-fin').waypoint(function(direction){
		if(direction === 'down'){
			$(".header-comparador").addClass('stick').slideUp();
		}else if(direction === 'up'){
			$(".header-comparador").removeClass('stick').slideDown();
		}
	}, {
	  offset: '100'
	});


	/********** pagina detalle ***********/
	//waypoints
	$('#waypoint-detalle').waypoint(function(direction){
		if(direction === 'down'){
			Marketcar.headerShowed = true;
			$(".header-detalle").slideDown();
		}else if(direction === 'up'){
			Marketcar.headerShowed = false;
			$(".header-detalle").slideUp();
		}
	}, {
	  offset: '0'
	});

	//tabs nav
	$(document).on('click',".detalle .header-detalle .icono", function(evento){
		evento.preventDefault();
		$('.menu li').removeClass("current");
		$(this).closest('li').addClass("current");
		$('body').scrollTo('#detalle-tabs-ancla', 200);
		var index = $(this).attr('tabindex');
		$("#detalle-tabs").tabs('option', 'active', index);
	});

	//slider
	$(document).on('click',".modulo.detalle-producto .imagen .thumbs li a", function(evento){
		evento.preventDefault();
		$(this).closest('ul').find('li').removeClass('active');
		$(this).closest('li').addClass('active');
		var index = $(this).closest('li').index();
		$(this).closest('.apresentacao').find("[productindex]").removeClass('active');
		$(this).closest('.apresentacao').find("[productindex='" + index + "']").addClass('active');

	});


	/********** pagina mis pedidos ***********/



	/********** pagina home ***********/
	function slider_home(numItem){
		slider = $('#slider-1-tab-'+numItem).bxSlider({
			minSlides: 2,
			maxSlides: 5,
			slideWidth: 175,
			slideMargin: 26,
			pager: true,
			nextSelector: '#slider-tab-next-'+numItem,
			prevSelector: '#slider-tab-prev-'+numItem,
			nextText: '',
			prevText: '',
		});

		setTimeout(slider.reloadSlider, 500);
	}

	slider_home(1);

	$(document).one('click',"#slider-tab-2 p", function(evento){
		evento.preventDefault();
		slider_home(2);
	});

	$(document).one('click',"#slider-tab-3 p", function(evento){
		evento.preventDefault();
		slider_home(3);
	});


	/********** seccion header ***********/
	function slider_header(numItem){
		$('#slider-menu-'+numItem).bxSlider({
			nextSelector: '#slider-next-menu-'+numItem,
			prevSelector: '#slider-prev-menu-'+numItem,
			nextText: '',
			prevText: '',
			pagerCustom: '#bx-pager-'+numItem,
		});
	}

	slider_header(1);
	slider_header(2);

	//hover in btn productos header
	$( "header .head .btn-productos" ).on( "mouseenter", function() {

		if(Marketcar.headerShowed){
			$(".detalle .header-detalle").slideUp();
			$(".list-page.stick-filters .modulo.filtros").css({'visibility': 'hidden'});;
		}

		$("header").addClass('hover');
		$(this).closest('header').find('.nav-2').css({position: 'fixed', marginTop: '0', top: '48px'});
		$(this).closest('header').find('.sub-menu.menu-desplegable').css({position: 'fixed', top: '89px'});

		$('body > .main').css({'marginTop': '121px'});
	  });

	$( "header" ).on( "mouseleave", function() {
		$("header").removeClass('hover');
		$(this).closest('header').find('.nav-2').css({position: 'relative', marginTop: '80px', top: '0'});
		$(this).closest('header').find('.sub-menu.menu-desplegable').css({position: 'relative', top: '0'});
		$('body > .main').css({'marginTop': '0'});
	});


	/************ seccion sucursales *********/

	function initMap() {

	  var latLng = {lat: -34.584043, lng: -58.445547};

	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: latLng,
	    zoom: 16
	  });

	  var marker = new google.maps.Marker({
	    position: latLng,
	    map: map,
		icon: "http://marketcar.vteximg.com.br/arquivos/pointer-on.png"
	});

	  marker.setMap(map);

	}

	if($("body").hasClass("sucursales")) initMap();

	/*

	//gomap
	$("#map").goMap({
		markers: [{
			id: 'map-1',
			latitude: '-34.803499',
			longitude: '-58.127269',
		},
		{
			id: 'map-2',
			latitude: '-35.803480',
			longitude: '-58.127269',
		},
		{
			id: 'map-3',
			latitude: '-34.803495',
			longitude: '-59.127269',
		}],
		icon: '/arquivos/pointer-off.png',
		hideByClick:   false,
		maptype: 'ROADMAP',
		scrollwheel: false,
		zoom: 16,
	});

	//$.goMap.fitBounds('visible');

	//ubicar sucursal 1
	*/
	$(document).on('click',"#btn-map-1", function(evento) {
		evento.preventDefault();
		initMap();

	/*
		var id  = 'map-1';
		var latLng = new google.maps.LatLng('-34.803499', '-58.127269');
		$.goMap.setMarker(id, {zIndex:999});
		$.goMap.setMarker('map-2', {icon:'/arquivos/pointer-off.png'});
		$.goMap.setMarker(id, {icon:'/arquivos/pointer-on.png'});
		$.goMap.map.setCenter(latLng);
		return false;
	*/
	});
	/*
	//ubicar sucursal 2
	$(document).on('click',"#btn-map-2", function(evento) {
		evento.preventDefault();
		var id  = 'map-2';
		var latLng = new google.maps.LatLng('-35.803480', '-58.127269');
		$.goMap.setMarker(id, {zIndex:999});
		$.goMap.setMarker('map-1', {icon:'/arquivos/pointer-off.png'});
		$.goMap.setMarker(id, {icon:'/arquivos/pointer-on.png'});
		$.goMap.map.setCenter(latLng);
		return false;
	});

	*/

	//tabs nav
	$(document).on('click',".modulo.direcciones .row.direccion .btn a", function(evento){
		evento.preventDefault();
		$('body').scrollTo($('.mapa').offset().top-48, 800);
	});
});
