# ts-demo

typescript版本项目初始化demo

## Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```
## 项目说明
* 含有authox模块，地图模块以及echarts的example。  
* v-echart组件封装了echarts的原生事件可以直接@click来获取图标点击事件   
同时鼠标事件参数有EchartMouseEvent这个类型描述  
事件参数中有一个chart字段是当前图标的Echarts实例  
* node-sass 可以使用/deep/ sass或dart-sass可以使用 ::v-deep  
* 不要直接在vuex根模块中添加方法
