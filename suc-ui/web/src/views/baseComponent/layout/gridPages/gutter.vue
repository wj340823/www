<template>
    <suc-row class="gutter" :gutter="16">
        <suc-col span="6">
            <div>suc-col-6</div>
        </suc-col>
        <suc-col span="6">
            <div>suc-col-6</div>
        </suc-col>
        <suc-col span="6">
            <div>suc-col-6</div>
        </suc-col>
        <suc-col span="6">
            <div>suc-col-6</div>
        </suc-col>
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
    export default class GutterGridDemo extends Vue {

    }
</script>
