<template>
    <div class="view-con">
        <div class="page">
            <h2 class="title">
                <slot name="header">{{title}}</slot>
            </h2>
            <suc-row class="content anchor-container">
                <suc-col class="mainContent" span="21">
                    <slot></slot>
                </suc-col>
                <suc-col span="3">
                    <suc-anchor show-ink container=".anchor-container" style="position:fixed;">
                        <suc-anchor-link v-for="item in anchors" :key="item.href" v-bind="item"></suc-anchor-link>
                        <suc-anchor-link href="#API" title="API"></suc-anchor-link>
                    </suc-anchor>
                </suc-col>
            </suc-row>
        </div>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Watch, Prop } from "vue-property-decorator";
    import { SucAnchor, SucAnchorLink, SucCol, SucRow } from "@suc/ui";
    import { State } from "vuex-class";
    import anchorSets from '@/utils/anchor';

    @Component({
        components: {
            SucAnchor,
            SucAnchorLink,
            SucRow,
            SucCol
        }
    })
    export default class ViewPage extends Vue {
        @State anchorData!: any;
        @Prop(String) title!: string;

        get anchors() {
            let result = anchorSets[this.$route.path.split("/")[4]];
            if (!result) {
                return [];
            }
            return result.anchor.map((item: any) => {
                return {
                    href: `#${item.id}`,
                    title: item.title
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
    .view-con {
        height: 100%;
        padding: 35px 0 0;
    }

    .page {
        display: inline-block;
        width: 100%;
        height: 100%;

        > .title {
            font-size: 20px;
            color: #182b51;
            padding: 10px 40px;
            /*margin: 0 32px 0 16px;*/
            border-bottom: solid 1px #dde4eb;
        }

        > .content {
            height: calc(100% - 51px);
            padding: 16px 32px 0 16px;
            overflow: auto;

            .mainContent {
                padding: 0 30px 30px 23px;
            }
        }
    }

</style>
