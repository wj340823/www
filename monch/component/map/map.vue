<template>
    <div class="vueol-map" :id="options.id" style="height: 100%;">
        <slot></slot>
    </div>
</template>
<script>
    import Map from 'ol/Map';
    import OlView from './view.vue';
    import {Heatmap} from 'ol/layer';
    import {layerMethods} from '../../util/layer';
    import {getControlClasses, coordinateTransform} from "../../util/helpers";

    import olData from "../../util/olData";
    import Bus from '../../util/bus'

    export default {
        name: 'suc-map',
        mixins: [OlView],
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        id: 'default',
                        controls: [{ //全屏
                            name: "fullscreen"
                        }, { //鹰眼
                            name: "overviewmap",
                            collapsed: false,
                            label: "«",
                            collapseLabel: "»",
                            tipLabel: "鹰眼"
                        }]
                    }
                }
            }
        },
        data() {
            return {
                mapObject: null,
                promise: null
            }
        },
        watch: {
            projection: {
                handler(value) {
                    //pixel
                    if (this.$view && this.$view.getProjection().getExtent() && value.extent && value.extent !== this.$view.getProjection().getExtent()) {
                        this.$view = this.createView();
                        this.mapObject.setView(this.$view);
                    }
                },
                deep: true
            }
        },
        created() {
            const vm = this;
            vm.promise = new Promise(function (resolve, reject) {
                vm.resolve = resolve;
            })
        },
        mounted() {
            this.init();
        },
        provide: function () {
            return {
                getMap: this.getMap
            }
        },
        methods: {
            init() {
                const vm = this;
                vm.mapObject = this.createMap();
                vm.$view = vm.createView();
                vm.mapObject.setView(vm.$view);

                //view 改变事件监听
                vm.listenViewChange(vm.mapObject);
                vm.createControls();

                vm.resolve(vm.mapObject);   //getMap
                olData.setMap(vm.mapObject, vm.options.id);
                /*olData.getMap(vm.options.id).then(function (map) {
                    console.log(map)
                })*/

                //监听事件
                vm.options.events.forEach((event) => {
                    vm.listenEvent(vm.mapObject, event);
                })

                window.onresize = function () {
                    vm.mapObject.updateSize();
                }

            },
            createMap() {
                const map = new Map({
                    target: this.$el
                });

                return map;
            },
            getMap() {   //异步 子组件访问map对象
                return this.promise;
            },
            createControls() {
                const vm = this;
                const controls = vm.options.controls || [];
                const controlClasses = getControlClasses();
                const olControls = [];

                //去除默认control
                let ctrls = vm.mapObject.getControls();
                ctrls.forEach(c => {
                    vm.mapObject.removeControl(c);
                })

                controls.forEach(item => {
                    if (item.name == "overviewmap") {
                        const layers = [];
                        if (item.layers) {
                            item.layers.forEach(function (layer) {
                                const olLayer = layerMethods.createLayer(layer, vm.$view.getProjection());
                                layers.push(olLayer);
                            });
                            item.layers = layers;
                        }
                        item.view = vm.createView();
                    }

                    const olControl = new controlClasses[item.name](item);
                    olControls.push(olControl);
                    vm.mapObject.addControl(olControl);
                })
                return olControls;
            },

            /**
             *  @description: 地图事件监听 并向组件（marker图层、聚集图层、esrijson 或 geojson 矢量图层、海量点位、轨迹图层）发送信息
             *  @param {String} eventType 事件类型 pointermove\singleclick
             *  @param {String} proj  坐标系
             *  @param {Array} coord  坐标数组
             *  @param {Array} layerFeature 事件发生处的[layer, feature]
             *  @return void
             *  @author xrx
             *  @date 2019/5/22 10:17
             */
            emitEvent(eventType, proj, coord, layerFeature) {
                const vm = this;

                if (layerFeature && layerFeature[1]) {
                    const olLayer = layerFeature[0],
                        feature = layerFeature[1];
                    let tempInfo = feature.get("featureInfo"),
                        featureType;
                    if (tempInfo) {
                        featureType = tempInfo.type;
                    }

                    if (feature.get("features")) { //汇聚而成的点位
                        featureType = "clusterFeature";
                    }

                    if (featureType === "marker") { //marker图层矢量对象
                        Bus.$emit((vm.options.id || "default") + ".marker." + eventType, {
                            feature: feature
                        })
                    } else if (feature.get("features")) {  //聚集图层矢量对象
                        Bus.$emit((vm.options.id || "default") + ".cluster." + eventType, {
                            feature,
                            olLayer
                        })
                    } else if (featureType === "esriFeature" || featureType === "geoFeature") {    // esrijson 或 geojson 矢量图层
                        Bus.$emit((vm.options.id || "default") + ".vectorLayer." + eventType, {
                            feature,
                            olLayer,
                            coord,
                            info: tempInfo.data
                        })
                    } else if (olLayer && olLayer.get("collectionLayer")) {   //海量点位
                        Bus.$emit((vm.options.id || "default") + ".collection." + eventType, {
                            feature,
                            olLayer
                        })
                    } else if (olLayer && olLayer.get("trackLayer")) {    //轨迹图层
                        Bus.$emit((vm.options.id || "default") + ".track." + eventType, {
                            feature,
                            olLayer
                        })
                    }

                } else {
                    //空白地图
                    Bus.$emit((vm.options.id || "default") + "." + eventType + ".blank");
                }
            },
            listenEvent(map, eventType) {
                const vm = this;
                map.on(eventType, function (event) {
                    let proj = map.getView().getProjection().getCode();

                    //地理坐标
                    let coord = event.coordinate;
                    if (proj === "pixel" || proj === "xkcd-image") {
                        coord = coord.map(function (v) {
                            return parseInt(v, 10);
                        });
                    }

                    //像素坐标
                    let pixel;
                    if (eventType == "singleclick") {
                        pixel = event.pixel;
                    } else if (eventType == "pointermove") {
                        pixel = map.getEventPixel(event.originalEvent);
                    }

                    //向下级组件非定向性传递消息
                    Bus.$emit((vm.options.id || "default") + "." + eventType, event);

                    //如果事件不是发生在openlayers画布上（这里主要是考虑二三维融合的情况），则退出事件回调
                    if (event.originalEvent.srcElement.className == "ol-cesium") {
                        return false;
                    }

                    let layerFeature = map.forEachFeatureAtPixel(pixel, function (feature, olLayer) {
                        return [olLayer, feature];
                    }, {
                        layerFilter(layer) {
                            return !(layer instanceof Heatmap);
                        }
                    });

                    //自定义事件 向父级发送消息
                    if (layerFeature && layerFeature[1]) {
                        const olLayer = layerFeature[0],
                            feature = layerFeature[1];

                        //矢量对象点击
                        let outCoord = coord;
                        if (proj != "pixel" && proj != "xkcd-image") {
                            //确保输出坐标的坐标系为4326
                            outCoord = coordinateTransform(coord, proj, "EPSG:4326");
                        }
                        vm.$emit(eventType, {
                            coord: outCoord,
                            projection: (proj === "pixel" || proj === "xkcd-image") ? proj : "EPSG:4326",
                            event: event,
                            layer: olLayer,
                            feature: feature
                        })
                    } else {
                        //空白处点击
                        let outCoord = coord;
                        if (proj != "pixel" && proj != "xkcd-image") {
                            //确保输出坐标的坐标系为4326
                            outCoord = coordinateTransform(coord, proj, "EPSG:4326");
                        }
                        vm.$emit(eventType + "-blank", {
                            coord: outCoord,
                            projection: (proj === "pixel" || proj === "xkcd-image") ? proj : "EPSG:4326"
                        })
                    }

                    //向下级组件定向性传递消息
                    vm.emitEvent(eventType, proj, coord, layerFeature);
                });
            }
        },
        beforeDestroy() {
            const vm = this;
            olData.resetMap(vm.options.id);
        }
    }
</script>
