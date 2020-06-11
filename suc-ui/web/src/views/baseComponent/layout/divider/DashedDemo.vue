<template>
    <suc-divider :dashed="dashed"></suc-divider>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucDivider } from "@suc/ui";

    @Component({
        components: {
            SucDivider
        }
    })
    export default class DashedDemo extends Vue {
        dashed = true;
    }
</script>

<style lang="scss" scoped>

</style>
