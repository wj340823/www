<template>
    <suc-row>
        <suc-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</suc-col>
        <suc-col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</suc-col>
        <suc-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</suc-col>
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
    export default class MediaGridDemo extends Vue {

    }
</script>
