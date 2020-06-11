<template>
    <suc-page :total="100" />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucPage } from "@suc/ui";
@Component({
    components: {
        SucPage
    }
})
export default class BasePageDemo extends Vue {}
</script>