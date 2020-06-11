<template>
    <div>
        <suc-row>
            <suc-col span="12">suc-col-12</suc-col>
            <suc-col span="12">suc-col-12</suc-col>
        </suc-row>
        <br>
        <suc-row>
            <suc-col span="8">suc-col-8</suc-col>
            <suc-col span="8">suc-col-8</suc-col>
            <suc-col span="8">suc-col-8</suc-col>
        </suc-row>
        <br>
        <suc-row>
            <suc-col span="6">suc-col-6</suc-col>
            <suc-col span="6">suc-col-6</suc-col>
            <suc-col span="6">suc-col-6</suc-col>
            <suc-col span="6">suc-col-6</suc-col>
        </suc-row>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucRow, SucCol} from "@suc/ui";

    @Component({
        components: {
            SucRow, SucCol
        }
    })
    export default class BasicGridDemo extends Vue {

    }
</script>
