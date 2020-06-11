<template>
    <div :class="wrapClass">
        <Anchor :affix="affix" :offsetTop="offsetTop" :offsetBottom="offsetBottom" :bounds="bounds"
                :container="container" :showInk="showInk" :scrollOffset="scrollOffset" v-on="$listeners">
            <slot></slot>
        </Anchor>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Provide} from "vue-property-decorator";
    import {Anchor, AnchorLink, Affix} from "iview";
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    (Anchor as any).components = {Affix};

    @Component({
        components: {
            Anchor,
            AnchorLink
        }
    })
    export default class SucAnchor extends Vue {
        @Prop({type: Boolean, default: true}) affix?: boolean;
        @Prop({type: Number, default: 0}) offsetTop?: number;
        @Prop(Number) offsetBottom?: number;
        @Prop({type: Number, default: 5}) bounds?: number;
        @Prop() container?: null;
        @Prop({type: Boolean, default: false}) showInk?: boolean;
        @Prop({type: Number, default: 0}) scrollOffset?: boolean;

        wrapClass: string = `${ELEMENT_CLASS_PREFIX}anchor`;
    }
</script>
<style lang="scss" scoped>

</style>
