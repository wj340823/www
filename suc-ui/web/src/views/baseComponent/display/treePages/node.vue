<template>
    <div>
        <suc-tree ref="tree" :data="data" node-key="id" default-expand-all
                  show-checkbox highlight-current :props="defaultProps"></suc-tree>
        <div class="btns">
            <suc-button @click="getCheckedNodes">通过 node 获取</suc-button>
            <suc-button @click="getCheckedKeys">通过 key 获取</suc-button>
            <suc-button @click="setCheckedNodes">通过 node 设置</suc-button>
            <suc-button @click="setCheckedKeys">通过 key 设置</suc-button>
            <suc-button @click="resetChecked">清空</suc-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTree, SucButton} from "@suc/ui";

    @Component({
        components: {
            SucTree, SucButton
        }
    })
    export default class NodeTreeDemo extends Vue {
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
        defaultProps = {
            children: 'children',
            label: 'label'
        };

        getCheckedNodes() {
            let nodes = (this.$refs.tree as SucTree).getCheckedNodes();
            console.log(nodes);
            alert(JSON.stringify(nodes));
        }
        getCheckedKeys() {
            let nodes = (this.$refs.tree as SucTree).getCheckedKeys();
            console.log(nodes);
            alert(nodes);
        }
        setCheckedNodes() {
            (this.$refs.tree as SucTree).setCheckedNodes([{
                id: 5,
                label: '二级 2-1'
            }, {
                id: 9,
                label: '三级 1-1-1'
            }]);
        }
        setCheckedKeys() {
            (this.$refs.tree as SucTree).setCheckedKeys([3], true);
        }
        resetChecked() {
            (this.$refs.tree as SucTree).setCheckedKeys([]);
        }
    }
</script>
<style lang="scss" scoped>
    .btns {
        margin-top: 15px;
        .suc-button {
            margin-right: 5px;
        }
    }
</style>
