<template>
    <el-progress :class="wrapClass" v-bind="$attrs" v-on="$listeners"></el-progress>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {Progress} from "element-ui";
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    @Component({
        components: {
            ElProgress: Progress
        }
    })
    export default class SucProgress extends Vue {
        wrapClass: string = `${ELEMENT_CLASS_PREFIX}progress`;
    }
</script>
<style lang="scss" scoped>

</style>