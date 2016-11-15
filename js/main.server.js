/* Uploaded on: 13/09/2016 16:25:26 */ ! function(e, t, o) {
    Fizzmod.addUrlParam = function(t, a, r) {
        r = r || location.search;
        var i = {},
            n = r.replace("?", "").split("&");
        if ("" == n[0] && n.pop(), e.each(n, function() {
                var e = this.split("=");
                if ("fq" == e[0]) {
                    var t = e[1].split(":");
                    "undefined" == typeof i.fq && (i.fq = {}), i.fq[t[0]] = t[1] || ""
                } else i[e[0]] = e[1] || ""
            }), "object" == typeof t && "object" == typeof a) e.each(t, function(e, r) {
            if ("fq" == t[e]) {
                var n = a[e].split(":");
                "undefined" == typeof i[t[e]] && (i[t[e]] = {}), i[t[e]][n[0]] = n[1] || o
            }
            i[t[e]] = a[e] || o
        });
        else if ("fq" == t) {
            var s = a.split(":");
            "undefined" == typeof i[t] && (i[t] = {}), i[t][s[0]] = s[1] || o
        } else i[t] = a || o;
        var c = "?",
            l = !0;
        return e.each(i, function(t, o) {
            "undefined" != typeof o && ("fq" == t ? e.each(o, function(e, o) {
                l ? l = !l : c += "&", c += t + "=" + e + ":" + o
            }) : (l ? l = !l : c += "&", c += t + "=" + o))
        }), "?" == c && (c = ""), c
    }, Array.prototype.min = function() {
        return Math.min.apply(null, this)
    }, Array.prototype.remove = function() {
        for (var e, t, o = arguments, a = o.length; a && this.length;)
            for (e = o[--a]; - 1 !== (t = this.indexOf(e));) this.splice(t, 1);
        return this
    };
    var a, r, i, n, s, c, l, d = {},
        u = {},
        p = function() {
            var e = {};
            decodeURI(t.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(t, o, a) {
                e[o] = a
            });
            return e
        },
        m = function(e) {
            e.preventDefault()
        },
        f = function(e, t) {
            Object.keys(u).length || (document.addEventListener("animationend", function(e) {
                if (e.animationName in u)
                    for (var t = 0, o = u[e.animationName].length; o > t; t++) u[e.animationName][t].call(null, e)
            }), document.addEventListener("webkitAnimationEnd", function(e) {
                if (e.animationName in u)
                    for (var t = 0, o = u[e.animationName].length; o > t; t++) u[e.animationName][t].call(null, e)
            }), document.addEventListener("MSAnimationEnd", function(e) {
                if (e.animationName in u)
                    for (var t = 0, o = u[e.animationName].length; o > t; t++) u[e.animationName][t].call(null, e)
            }), document.addEventListener("oAnimationEnd", function(e) {
                if (e.animationName in u)
                    for (var t = 0, o = u[e.animationName].length; o > t; t++) u[e.animationName][t].call(null, e)
            }), document.addEventListener("mozAnimationEnd", function(e) {
                if (e.animationName in u)
                    for (var t = 0, o = u[e.animationName].length; o > t; t++) u[e.animationName][t].call(null, e)
            })), u[e] instanceof Array || (u[e] = []), u[e].push(t)
        },
        h = {
            initialize: function() {
                a = this, e(document).ready(a.documentReady)
            },
            documentReady: function() {
                a.bindEvents(), i = e("body"), (i.hasClass("home") || i.hasClass("list-page")) && a.initializeListPage(), i.hasClass("comparador") && a.initializeComparatorPage()
            },
            bindEvents: function() {
                r = e(document), r.on("click", ".compare-btn-container a.inactive", m).on("ifChecked", ".list-page input", a.addToComparator).on("ifChecked", ".list-page input", a.showComparatorTab).on("ifUnchecked", ".list-page input", a.uncheckProduct).on("click", ".footer-productos .icn.cross", a.closeItem).on("click", ".modulo.comparar.productos .cerrar", a.removeProduct)
            },
            initializeListPage: function() {
                a.products = {}, a.maxProducts = 4, d.bar = e(".comparator-bar"), d.items = e(".footer-comparador .items"), d.compareButton = e(".footer-comparador .compare-products"), d.item = [], a.checkIfComparatorHasProducts(), e(".footer-comparador .item").each(function(t, o) {
                    d.item.push(e(o))
                })
            },
            showComparatorTab: function() {
                if (!e(".footer-productos").hasClass("stick")) {
                    e(".footer-productos").addClass("stick");
                    var o = t.innerHeight - 57 + "px";
                    e(".footer-productos.stick").animate({
                        top: o
                    }, 300)
                }
            },
            checkIfComparatorHasProducts: function() {
                var e = p();
                "comparatorIds" in e && (comparatorIds = e.comparatorIds.split("|"), a.setProductsInComparatorBar(comparatorIds))
            },
            setProductsInComparatorBar: function(e) {
                for (var t = 0; t < e.length; t++) a.setProductInfo(t, e[t])
            },
            configAnimations: function() {
                f("openComparatorBar", a.endAnimationOpenBar)
            },
            endAnimationOpenBar: function() {
                d.bar.addClass("no-animation")
            },
            setProductInfo: function(t, o) {
                vtexjs.catalog.getProductWithVariations(o).done(function(r) {
                    d.item[t].find(".name").text(r.name), d.item[t].find(".dimensions").text(r.skus[0].skuname), d.item[t].attr("data-product-id", o), d.item[t].removeClass("no-product"), a.products[o] = {}, d.bar.removeClass("inactive").addClass("ready");
                    var i = e('.product-list .product[data-product-id="' + o + '"]');
                    i.length > 0 && i.find("input").iCheck("check"), a.refreshUrlCompareButton()
                })
            },
            addToComparator: function(t) {
                if (Object.keys(a.products).length < a.maxProducts) {
                    var o = e(this),
                        r = o.parents("li"),
                        i = r.find(".product").data("product-id"),
                        n = r.find(".productName").text(),
                        s = r.find(".texto.brand").text(),
                        c = r.find(".descripcion.productSku li").text();
                    if (i in a.products) a.products[i].addToComparatorSelector = o;
                    else {
                        a.products[i] = {}, a.products[i].addToComparatorSelector = o, a.refreshUrlCompareButton();
                        var l = d.items.children(".no-product:eq(0)");
                        l.attr("data-product-id", i), l.find(".brand").text(s), l.find(".name").text(n), l.find(".dimensions").text(c), l.removeClass("no-product"), d.bar.addClass("ready").removeClass("inactive")
                    }
                } else e(this).iCheck("uncheck")
            },
            uncheckProduct: function(t) {
                var o = e(this),
                    r = o.closest("li"),
                    i = r.find(".product").data("product-id");
                a.removeItemFromComparator(i)
            },
            refreshUrlCompareButton: function() {
                var o = "/comparador/?productIds=",
                    r = "";
                e.each(a.products, function(e, t) {
                    r += e + "|"
                }), r = r.substring(0, r.length - 1), o += r, d.compareButton.attr("href", o), Object.keys(a.products).length > 1 ? d.compareButton.removeClass("inactive") : d.compareButton.addClass("inactive");
                var i = Fizzmod.addUrlParam("comparatorIds", r);
                t.history.pushState({
                    pushed: !0
                }, t.title, i)
            },
            closeItem: function() {
                $this = e(this);
                var t = $this.parents(".item").attr("data-product-id");
                a.removeItemFromComparator(t)
            },
            removeItemFromComparator: function(t) {
                d.items.find('.item[data-product-id="' + t + '"]').addClass("no-product");
                var o = e('.product-list .product[data-product-id="' + t + '"]');
                o.length > 0 && o.find("input").iCheck("uncheck"), delete a.products[t], a.refreshUrlCompareButton();
                var r = Object.keys(a.products).length > 0;
                r || d.bar.addClass("inactive").removeClass("no-animation")
            },
            scrollListPage: function() {
                yPosition = r.scrollTop() + 45, yPosition > n ? i.addClass("scroll-comparator") : i.removeClass("scroll-comparator")
            },
            initializeComparatorPage: function() {
                console.log("initializeComparatorPage");
                var t = p(),
                    o = document.referrer;
                if (0 == o.length ? (l = "?comparatorIds=0", c = "/") : (c = o.split("/"), o = o.split("/"), c = c.slice(0, c.length - 1).join("/"), l = o.slice(o.length - 1, o.length).toString(), null != l.match(/.+\?/g) ? (c += "/" + l.match(/.+\?/g)[0].replace("?", ""), l = l.replace(/.+\?/g, "")) : c += "/"), "productIds" in t) d.item = [], d.itemComparatorFixed = [], d.returnLink = e(".modulo.comparar.productos .btn.agregar"), t.productIds = t.productIds.split("|"), a.setProducts(t.productIds), s = t.productIds, console.log("here");
                else
                    for (var r = 0; 4 > r; r++) {
                        var i = e("#tmpl-item-compare-empty").tmpl();
                        e(".modulo.comparar.productos").append(i)
                    }
            },
            setProducts: function(t) {
                if (t.length > 4 && t.splice(4, t.length - 1), 0 == t[0].length) {
                    for (var o = 0; 4 > o; o++) {
                        var r = e("#tmpl-item-compare-empty").tmpl();
                        e(".modulo.comparar.productos").append(r)
                    }
                    return void e(".modulo.comparar.productos .col.datos .wrap .intro .contador").text("0 de 4 productos")
                }
                e(".modulo.comparar.productos .col.datos .wrap .intro .contador").text(t.length + " de 4 productos"), a.getProducts(t).done(function(o) {
                    e.each(o, function(t, o) {
                        var r = Fizzmod.Utils.getResizedImage(o.items[0].images[0].imageUrl, 180, 180),
                            i = a.getBestPrice(o.items),
                            n = {
                                index: t,
                                productId: o.productId,
                                name: o.productName,
                                img: r,
                                brand: o.brand.toUpperCase(),
                                listPrice: "$" + Fizzmod.Utils.formatPrice(i.listPrice),
                                bestPrice: "$" + Fizzmod.Utils.formatPrice(i.bestPrice),
                                installmentValue: Fizzmod.Utils.formatPrice(i.installmentValue),
                                numberOfInstallments: i.numberOfInstallments,
                                link: o.link,
                                brandImg: Fizzmod.Utils.getResizedImage(o["fabricante marca"][0], 200, 50),
                                vehicleType: o["tipo de vehiculo"][0],
                                dimensions: o.items[0].name,
                                warranty: o["garantia texto"]
                            },
                            s = e("#tmpl-item-compare").tmpl(n);
                        e(".modulo.comparar.productos").append(s)
                    });
                    for (var r = t.length + 1; 4 >= r; r++) {
                        var i = e("#tmpl-item-compare-empty").tmpl();
                        e(".modulo.comparar.productos").append(i)
                    }
                    a.refreshUrlAddProduct()
                })
            },
            getBestPrice: function(t) {
                var o = 999999999,
                    a = 0;
                e.each(t, function(e, t) {
                    t.sellers[0].commertialOffer.Price > 0 && t.sellers[0].commertialOffer.Price < o && (o = t.sellers[0].commertialOffer.Price, a = e)
                });
                var r, i;
                if (t[a].sellers[0].commertialOffer.Installments.length > 0) {
                    var n = e.map(t[a].sellers[0].commertialOffer.Installments, function(e) {
                        return e.Value
                    });
                    r = n.min();
                    var s = n.indexOf(r);
                    i = t[a].sellers[0].commertialOffer.Installments[s].NumberOfInstallments
                } else r = 0, i = 0;
                return {
                    bestPrice: o,
                    listPrice: t[a].sellers[0].commertialOffer.ListPrice,
                    numberOfInstallments: i,
                    installmentValue: r
                }
            },
            getProducts: function(t) {
                for (var o = "", a = 0; a < t.length; a++) o += "&fq=productId:" + t[a];
                return e.get("/api/catalog_system/pub/products/search/?" + o)
            },
            removeProduct: function(t) {
                $this = e(this);
                var t = $this.data("index"),
                    o = $this.attr("data-product-id"),
                    r = $this.parents(".item-compare");
                t += 2;
                var i = e("#tmpl-item-compare-empty").tmpl();
                r.before(i), r.remove(), s.remove(o), a.refreshUrlAddProduct()
            },
            refreshUrlAddProduct: function() {
                var o, a = "/neumaticos",
                    r = s.join("|");
                a += "?comparatorIds=" + r, l = Fizzmod.addUrlParam("comparatorIds", r, l), d.returnLink.attr("href", c + l), s[0].length > 0 ? (o = Fizzmod.addUrlParam("productIds", r), t.history.pushState({
                    pushed: !0
                }, t.title, o)) : t.location.href = "/", e(".modulo.comparar.productos .btn.agregar, .comparador .volver").attr("href", a)
            },
            scrollComparatorPage: function() {
                var e = r.scrollTop() + 53;
                e > n ? i.addClass("scroll-comparator") : i.removeClass("scroll-comparator")
            }
        };
    return t.Comparator = h, h.initialize()
}(jQuery, window);

