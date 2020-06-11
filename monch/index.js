import * as Map from './component/map'
import * as BasicLayer from './component/basicLayer'
import * as Marker from './component/marker'
import * as Overlay from './component/overlay'
import * as Cluster from './component/cluster'
import * as Interaction from './component/interaction'
import * as Flash from './component/flash'
import * as Vector from './component/vector'
import * as components from "./component";
import * as helpers from './util/helpers'
import olData from './util/olData'
import 'ol/ol.css'
import './sass/main.scss'

function plugin(Vue) {
    if (plugin.installed) {
        return;
    }
    plugin.installed = true;

    Vue.use(Map);
    Vue.use(BasicLayer);
    Vue.use(Marker);
    Vue.use(Overlay);
    Vue.use(Cluster);
    Vue.use(Interaction);
    Vue.use(Flash);
    Vue.use(Vector);
    Vue.prototype.$mapUtils = helpers;
}

let olMap = {
    ...components,
    helpers,
    olData,
    install: plugin
}
export default olMap;