<template>
    <div class="menu-container">
        <div class="logo">
            <img src="../../assets/layout/title.svg"/>
        </div>
        <suc-menu :config="option">
            <suc-menu-item name="sys" to="/home">
                <img src="../../assets/layout/sys.png" class="menu-img" alt="index"/>
                <span style="background: none">系统设置</span>
            </suc-menu-item>
            <suc-menu-item name="visual" to="/data">
                <img
                        src="../../assets/layout/visual.png"
                        class="menu-img"
                        alt="index"
                />
                <span style="background: none">数据可视化</span>
            </suc-menu-item>
            <suc-submenu name="api">
                <template slot="title">
                    <img src="../../assets/layout/API.png" class="menu-img" alt="log"/>
                    <span style="background: none">API 组件</span>
                </template>
                <suc-menu-item name="monch" to="/home">
                    <span style="background: none">@suc/monch</span>
                </suc-menu-item>
              <suc-menu-item name="cesium" to="/home">
                <span style="background: none">vue-cesium</span>
              </suc-menu-item>
            </suc-submenu>
            <suc-menu-item name="service" to="/home">
                <img src="../../assets/layout/service.png" class="menu-img" alt="log"/>
                <span style="background: none">服务</span>
            </suc-menu-item>
            <suc-menu-item name="data" to="/data">
                <img src="../../assets/layout/mapData.png" class="menu-img" alt="log"/>
                <span style="background: none">数据</span>
            </suc-menu-item>
            <suc-menu-item name="home" to="/home">
                <img src="../../assets/layout/home.png" class="menu-img" alt="log"/>
                <span style="background: none">首页</span>
            </suc-menu-item>
        </suc-menu>
        <div class="user-info">
            <img src="../../assets/layout/user.png"/>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator";
    import {SucIcon, SucMenu, SucMenuItem, SucSubmenu} from "@suc/ui";
    import {MenuConfig} from "@suc/ui/interfaces";

    @Component({
        components: {
            SucMenu,
            SucMenuItem,
            SucSubmenu,
            SucIcon
        }
    })
    export default class TopMenu extends Vue {
        option: MenuConfig = {
            mode: "horizontal",
            activeName: "visual"
        };

        @Watch("$route.path")
        update() {
            this.option.activeName = this.$route.path.split("/")[2];
        }

        mounted() {
            this.option.activeName = this.$route.path.split("/")[2];
        }
    }
</script>
<style lang="scss">
    .menu-container {
        width: 100%;
        height: 70px;
        background-image: url("../../assets/layout/navBackground.png");
        background-position: center;
        background-size: 101% 150%;
        z-index: 10000;

        .logo {
            float: left;
            height: 70px;
            padding-top: 20px;
            padding-left: 30px;
            z-index: 1000;

            img {
                height: 30px;
            }
        }

        .suc-menu {
            display: inline-block;
            width: calc(100% - 263px);
            height: 100%;
        }

        .user-info {
            display: inline-block;
            width: 60px;
            height: 100%;
            padding-top: 22px;
            text-align: center;
            vertical-align: top;
            cursor: pointer;

            i {
                font-size: 20px;
                color: $theme-text-white;
            }
        }

        .ivu-menu.ivu-menu-light.ivu-menu-horizontal {
            height: 100%;
            background: transparent;

            >.ivu-menu-item, >.ivu-menu-submenu {
                float: right;
                display: flex;
                align-items: center;
                padding: 0 18px;
                color: $theme-text-white;

              &:hover {
                border-bottom: 5px solid #e15437;
                background-image: linear-gradient( 90deg, #3c71f7 0%, #5542e8 99%, #5542e8 100%);
              }

                .ivu-select-dropdown .ivu-menu-item {
                    padding-top: 9px;
                    padding-bottom: 10px;
                    &.ivu-menu-item-active {
                        background: rgba($theme-primary, 0.5);
                    }
                }
            }

          .ivu-menu-item-selected, .ivu-menu-child-item-active {
            border-bottom: 5px solid #e15437;
            background-image: linear-gradient(90deg, #3c71f7 0%, #5542e8 99%, #5542e8 100%);
          }

            >a, >li {
                float: right;

                span {
                    height: 24px;
                    cursor: pointer;
                    font-family: Microsoft YaHei;
                    font-size: 18px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 24px;
                    letter-spacing: 1px;
                }
            }

            .menu-img {
                margin: auto 10px auto 0;
            }
        }

        .ivu-menu-horizontal.ivu-menu-light:after {
            height: 0;
        }

      .ivu-menu-submenu-title {
        display: flex;
        height: 100%;
        align-items: center;
        >i {
          margin-right: 0;
          margin-left: 4px;
        }
      }
    }
</style>
