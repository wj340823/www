<template>
    <TabPane :name="name" :label="label" :icon="icon" :disabled="disabled" :closable="closable"
             :tab="tab" :index="index">
        <slot></slot>
    </TabPane>
</template>
<script lang="ts">
    import {Vue, Component, Inject, Prop} from "vue-property-decorator";
    import {TabPane} from "iview";

    @Component({
        components: {
            TabPane
        }
    })
    export default class SucTabPane extends Vue {
        @Inject() readonly TabsInstance!: any;
        @Prop(String) name?:string;
        @Prop([String, Function]) label?:string|Function;
        @Prop(String) icon?:string;
        @Prop({default: false}) disabled?:boolean;
        @Prop({default: null}) closable?:boolean;
        @Prop(String) tab?:string;  // 3.3.1 Tabs 嵌套时，用 tab 区分层级，指向对应的 Tabs 的 name
        @Prop(Number) index?:number; // 3.3.1 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序

    }
</script>
<style lang="scss" scoped>

</style>
