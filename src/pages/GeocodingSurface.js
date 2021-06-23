import React from 'react';
import Geocoding from '../components/organisms/Geocoding';
import {View} from 'react-native'
import GeocodingInput from '../components/organisms/GeocodingInput';

class GeocodingSurface extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
      <GeocodingInput/>
    </View>
    );
  }
}
const renderGeocoding = () => {
  console.log(Conf)
  console.log('DENTRO DE RENDER GEOCODING')
  alert('hola')
  
    return (
      <GeocodingSurface/>
    )
  }

const getPanel = (navigation, store, map) => {
  return <GeocodingSurface navigation = {navigation} store={store} map={map} />;
};

const getTitle = () => {
  return 'geocoding';
};

const getStyleButton = () => {
  return null //No tiene boton
};

const getBackgroundColor = () => {
  return '#b3b3b3';
};

const id = 0;

export default {getPanel, getTitle, getStyleButton, getBackgroundColor, renderGeocoding, id};
