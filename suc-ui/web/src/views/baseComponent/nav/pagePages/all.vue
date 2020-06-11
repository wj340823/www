<template>
    <suc-page
        :total="100"
        show-sizer
        show-elevator
        show-total
        prev-text="Previous"
        next-text="Next"
    ></suc-page>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucPage } from "@suc/ui";
@Component({
    components: {
        SucPage
    }
})
export default class AllPageDemo extends Vue {}
</script>