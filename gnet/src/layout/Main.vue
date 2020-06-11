<template>
  <div class="main_view">
    <top-bar></top-bar>
    <app-main></app-main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { TopBar, AppMain } from "./components";

@Component({
  components: { TopBar, AppMain }
})
export default class MainView extends Vue {}
</script>
<style lang="scss" scoped></style>
