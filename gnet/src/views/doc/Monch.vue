<template>
    <div class="main_view">
        <div class="app_main">
            <div class="leftMenus" :style="{width:leftWidth}">
                <div class="sideTrigger" :style="iconRotate">
                    <i @click="changeWidth"></i>
                </div>
                <div class="slideItems">
                    <template v-for="item in menus">
                        <router-link :to="item.router" :title="item.name" :class="{'secMenu':item.children}">
                            <i class="iconfont" :class="item.icon"></i>
                            <span>{{item.name}}</span>
                            <span class="icon-triangle" v-if="item.children"></span>
                            <ul v-if="item.children">
                                <li v-for="child in item.children">
                                    <router-link :to="child.router" :title="child.name"><span>{{child.name}}</span></router-link>
                                </li>
                            </ul>
                        </router-link>
                    </template>
                </div>
                <div class="sideDownload">
                    <i class="iconfont icon-xiazai" title="下载" @click="download"></i>
                </div>
            </div>
            <div class="app_content" :style="{marginLeft:leftWidth}">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    //@ts-ignore
    import {MAPMENU} from "suc-vue-map/web/src/utils/menus";

    @Component
    export default class Monch extends Vue {
        leftWidth = "180px";
        iconRotate = {}
        menus = MAPMENU;

        changeWidth() {
            if (this.leftWidth == "180px") {
                this.leftWidth = "54px";
                this.iconRotate = {
                    transform: "rotate(90deg)"
                }
            } else {
                this.leftWidth = "180px";
                this.iconRotate = {
                    transform: "rotate(0deg)"
                }
            }
        }
        download(){
            window.open("http://192.168.80.65/vueol/vueol-demo.zip");
        }
    }
</script>