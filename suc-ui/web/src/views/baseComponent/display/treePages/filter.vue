<template>
    <div>
        <suc-input v-model="filterText" @on-change="filter" placeholder="请输入关键字进行过滤" />
        <suc-tree ref="tree" :data="data" :props="defaultProps" default-expand-all
                  :filter-node-method="filterNode"></suc-tree>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTree, SucInput} from "@suc/ui";

    @Component({
        components: {
            SucTree, SucInput
        }
    })
    export default class FilterTreeDemo extends Vue {
        filterText = '';
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

        public $refs!: {
            tree: any
        }
        filter() {
            this.$refs.tree.filter(this.filterText);
        }

        filterNode(value:string, data:{[key:string]:any}, node:any) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    }
</script>
<style lang="scss" scoped>
    .suc-input {
        width: 100%;
        margin-bottom: 15px;
    }
</style>
