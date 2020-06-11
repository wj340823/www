<template>
    <suc-page
        :current="2"
        :total="50"
        simple
    />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucPage } from "@suc/ui";
@Component({
    components: {
        SucPage
    }
})
export default class SimplePageDemo extends Vue {}
</script>