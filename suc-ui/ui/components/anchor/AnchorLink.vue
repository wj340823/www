<template>
    <AnchorLink :href="href" :title="title" :scroll-offset="scrollOffset">
        <slot></slot>
    </AnchorLink>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Inject } from "vue-property-decorator";
    import { AnchorLink } from "iview";

    @Component({
        components: {
            AnchorLink
        }
    })
    export default class SucAnchorLink extends Vue {
        @Inject() readonly anchorCom!: any;
        @Prop(String) href?: string;
        @Prop(String) title?: string;
        @Prop({
            type: Number,
            default() {
                return (this as any).anchorCom.scrollOffset;
            }
        }) scrollOffset?: number;
    }
</script>
<style lang="scss" scoped>

</style>
