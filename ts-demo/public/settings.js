window.mapConfig = {
    map: {
        id: 'baseMap',
        view: {
            center: {
                coord: [119.30, 26.08]
            },
            zoom: 6,
            maxZoom: 18
        },
        controls: [{
            name: 'zoom',
            zoomInTipLabel: '放大',
            zoomOutTipLabel: '缩小'
        }],
        events: ['singleclick', 'pointermove']
    },
    baseLayer: [{
        name: "satelliteMap_base",
        source: {
            type: "XYZ",
            url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
            crossOrigin: 'anonymous'
        },
        onLayerCreated: function (layer) {
            console.log(layer);
        },
        visible: true
    }]
}