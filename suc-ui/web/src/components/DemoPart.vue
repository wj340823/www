<template>
    <div class="demo-part">
        <div class="header">
            <p class="title">{{title}}</p>
        </div>
        <div class="main">
            <div class="main-left">
                <slot></slot>
                <template v-if="desc">
                    <div class="leftDesc" v-html="desc"></div>
                </template>
            </div>
            <div class="main-divider"></div>
            <div class="main-right" :style="rightH">
                <div v-highlight>
                    <pre><code class="html">{{code}}</code></pre>
                </div>
                <div class="right-open" :title="open?'收起':'展开'" @click="open=!open">
                    <i class="iconfont" :class="{true:'iconshouqi', false:'iconzhankai'}[open]"></i>
                </div>
                <div class="right-ops">
                    <i class="iconfont iconenlarge" title="放大" @click="large"></i>
                    <i class="iconfont iconcopy" title="复制代码" @click="copy"></i>
                </div>
            </div>
        </div>
        <suc-modal class="code-modal" v-model="modal1" :config="modalConfig">
            <div v-highlight class="code-large-content">
                <pre><code class="html">{{code}}</code></pre>
            </div>
        </suc-modal>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {SucModal} from '@suc/ui';

    @Component({
        components: {
            SucModal
        }
    })
    export default class DemoPart extends Vue {
        @Prop() title!: string;
        @Prop() desc?: string;
        @Prop() code!: string;

        renderFinished = false;
        open = false;
        modal1 = false;
        modalConfig = {
            title: this.title,
            width: '65%',
            footerHide: true
        }

        mounted() {
            this.$nextTick(() => {
                this.renderFinished = true;
            })
        }

        get rightH() {
            if (this.open) {
                return {height: 'auto'}
            }

            if (this.renderFinished) {
                return {height: this.$el.children[1].children[0].clientHeight + 'px'};
            }
            return {height: '200px'};
        }

        large() {
            this.modal1 = true;
        }

        copy() {
            this.$Copy(this.code);
        }
    }
</script>
<style lang="scss">
    .demo-part {
        margin-bottom: 20px;
        > .header {
            position: relative;
            padding: 12px 0;
            font-size: 16px;
            color: #182b51;
            > .title {
                font-weight: bold;
                height: 24px;
                padding-right: 100px;
                > .sub-title {
                    font-weight: normal;
                }
            }
        }
        > .main {
            position: relative;
            height: auto;
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 1px #dde4eb;
            .main-left, .main-right {
                position: relative;
                display: inline-block;
                width: 50%;
                min-height: 160px;
                padding: 20px 30px;
                vertical-align: top;
            }
            .main-right {
                padding-bottom: 35px;
                overflow: hidden;
                .right-ops {
                    position: absolute;
                    right: 15px;
                    top: 10px;
                    i + i {
                        margin-left: 10px;
                        color: #a6a6a7;
                    }
                }
            }
            .main-divider {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 50%;
                border: 1px dashed #dde4eb;
            }
            .leftDesc {
                margin-top: 15px;
                font-size: 12px;
                > div {
                    line-height: 30px;
                    text-align: justify;
                }
            }
            .right-open {
                position: absolute;
                bottom: 0;
                left: 4px;
                right: 0;
                height: 30px;
                padding: 5px 0;
                text-align: center;
                cursor: pointer;
                &:after {
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 1;
                    box-shadow: inset 0 -15px 30px #fff;
                }
                i {
                    position: relative;
                    font-size: 20px;
                    color: #a6a6a7;
                    z-index: 2;
                }
            }
        }
    }

    pre, code {
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: #525252;
        .hljs-tag, .hljs-name {
            color: #3e76f6;
        }
        .hljs-attr {
            color: #e96900;
        }
    }

    .code-modal {
        .code-large-content {
            font-size: 14px;

        }
        .suc-modal-content, .hljs {
            background-color: #eff6fc;
        }
    }
</style>
