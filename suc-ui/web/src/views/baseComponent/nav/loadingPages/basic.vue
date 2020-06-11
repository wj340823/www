<template>
    <div class="message-types">
        <suc-button @click="start">Start</suc-button>
        <suc-button @click="finish">Finish</suc-button>
        <suc-button @click="error">Error</suc-button>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton, LoadingBar} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class BasicLoadingDemo extends Vue {
        start() {
            LoadingBar.start();
        }

        finish() {
            LoadingBar.finish();
        }

        error() {
            LoadingBar.error();
        }
    }
</script>
