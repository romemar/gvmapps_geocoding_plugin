/**
    gvSIG Mobile Framework.
    Copyright (C) 2010-2020 SCOLAB.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
@author: nbrodin <nbrodin@scolab.es>
*/

import registerPoint from "../../gvmapps_core/services/RegisterPoint"
import dbservice from '../../gvmapps_core/services/BDService'
import DeepLinkService from '../../gvmapps_core/services/DeepLinkService'
import GvSIGOLService from '../../gvmapps_core/services/GvSIGOLService'
import GeocodingSurface from './src/pages/GeocodingSurface'


global.db = null
global.location = null

/*************PLUGIN API***************/

/**
 * Plugin initialization.
 * It registers the message manager to process incoming messages and the marker info dialog 
 */
init = (store) => {
    console.log("Init plugin geocoding")
    registerPoint.addFirst("GEOCODING_ON_OFF", handlerGeocodingOn)
    
    /** Añadimos una subpropiedad a map, la cual cambiaremos de estado con el método 
    handlerGeocodingOn asignado al onPress del nuevo Map Control creado.  */
    store.addSubProperty({key: 'map', subkey: 'show_geocoding_input', value: false})
}

post = (store) => {
}


afterMount = ( props ) => {
   
}

getPluginName = () => {
    return "gvsig_geocoding_plugin"
}

getPluginTrans = (lang) => {
    if(lang == 'es') 
        return require('./assets/i18n/es.json')
    if(lang == 'en') 
        return require('./assets/i18n/en.json')
    if(lang == 'fr') 
        return require('./assets/i18n/fr.json')
}

//Método para modificar la nuevo subpropiedad creada. 

const handlerGeocodingOn = (props) => {
    console.log('Dentro de handlerGeocodingOn')
    console.log(JSON.stringify(props.config.map.show_geocoding_input))
    //console.log(JSON.stringify(props.config.map.props.updateSubProperty))

    if(props.config.map.show_geocoding_input == true){
        props.addSubProperty({key: 'map', subkey: 'show_geocoding_input', value: false})
    } else {
        props.addSubProperty({key: 'map', subkey: 'show_geocoding_input', value: true})
    }

    }

/*************END PLUGIN API***************/



export default {init, post, afterMount, getPluginTrans, getPluginName};