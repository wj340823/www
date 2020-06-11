<template>
    <div class="vueol-baselayer" style="display: none !important;">
        <slot :select="selectFeature" :move="moveFeature"></slot>
    </div>
</template>
<script>
    import {layerMethods} from '../../util/layer';
    import {
        isDefined, isDefinedAndNotNull, isFunction, createStyle,
        deepClone, convolve, normalize, coordinateTransform
    } from '../../util/helpers';
    import Bus from '../../util/bus'

    export default {
        name: 'ol-layer',
        inject: ['getMap'],
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        name: "satelliteMap_base",
                        source: {
                            type: "XYZ",
                            url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
                        },
                        onLayerCreated(layer) {
                            console.log(layer);
                        },
                        visible: true
                    }
                }
            },
            params: Object,   //source.params 主要用于arcgis服务的配置
            filter: {    //图片图层滤镜
                type: String,
                default: ""
            }
        },
        data() {
            return {
                layer: null,
                selectFeature: null,   //选中的矢量的属性  用于向外传递参数
                moveFeature: null,   //悬浮的矢量的属性  用于向外传递参数
                curClickFeature: null,  //点击的矢量
                curMoveFeature: null,  //悬浮的矢量
                curMoveNormalStyle: null  //悬浮的矢量样式
            }
        },
        created() {
            this.init();
        },
        watch: {
            options: {
                handler(nval) {
                    let vm = this;
                    vm.selectFeature = null;
                    vm.getMap().then((mapObject) => {
                        vm.updateLayer(mapObject, deepClone(this.options));
                    })
                },
                deep: true
            },
            params: {
                handler(nval) {
                    if (this.layer && this.layer.getSource().updateParams) {
                        this.layer.getSource().updateParams();
                    }
                },
                deep: true
            }
        },
        methods: {
            init() {
                let vm = this;
                vm.getMap().then((mapObject) => {
                    vm.map = mapObject;
                    let options = deepClone(this.options);
                    if (this.params) {
                        options.source.params = this.params;
                    }
                    vm.updateLayer(mapObject, options);
                    vm.handleEvent(mapObject);
                })
            },
            updateLayer(mapObject, options) {
                let projection = mapObject.getView().getProjection();
                if (this.layer && options.refresh) {
                    if (this.layer.getSource().clear) {
                        this.layer.getSource().clear();
                    }
                    let oSource = layerMethods.createSource(options.source, projection, options.onLayerCreated, options.onLayerFailFn);
                    this.layer.setSource(oSource);
                    if (options.opacity) {
                        this.layer.setOpacity(options.opacity);
                    }
                    if (options.visible) {
                        this.layer.setVisible(options.visible);
                    }

                    let style;
                    if (isDefinedAndNotNull(this.layer.style)) {
                        if (!isFunction(options.style)) {
                            style = createStyle(options.style);
                        } else {
                            style = options.style;
                        }
                        // not every layer has a setStyle method
                        if (this.layer.setStyle && isFunction(this.layer.setStyle)) {
                            this.layer.setStyle(style);
                        }
                    }
                } else {
                    if (this.layer) {
                        if (this.layer.getSource().clear) {
                            this.layer.getSource().clear();
                        }
                        mapObject.removeLayer(this.layer);
                    }
                    this.layer = layerMethods.createLayer(options, projection);
                    mapObject.addLayer(this.layer);

                    const vm = this;
                    if (vm.filter) {
                        vm.layer.on('postcompose', function (event) {
                            convolve(event.context, normalize(vm.filter));
                            mapObject.render();
                        });
                    }
                }
            },
            handleStyle(style, feature) {
                let styleResult = [];
                if (isDefined(style)) {
                    if (style instanceof Array) {
                        let len = source.style.length;
                        for (let i = 0; i < len; i++) {
                            styleResult[i] = createStyle(style[i]);
                        }
                    } else if (isFunction(style)) {
                        styleResult = createStyle(style(feature));
                    } else {
                        styleResult = createStyle(style);
                    }
                }

                if (styleResult instanceof Array && styleResult.length == 0) {
                    return undefined;
                }
                return styleResult;
            },
            listenerMove(data) {
                const vm = this;
                //矢量 悬浮样式
                const feature = data.feature;
                let style = data.info.style;
                vm.curMoveNormalStyle = vm.handleStyle(style, feature);

                let selectStyle = null;
                if (data.info.moveStyle) {
                    if (vm.curMoveFeature && vm.curMoveFeature != vm.curClickFeature) {
                        //恢复前次标记的feature的样式
                        vm.curMoveFeature.setStyle(vm.handleStyle(style, vm.curMoveFeature));
                        vm.curMoveFeature = null;
                    }
                    if (feature != vm.curClickFeature) {
                        selectStyle = vm.handleStyle(data.info.moveStyle, feature);
                        feature.setStyle(selectStyle);

                        vm.curMoveFeature = feature;
                    }
                }

                let outCoord = data.coord;
                const proj = vm.map.getView().getProjection();
                if (proj != "pixel") {
                    //确保输出坐标的坐标系为4326
                    outCoord = coordinateTransform(data.coord, proj, "EPSG:4326");
                }
                vm.moveFeature = {
                    coord: outCoord,
                    projection: proj === "pixel" ? proj : "EPSG:4326",
                    ...feature.getProperties()
                };
            },
            listenerMove_blank() {
                const vm = this;
                if (vm.curMoveFeature && vm.curMoveFeature != vm.curClickFeature) {
                    //恢复前次标记的feature的样式
                    vm.curMoveFeature.setStyle(vm.curMoveNormalStyle);
                }
                vm.curMoveFeature = null;

                vm.moveFeature = null;
            },
            listenerClick(data) {
                const vm = this;
                //矢量 点击样式
                const feature = data.feature;
                let style = data.info.style;

                let selectStyle = null;
                if (data.info.clickStyle) {
                    if (vm.curClickFeature) {
                        //恢复前次标记的feature的样式
                        vm.curClickFeature.setStyle(vm.curClickStyle);
                    }

                    vm.curClickStyle = vm.curMoveNormalStyle;
                    selectStyle = vm.handleStyle(data.info.clickStyle, feature);
                    feature.setStyle(selectStyle);

                    vm.curClickFeature = feature;
                }

                let outCoord = data.coord;
                const proj = vm.map.getView().getProjection();
                if (proj != "pixel") {
                    //确保输出坐标的坐标系为4326
                    outCoord = coordinateTransform(data.coord, proj, "EPSG:4326");
                }
                vm.selectFeature = {
                    coord: outCoord,
                    projection: proj === "pixel" ? proj : "EPSG:4326",
                    ...feature.getProperties()
                };
            },
            listenerClick_blank() {
                const vm = this;
                if (vm.curClickFeature) {
                    //恢复前次标记的feature的样式
                    vm.curClickFeature.setStyle(vm.curClickStyle);
                    vm.curClickFeature = null;
                }

                vm.selectFeature = null;
            },
            handleEvent(mapObject) {
                const vm = this;
                const mapId = mapObject.getTarget().id || "default";
                Bus.$on(mapId + ".vectorLayer.pointermove", vm.listenerMove)

                //地图空白处悬浮
                Bus.$on(mapId + ".pointermove.blank", vm.listenerMove_blank)

                Bus.$on(mapId + ".vectorLayer.singleclick", vm.listenerClick)

                //地图空白处 点击
                Bus.$on(mapId + ".singleclick.blank", vm.listenerClick_blank)
            }
        },
        beforeDestroy() {
            let vm = this;
            vm.getMap().then((mapObject) => {
                let source = vm.layer.getSource();
                if (source.clear&&source.getFeatures) {
                    source.getFeatures().forEach(function (f) {
                        let s = f.getStyle();
                        s = null;
                        f.setStyle(null);
                        f = null;
                    })
                    source.clear();
                }
                source = null;
                vm.layer.setSource(undefined);
                mapObject.removeLayer(this.layer);

                const mapId = mapObject.getTarget().id || "default";
                Bus.$off(mapId + ".vectorLayer.pointermove", vm.listenerMove);
                Bus.$off(mapId + ".pointermove.blank", vm.listenerMove_blank)
                Bus.$off(mapId + ".vectorLayer.singleclick", vm.listenerClick);
                Bus.$off(mapId + ".singleclick.blank", vm.listenerClick_blank);
            });
            this.selectFeature = null;
            this.moveFeature = null;
            this.curClickFeature = null;
            this.curMoveFeature = null;
            this.curMoveNormalStyle = null;
        }
    }
</script>