var Marketcar = function(e, t, o, a) {
    var r, i = {
        initialize: function() {
            return r = this, i.headerShowed = !1, r.mouseIsOverMenu = !1, r.mouseIsOverSubMenu = !1, r.productsArray = [], r.setHBHelpers(), e(document).ready(r.documentReady), r.chosenFilters = "{", r
        },
        documentReady: function() {
            r.menuMobile(), r.searchWord(), r.searchAutocomplete(), r.setChecboxes(), r.addArrows(), r.setMainSlider(), r.setFilters(), r.updateMiniCart(), r.setProductSliders(), e(".resultados").perfectScrollbar(), e("header .nav-1 .pre-cart ul").perfectScrollbar(), t.MasterData.setStore("marketcar"), e(document).on("submit", "header .search, header.stick .search.stick", r.search).on("submit", "footer .newsletter form", r.suscribeNewsletter).on("click", "footer .retry", function() {
                e("footer .newsletter").removeClass("hide"), e("footer .wrong-email, footer .fail").addClass("hide")
            }).on("click", ".btn-mp", r.toggleMercadoPago).on("click", ".selector .label", n.toggleDisplay).on("click", ".selector .option", n.selectOption).on("click", "body", n.closeOnClickOutside).on("click", ".chosen-container .chosen-results li.active-result", r.chooseFilters).on("click", ".home #tabs-1 .col-4 button", function(e) {
                e.preventDefault(), r.sendFilters()
            }).on("click", ".btn.chat", r.openChat).on("mouseenter", "header .nav-2.menu-desplegable", function() {
                r.mouseIsOverMenu = !0
            }).on("mouseleave", "header .nav-2.menu-desplegable", function() {
                r.mouseIsOverMenu = !1, setTimeout(function() {
                    r.mouseIsOverMenu || r.mouseIsOverSubMenu || !i.headerShowed || (e(".detalle .header-detalle").slideDown(), e(".list-page.stick-filters .modulo.filtros").css({
                        visibility: "visible"
                    }))
                }, 300)
            }).on("mouseenter", "header .sub-menu.menu-desplegable", function() {
                r.mouseIsOverSubMenu = !0
            }).on("mouseleave", "header .sub-menu.menu-desplegable", function() {
                r.mouseIsOverSubMenu = !1, setTimeout(function() {
                    r.mouseIsOverMenu || r.mouseIsOverSubMenu || !i.headerShowed || (e(".detalle .header-detalle").slideDown(), e(".list-page.stick-filters .modulo.filtros").css({
                        visibility: "visible"
                    }))
                }, 300)
            })
        },
        openChat: function() {
            e(".zopim").eq(0).find("iframe").contents().find(".meshim_widget_components_chatButton_Button").click()
        },
        setProductSliders: function() {
            console.log("home slider");
            console.log($(window).width());
            var slides = 1;
            if ($(window).width() >= 1040) {
                console.log("mayor a 1040");
                var slides = 5;
            }
            if ($(window).width() <= 400) {
                console.log("menor a 400");
                 var slides = 1;
                
            }
            (e("body").hasClass("home") || e("body").hasClass("product")) && (e(".helperComplement").remove(), e(".product-list > ul").bxSlider({
                // slideWidth: 300,
                minSlides: slides,
                maxSlides: slides,
                moveSlides: 1,
                responsive: true,
            }))
        },
        search: function(t) {
            t.preventDefault(), o.location.href = "/" + encodeURI(e(this).find("input").val())
        },
        menuMobile: function(){
            $(".btn-productos").on('click', function(event) {
                event.preventDefault();
                console.log("click menu");
                $('.menu-desplegable').toggleClass('show-menu');
                $('.search.stick').toggleClass('hide');
            });
        },
        
        searchWord: function() {
            if (e("body").hasClass("search-result") || e("body").hasClass("busqueda-vacia")) {
                var t = "Sistema" != decodeURI(o.location.href.split("/")[3]) ? decodeURI(o.location.href.split("/")[3]) : o.location.href.split("=")[1];
                t.match(/(=|\{|\}|\?|\(|\)|:|\&)/g) ? e(".list-page .modulo.resultado .titulo-sessao").text("Resultados de Búsqueda") : (e(".busqueda-vacia .empty-search .search-word").text('"' + t + '"'), e(".list-page .modulo.resultado .titulo-sessao").text("Resultados de Búsqueda para: " + t))
            }
        },
        searchAutocomplete: function() {
            var t, o = function() {
                var e = 0;
                return function(t, o) {
                    clearTimeout(e), e = setTimeout(t, o)
                }
            }();
            e("header .nav-2 .search input").keyup(function(r) {
                var i = e(this),
                    n = e(".resultados"),
                    s = i.val();
                "" != s ? o(function() {
                    t != a && t.abort(), t = e.ajax({
                        url: "/api/catalog_system/pub/products/search?ft=" + encodeURIComponent(s),
                        type: "GET",
                        beforeSend: function() {
                            n.find(".item").remove(), n.removeClass("ready"), n.addClass("loading"), n.show()
                        },
                        success: function(t) {
                            n.removeClass("loading"), n.addClass("ready"), t.length > 0 ? (e.each(t, function(e, t) {
                                n.append('<a href="' + t.link + '" class="item"><p>' + t.brand.toUpperCase() + " - " + t.productName.replace(" - ", " ") + "</p></a>")
                            }), e(".resultados").perfectScrollbar("update")) : n.append('<p class="item">No se encontraron resultados</p>')
                        }
                    })
                }, 750) : (n.removeClass("ready loading"), n.hide())
            }).focus(function(t) {
                e(".resultados").show()
            }).click(function() {
                e(".resultados").show()
            }), e(document).on("mouseleave", ".search", function() {
                e(".resultados").hide()
            })
        },
        updateMiniCart: function() {
            function o(o) {
                var r = 0;
                e.each(o.items, function(e) {
                    r += o.items[e].quantity, a += o.items[e].price * o.items[e].quantity
                }), e("header .nav-1 .pre-cart .total .numero, header .nav-1 .carrito .info p+p").text(t.Utils.formatPrice(a / 100, ",", ".", 2, "$")), e("header .nav-1 .carrito .icono .num p").text(r)
            }
            e("header .nav-1 .pre-cart .script").length || e("header .nav-1 .pre-cart ul").before('<script id="item-mini-cart" type="text/x-jquery-tmpl"><li><a href="${link}"><img src="${img}" /></a><div class="detalle"><h2 class="tit productName">${name}</h2><h3 class="descripcion">${description}</h3><p class="cantidad">Cantidad: ${qty}</p><p class="precio bestPrice">${price}</p></div><div class="cerrar"></div></li></script>');
            var a = 0;
            vtexjs.checkout.getOrderForm().done(function(a) {
                var i;
                e("header .nav-1 .pre-cart ul").empty(), a.items.length ? e("header .nav-1 .pre-cart ul").addClass("has-items") : e("header .nav-1 .pre-cart ul").removeClass("has-items"), e.each(a.items, function(o) {
                    var a = this;
                    i = {
                        skuId: a.id,
                        name: a.name,
                        description: a.additionalInfo.brandName,
                        price: t.Utils.formatPrice(a.price / 100, ",", ".", 2),
                        img: a.imageUrl,
                        link: a.detailUrl,
                        qty: a.quantity,
                        index: o
                    }, e("#item-mini-cart").tmpl(i).appendTo(e("header .nav-1 .pre-cart ul"))
                }), e("header .nav-1 .pre-cart ul li .cerrar").on("click", r.removeItemMiniCart), e("header .nav-1 .pre-cart ul.has-items").perfectScrollbar("update"), o(a)
            })
        },
        removeItemMiniCart: function() {
            var t = e(this).parents("li").data("index");
            e(this).parent().children().css("opacity", ".3").end().prepend('<div class="cssload-loader"></div>'), vtexjs.checkout.getOrderForm().then(function(e) {
                var o = e.items[t];
                return o.index = t, vtexjs.checkout.removeItems([o])
            }).done(function(e) {
                r.updateMiniCart()
            })
        },
        setFilters: function() {
            e("body").hasClass("home") && e.get("http://www.marketcar.vtexcommercestable.com.br/api/catalog_system/pub/facets/search/neumaticos/?map=c", function(t) {
                for (var o in t.SpecificationFilters)
                    for (var a in t.SpecificationFilters[o]) {
                        var r = t.SpecificationFilters[o];
                        if (r[a].Name) {
                            var a = r[a];
                            e('#tabs-1 select[data-filter-name="' + o + '"]').append("<option data-filter-option=" + a.Name + " data-filter-link=" + a.Link + ">" + a.Name + "</option>")
                        }
                    }
                e("#tabs-1 select").each(function() {
                    options = e(this).find("option"), options.sort(function(e, t) {
                        return e = e.value, t = t.value, e - t
                    }), e(this).html(options), e(this).prepend("<option selected>Seleccione...</option>")
                }), e(".chosen-select").chosen({
                    disable_search_threshold: 10
                })
            })
        },
        chooseFilters: function() {
            if (!e("body").hasClass("mis-pedidos")) {
                var t = e(this).data("option-array-index"),
                    o = e(this).parents(".col").find("select option").eq(t).data("filter-link").split("_")[1],
                    a = e(this).parents(".col").find("select option").eq(t).data("filter-option");
                Number(a) || (a = -1 == a.indexOf(",") ? '"' + a + '"' : parseFloat(a.replace(",", "."))), 1 != r.chosenFilters.length ? (r.chosenFilters = r.chosenFilters.slice(0, -1), r.chosenFilters += ',"' + o + '":' + a) : r.chosenFilters += '"' + o + '":' + a, r.chosenFilters += "}"
            }
        },
        chooseFiltersMobile: function() {
            console.log("chose filter mobile");
            if($("body").hasClass("mis-pedidos")) return;

            $("#tabs-1 form select").each(function(index, el) {
                $(el).on("change", function(){
                    var optionSelected = $(this).find("option:selected");
                    var i = $(optionSelected).data("option-array-index")
                    var filter = $(this).find("option").eq(i).data("filter-link").split("_")[1];
                    var option = $(this).find("option").eq(i).data("filter-option");

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

                });
            });             
        },
        sendFilters: function() {
            if ($(window).width() < 768) {
                console.log("chose->");
                r.chooseFiltersMobile();
            }
            r.chosenFilters.length > 1 && (o.location.href = "/neumaticos?filters=true&" + r.chosenFilters)
        },
        setHBHelpers: function() {
            Handlebars.registerHelper("inc", function(e, t) {
                return parseInt(e) + 1
            })
        },
        setMainSlider: function() {
            var t = !1;
            e("#main-slider").children().length > 1 && (t = !0), e("#main-slider").bxSlider({
                auto: !0,
                pause: 4e3,
                mode: "fade",
                controls: t
            })
        },
        setChecboxes: function() {
            e("input").iCheck({
                checkboxClass: "icheckbox",
                radioClass: "iradio",
                hoverClass: "ihover",
                labelHoverClass: "ihover"
            })
        },
        addArrows: function() {
            e(".modulo.detalle-producto .economia-de").append('<div class="punta"></div>')
        },
        toggleMercadoPago: function(t) {
            t.preventDefault(), e(".mp").slideToggle("slow", "swing", function() {
                e(".wrap-scroll").getNiceScroll().resize(), e(".wrap-scroll").scrollTo(e(".wrap-scroll iframe"), 800)
            })
        },
        onClickNav: function() {
            e(this).data();
            e(this).addClass("stores-nav-active"), e(".stores-nav-buttons").not(e(this)).removeClass("stores-nav-active"), e(".stores-subnav-buttons").removeClass("stores-subnav-active"), e(".stores-box").removeClass("stores-box-active")
        },
        suscribeNewsletter: function(o) {
            o.preventDefault(), t.Utils.isEmail(e("footer .newsletter input").val()) ? t.MasterData.newsletter(e("footer .newsletter input").val()).done(function(t) {
                e("footer .newsletter").addClass("hide"), e("footer .success").removeClass("hide")
            }).fail(function(t) {
                e("footer .newsletter").addClass("hide"), e("footer .fail").removeClass("hide")
            }) : (e("footer .newsletter").addClass("hide"), e("footer .wrong-email").removeClass("hide"))
        }
    },
    n = {
        slideSpeed: 250,
        toggleDisplay: function() {
            var t = e(this),
                o = t.closest(".selector");
            o.toggleClass("active").children(".options").stop(!0, !0).slideToggle(n.slideSpeed, function() {
                e(this).css("overflow", "")
            })
        },
        selectOption: function() {
            var t = e(this);
            t.closest(".selector").find(".label .value").text(t.text()).click()
        },
        closeOnClickOutside: function(t) {
            e(".selector.active").each(function() {
                var o = e(this);
                o.has(t.target).length || o.removeClass("active").children(".options").stop(!0, !0).slideUp(n.slideSpeed)
            })
        }
    };
    return i.initialize()
}(jQuery, Fizzmod, window);

