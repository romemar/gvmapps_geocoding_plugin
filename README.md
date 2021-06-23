# gvmapps_geocoding_plugin
Plugin geocoding para gvmapps 

23/06 - Se crea este plugin para integrar el geocodig en gvmapps. 
  A día de hoy el plugin añade un botón a MapControls.js y crea una subpropiedad llamada 'show_geocoding_input' con value=false. 
  
  El componente 'GeocodingInput' es incluido en 'gvmapps_core/componentes/organisms/map'. 
  
  Al nuevo botón, Se le pasará una funcion definida en el plugin 'handlerGeocodingOn' haciendo uso de registerPoint. Esta función, 
  cambiará 'show_geocoding_input' de false a true, y viciversa. De manera que con un rednderizado condicional, es posible mostrar o esconder
  el inputText del geocoding.

MODIFICACIONES EN src/custom/config/Con.js de gvMapps_Bombersdv_App: 
Se añade la siguiente línea en config --map -- button_bar para incluir un nuevo botón en el mapa.

{icon: 'search', bgcolor: '#ffffff', registerpoint: 'GEOCODING_ON_OFF'},

-----
MODIFICACIONES EN EL gvMapps_Core 
- Añadimos nuestro componente 'GeocodingInput' en 'gvmapps_core/componentes/organisms/map'. 

- Modificamos Map.js en 'gvmapps_core/componentes/organisms/

   Dentro del constructor:
     candidate: {}, (un nuevo state)

     (Métodos que pasaremos a GeocodingInput como props)
      this.goTo = this.goTo.bind(this); //método ya creado 
      this.handler = this.handler.bind(this); 

  
     //-----------MÉTODOS_GEOCODING DENTRO DE LA CLASE MAP ----------
      getGeocoding() {
        //if(this.props.config.map.show_geocoding_input == true){ <GeocodingInput goTo={this.goTo} handler={this.handler}/>
        let geocodingOn = this.props.config.map.show_geocoding_input
          return (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}>
              <GeocodingInput goTo={this.goTo} handler={this.handler} geocodingOn={geocodingOn}/>
            </View>
          );
        }

      //manejador que usaremos para cambiar el state candidate de Map.js desde GeocodingInput.js
      handler = param => {
        this.setState({
          candidate: param,
        });
      };

      addMarkerGeocoding(item) {
        console.log('Dentro de ADDMARKER:' + JSON.stringify(item));
        console.log('Añadiendo marcador');
        return (
          <Marker
            title={item.address}
            image={pointselected}
            key={item.id}
            id={item.id}
            coordinate={{
              latitude: item.lat,
              longitude: item.lng,
            }}
          />
        );
      }
