# gvmapps_geocoding_plugin
Plugin geocoding para gvmapps 

23/06 - Se crea este plugin para integrar el geocodig en gvmapps. 
  A día de hoy el plugin añade un botón a MapControls.js y crea una subpropiedad llamada 'show_geocoding_input' con value=false. 
  
  El componente 'GeocodingInput' es incluido en 'gvmapps_core/componentes/organisms/map'. 
  
  Al nuevo botón, Se le pasará una funcion definida en el plugin 'handlerGeocodingOn' haciendo uso de registerPoint. Esta función, 
  cambiará 'show_geocoding_input' de false a true, y viciversa. De manera que con un rednderizado condicional, es posible mostrar o esconder
  el inputText del geocoding.
