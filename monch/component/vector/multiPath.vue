/*
* 多个feature加载 比使用多个olPath组件性能高
* 并且对交互基本没有要求
* 所以特意为此写了一个组件
* type种类Point, LineString, MultiLineString, Polygon等
*/
<template>
    <div class="vueol-mulpath" style="display: none;"></div>
</template>
<script>
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import {createFeature, deepClone, coordinateTransform, calcRadius } from '../../util/helpers'
    import {olMapDefaults} from "../../util/olMapDefaults";

    export default {
        name: 'ol-mul-path',
        inject: ['getMap'],
        props: {
            grids: {
                type: Array,
                required: true
            },
            isFit: {
              type: Boolean,
              default: false
            },
            zIndex: {
                type: Number,
                default: 0
            },
            projection: {
                type: String,
                default: 'EPSG:4326'
            }
        },
        data() {
            return {}
        },
        watch: {
            grids: {
                handler() {
                    const vm = this;
                    vm.getMap().then(map => {
                        vm.update(map);
                    })
                },
                deep: true
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.initData();
                this.getMap().then((map) => {
                    this.createLayer(map);
                    this.update(map);
                })
            },
            initData() {
                this.layer = null;
                this.source = null;
            },
            createLayer(map) {
                this.source = new VectorSource();
                this.layer = new VectorLayer({
                    source: this.source,
                    zIndex: this.zIndex
                });
                this.layer.set("mulPathLayer", true);
                map.addLayer(this.layer);
            },
            update(map) {
                const vm = this;
                const viewProjection = map.getView().getProjection().getCode();
                const defaults = olMapDefaults.getDefaults();

                let defaultStyle = defaults.styles.feature;

                let nVal = this.grids;
                let features = new Array();
                nVal.forEach(function (point) {
                    let data = deepClone(point);
                    data.style = data.style || defaultStyle;
                    data.projection = vm.projection;
                    if (point.radius) {
                        if(vm.projection!="pixel") {
                            data.coords = coordinateTransform(data.coords, vm.projection, viewProjection);
                            data.radius = calcRadius(viewProjection, data.radius, data.coords);
                            data.projection = viewProjection;
                        }
                    }
                    let feature = createFeature(data, viewProjection);
                    features.push(feature);
                });
                vm.source.clear(true);
                vm.source.addFeatures(features);

                vm.$emit("loadFinished", {
                    source: vm.source
                })

                if(vm.isFit){
                    map.getView().fit(vm.source.getExtent());
                }
            }
        },
        beforeDestroy() {
            const vm = this;
            vm.getMap().then((map) => {
                let source = vm.source;
                source.getFeatures().forEach(function (f) {
                    let s = f.getStyle();
                    s = null;
                    f = null;
                })
                source.clear();
                source = null;
                map.removeLayer(vm.layer);
            })
        }
    }
</script>