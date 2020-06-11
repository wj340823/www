<template>
    <suc-divider></suc-divider>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucDivider } from "@suc/ui";

    @Component({
        components: {
            SucDivider
        }
    })
    export default class DividerDemo extends Vue {
    }
</script>

<style lang="scss" scoped>

</style>
