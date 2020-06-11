<template>
    <suc-row type="flex">
        <suc-col span="6" order="4">1 | order-4</suc-col>
        <suc-col span="6" order="3">2 | order-3</suc-col>
        <suc-col span="6" order="2">3 | order-2</suc-col>
        <suc-col span="6" order="1">4 | order-1</suc-col>
    </suc-row>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucRow, SucCol} from "@suc/ui";

    @Component({
        components: {
            SucRow, SucCol
        }
    })
    export default class OrderGridDemo extends Vue {

    }
</script>
