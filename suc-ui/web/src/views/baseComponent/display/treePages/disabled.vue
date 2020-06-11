<template>
    <div>
        <suc-tree :data="data" :props="defaultProps" node-key="id" show-checkbox
                  :default-expanded-keys="[2, 3]" :default-checked-keys="[5]"></suc-tree>
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
    export default class DisabledTreeDemo extends Vue {
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
                    label: '二级 2-1',
                    disabled: true
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                disabled: true,
                children: [{
                    id: 7,
                    label: '二级 3-1',
                    disabled: true
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
    }
</script>
