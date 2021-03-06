/*global define,location */
/*jslint sloppy:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
  //Default configuration settings for the application. This is where you'll define things like a bing maps key,
  //default web map, default app color theme and more. These values can be overwritten by template configuration settings and url parameters.
  "appid": "",
  "webmap": "24e01ef45d40423f95300ad2abc5038a",
  "oauthappid": "arcgisWebApps", //"AFTKRmv16wj14N3z",
  "extent": null,
  "home": false,
  "zoom": true,
  "zoom_position": "top-left",
  "scale": true,
  "search": false,
  "searchextent": true,
  "logoimage": null,
  "logolink": null,
  "basemap_toggle": false,
  "basemap_gallery": false,
  //"streets" , "satellite" , "hybrid", "topo", "gray", "oceans", "national-geographic" "osm"
  "alt_basemap": "satellite",
  "legend": false,
  "legendlayers": false,
  "popup_sidepanel": false,
  "details": false,
  "active_panel": "legend", //"legend, details, popup"
  "find": null,
  "feature": null,
  "show_panel": false,
  // This is an option added so that developers working with the
  // hosted version of the application can apply custom styles
  // not used in the download version.
  "customstyle": null,
  "theme": "light",
  // Or define background and text colors
  "buttonBackground": null,
  "buttonColor": null,
  "headerBackground": null,
  "headerColor": null,
  "bodyBackground": null,
  "bodyColor": null,
  "color": null,
  "iconcolor": null,
  "markerSymbol": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAdVBMVEX///8dQ3MdQ3MdQ3MdQ3MdQ3MdQ3MdQ3MdQ3MdQ3MfRnggSX0iTYImVpEsZq0tY6UtZ64taLAuabEva7QxbbMxbrczcLg1c701dcE2dsI5cLJDf8ZhjMJomNF7oMyCqtm+0ObB1ezL2evN3fDz9vrz9/v////A4KgrAAAACXRSTlMAEEBwkKDQ4PCy0djnAAAAkUlEQVQoz83Q2w6CMAyA4XFmHIoHBKeggrr3f0Q3iiGdxcQ7/9svS9sJMedHqTSlkS+cwrxqlKmp8pBKULQWALaHtggIJbVCAtjXCSFp4dx3J2Mq+6DrU+vHhaNeT3WgpEsD0o2hO9L426svs5YN5fpdDOFv/AltHIrLN+2OZUzIQ0PxBGOczMYKGi+TrYg1Ii+BgBmO06qR0gAAAABJRU5ErkJggg==",
  "markerSymbolWidth": 26,
  "markerSymbolHeight": 26,
  "level": null,
  "center": null,
  "disable_scroll": true,
  "disable_nav": false, // set to true to disable all map navigation
  //Enter the url to the proxy if needed by the application. See the 'Using the proxy page' help topic for details
  //http://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
  "proxyurl": "",
  "bingKey": "", //Enter the url to your organizations bing maps key if you want to use bing basemaps
  //Defaults to arcgis.com. Set this value to your portal or organization host name.
  "sharinghost": location.protocol + "//" + "www.arcgis.com",
  "units": null,
  //If your applcation needs to edit feature layer fields set this value to true. When false the map will
  //be dreated with layers that are not set to editable which allows the FeatureLayer to load features optimally.
  "editable": false,
  //Setup the app to support a custom url parameter. Use this if you want users
  //to be able to search for a string field in a layer. For example if the web map
  //has parcel data and you'd like to be able to zoom to a feature using its parcel id
  //you could add a custom url param named parcel then users could enter
  //a value for that param in the url. index.html?parcel=3203
  "customUrlLayer": {
    "id": null, //id of the search layer as defined in the web map
    "fields": [] //Name of the string field to search
  },
  "customUrlLayerZoomScale": null,
  "customUrlParam": null, //Name of url param. For example parcels
  "helperServices": {
    "geometry": {
      "url": null
    },
    "printTask": {
      "url": null
    },
    "elevationSync": {
      "url": null
    },
    "geocode": [{
      "url": null
    }]
  }
});
