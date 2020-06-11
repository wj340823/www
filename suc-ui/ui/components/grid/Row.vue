<template>
    <div :class="wrapClass">
        <Row :type="type" :align="align" :justify="justify" :gutter="gutter" :className="className">
            <slot></slot>
        </Row>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Row} from "iview";
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    @Component({
        components: {
            Row
        }
    })
    export default class SucRow extends Vue {
        @Prop(String) type?:'flex';
        @Prop(String) align?:'top' | 'middle' | 'bottom';
        @Prop(String) justify?:'start' | 'end' | 'center' | 'space-around' | 'space-between';
        @Prop(Number) gutter?:number;
        @Prop(String) className?:string;

        wrapClass:string = `${ELEMENT_CLASS_PREFIX}grid`;

        created() {
            // console.log(this.gutter);
        }
    }
</script>
<style lang="scss" scoped>

</style>
