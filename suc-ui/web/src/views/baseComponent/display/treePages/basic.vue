<template>
    <div>
        <suc-tree :data="data" :props="defaultProps" default-expand-all
                  @node-click="handleNodeClick"></suc-tree>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTree} from "@suc/ui";

    @Component({
        components: {
            SucTree
        }
    })
    export default class BasicTreeDemo extends Vue {
        data = [
            {
                label: '一级 1',
                children: [{
                    label: '二级 1-1'
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1'
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }
        ];
        defaultProps = {
            children: 'children',
            label: 'label'
        };

        handleNodeClick(data:{[key:string]:any}) {
            console.log(data);
        }
    }
</script>
