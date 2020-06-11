import basicLayer from './basicLayer.vue'

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(basicLayer.name, basicLayer);
}

export default plugin;

export {
    basicLayer as OlLayer,
    plugin as install
}