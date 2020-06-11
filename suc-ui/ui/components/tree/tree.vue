<template>
    <el-tree ref="tree" :class="wrapClass" v-bind="$attrs" v-on="$listeners">
        <template v-slot="{ node, data }" v-if="$scopedSlots.default">
            <slot :node="node" :data="data"></slot>
        </template>
    </el-tree>
</template>
<script lang="ts">
    import {Vue, Component, Mixins} from "vue-property-decorator";
    import {Tree} from "element-ui"
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    @Component({
        components: {
            ElTree: Tree
        }
    })
    export default class SucTree extends Vue {
        wrapClass: string = `${ELEMENT_CLASS_PREFIX}tree`;

        public $refs!: {
            tree: any
        }

        filter(params: any) {
            this.$refs.tree.filter(params);
        }

        updateKeyChildren(key: string|number, data: any[]) {
            this.$refs.tree.updateKeyChildren(key, data);
        }

        getCheckedNodes(leafOnly?: boolean, includeHalfChecked?: boolean) {
            return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked);
        }

        setCheckedNodes(nodes: any[]) {
            this.$refs.tree.setCheckedNodes(nodes);
        }

        getCheckedKeys(leafOnly?: boolean) {
            return this.$refs.tree.getCheckedKeys(leafOnly);
        }

        setCheckedKeys(keys: string[]|number[], leafOnly?: boolean) {
            this.$refs.tree.setCheckedKeys(keys, leafOnly);
        }

        setChecked(data: string | { [key: string]: any }, checked: boolean, deep: boolean) {
            this.$refs.tree.setChecked(data, checked, deep);
        }

        getHalfCheckedNodes() {
            return this.$refs.tree.getHalfCheckedNodes();
        }

        getHalfCheckedKeys() {
            return this.$refs.tree.getHalfCheckedKeys();
        }

        getCurrentKey() {
            return this.$refs.tree.getCurrentKey();
        }

        getCurrentNode() {
            return this.$refs.tree.getCurrentNode();
        }

        setCurrentKey(key: string|number) {
            this.$refs.tree.setCurrentKey(key);
        }

        setCurrentNode(node: any) {
            this.$refs.tree.setCurrentNode(node);
        }

        getNode(data: any) {
            return this.$refs.tree.getNode(data);
        }

        remove(data: any) {
            this.$refs.tree.remove(data);
        }

        append(data: any, parentNode: any) {
            this.$refs.tree.append(data, parentNode);
        }

        insertBefore(data: any, refNode: any) {
            this.$refs.tree.insertBefore(data, refNode);
        }
        insertAfter(data: any, refNode: any) {
            this.$refs.tree.insertAfter(data, refNode);
        }
    }
</script>