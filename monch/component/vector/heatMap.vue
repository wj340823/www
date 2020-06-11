<template>
    <div class="vueol-heat" style="display: none;"></div>
</template>
<script>
    import {Heatmap} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import { createFeature } from '../../util/helpers';

    export default {
        name: 'ol-heat-map',
        inject: ['getMap'],
        props: {
            layerConfig: {
                type: Object,
                default: {
                    blur: 15,
                    radius: 8
                }
            },
            points: {
                type: Array,
                required: true,
                default() {
                    return []
                }
            },
            zIndex: {
                type: Number,
                default: 2
            },
            projection: {
                type: String,
                default: 'EPSG:4326'
            }
        },
        watch: {
            points: {
                handler(nval) {
                    const vm = this;
                    vm.getMap().then(map => {
                        vm.update(map);
                    })
                },
                deep: true
            }
        },
        data() {
            return {
                source: null,
                layer: null
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getMap().then((map) => {
                    this.createLayer(map);
                    this.update(map);
                })
            },
            createLayer(map) {
                this.source = new VectorSource();
                this.layer = new Heatmap({
                    source: this.source,
                    ...this.layerConfig,
                    zIndex: this.zIndex
                });
                this.layer.set("heatLayer", true);
                map.addLayer(this.layer);
            },
            update(map) {
                const vm = this;
                const viewProjection = map.getView().getProjection().getCode();
                const count = this.points.length;
                let features = new Array();

                for (let i = 0; i < count; i++) {
                    let point = this.points[i];
                    if (point.lon && point.lat) {
                        let feature = createFeature({
                            projection: vm.projection,
                            lat: parseFloat(point.lat),
                            lon: parseFloat(point.lon),
                            id: point.id
                        }, viewProjection);
                        if (point.weight) {
                            feature.set('weight', point.weight);
                        }
                        features.push(feature);

                        feature.set("featureInfo", {
                            type: "heatFeature",
                            data: {}
                        });

                    }
                }

                this.source.clear(true);
                this.source.addFeatures(features);
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