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
        name: 'tdt_sl_base',
        source: {
            type: "XYZ",
            url: "http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&" +
                "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a"
        }
    }, {
        name: 'tdt_sl_txt',
        source: {
            type: "XYZ",
            url: "http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&" +
                "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a"
        }
    }]
}