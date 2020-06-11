<template>
    <suc-anchor show-ink container=".anchor-container">
        <suc-anchor-link href="#JBYF" title="基本用法" />
        <suc-anchor-link href="#API" title="API">
            <suc-anchor-link href="#component_props" title="SucAnchor props" />
            <suc-anchor-link href="#component_events" title="SucAnchor events" />
            <suc-anchor-link href="#component_subprops" title="SucAnchorLink props" />
        </suc-anchor-link>
    </suc-anchor>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucAnchor, SucAnchorLink} from "@suc/ui";

    @Component({
        components:{
            SucAnchor,
            SucAnchorLink
        }
    })
    export default class BasicAnchorDemo extends Vue {

    }
</script>
