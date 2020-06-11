<template>
    <div>
        <suc-tree :props="props" :load="loadNode" lazy show-checkbox></suc-tree>
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
    export default class LazyTreeDemo extends Vue {
        props = {
            label: 'name',
            children: 'zones',
            isLeaf: 'leaf'
        };

        loadNode(node: { [key: string]: any }, resolve: Function) {
            if (node.level === 0) {
                return resolve([{name: 'region'}]);
            }
            if (node.level > 1) return resolve([]);

            setTimeout(() => {
                const data = [{
                    name: 'leaf',
                    leaf: true
                }, {
                    name: 'zone'
                }];

                resolve(data);
            }, 500);
        }
    }
</script>