$(document).ready(function() {
    function e(e) {
        slider = $("#slider-1-tab-" + e).bxSlider({
            minSlides: 2,
            maxSlides: 5,
            slideWidth: 175,
            slideMargin: 26,
            pager: !0,
            nextSelector: "#slider-tab-next-" + e,
            prevSelector: "#slider-tab-prev-" + e,
            nextText: "",
            prevText: ""
        }), setTimeout(slider.reloadSlider, 500)
    }

    function t(e) {
        $("#slider-menu-" + e).bxSlider({
            nextSelector: "#slider-next-menu-" + e,
            prevSelector: "#slider-prev-menu-" + e,
            nextText: "",
            prevText: "",
            pagerCustom: "#bx-pager-" + e
        })
    }

    function o() {
        var e = {
                lat: -34.584043,
                lng: -58.445547
            },
            t = new google.maps.Map(document.getElementById("map"), {
                center: e,
                zoom: 16
            }),
            o = new google.maps.Marker({
                position: e,
                map: t,
                icon: "http://marketcar.vteximg.com.br/arquivos/pointer-on.png"
            });
        o.setMap(t)
    }
    $(".pre-cart").on("click", function(e) {
        e.stopPropagation()
    }), $(document).on("click", function(e) {
        $(".pre-cart").hide()
    }), $(".fancybox").fancybox({
        padding: 0,
        scrolling: "no",
        width: 650,
        autoHeight: !0,
        autoSize: !1,
        helpers: {
            overlay: {
                css: {
                    background: "rgba(35, 31, 32, 0.5)"
                },
                locked: !0
            }
        },
        afterShow: function() {
            $("html").removeClass("popup-off"), $(".wrap-scroll").niceScroll({
                cursorcolor: "#d0d2d3",
                cursorborder: 0,
                cursorborderradius: 3,
                cursorwidth: "5px",
                background: "#f8f8f8",
                autohidemode: !1
            }).resize()
        },
        afterClose: function() {
            $(".wrap-scroll").getNiceScroll().remove(), $(".popup.banco").hide()
        },
        beforeClose: function() {
            $("html").addClass("popup-off")
        }
    }), $(document).on("click", ".btn-banco", function(e) {
        e.preventDefault(), $(this).closest(".wrap-banco").find(".popup.banco").show(), $(".wrap-scroll").getNiceScroll().hide()
    }), $(document).on("click", ".wrap-banco .btn.cerrar", function(e) {
        e.preventDefault(), $(this).closest(".wrap-banco").find(".popup.banco").hide(), $(".wrap-scroll").getNiceScroll().show()
    }), $("body").not(".mis-pedidos").find(".accordion").accordion({
        heightStyle: "content",
        collapsible: !0
    }), $.datepicker.regional.es = {
        closeText: "Cerrar",
        prevText: "<Ant",
        nextText: "Sig>",
        currentText: "Hoy",
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        weekHeader: "Sm",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: ""
    }, $.datepicker.setDefaults($.datepicker.regional.es), $(".datepicker").datepicker({
        beforeShow: function(e, t) {
            setTimeout(function() {
                t.dpDiv.css({
                    top: "+=10px",
                    left: "-=15px"
                })
            }, 0)
        }
    }), $(".spinner").spinner(), $("#home-tabs, #menu-tabs, #slider-tabs, #detalle-tabs").tabs({
        hide: "fade",
        show: "fade"
    }), $("header .menu-desplegable li .wrap-hover").hover(function() {
        var e = $(this).closest("li").attr("class");
        $(".lista-preview ." + e).css({
            visibility: "visible",
            opacity: "1"
        }), $(this).closest("li").find(".wrap-hover").addClass("activo"), $(".nav-2").find("." + e).find(".wrap-hover").addClass("activo")
    }, function() {
        var e = $(this).closest("li").attr("class");
        $(".lista-preview ." + e).css({
            visibility: "hidden",
            opacity: "0"
        }), $(this).closest("li").find(".wrap-hover").removeClass("activo"), $(".nav-2").find("." + e).find(".wrap-hover").removeClass("activo")
    }), $(document).on("click", ".filtro-1 .btn", function(e) {
        return e.preventDefault(), $(this).closest(".filtro-1").toggleClass("active"), $(this).closest(".filtro-1").find(".cols").slideToggle(500), !1
    }), $(document).on("click", "header li .btn", function(e) {
        return e.preventDefault(), $(this).closest("li").toggleClass("active"), $(this).closest("li").find(".dropdown, .pre-cart").toggle(), !1
    }), $("#waypoint").waypoint(function(e) {
        "down" === e ? $("header").addClass("stick") : "up" === e && $("header").removeClass("stick")
    }, {
        offset: "0"
    }), $(".detalle-slider").bxSlider({
        pagerCustom: "#detalle-pager",
        controls: !1
    }), $(".slider-principal .slider").bxSlider({
        pager: !1,
        nextSelector: ".slider-next-principal",
        prevSelector: ".slider-prev-principal",
        nextText: "",
        prevText: ""
    }), $(".slider-1").bxSlider({
        minSlides: 2,
        maxSlides: 7,
        slideWidth: 135,
        slideMargin: 5,
        pager: !1,
        nextSelector: ".slider-next-1",
        prevSelector: ".slider-prev-1",
        nextText: "",
        prevText: ""
    }), $("#filtros-waypoint").waypoint(function(e) {
        if ("down" === e) {
            if (Marketcar.headerShowed = !0, $("body").addClass("stick-filters"), window.location.href.indexOf("comparator") > -1) {
                $(".footer-productos").addClass("stick");
                var t = window.innerHeight - 57 + "px";
                $(".footer-productos.stick").animate({
                    top: t
                }, 300)
            }
        } else "up" === e && (Marketcar.headerShowed = !1, $("body").removeClass("stick-filters"), $(".footer-productos.stick").animate({
            top: "100%"
        }, 300, function() {
            $(".footer-productos").removeClass("stick")
        }))
    }, {
        offset: "0"
    }), $(".modulo.productos li .btn.comparar input").on("ifChecked", function(e) {
        $(".seccion.listado .header-listado").slideDown()
    }), $(".modulo.productos li .btn.comparar input").on("ifUnchecked", function(e) {
        var t = 0;
        $(this).closest(".modulo.productos").find(".btn.comparar input").each(function() {
            $(this).closest(".icheckbox").hasClass("checked") && t++
        }), t -= 1, 1 > t && $(".seccion.listado .header-listado").slideUp()
    }), $("#waypoint-comparador").waypoint(function(e) {
        "down" === e ? $(".header-comparador").addClass("stick").slideDown() : "up" === e && $(".header-comparador").removeClass("stick").slideUp()
    }, {
        offset: "100"
    }), $("#waypoint-comparador-fin").waypoint(function(e) {
        "down" === e ? $(".header-comparador").addClass("stick").slideUp() : "up" === e && $(".header-comparador").removeClass("stick").slideDown()
    }, {
        offset: "100"
    }), $("#waypoint-detalle").waypoint(function(e) {
        "down" === e ? (Marketcar.headerShowed = !0, $(".header-detalle").slideDown()) : "up" === e && (Marketcar.headerShowed = !1, $(".header-detalle").slideUp())
    }, {
        offset: "0"
    }), $(document).on("click", ".detalle .header-detalle .icono", function(e) {
        e.preventDefault(), $(".menu li").removeClass("current"), $(this).closest("li").addClass("current"), $("body").scrollTo("#detalle-tabs-ancla", 200);
        var t = $(this).attr("tabindex");
        $("#detalle-tabs").tabs("option", "active", t)
    }), $(document).on("click", ".modulo.detalle-producto .imagen .thumbs li a", function(e) {
        e.preventDefault(), $(this).closest("ul").find("li").removeClass("active"), $(this).closest("li").addClass("active");
        var t = $(this).closest("li").index();
        $(this).closest(".apresentacao").find("[productindex]").removeClass("active"), $(this).closest(".apresentacao").find("[productindex='" + t + "']").addClass("active")
    }), e(1), $(document).one("click", "#slider-tab-2 p", function(t) {
        t.preventDefault(), e(2)
    }), $(document).one("click", "#slider-tab-3 p", function(t) {
        t.preventDefault(), e(3)
    }), t(1), t(2), $("header .head .btn-productos").on("mouseenter", function() {
        Marketcar.headerShowed && ($(".detalle .header-detalle").slideUp(), $(".list-page.stick-filters .modulo.filtros").css({
            visibility: "hidden"
        })), $("header").addClass("hover"), $(this).closest("header").find(".nav-2").css({
            position: "fixed",
            marginTop: "0",
            top: "48px"
        }), $(this).closest("header").find(".sub-menu.menu-desplegable").css({
            position: "fixed",
            top: "89px"
        }), $("body > .main").css({
            marginTop: "121px"
        })
    }), $("header").on("mouseleave", function() {
        $("header").removeClass("hover"), $(this).closest("header").find(".nav-2").css({
            position: "relative",
            marginTop: "80px",
            top: "0"
        }), $(this).closest("header").find(".sub-menu.menu-desplegable").css({
            position: "relative",
            top: "0"
        }), $("body > .main").css({
            marginTop: "0"
        })
    }), $("body").hasClass("sucursales") && o(), $(document).on("click", "#btn-map-1", function(e) {
        e.preventDefault(), o()
    }), $(document).on("click", ".modulo.direcciones .row.direccion .btn a", function(e) {
        e.preventDefault(), $("body").scrollTo($(".mapa").offset().top - 48, 800)
    })
});