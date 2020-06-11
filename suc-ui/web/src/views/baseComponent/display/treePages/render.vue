<template>
    <div>
        <div class="render-outer">
            <p>使用 render-content</p>
            <suc-tree :data="data" node-key="id" show-checkbox default-expand-all
                      :expand-on-click-node="false" :render-content="renderContent"></suc-tree>
        </div>
        <div class="render-outer">
            <p>使用 scoped slot</p>
            <suc-tree :data="data" node-key="id" show-checkbox default-expand-all
                      :expand-on-click-node="false">
                <template v-slot="{ node, data }">
                    <span class="custom-tree-node">
                        <span>{{ node.label }}</span>
                        <span>
                          <suc-button type="text" :config="{size:'small'}" @on-click="append(data)">
                            添加
                          </suc-button>
                          <suc-button type="text" :config="{size:'small'}" @on-click="remove(node, data)">
                            删除
                          </suc-button>
                        </span>
                    </span>
                </template>
            </suc-tree>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTree, SucButton} from "@suc/ui";
    import {CreateElement} from "vue";

    let id = 1000;

    @Component({
        components: {
            SucTree, SucButton
        }
    })
    export default class RenderTreeDemo extends Vue {
        data = [
            {
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }
        ];

        append(data: any) {
            const newChild = {id: id++, label: 'testtest', children: []};
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        }

        remove(node: any, data: any) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d: any) => d.id === data.id);
            children.splice(index, 1);
        }

        renderContent(h: CreateElement, {node, data, store}:{node:any,data:any,store:any}) {
            return h('span', {
                class: 'custom-tree-node'
            },[
                h('span', node.label),
                h('span', [
                    h('button', {
                        class: 'ivu-btn ivu-btn-text ivu-btn-small suc-button',
                        on: {
                            click:() => {
                                this.append(data);
                            }
                        }
                    }, '添加'),

                    h('button', {
                        class: 'ivu-btn ivu-btn-text ivu-btn-small suc-button',
                        on: {
                            click: ()=> {
                                this.remove(node, data);
                            }
                        }
                    }, '删除')
                ])
            ]);
        }
    }
</script>
<style lang="scss">
    .render-outer {
        display: inline-block;
        width: 50%;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .suc-button:hover, .suc-button:focus {
            box-shadow: none;
            background: transparent;
        }
    }
</style>
