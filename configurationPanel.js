{
    "configurationSettings": [{
        "category": "General",
        "fields": [{
            "type": "webmap"
        }, {
            "type": "appproxies"
        }]
    }, {
        "category": "Theme",
        "fields": [{
            "type": "subcategory",
            "label": "Colors"
        }, {
            "type":"paragraph",
            "value":"Choose one of the default color themes (Light/Dark) or use the custom option to choose custom colors for the app"
        },{
            "type": "string",
            "fieldName": "theme",
            "tooltip": "Color Theme",
            "label": "Color Theme:",
            "options": [{
                "label": "Light",
                "value": "light"
            }, {
                "label": "Dark",
                "value": "dark"
            }]
        }, {
            "type": "conditional",
            "condition": false,
            "fieldName": "presetTheme",
            "label": "Select custom theme colors",
            "items": [{
                "fieldName": "buttonBackground",
                "type": "color",
                "label": "Button background color",
                "sharedThemeProperty": "button.background"
            }, {
                "fieldName": "buttonColor",
                "type": "color",
                "label": "Choose button text color",
                "sharedThemeProperty": "button.text"
            }, {
                "fieldName": "headerBackground",
                "type": "color",
                "label": "Header background color",
                "sharedThemeProperty": "header.background"
            }, {
                "fieldName": "headerColor",
                "type": "color",
                "label": "Header text color",
                "sharedThemeProperty": "header.text"
            }, {
                "fieldName": "bodyBackground",
                "type": "color",
                "label": "Body background color",
                "sharedThemeProperty": "body.background"
            }, {
                "fieldName": "bodyColor",
                "type": "color",
                "label": "Body text color",
                "sharedThemeProperty": "body.text"
            }]
        }, {
            "label": "Map Logo URL",
            "fieldName": "logoimage",
            "type": "string",
            "tooltip": "Provide a url to your logo. Defaults to Esri logo.",
            "sharedThemeProperty": "logo.small"
        }, {
            "label": "Map Logo Link",
            "fieldName": "logolink",
            "type": "string",
            "tooltip": "Url to navigate to when logo is clicked",
            "sharedThemeProperty": "logo.link"
        }, {
            "type": "subcategory",
            "label": "Custom Layout Options"
        }, {
            "type": "paragraph",
            "value": "Use the Custom css option to paste css that overwrites rules in the app."
        }, {
            "type": "string",
            "fieldName": "customstyle",
            "tooltip": "Custom css",
            "label": "Custom css"
        }]
    }, {
        "category": "Options",
        "fields": [{
            "type": "conditional",
            "condition": false,
            "fieldName": "zoom",
            "label": "Zoom Slider",
            "items": [{
                "type": "boolean",
                "fieldName": "home",
                "label": "Home Extent Button"
            }, {
                "type": "string",
                "fieldName": "zoom_position",
                "tooltip": "Choose the location of the zoom slider.",
                "label": "Choose the zoom position:",
                "options": [{
                    "label": "Top Left",
                    "value": "top-left"
                }, {
                    "label": "Top Right",
                    "value": "top-right"
                }, {
                    "label": "Bottom Left",
                    "value": "bottom-left"
                }, {
                    "label": "Bottom Right",
                    "value": "bottom-right"
                }]
            }]
        }, {
            "type": "paragraph",
            "value": "If both basemap gallery and basemap toggle are selected only the gallery will display."
        }, {
            "type": "boolean",
            "fieldName": "basemap_gallery",
            "label": "Basemap Gallery"
        }, {
            "type": "conditional",
            "condition": false,
            "fieldName": "basemap_toggle",
            "label": "Basemap Toggle",
            "items": [{
                "type": "basemaps",
                "fieldName": "alt_basemap",
                "tooltip": "Specify an alternate basemap",
                "label": "Alternate basemap"
            }]
        }, {
            "type": "boolean",
            "fieldName": "scale",
            "label": "Scalebar"
        }, {
            "type": "paragraph",
            "value": "Disabled scrolling is important when embedding maps into websites or blogs.  If this will be a stand-alone app, you may want to uncheck 'Disable scrolling in app' if you want to provide the ability to use the mouse scroll wheel to navigate in this app. To disable all map navigation check the Disable map navigation checkbox."
        }, {
            "type": "boolean",
            "fieldName": "disable_scroll",
            "label": "Disable scrolling in app"
        }, {
            "type": "boolean",
            "fieldName": "disable_nav",
            "label": "Disable all map navigation"
        }, {
            "type": "paragraph",
            "value": "Options to add a legend, details and popup info to the side panel."
        }, {
            "type": "boolean",
            "fieldName": "show_panel",
            "label": "Display the side panel when the app loads."
        }, {
            "type": "paragraph",
            "value": "Choose to display either the legend alone or as an integrated legend + layer list."
        }, {
            "type": "conditional",
            "condition": false,
            "fieldName": "legend",
            "label": "Display a legend",
            "items": [{
                "type": "boolean",
                "fieldName": "legendlayers",
                "label": "Display legend + layer list"
            }]
        }, {
            "type": "boolean",
            "fieldName": "details",
            "label": "Display map details in side panel"
        }, {
            "type": "boolean",
            "fieldName": "popup_sidepanel",
            "label": "Display popup content in side panel"
        }, {
            "type": "string",
            "fieldName": "active_panel",
            "tooltip": "Choose the panel presented when the app loads.",
            "label": "Choose the default panel:",
            "options": [{
                "label": "Legend",
                "value": "legend"
            }, {
                "label": "Details",
                "value": "details"
            }, {
                "label": "Popup Info",
                "value": "popup"
            }]
        }]
    }, {
        "category": "Search",
        "fields": [{
            "type": "subcategory",
            "label": "Search Settings"
        }, {
            "type": "paragraph",
            "value": "Enable search to allow users to find a location or data in the map. Configure the search settings to refine the experience in your app by setting the default search resource, placeholder text, etc."
        }, {
            "type": "conditional",
            "condition": false,
            "fieldName": "search",
            "label": "Enable search tool",
            "items": [{
                "type": "boolean",
                "fieldName": "searchextent",
                "label": "Limit search to the default extent of the map"
            }, {
                "type": "search",
                "fieldName": "searchOptions",
                "label": "Configure Search"
            }]
        }, {
            "type": "subcategory",
            "label": "Custom Url Parameters"
        }, {
            "type": "paragraph",
            "value": "Setup the app to support a custom url parameter. For example if your map contains a feature layer with parcel information and you'd like to be able to find parcels using a url parameter you can use this section to do so. Select a layer and search field then define the name of a custom param. Once you've defined these values you can append the custom search to your application url using the custom parameter name you define. For example, if I set the custom param value to parcels a custom url would look like this index.html?parcel=3045"
        }, {
            "placeHolder": "i.e. parcels",
            "label": "URL param name:",
            "fieldName": "customUrlParam",
            "type": "string",
            "tooltip": "Custom URL param name"
        }, {
            "type": "layerAndFieldSelector",
            "fieldName": "customUrlLayer",
            "label": "Layer to search for custom url param value",
            "tooltip": "Url param search layer",
            "fields": [{
                "multipleSelection": false,
                "fieldName": "urlField",
                "label": "URL param search field",
                "tooltip": "URL param search field"
            }],
            "layerOptions": {
                "supportedTypes": ["FeatureLayer"],
                "geometryTypes": ["esriGeometryPoint", "esriGeometryLine", "esriGeometryPolyline", "esriGeometryPolygon"]
            }
        }, {
            "type": "paragraph",
            "label": "Specify custom zoom scale"
        }, {
            "type": "scaleList",
            "fieldName": "customUrlLayerZoomScale",
            "label": "Choose zoom level"
        }]
    }],
    "values": {
        "home": false,
        "zoom": true,
        "zoom_position": "top-left",
        "theme": "light",
        "presetTheme": false,
        "active_panel": "legend",
        "show_panel": false,
        "scale": true,
        "search": false,
        "searchextent": true,
        "logoimage": null,
        "logolink": null,
        "details": false,
        "legend": false,
        "legendlayers": false,
        "popup_sidepanel": false,
        "basemap_gallery": false,
        "basemap_toggle": false,
        "disable_scroll": false,
        "disable_nav": false
    }
}
