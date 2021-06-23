/**********************
 * COMPONENTE DE CLASE DEL GEOCODING. Comvertimos el componente funcional a uno de clase.
 */

import React, {useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';

import {Surface} from 'react-native-paper'
import {connect} from 'react-redux'

class Geocoding extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      searchKeyword:'',
      isShowingResults:false,
      gvSigUrl:'https://bombers.gvsigonline.com/gvsigonline/',
      options:{}
    }
  }

  //-----------función con la llamada a search_candidates y get_providers_activated
  lookup = async text => {
    const candidatos = [];
    this.setState({
      searchKeyword:text
  })
    console.log(gvSigUrl + '/geocoding/search_candidates/?limit=10&q=' + text);

    
    if (text.length < 3) {
      this.setState({
        isShowingResults:false,
        options:{}
      })
    } // (cuando ya has hecho una búsqueda previa) que no aparezcan los resultados cuando el texto sea menor que 3 letras 

    if (text.length >= 3) {
      let response = await fetch(
        gvSigUrl + '/geocoding/search_candidates/?limit=10&q=' + text,
      );

      let json = await response.json();
      console.log(json);
      let results = json.suggestions;
      this.setState({
        isShowingResults:true
      })
    
      if (results.length > 0) {
        //llamada a la API para recoger los proveedores activos
        let response = await fetch(
          gvSigUrl + '/geocoding/get_providers_activated/',
        );
        let json = await response.json();
        console.log('Proveedores' + JSON.stringify(json));
        let provee = json.types;

        //recogemos para cada proveedor sus candidatos de búsqueda
        provee.map(prov => {
          const arrayOptions = [];
          results.map(suggest => {
            if (suggest.category === prov) {
              arrayOptions.push(suggest);
            }
          });
          candidatos.push({
            label: prov,
            options: arrayOptions,
          });
        });
      }
      console.log(candidatos);
      this.setState({
        options:candidatos
      })
    }
  };

 //----------función con la llamada a find_candidate
  geocode = async suggest => {
    console.log(' geocode de ' + JSON.stringify(suggest));
    // TODO: Aquí tenemos que pillar el suggest.raw y
    // obtener el idcalle, id, etc para buscar
    // las coordenadas de una dirección y luego llamar al zoom
    // let csrftoken = Cookies.get("csrftoken");

    // FJP: Esta parte es probable que tenga que cambiarse en gvSIG Online. Jose envía de una forma muy rara
    // la dirección:
    let formBody = [];
    for (let property in suggest) {
      var encodedKey = encodeURIComponent('address[' + property + ']');
      let encodedValue = encodeURIComponent(suggest[property]);
      if (suggest[property] == null) formBody.push(encodedKey + '=');
      else formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    console.log('EL BODY DEL FETCH:  ' + formBody);

    return await fetch(gvSigUrl + '/geocoding/find_candidate/', {
      method: 'POST',
      headers: {
        //"Content-Type": "application/json"
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formBody, // body data type must match "Content-Type" header
    })
      .then(response => response.json())
      .then(json => {
        console.log('find_candidate: ' + JSON.stringify(json));
        let encontrados = json.address;
        var lat = '\nlat: ' + encontrados.lat;
        var lon = '\nlng: ' + encontrados.lng;
        console.log('Coordenadas ->' + lat + ' ' + lon);
        Alert.alert('Geocoding', 'Hacer zoom en: ' + lat + lon, [
          {
            text: 'OK',
            style: 'OK',
          },
        ]);
      })
      .catch(err => console.error(err.message));
  };

  //------- funciones renderizado de candidatos ------
  renderTitle = title => {
    return <Text style={Styles.categoryLabel}>{title}</Text>;
  };

  myRenderItem = item => {
    return (
      <TouchableOpacity
        key={item.id}
        style={Styles.resultItem}
        onPress={() => {
          geocode(item);
          this.setState({
            isShowingResults:false,
            searchKeyword:item.address
          })
        }}>
        <Text>{item.address}</Text>
      </TouchableOpacity>
    );
  };
//------- 

render() {
  return (
    <View>
      <Surface style={styles.container}>
      {isShowingResults && (
        <FlatList
          data={options}
          renderItem={myRender}
          keyExtractor={item => item.id.toString()}
          style={Styles.searchResultsContainer}
        />
      )}

      <View style={Styles.autocompleteContainer}>
        <TextInput
          placeholder="Search for an address"
          returnKeyType="search"
          style={Styles.searchBox}
          placeholderTextColor="#000"
          onChangeText={text => lookup(text)}
          value={searchKeyword}
        />
      </View>
      </Surface>
    </View>
  );
}
}


const Styles = StyleSheet.create({
  container: {
    height:50,
    width: '100%',
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white'
},
  autocompleteContainer: {
    zIndex: 1,
  },
  searchResultsContainer: {
    width: 340,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
    zIndex: 2,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 15,
  },
  categoryLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    height: 25,
    paddingLeft: 15,
    backgroundColor: '#5AF8EE',
    alignItems: 'center',
  },
  searchBox: {
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
});

function mapStateToProps(state) {
  const { config } = state
  return { config }
}

function mapDispatchToProps(distpatch) {
  return {
      addProperty: (config) => addProperty(config, distpatch),
      removeProperty: (config) => removeProperty(config, distpatch),
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Geocoding)