<template>
    <div class="header_bar">
        <h1 class="logo-title">成功软件组件库</h1>

        <template v-if="curMenu=='baseComponent'">
            <suc-select v-model="keywords" :options="options" :config="config" @on-change="onChange"></suc-select>
        </template>

        <suc-menu :config="menuConfig" @on-select="menuSelect">
            <suc-menu-item name="baseComponent" to="/main/baseComponent">
                <span>基础 UI 组件</span>
            </suc-menu-item>
            <suc-menu-item name="echarts" to="/main/echarts">
                <span>ECharts 常用示例</span>
            </suc-menu-item>
            <suc-menu-item name="layout" to="/main/other">
                <span>其他</span>
            </suc-menu-item>
        </suc-menu>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator";
    import {secondMenus} from '@/router-config';
    import {Mutation} from "vuex-class";
    import {SucMenu, SucMenuItem, SucSelect} from "@suc/ui";
    import {MenuConfig} from "@suc/ui/components/menu/interface";
    import {SelectConfig, SelectOptions} from "@suc/ui/components/select";

    @Component({
        components: {
            SucMenu,
            SucMenuItem,
            SucSelect
        }
    })
    export default class topBar extends Vue {
        @Mutation("setSecondMenus") setMenus: any;

        keywords = "";
        options: SelectOptions = [];
        config: SelectConfig = {
            placeholder: "搜索组件……",
            filterable: true
        };

        menuConfig: MenuConfig = {
            mode: "horizontal",
            theme: "primary",
            activeName: ""
        };
        curMenu:number|string|undefined = "";

        menuSelect(name: string) {
            this.curMenu = name;
            const matchMenus = secondMenus[name];
            this.setMenus(matchMenus);
        }

        onChange() {
            if (this.keywords && this.keywords != this.$route.path) {
                this.$router.push(this.keywords);
            }

            setTimeout(() => {
                this.keywords = "";
            }, 1000)
        }

        mounted() {
            this.menuConfig.activeName = this.$route.matched[1].meta.name;
            this.curMenu = this.menuConfig.activeName;
            this.options = secondMenus.baseComponent.reduce((result: any[], item: any) => {
                let arr = item.children.map((child: { label: string, router: string }) => {
                    return {
                        label: child.label,
                        value: child.router
                    }
                })
                return result.concat(arr);
            }, [])
        }

    }
</script>
