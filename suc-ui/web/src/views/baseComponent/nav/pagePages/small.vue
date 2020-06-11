<template>
    <suc-page
        :total="100"
        size="small"
        show-sizer
        show-elevator
        show-total
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
export default class SmallPageDemo extends Vue {}
</script>