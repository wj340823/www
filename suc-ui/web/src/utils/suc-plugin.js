// import ECharts from 'vue-echarts';
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/radar'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/geo'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/visualMap'
// import 'echarts/lib/component/dataset'
import ECharts from '@/components/ECharts.vue';
//通用方法集合
const utils = {
    //时间戳转换成自定义字符串
    dateFormat: (date, fmt) => {
        let dateList = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in dateList) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? dateList[k] : ("00" + dateList[k]).substr(("" + dateList[k]).length));
            }
        }
        return fmt;
    },
    deepCopy: (obj) => {
        let result = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    // @ts-ignore
                    result[key] = utils.deepCopy(obj[key]); //递归复制
                }
                else {
                    // @ts-ignore
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
};
//地图类
class Map {
    constructor(common) {
        if (common) {
            Object.assign(this, common);
        }
        else {
            Object.assign(this, utils.deepCopy(window.mapConfig));
        }
    }
    setCenter(coords, projection) {
        if (coords instanceof Array) {
            this.map.view.center.coord = [parseFloat(coords[0]), parseFloat(coords[1])];
        }
        if (projection) {
            this.map.view.center.projection = projection;
        }
    }
    setZoom(zoom) {
        if (zoom) {
            this.map.view.zoom = zoom;
        }
    }
    setCenterZoom(coords, zoom, projection) {
        this.setCenter(coords, projection);
        this.setZoom(zoom);
    }
}
export default {
    install: (Vue, options) => {
        //时间转换过滤器
        Vue.filter('dateFormat', utils.dateFormat);
        //echarts的vue组件
        Vue.component('v-chart', ECharts);
        //将方法集添加到Vue实例上面去
        Vue.prototype.$utils = utils;
        //返回地图对象
        Vue.prototype.$getMapConfig = function () {
            return new Map();
        };
    }
};
//# sourceMappingURL=suc-plugin.js.map