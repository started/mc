"function" !== typeof String.prototype.replaceSpecialChars && (String.prototype.replaceSpecialChars = function() {
	var b = {"\u00e7": "c","\u00e6": "ae","\u0153": "oe","\u00e1": "a","\u00e9": "e","\u00ed": "i","\u00f3": "o","\u00fa": "u","\u00e0": "a","\u00e8": "e","\u00ec": "i","\u00f2": "o","\u00f9": "u","\u00e4": "a","\u00eb": "e","\u00ef": "i","\u00f6": "o","\u00fc": "u","\u00ff": "y","\u00e2": "a","\u00ea": "e","\u00ee": "i","\u00f4": "o","\u00fb": "u","\u00e5": "a","\u00e3": "a","\u00f8": "o","\u00f5": "o",u: "u","\u00c1": "A","\u00c9": "E","\u00cd": "I","\u00d3": "O","\u00da": "U","\u00ca": "E","\u00d4": "O","\u00dc": "U","\u00c3": "A","\u00d5": "O","\u00c0": "A","\u00c7": "C"};
	return this.replace(/[\u00e0-\u00fa]/g, function(a) {
		return "undefined" != typeof b[a] ? b[a] : a
	})
});

var $dom = $dom || {};

var FizzList = {

	productGetRequest : false,
	listPage : 1,
	listProductsPage : 10,
	moreProducts : true,
	defaultTemplate: "5535f891-6409-4d37-9c26-b4a2184333d8",
	categories : null,
	department : null, 				// id de departamento actual, puede ser igual a FizzList.category (en caso de estar en una pagina de depto)
	departmentName : null, 			// nombre de departamento actual, puede ser igual a FizzList.categoryName (en caso de estar en una pagina de depto)
	departmentData : null, 			// data del depto actual
	departmentChildren : null,
	category : null, 					// id de categoria actual, puede ser departamento o categoria
	categoryName : null,				// nombre de categoria actual, puede ser departamento o categoria
	order : "OrderByTopSaleDESC",
	isSearchResult : false,
	isSearchCollection : false,
	isSearchBrand : false,
	selectors: {
			body: "body",
			mainWrapper: "#all-content",
			wrapFilters: ".wrap-filters",
			containerTags: ".modulo.tags",
			wrapTags: ".modulo.tags .grupo-tags",
			containerProducts: ".modulo.productos",
			wrapProducts: ".modulo.productos .product-list",
			products: ".modulo.productos .items .product",
			loader: ".modulo.productos .preload",
			resultItemsWrapper: ".resultItemsWrapper"

		},
	activeFilters: {},
	HBTemplates: {},

	

	/**
	*	Eventos del listado
	*	Department, Category, Search Results
	*
	*/
	events : function() {

		setTimeout(function(){					// Quitar setTimeout!
			FizzList.setJQuerySelectors();

			FizzList.setHBTemplates();


			if ($dom.body.hasClass("departamento") || $dom.body.hasClass("categoria")) {

				FizzList.category = vtxctx.categoryId;
				FizzList.categoryName = vtxctx.categoryName;
				FizzList.department = vtxctx.departmentId;
				FizzList.loadCategoryView();
				FizzList.getFilters();

			} else if($dom.body.hasClass("search-result") || $dom.body.hasClass("resultado-busca")) {
				FizzList.loadSearchView();
			}
		},500)
	},


	getFilters: function(){

		if(window.location.href.indexOf("filters=true") == -1) return;

		var link = window.location.href.split("filters=true&")[1];
		var params = decodeURIComponent(link);

		FizzList.activeFilters = JSON.parse(params);

		function isFloat(n) {
		    return n === +n && n !== (n|0);
		}
		
		for(idFilter in FizzList.activeFilters){


			var filterValue = FizzList.activeFilters[idFilter];
			if(isFloat(filterValue)){
				FizzList.activeFilters[idFilter] = filterValue.toString().replace(".",",")
			}

			$(".filter[data-id='" + idFilter +"']")
			.find(".selector .label .value").text(FizzList.activeFilters[idFilter]);

			// Set and show tags

			var data = {"title": FizzList.activeFilters[idFilter], "id": idFilter, "value": FizzList.activeFilters[idFilter]},
			html = FizzList.HBTemplates.tag(data);
			$dom.wrapTags.append(html);
		}

		$dom.containerTags.slideDown();
		FizzList.filterList();
	},

	setJQuerySelectors : function() {

		$.each(FizzList.selectors, function(name, selector) {
			$dom[name] = $(selector);
		});
	},

	setHBTemplates : function() {

		var templatesName = ["filter", "tag"];

		for(var i = 0; i < templatesName.length; i++) {
			var source = $("#"+templatesName[i]+"-template").html();

			FizzList.HBTemplates[templatesName[i]] = Handlebars.compile(source);
		}
	},

	/**
	*	Chequea que no se repitan productos en una coleccion
	*	En caso de repetirse algun producto, devuelve el string nuevo SIN los li que se repiten
	*	En caso de NO repetirse ningun produto devuelve FALSE
	*
	*/
	collectionProdsRepeat : function(items, prods) {

		if(!prods.length) return false;

		var res = new Array();
		var repeat = false;

		prods.each(function(i, prod) {
			var prodId = $(this).find(".prod").data("id");

			if(items.find(".prod.p_"+prodId).length || items.find(".prod.prod-"+prodId).length) { /// PRODUCTO REPETIDO!
				repeat = true;
				//console.log("REPETIDOOOOOOOOOOOOO " + prodId);
			} else { // NO REPETIDO!
				res.push(prod);
				//console.log("NO REPETIDO " + prodId);
			}

		});

		return repeat ? res : false;

	},

	/**
	*	Prepara pagina "Categoría"
	*	Category
	*
	*/
	loadCategoryView : function() {

		FizzList.loadProductsAmount();
		FizzList.loadCategoryClass();
		FizzList.loadFilters();
		FizzList.filtersEvents();
		FizzList.scrollInfinite();
	},

	loadSearchView: function() {

		FizzList.loadProductsAmount();
		FizzList.loadFiltersSearchView();
		FizzList.filtersEvents();
		FizzList.readFromUrl();
		FizzList.scrollInfinite();
	},

	getCollectionId : function(items) {
		
		var script = items.parent().prevAll("script").eq(0);

		if(script.length) {

			var collectionId = script.text().match((/pc=(.+?)&/));

			return (collectionId && typeof collectionId[1] != "undefined") ? collectionId[1] : false;

		} else {
			console.log("ERROR Landing - No se encontró la etiqueta script, setear colección 'paginada'");
			return false;
		}

	},

	/**
	*	Get de productos para mostrar dependiendo de filtros, pagina
	*	Devuelve el resultado de la query, html o vacio
	*	TODO: chequear firefox!
	*	Department, Category, Search Results
	*
	*/
	getProducts : function(params) {

		return $.Deferred(function() {
			var $this = this;

			if(typeof params.tmpl == "undefined") {
				console.log("FizzList Get ERROR: Param template is required");
				$this.reject();
			}

			var url = "/buscapagina?";

			var url_params = {
				"sl" : params.tmpl,														// template con el que devuelven los productos
				"PS" : typeof params.products != "undefined" ? params.products : 3,	 	// productos que se piden
				"cc" : typeof params.columns != "undefined" ? params.columns : 3,		// cantidad de columnas... cuantos li trae por cada ul
				"sm" : 0,
				"PageNumber" : params.page || 1,										// pagina que se pide
				"O": FizzList.order
			};

			if(typeof params.cat != "undefined") url_params.fq = "C:"+ params.cat;
			else if(typeof params.collection != "undefined") url_params.fq = "H:"+ params.collection;
			else if(typeof params.brand != "undefined") url_params.fq = "B:"+ params.brand;
			
			url_params = $.param(url_params, true);

			if(params.filters) {
				if(!$.isEmptyObject(params.filters)){
					$.each(params.filters, function(id, value) {
						url_params += "&fq=specificationFilter_" + id + ":" + value; 
					});					
				}
				else {
					url_params += "&" + window.location.search.split("&")[1];
				}				

			}

			url += url_params;

			FizzList.productGetRequest = $.get(url, function(res) { $this.resolve(res); });
			
		});

	},

	/**
	*	Get de categorías (variable js de subtemplate)
	*	parent = 0 para cargar todo el arbol
	*	parent = id para cargar hijas de una categoria (para department)
	*	Department, Category
	*
	*/
	getCategories : function(parent) {

		if(parent == 0) {

			if(FizzList.categories) return FizzList.categories;
			else {
				FizzList.categories = Fizzmod.Categories;
				return FizzList.categories;
			}

		} else {

			var cats = FizzList.getCategories(0);
			$.each(cats, function(i, cat) {
				if(cat.id == parent && typeof cat.children != "undefined" && cat.children.length) {
					FizzList.departmentChildren = cat.children;
					return false;
				}
			});
		}

	},

	/*
	* 	Devuelve el departamento actual a partir de un id de categoria (*id de departamento o categoria)
	*	Puede ser la misma categoria en la que estoy o una padre
	*
	*/
	getDepartment : function(id) {

		var res;

		if($.isEmptyObject(FizzList.categories)) FizzList.getCategories(0);

		if(typeof FizzList.categories == "undefined" || $.isEmptyObject(FizzList.categories)) return false;

		$.each(FizzList.categories, function(i, department) {
			if(id == department.id) {
				res = department;
				return false;
			} else if(department.children) {
				$.each(department.children, function(i, category) {
					if(id == category.id) {
						res = department;
						return false;
					}
				});
			}
		});

		return res;

	},

	/*
	*	Carga la cantidad de productos totales que tiene la categoria actual o resultado de busqueda
	*	Category, Search Results
	*
	*/
	loadProductsAmount : function() {
	
		if($(".resultado-busca-numero .value:first").length)
			FizzList.amount = $(".resultado-busca-numero .value:first").text();
	},

	/*
	*	Carga los filtros de vtex en bloque custom
	*	Agrega los eventos para el filtro (evento => getProducts())
	*	Category, Search Results
	*
	*/
	loadFilters : function() {

		var vtexFilters = $("#vtex-filters .search-multiple-navigator .refino"),
			filters = [];

		if(!vtexFilters.length) return false;

		var i = 0;

		$.each(vtexFilters, function() {
			
			var values = $(this).find("label input"),
				options = [];
			
			if(!values.length) return true;

			var filterData = {
				type : "or",
				name : $(this).find("h5").text().trim().toUpperCase(),
				items : "",
				currentValue: "Seleccione..."
			};


			filterData.code = filterData.name.toLowerCase().replace(/ /g, "");
			filterData.code = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], filterData.code);
			filterData.code = filterData.code.replace(/[^-a-zA-Z0-9]/g, "");

			filterData.filterClass = filterData.code + " last";
			filterData.filterClass += (i == 0 ? " first" : "");
			filterData.filterClass += ((i % 2 == 0) ? " even" : " odd");

			var j = 0;

			$.each(values, function() {
				var option = {};

				if(typeof filterData.filterId == "undefined") {
					filterData.id = $(this).attr("rel");

					var res = filterData.id.match(/fq=specificationFilter_(.+):/);
					
					if(!res) { // Filtro Tipo Precio
						if(filterData.id.match(/fq=P:(.+)/)) {
							filterData.id = 0;
							filterData.type = "price";
						}
					} else if(res.length == 2) filterData.id = res[1]; // Filtros normales
					else {
						filterData.id = false;
						return true;
					}
				}
				
				option.value = $(this).val();
				
				if(filterData.type == "price") {
					var label = $(this).closest("label");
					option.title = label.text();
					option.title = option.title.replace(/\((.+)/g, "").trim();
				} else option.title = option.value;

				option.value = encodeURI(option.value);
				option.value = option.value.replace(/%22/g, "");
				option.value = option.value.replace(/\(/g, "");
				option.value = option.value.replace(/\)/g, "");

				option.url = option.title.toLowerCase().trim().replace(/ /g, "");
				option.url = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], option.url);
				option.url = option.url.replace(/[^-a-z0-9]/g, "");

				option.valueUnique = filterData.code + "-" + option.url;
				option.class = option.valueUnique;
				option.class += j == 0 ? " first" : "";
				option.class += values.length == (j+1) ? " last" : "";

				j++;

				options.push(option);

			});

			i++;

			filterData.options = options;

			filters.push(filterData);

		});

		var html = FizzList.HBTemplates.filter(filters);

		$(".wrap-filters .filters").append(html);

		$('input').iCheck({
			checkboxClass: 'icheckbox',
			radioClass: 'iradio',
			hoverClass: 'ihover',
			labelHoverClass: 'ihover',
		});

		// hay filtros
		if(i > 0)
			$(".wrap-filters").addClass("has-filters");

		// FizzList.readFromUrl(); /* carga filtros + orden desde la url */

	},


	loadFiltersSearchView : function() {

		var vtexFilters = $("#vtex-filters .search-multiple-navigator .refino"),
			filters = [];
	

		if(vtexFilters.length) return false;

		var i = 0;

		$.get(	"http://www.marketcar.vtexcommercestable.com.br/api" + 
				"/catalog_system/pub/facets/search/neumaticos/?map=c", function(res){
						
			$.each(res.SpecificationFilters, function(name, filter){

				var options = [];
				var filterData = {
					type : "or",
					name : name.toUpperCase(),
					items : "",
					currentValue: "Seleccione..."
				};			

				filterData.code = filterData.name.toLowerCase().replace(/ /g, "");
				filterData.code = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], filterData.code);
				filterData.code = filterData.code.replace(/[^-a-zA-Z0-9]/g, "");

				filterData.filterClass = filterData.code + " last";
				filterData.filterClass += (i == 0 ? " first" : "");
				filterData.filterClass += ((i % 2 == 0) ? " even" : " odd");

				// -----------------------------------------------------------------

				var j = 0;

				$.each(filter, function(opt) {

					var option = {};

					filterData.id = filter[opt].Link.split("_")[1];
					
					option.value = filter[opt].Name;
					option.title = option.value;
					
					option.value = encodeURI(option.value);
					option.value = option.value.replace(/%22/g, "");
					option.value = option.value.replace(/\(/g, "");
					option.value = option.value.replace(/\)/g, "");

					option.url = option.value.toLowerCase().trim().replace(/ /g, "");
					option.url = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], option.url);
					option.url = option.url.replace(/[^-a-z0-9]/g, "");

					option.valueUnique = filterData.code + "-" + option.url;
					option.class = option.valueUnique;
					option.class += j == 0 ? " first" : "";
					option.class += filter.length == (j+1) ? " last" : "";
					
					j++;

					options.push(option);

				});

				// -----------------------------------------------------------------

				i++;

				filterData.options = options;
				filters.push(filterData);
			})

			var html = FizzList.HBTemplates.filter(filters);

			$(".wrap-filters .filters").append(html);

			// hay filtros
			if(i > 0)
				$(".wrap-filters").addClass("has-filters");		

			FizzList.getFilters();

		});

	},	

	/*
	*	Eventos necesarios para filtrar el listado productos
	*	Category, Search Results
	*
	*/
	filtersEvents : function() {

		$dom.wrapFilters
			.on("click", ".filter:not(.orderby) .selector .option", FizzList.addFilter)
			.on("click", ".filter.orderby .selector .option", FizzList.changeOrder);

		$dom.containerTags.on("click", ".borrar", FizzList.resetFilters);
		$dom.wrapTags.on("click", ".cerrar", FizzList.removeFilter);

	},

	addFilter : function() {

		var $this = $(this);
			value = $this.data("value");
			title = $this.text();
			id = $this.closest(".filter").data("id");

		if(!(id in FizzList.activeFilters)) {
			var data = {"title": title, "id": id, "value": "value"},
			html = FizzList.HBTemplates.tag(data);

			$dom.wrapTags.append(html);

		// si es un filtro que ya esta aplicado lo actualiza
		}else {
			$dom.wrapTags
				.children('.tag[data-id="'+id+'"]')
				.attr("data-value", value)
				.children(".title").text(title);
		}

		$dom.containerTags.slideDown();

		FizzList.activeFilters[id] = value;

		FizzList.filterList();
	},

	changeOrder: function() {
	
		FizzList.order = $(this).data("value");

		FizzList.filterList();
	},

	resetFilters : function() {

		FizzList.activeFilters = {};

		$dom.wrapFilters.find(".filter:not(.orderby) .selector .label .value").text("Seleccione...");
		$dom.wrapTags.empty();
		$dom.containerTags.slideUp();

		FizzList.filterList();
	},

	removeFilter : function() {

		var $tag = $(this).closest(".tag"),
			id = $tag.data("id");

		$tag.remove();

		delete FizzList.activeFilters[id];

		$dom.wrapFilters.find('.filter[data-id="'+id+'"] .selector .label .value').text("Seleccione...");

		if(!Object.keys(FizzList.activeFilters).length)
			$dom.containerTags.slideUp();
		
		FizzList.filterList();
	},

	/*
	*	Filtra un listado de productos
	*	Busca filtros activos en la maqueta, siempre pide pagina 1
	*	Category, Search Results
	*
	*/
	filterList : function() {

		if(FizzList.productGetRequest !== false) { console.log("productGetRequest", FizzList.productGetRequest); FizzList.productGetRequest.abort(); }

		FizzList.listPage = 1;
		FizzList.moreProducts = true;

		var params = {
			tmpl : typeof tmplListProducts != "undefined" ? tmplListProducts : FizzList.defaultTemplate,
			page : FizzList.listPage,
			products : FizzList.listProductsPage,
			columns : FizzList.listProductsPage,
			filters : FizzList.activeFilters,
			order : FizzList.order
		};

		if(FizzList.department || FizzList.category) {
			if(typeof FizzList.department != "undefined" && typeof FizzList.category != "undefined" && FizzList.department != FizzList.category) params.cat = FizzList.department + "/" + FizzList.category;
			else if (typeof FizzList.department != "undefined" && typeof FizzList.category != "undefined" && FizzList.department == FizzList.category) params.cat = FizzList.department;
			else if (typeof FizzList.department == "undefined" && typeof FizzList.category != "undefined") params.cat = FizzList.category;
		}


		if(FizzList.isSearchBrand) {
			params.brand = FizzList.brandId;
		}

		setTimeout(function(){
			FizzList.goTop();

			$dom.containerProducts.addClass("loading");

			FizzList.getProducts(params).done(function(res) {

				FizzList.productGetRequest = false;

				var res = $(res);

				var newContent = res.children("ul");

				if(newContent.length) {
					$dom.wrapProducts.empty().html(newContent);
				} else {
					$dom.wrapProducts.empty();
				}

				$dom.containerProducts.removeClass("loading");

				//icheck
				$('input').iCheck({
					checkboxClass: 'icheckbox',
					radioClass: 'iradio',
					hoverClass: 'ihover',
					labelHoverClass: 'ihover',
				});

				// FizzList.updateListUrl();
				// FizzList.updateFiltersApplied();
			});
		},500)
	},


	/*
	*	Lleva al top antes de filtrar
	*	Category
	*
	*/

	goTop : function() {

		setTimeout(function(){
			var y = $(document).scrollTop();

			wrapProductTop = $dom.wrapProducts.offset().top;

			if(y >= wrapProductTop) $("html, body").animate({ scrollTop : wrapProductTop - 90 }, 250);
		},500)
	},

	/**
	*	Lee filtros y orden de la url
	*
	*/
	readFromUrl : function() {

		if(typeof window.location.search == "undefined" || window.location.search == "") return;

		var urlParams = window.location.search;

/*		var filters = urlParams.match(/filters=(.*?)(?:\&|$)/);

		var doFilter = false

		if(filters && typeof filters[1] != "undefined") {
			filters = filters[1].split("|");

			for(var i = 0, l = filters.length; i < l; i++) {
				filterValues = filters[i].split(":");
				var filterName = filterValues[0];
				var filterValue = filterValues[1];

				for(var j = 1, lv = filterValues.length; j < lv; j++) {
					var item = filter_name+"-"+filterValues [j];
					item = $(".wrap-filters .wrap-filter .item."+item);

					if(item.length) {
						item.addClass("active");
						doFilter = true;
					}
				}
			}
		}

		var order = urlParams.match(/order=(.*?)(?:\&|$)/);

		if(order && typeof order[1] != "undefined") {

			$(".wrap-list .wrap-filters .orderby .options .op").each(function() {
				$(this).addClass($(this).data("value"));
			});

			var orderop = $(".wrap-list .wrap-filters .orderby .options .op."+order[1]);
			if(orderop.length) {
				FizzSelector.selectOption(orderop);
				doFilter = true;
			}
		}
*/
		var collection = urlParams.match(/fq=H\:(\d+)/)

		if(collection && typeof collection[1] != "undefined" ) {
			FizzList.isSearchCollection = true;
			FizzList.collectionId = collection[1];
			// params.collection = collection[1];
			// FizzList.getProducts(params);
		}

		var brand = urlParams.match(/fq=B\:(\d+)/)

		if(brand && typeof brand[1] != "undefined" ) {
			FizzList.isSearchBrand = true;
			FizzList.brandId = brand[1];
		}


		// if(doFilter) FizzList.filterList();

	},

	/**
	*	Actualiza la url actual para mantener filtros + orden
	*
	*/
	updateListUrl : function() {

		var title = $("title").text();
		var url = "http://"+window.location.hostname+window.location.pathname;

		var params = { "lid" : "6ea0fd00-e26b-4119-938d-b89f2d0a4896" };
		
		params.order = FizzList.order;

		params.filters = FizzList.getFiltersUrl();

		var url_params = "";
		$.each(params, function(key, value) {
			if(!value) return true;
			url_params += (url_params == "" ? "?" : "&") + key +"="+ value;
		});
		url += url_params;

		History.pushState({}, title, url);
	},

	loadCategoryClass : function() {

		if(FizzList.departmentName) {
			var c = FizzList.departmentName.toLowerCase().trim().replace(/ /g, "-");
			c = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], c);
			c = c.replace(/[^-a-z0-9]/g, "");
			$dom.mainWrapper.addClass(c);
		}
		if(FizzList.categoryName) {
			var c = FizzList.categoryName.toLowerCase().trim().replace(/ /g, "-");
			c = Fizzmod.Utils.strReplace(["ñ", "á", "é", "í", "ó", "ú"], ["n" ,"a", "e", "i", "o", "u"], c);
			c = c.replace(/[^-a-z0-9]/g, "");
			$dom.mainWrapper.addClass(c);
		}
	},

	/**
	* 	Scroll Action
	*	Category
	*
	*/
	scrollInfinite : function() {

		$(document).on("scroll", function() {

			if(FizzList.productGetRequest !== false) return true;
			
			var ybottom = $(document).scrollTop() + window.innerHeight;

			if($dom.resultItemsWrapper.length) 
				var limit = $dom.resultItemsWrapper.offset().top + $dom.resultItemsWrapper.outerHeight(true) - 150;


			if(ybottom <= limit) return true;

			var productsShown = $(FizzList.selectors.products).length;
			var productsShouldShown = FizzList.listProductsPage*FizzList.listPage;

			if(productsShown < productsShouldShown) FizzList.moreProducts = false;

			if(!FizzList.moreProducts) return true;

			FizzList.listPage++;
			
			if(FizzList.listPage < 2) return true; // se pide a partir de la 2

			var params = {
				tmpl : typeof tmplListProducts != "undefined" ? tmplListProducts : FizzList.defaultTemplate,
				page : FizzList.listPage,
				products : FizzList.listProductsPage,
				columns : FizzList.listProductsPage,
				filters : FizzList.activeFilters,
				order : FizzList.order
			};

			if(FizzList.department || FizzList.category) {
				if(typeof FizzList.department != "undefined" && typeof FizzList.category != "undefined" && FizzList.department != FizzList.category) params.cat = FizzList.department + "/" + FizzList.category;
				else if (typeof FizzList.department != "undefined" && typeof FizzList.category != "undefined" && FizzList.department == FizzList.category) params.cat = FizzList.department;
				else if (typeof FizzList.department == "undefined" && typeof FizzList.category != "undefined") params.cat = FizzList.category;
			}

			if(FizzList.isSearchCollection)
				params.collection = FizzList.collectionId;

			if(FizzList.isSearchBrand){
				console.log("isSearchBrand");
				params.brand = FizzList.brandId;
			}

			// $dom.containerProducts.addClass("loading");

			FizzList.getProducts(params).done(function(res) {

				FizzList.productGetRequest = false;

				if(res == "" || $.isEmptyObject(res) || typeof res.activeElement != "undefined") FizzList.moreProducts = false;
				else {

					$(res)
						.children()
						.children() // .items > ul > li
						.appendTo($(FizzList.selectors.wrapProducts).children("ul:last"));
				
				}

				// $dom.containerProducts.removeClass("loading");

			});

		});
	}

};


$(document).ready(FizzList.events());

/**
* TODO:
*	mobile, tablet
*	
*/