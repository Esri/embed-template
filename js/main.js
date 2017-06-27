define(["dojo/ready", "dojo/parser", "dojo/dom-attr", "dojo/dom-geometry", "dojo/on", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/kernel", "dojo/query", "dojo/Deferred", "dojo/promise/all", "dojo/dom", "dojo/dom-class", "dojo/dom-style", "dojo/dom-construct", "dijit/registry", "esri/domUtils", "esri/lang", "esri/arcgis/utils", "esri/dijit/Popup", "esri/layers/FeatureLayer", "application/MapUrlParams", "application/sniff", "dojo/domReady!"], function (
  ready,
  parser,
  domAttr,
  domGeometry,
  on,
  declare,
  lang,
  kernel,
  query,
  Deferred,
  all,
  dom,
  domClass,
  domStyle,
  domConstruct,
  registry,
  domUtils,
  esriLang,
  arcgisUtils,
  Popup,
  FeatureLayer,
  MapUrlParams,
  has) {
  return declare(null, {
    config: {},
    startup: function (config) {
      document.documentElement.lang = kernel.locale;
      // var promise;
      parser.parse();
      // config will contain application and user defined info for the template such as i18n strings, the web map id
      // and application id
      // any url parameters and any application specific configuration information.
      if (config) {
        this.config = config;
        window.config = config;
        if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
          this.config.theme = "light";
        }
        // Create and add custom style sheet
        if (this.config.customstyle) {
          var style = document.createElement("style");
          style.appendChild(document.createTextNode(this.config.customstyle));
          document.head.appendChild(style);
        }
        if (has("drawer")) {
          require(["application/Drawer"], lang.hitch(this, function (Drawer) {
            this._drawer = new Drawer({
              borderContainer: "border_container",
              // border container node id
              contentPaneCenter: "cp_center",
              // center content pane node id
              direction: this.config.i18n.direction,
              config: this.config,
              displayDrawer: (this.config.legend || this.config.details || this.config.popup_sidepanel || this.config.legendlayers),
              drawerOpen: this.config.show_panel
            });

            // startup drawer
            this._drawer.startup();
            this._buildMapUI();
          }));
        } else {
          domClass.add(document.body, "no-title");
          this._buildMapUI();
        }
      } else {
        var error = new Error("Main:: Config is not defined");
        this.reportError(error);
        var def = new Deferred();
        def.reject(error);
        // promise = def.promise;
      }
      //  return promise;
    },
    reportError: function (error) {
      // remove loading class from body
      domClass.remove(document.body, "app-loading");
      domClass.add(document.body, "app-error");
      // an error occurred - notify the user. In this example we pull the string from the
      // resource.js file located in the nls folder because we've set the application up
      // for localization. If you don't need to support multiple languages you can hardcode the
      // strings here and comment out the call in index.html to get the localization strings.
      // set message
      var node = dom.byId("loading_message");
      if (node) {
        if (this.config && this.config.i18n) {
          node.innerHTML = this.config.i18n.map.error + ": " + error.message;
        } else {
          node.innerHTML = "Unable to create map: " + error.message;
        }
      }
    },
    _buildMapUI: function () {

      var itemInfo = this.config.itemInfo || this.config.webmap;

      // Check for center, extent, level and marker url parameters.
      var mapParams = new MapUrlParams({
        center: this.config.center || null,
        extent: this.config.extent || null,
        level: this.config.level || null,
        marker: this.config.marker || null,
        mapSpatialReference: itemInfo.itemData.spatialReference,
        defaultMarkerSymbol: this.config.markerSymbol,
        defaultMarkerSymbolWidth: this.config.markerSymbolWidth,
        defaultMarkerSymbolHeight: this.config.markerSymbolHeight,
        geometryService: this.config.helperServices.geometry.url
      });

      mapParams.processUrlParams().then(lang.hitch(this, function (urlParams) {
        this._createWebMap(itemInfo, urlParams);
      }), lang.hitch(this, function (error) {
        this.reportError(error);
      }));
    },
    _addScalebar: function () {
      var deferred = new Deferred();
      require(["application/sniff!scale?esri/dijit/Scalebar"], lang.hitch(this, function (Scalebar) {
        if (!Scalebar) {
          deferred.resolve();
          return;
        }
        var scalebar = new Scalebar({
          map: this.map,
          scalebarUnit: this.config.units
        });
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _addZoom: function () {
      var deferred = new Deferred();
      //Zoom slider needs to be visible to add home
      if (this.config.home && this.config.zoom) {
        require(["application/sniff!home?esri/dijit/HomeButton"], lang.hitch(this, function (HomeButton) {
          if (!HomeButton) {
            deferred.resolve();
            return;
          }
          var home = new HomeButton({
            map: this.map
          }, domConstruct.create("div", {}, query(".esriSimpleSliderIncrementButton")[0], "after"));
          home.startup();
          deferred.resolve();
        }));

      } else {
        //add class so we can move basemap gallery button
        domClass.add(document.body, "no-home");
        deferred.resolve();
      }
      return deferred.promise;
    },
    _addLayerList: function () {
      var deferred = new Deferred();
      require(["application/sniff!legendlayers?esri/dijit/LayerList"], lang.hitch(this, function (LayerList) {
        if (!LayerList) {
          deferred.resolve();
          return;
        }

        // Add the css 
        var lnk = document.createElement("link");
        lnk.type = "text/css";
        lnk.href = "//js.arcgis.com/3.21/esri/dijit/LayerList/css/LayerList.css";
        lnk.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(lnk);
        var layerList = new LayerList({
          map: this.map,
          showLegend: true,
          layers: arcgisUtils.getLayerList(this.config.response)
        }, domConstruct.create("div", {}, registry.byId("legend").domNode));

        layerList.startup();
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _addLegend: function () {
      var deferred = new Deferred();
      // if layer list is enabled don't add legend
      require(["application/sniff!legend?esri/dijit/Legend"], lang.hitch(this, function (Legend) {
        if (!Legend) {
          deferred.resolve();
          return;
        }
        var legend = new Legend({
          map: this.map,
          layerInfos: arcgisUtils.getLegendLayers(this.config.response)
        }, domConstruct.create("div", {}, registry.byId("legend").domNode));
        legend.startup();
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _setupFind: function () {
      var deferred = new Deferred();
      //Feature Search or find (if no search widget)
      if (this.config.find || this.config.feature || (this.config.customUrlLayer.id !== null && this.config.customUrlLayer.fields.length > 0 && this.config.customUrlParam !== null)) {
        require(["esri/dijit/Search", "esri/urlUtils"], lang.hitch(this, function (Search, urlUtils) {
          if (!Search && !urlUtils) {
            deferred.resolve();
            return;
          }
          //get the search value
          var feature = null,
            find = null,
            source = null,
            value = null;

          if ((this.config.customUrlLayer.id !== null && this.config.customUrlLayer.fields.length > 0 && this.config.customUrlParam !== null)) {
            var urlObject = urlUtils.urlToObject(document.location.href);
            urlObject.query = urlObject.query || {};
            urlObject.query = esriLang.stripTags(urlObject.query);
            var customUrl = null;
            for (var prop in urlObject.query) {
              if (urlObject.query.hasOwnProperty(prop)) {
                if (prop.toUpperCase() === this.config.customUrlParam.toUpperCase()) {
                  customUrl = prop;
                }
              }
            }
            value = urlObject.query[customUrl];
            searchLayer = this.map.getLayer(this.config.customUrlLayer.id);
            if (searchLayer) {

              var searchFields = this.config.customUrlLayer.fields[0].fields;
              source = {
                exactMatch: true,
                outFields: ["*"],
                featureLayer: searchLayer,
                displayField: searchFields[0],
                searchFields: searchFields
              };
            }
          }
          if (this.config.feature) {
            feature = decodeURIComponent(this.config.feature);
            if (feature) {
              var splitFeature = feature.split(";");
              if (splitFeature.length && splitFeature.length !== 3) {
                splitFeature = feature.split(",");
              }
              feature = splitFeature;
              if (feature && feature.length && feature.length === 3) {
                var layerId = feature[0],
                  attribute = feature[1],
                  featureId = feature[2],
                  searchLayer = null;
                searchLayer = this.map.getLayer(layerId);
                if (searchLayer) {
                  source = {
                    exactMatch: true,
                    outFields: ["*"],
                    featureLayer: searchLayer,
                    displayField: attribute,
                    searchFields: [attribute]
                  };
                  value = featureId;
                }

              }
            }
          }
          if (this.config.find) {
            find = decodeURIComponent(this.config.find);
            value = find;
          }

          var urlSearch = new Search({
            map: this.map,
            zoomScale: this.config.customUrlLayerZoomScale || 1000
          });

          urlSearch.startup();
          if (source) {
            urlSearch.set("sources", [source]);
          }
          urlSearch.startup();
          urlSearch.search(value).then(lang.hitch(this, function (result) {
            if (this.config.customUrlLayerZoomScale) {
              var sel = result[0];
              if (sel) {
                var r = sel[0];
                if (r && r.extent) {
                  // extent avail so specified zoom scale isn't used. So we need to center and zoom
                  this.map.setScale(this.config.customUrlLayerZoomScale).then(lang.hitch(this, function () {
                    this.map.centerAt(r.extent.getCenter());
                  }));
                }
              }
            }
            on.once(this.map.infoWindow, "hide", lang.hitch(this, function () {
              urlSearch.clear();
              urlSearch.destroy();
            }));
          }));
          deferred.resolve();
        }));


      } else {
        deferred.resolve();
      }
      return deferred.proise;
    },
    _setupSearch: function () {
      //Add the location search widget
      var deferred = new Deferred();
      require(["application/sniff!search?esri/dijit/Search", "application/sniff!search?esri/tasks/locator", "application/sniff!search?application/SearchSources"], lang.hitch(this, function (Search, Locator, SearchSources) {
        if (!Search && !Locator && !SearchSources) {
          deferred.resolve();
          return;
        }
        var searchOptions = {
          map: this.map,
          useMapExtent: this.config.searchextent,
          itemData: this.config.response.itemInfo.itemData
        };

        if (this.config.searchOptions && this.config.searchOptions.sources) {
          if (this.config.searchOptions.hasOwnProperty("enableSearchingAll")) {
            searchOptions.enableSearchingAll = true;
          }
          searchOptions.applicationConfiguredSources = this.config.searchOptions.sources;
          if (this.config.searchOptions.hasOwnProperty("activeSourceIndex")) {
            searchOptions.activeSourceIndex = this.config.searchOptions.activeSourceIndex;
          }
        } else {
          searchOptions.geocoders = this.config.helperServices.geocode || [];
        }
        var searchSources = new SearchSources(searchOptions);

        var createdOptions = searchSources.createOptions();
        createdOptions.enableButtonMode = true;
        createdOptions.expanded = true;
        var search = new Search(createdOptions, domConstruct.create("div", {
          id: "search",
          className: "simpleGeocoder"
        }, "mapDiv"));

        domClass.add(search.domNode, "simpleGeocoder");

        search.startup();
        //use search if its available.
        if (this.config.find) {
          search.set("value", this.config.find);
          var activeIndex = search.activeSourceIndex;

          search.set("activeSourceIndex", "all");
          search.search(this.config.find).then(function () {
            search.set("activeSourceIndex", activeIndex);
          });
        }
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _addBasemapGallery: function () {
      var deferred = new Deferred();
      require(["application/sniff!basemap_gallery?esri/dijit/BasemapGallery"], lang.hitch(this, function (BasemapGallery) {
        if (!BasemapGallery) {
          deferred.resolve();
          return;
        }
        var galleryOptions = {
          showArcGISBasemaps: true,
          bingMapsKey: this.config.orgInfo.bingKey || "",
          portalUrl: this.config.sharinghost,
          basemapsGroup: this._getBasemapGroup(),
          map: this.map
        };
        var gallery = null;

        //Create a container to hold the basemap gallery title, gallery and also draw
        //the callout arrow
        var container = domConstruct.create("div", {
          id: "gallery_container"
        }, "mapDiv");
        this.gallery_container = container;
        domConstruct.create("div", {
          "class": "arrow_box",
          innerHTML: "<div class='basemap_title'>" + this.config.i18n.tools.basemap.title + "</div><span tabindex='0' role='button' aria-label='" + this.config.i18n.tools.basemap.close + "' id='esri-icon-close' class='esri-icon-close'></span><div id='full_gallery'></div>"
        }, container);

        //add a button below the slider to show/hide the basemaps
        var mainContainer = domConstruct.create("div", {
          "class": "icon-basemap-container active-toggle",
          "tabindex": "0",
          "aria-label": this.config.i18n.tools.basemap.label,
          "role": "button",
          "click": lang.hitch(this, this._displayBasemapContainer)
        }, this.map.id + "_root");


        domConstruct.create("div", {
          "class": "icon-basemap",
          "title": this.config.i18n.tools.basemap.label
        }, mainContainer);


        //add a class so we can move the basemap if the zoom position moved.
        if (this.config.zoom && this.config.zoom_position) {
          domClass.add(mainContainer, "embed-" + this.config.zoom_position);
          domClass.add(this.gallery_container, "embed-" + this.config.zoom_position);
        }


        gallery = new BasemapGallery(galleryOptions, "full_gallery");
        gallery.startup();
        var closemenu = dom.byId("esri-icon-close");
        if (closemenu) {
          on(closemenu, "click", lang.hitch(this, function () {
            this._displayBasemapContainer();
          }));
        }

        //Hide the basemap gallery at startup
        this._displayBasemapContainer();
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _addBasemapToggle: function () {
      var deferred = new Deferred();
      require(["application/sniff!basemap_toggle?esri/dijit/BasemapToggle", "application/sniff!basemap_toggle?esri/basemaps"], lang.hitch(this, function (BasemapToggle, basemaps) {
        if (!BasemapToggle && !basemaps) {
          deferred.resolve();
          return;
        }
        // Don't show toggle if gallery is enabled. 
        if (this.config.basemap_gallery) {
          return;
        }
        var toggle_container = domConstruct.create("div", {}, "mapDiv");

        /* Start temporary until after JSAPI 4.0 is released */
        var bmLayers = [],
          mapLayers = this.map.getLayersVisibleAtScale(this.map.getScale());
        if (mapLayers) {
          for (var i = 0; i < mapLayers.length; i++) {
            if (mapLayers[i]._basemapGalleryLayerType) {
              var bmLayer = this.map.getLayer(mapLayers[i].id);
              if (bmLayer) {
                bmLayers.push(bmLayer);
              }
            }
          }
        }
        on.once(this.map, "basemap-change", lang.hitch(this, function () {
          if (bmLayers && bmLayers.length) {
            for (var i = 0; i < bmLayers.length; i++) {
              bmLayers[i].setVisibility(false);
            }
          }
        })); /* END temporary until after JSAPI 4.0 is released */


        var toggle = new BasemapToggle({
          map: this.map,
          basemap: this.config.alt_basemap || "satellite"
        }, toggle_container);
        if (this.config.response && this.config.response.itemInfo && this.config.response.itemInfo.itemData && this.config.response.itemInfo.itemData.baseMap) {
          var b = this.config.response.itemInfo.itemData.baseMap;
          if (b.title === "World Dark Gray Base") {
            b.title = "Dark Gray Canvas";
          }
          if (b.title) {
            console.log("Basemaps", basemaps);
            for (var j in basemaps) {
              //use this to handle translated titles		
              if (b.title === this._getBasemapName(j)) {

                toggle.defaultBasemap = j;
                //remove at 4.0		
                if (j === "dark-gray") {
                  if (this.map.layerIds && this.map.layerIds.length > 0) {
                    this.map.basemapLayerIds = this.map.layerIds.slice(0);
                    this.map._basemap = "dark-gray";
                  }
                }
                //end remove at 4.0		
                this.map.setBasemap(j);
              }
            }
          }
        }
        //add a class so we can move the basemap if the zoom position moved.
        if (this.config.zoom && this.config.zoom_position) {
          domClass.add(toggle.domNode, "embed-" + this.config.zoom_position);
        }

        if (this.config.scale) {
          domClass.add(toggle.domNode, "scale");
        }

        toggle.startup();
        deferred.resolve();
      }));
      return deferred.promise;
    },
    _getBasemapName: function (name) {
      // We have to do this because of localized strings we need 
      // a better solution 
      var current = "Streets";
      if (name === "dark-gray" || name === "dark-gray-vector") {
        current = "Dark Gray Canvas";
      } else if (name === "gray" || name === "gray-vector") {
        current = "Light Gray Canvas";
      } else if (name === "hybrid") {
        current = "Imagery with Labels";
      } else if (name === "national-geographic") {
        current = "National Geographic";
      } else if (name === "oceans") {
        current = "Oceans";
      } else if (name === "osm") {
        current = "OpenStreetMap";
      } else if (name === "satellite") {
        current = "Imagery";
      } else if (name === "streets" || name === "streets-vector") {
        current = "Streets";
      } else if (name === "streets-navigation-vector") {
        current = "World Navigation Map";
      } else if (name === "streets-night-vector") {
        current = "World Street Map (Night)";
      } else if (name === "streets-relief-vector") {
        current = "World Street Map (with Relief)";
      } else if (name === "terrain") {
        current = "Terrain with Labels";
      } else if (name === "topo" || name === "topo-vector") {
        current = "Topographic";
      }
      return current;
    },
    loadMapWidgets: function () {
      var promises = [];
      promises.push(lang.hitch(this, this._addScalebar()));
      promises.push(lang.hitch(this, this._addZoom()));


      //Position basemap gallery higher if zoom isn't taking up space
      if (this.config.zoom === false) {
        //add class so we can move basemap gallery button
        domClass.add(document.body, "no-zoom");
      }
      if (this.config.zoom && this.config.zoom_position && this.config.zoom_position !== "top-left") {
        domClass.add(document.body, "no-zoom");
      }
      promises.push(this._addLayerList());
      promises.push(this._addLegend());



      if (this.config.details) {
        var template = "<div class='map-title'>{title}</div><div class='map-details'>{description}</div>";
        var content = {
          title: this.config.response.itemInfo.item.title,
          description: this.config.response.itemInfo.item.description || this.config.i18n.tools.details.error
        };
        registry.byId("details").set("content", lang.replace(template, content));
      }

      promises.push(lang.hitch(this, this._setupFind()));

      promises.push(lang.hitch(this, this._setupSearch()));

      promises.push(lang.hitch(this._addBasemapGallery()));
      promises.push(lang.hitch(this, this._addBasemapToggle()));

      if (this.config.active_panel) {
        var tabs = registry.byId("tabContainer");
        if (tabs) {
          var panel = registry.byId(this.config.active_panel);
          if (panel) {
            tabs.selectChild(this.config.active_panel);
          }
        }
      }
      var bc = registry.byId("border_container");
      if (bc) {
        bc.resize();
      }
      all(promises).then(lang.hitch(this, function () {
        // update color theme if defined.
        if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
          var sharedTheme = this.config.sharedThemeConfig.attributes;
          this.config.buttonColor = sharedTheme.theme.text.color;
          this.config.buttonBackground = sharedTheme.theme.body.bg;
        }
        /*Create custom style and insert*/
        var sharedStyleCSS = null;
        if (this.config.buttonColor) {
          var buttonColorCSS = esriLang.substitute({
            theme: this.config.theme,
            color: this.config.buttonColor
          }, ".${theme} .menu-button{color:${color}}.${theme} .${theme} .vertical-line{background:${color};}.esriPopup div.titlePane, .esriPopup .titleButton{color:${color};}");
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += buttonColorCSS : buttonColorCSS;
        }
        if (this.config.buttonBackground) {
          var buttonCSS = esriLang.substitute({
            theme: this.config.theme,
            background: this.config.buttonBackground
          }, ".esriPopup div.titlePane{background-color:${background}}.${theme} .menu-button{background-color:${background};}.vertical-line{background-color:${background} !important;}");
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += buttonCSS : buttonCSS;
        }
        if (this.config.headerBackground) {
          var headerCSS = esriLang.substitute({
            theme: this.config.theme,
            backgroundColor: this.config.headerBackground,
            contrastColor: this._calculateColorLuminance(this.config.headerBackground, 0.2)
          }, ".calcite.${theme} .dijitTab{background:${backgroundColor};}.calcite.${theme} .dijitTabChecked{background:${contrastColor};}");
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += headerCSS : headerCSS;
        }
        if (this.config.headerColor) {
          var headerColorCSS = ".dijitTab .tabLabel{ color:" + this.config.headerColor + ";}";
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += headerColorCSS : headerColorCSS;
        }
        if (this.config.bodyBackground) {
          var panelCSS = esriLang.substitute({
            background: this.config.bodyBackground,
            theme: this.config.theme
          }, ".calcite.${theme} .dijitTabPaneWrapper{background:${background};}.${theme} .esriLayerList .esriContainer{background-color:${background};} .esriLayerList .esriContainer{background-color:${background};}");
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += panelCSS : panelCSS;
        }
        if (this.config.bodyColor) {
          var panelColorCSS = esriLang.substitute({
            color: this.config.bodyColor,
            theme: this.config.theme
          }, ".${theme} .dijitTabPane{color:${color};} .dijitTabPane{color:${color};} .esriLayerList .esriToggleButton{color:${color};}.esriLayerList .esriLabel{color:${color};}.calcite .esriLegendLayer{color:${color};} .esriLayerList .esriContainer{color:${color};}.calcite .esriLegendServiceLabel, .calcite .esriLegendLayerLabel{color:${color};} .no-select{color:${color};}");
          sharedStyleCSS = (sharedStyleCSS) ? sharedStyleCSS += panelColorCSS : panelColorCSS;
        }
        if (sharedStyleCSS) {
          var style = document.createElement("style");
          style.appendChild(document.createTextNode(sharedStyleCSS));
          document.head.appendChild(style);
        }
      }));
    },
    _calculateColorLuminance: function (color, luminosity) {

      // validate hex string
      color = new String(color).replace(/[^0-9a-f]/gi, '');
      if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
      }
      luminosity = luminosity || 0;

      // convert to decimal and change luminosity
      var newColor = "#",
        c, i, black = 0,
        white = 255;
      for (i = 0; i < 3; i++) {
        c = parseInt(color.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
        newColor += ("00" + c).substr(c.length);
      }
      return newColor;
    },
    _adjustPopupSize: function () {
      if (!this.map) {
        return;
      }
      var box = domGeometry.getContentBox(this.map.container);

      var width = 270,
        height = 300,
        newWidth = Math.round(box.w * 0.50),
        newHeight = Math.round(box.h * 0.35);

      if (newWidth < width) {
        width = newWidth;
        if (this._drawer) {
          width = 270;
        }
      }
      if (newHeight < height) {
        height = newHeight;
      }
      this.map.infoWindow.resize(width, height);
    },
    _displayBasemapContainer: function () {
      var node = null,
        gallery = query(".basemap_gallery");
      if (gallery && gallery.length > 0) {
        node = gallery[0];
      } else {
        node = this.gallery_container;
      }
      domClass.toggle(query(".icon-basemap-container")[0], "active-toggle");
      domUtils.toggle(node);

    },

    // create a map based on the input web map id
    _createWebMap: function (itemInfo, params) {
      // Optionally define additional map config here for example you can
      // turn the slider off, display info windows, disable wraparound 180,
      // slider position and more.

      var customPopup = new Popup({
        titleInBody: true
      }, domConstruct.create("div"));

      domClass.add(document.body, this.config.theme);
      domClass.add(customPopup.domNode, this.config.theme);
      params = params || {};
      if (this.config.disable_nav) {
        this.config.zoom = false;
      }
      params.mapOptions.slider = this.config.zoom;

      params.mapOptions.sliderPosition = this.config.zoom_position;
      params.mapOptions.infoWindow = customPopup;
      if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
        var sharedTheme = this.config.sharedThemeConfig.attributes;
        this.config.logoimage = sharedTheme.layout.header.component.settings.logoUrl || sharedTheme.theme.logo.small || null;
      }
      params.mapOptions.logo = (this.config.logoimage === null) ? true : false;

      //disable mouse zoom for mac
      if (this.config.disable_scroll) {
        params.mapOptions.smartNavigation = false;
      }
      return arcgisUtils.createMap(itemInfo, "mapDiv", {
        mapOptions: params.mapOptions || {},
        usePopupManager: true,
        layerMixins: this.config.layerMixins || [],
        editable: this.config.editable,
        bingMapsKey: this.config.orgInfo.bingKey || ""
      }).then(lang.hitch(this, function (response) {

        this.map = response.map;
        document.title = response.itemInfo.item.title;
        if (this.config.previewImage) {
          var preview = document.getElementById("previewImage");
          domClass.add(preview, "fade-out");
        }
        this.config.response = response;
        this._adjustPopupSize();
        if (this.config.disable_nav) {
          this.map.disableMapNavigation();
          this.map.disableKeyboardNavigation();
          this.map.disablePan();
          this.map.disableRubberBandZoom();
          this.map.disableScrollWheelZoom();
        }

        if (this.config.logoimage) {
          query(".esriControlsBR").forEach(lang.hitch(this, function (node) {
            var link = null;
            if (this.config.logolink) {
              link = domConstruct.create("a", {
                href: this.config.logolink,
                target: "_blank"
              }, node);
            }

            //create a logo image
            domConstruct.create("img", {
              src: this.config.logoimage,
              "class": "logo"
            }, link || node);

          }));
        }
        //disable mouse zoom
        if (this.config.disable_scroll) {
          this.map.disableScrollWheelZoom();
        }
        if (params.markerGraphic) {
          // Add a marker graphic with an optional info window if
          // one was specified via the marker url parameter
          require(["esri/layers/GraphicsLayer"], lang.hitch(this, function (GraphicsLayer) {
            var markerLayer = new GraphicsLayer();

            this.map.addLayer(markerLayer);
            markerLayer.add(params.markerGraphic);

            if (params.markerGraphic.infoTemplate) {
              this.map.infoWindow.setFeatures([params.markerGraphic]);
              this.map.infoWindow.show(params.markerGraphic.geometry);
            }

          }));

        }
        // remove loading class from body
        domClass.remove(document.body, "app-loading");

        if (this.config.popup_sidepanel) { //display popup content in the side panel
          this.map.infoWindow.set("popupWindow", false);
          this._initializeSidepanel();
        }
        this.loadMapWidgets();
        /* ---------------------------------------- */
        /*                                          */
        /* ---------------------------------------- */
        // return for promise
        return response;
        // map has been created. You can start using it.
        // If you need map to be loaded, listen for it's load event.
      }), this.reportError);
    },
    _displayPopupContent: function (feature, selectedIdx, count) {
      if (feature) {
        var content = feature.getContent();
        registry.byId("info_content").set("content", content);
        if (selectedIdx && count) {
          domAttr.set(dom.byId("nav_count"), "innerHTML", "" + selectedIdx + "/" + count);
        }
      }
    },
    _initializeSidepanel: function () {
      var popup = this.map.infoWindow,
        prev = dom.byId("prev_nav"),
        next = dom.byId("next_nav"),
        popupNav = dom.byId("popupNav"),
        selectCount = dom.byId("selectCount");
      popup.on("selection-change", lang.hitch(this, function () {
        if (popup.count > 1) {
          this._displayPopupContent(popup.getSelectedFeature(), (popup.selectedIndex + 1), popup.count);
          domAttr.set(prev, "disabled", false);
          domAttr.set(next, "disabled", false);
          if (popup.selectedIndex === 0) {
            domAttr.set(prev, "disabled", true);
          } else if (popup.selectedIndex + 1 === popup.count) {
            domAttr.set(next, "disabled", true);
          }
        } else {
          this._displayPopupContent(popup.getSelectedFeature());
        }

      }));
      popup.on("clear-features", lang.hitch(this, function () {
        domUtils.hide(popupNav);
        registry.byId("info_content").set("content", "");
        domAttr.set(prev, "disabled", false);
        domAttr.set(next, "disabled", false);
        dom.byId("nav_count").innerHTML = "";
        domUtils.show(selectCount);
      }));
      popup.on("set-features", lang.hitch(this, function () {
        registry.byId("tabContainer").selectChild("popup");
        var drawer = query(".drawer-open");
        if (drawer && drawer.length === 0) {
          //drawer is not open so open it
          dom.byId("toggle_button").click();
        }
        if (popup.features && popup.features.length > 1) {
          this._displayPopupContent(popup.getSelectedFeature(), (popup.selectedIndex + 1), popup.count);
          //starting at first feature
          domUtils.show(popupNav);
          domAttr.set(next, "disabled", false);
          domAttr.set(prev, "disabled", true);
        } else {
          domUtils.hide(popupNav);
          this._displayPopupContent(popup.getSelectedFeature());
        }
        domUtils.hide(selectCount);
        this._drawer.resize();
      }));
      on(prev, "click", function () {
        popup.selectPrevious();
      });
      on(next, "click", function () {
        popup.selectNext();
      });
    },
    _getBasemapGroup: function () {
      //Get the id or owner and title for an organizations custom basemap group.
      var basemapGroup = null;
      if (this.config.basemapgroup && this.config.basemapgroup.title && this.config.basemapgroup.owner) {
        basemapGroup = {
          "owner": this.config.basemapgroup.owner,
          "title": this.config.basemapgroup.title
        };
      } else if (this.config.basemapgroup && this.config.basemapgroup.id) {
        basemapGroup = {
          "id": this.config.basemapgroup.id
        };
      }
      return basemapGroup;
    },
    _supportsPagination: function (source) {
      // check if featurelayer supports pagination remove at 3.14
      var supported;
      if (source.locator) {
        supported = true;
      } else if (source.featureLayer) {
        // supports pagination
        if (source.featureLayer.advancedQueryCapabilities && source.featureLayer.advancedQueryCapabilities.supportsPagination) {
          supported = true;
        }
      }
      return supported;
    }
  });
});
