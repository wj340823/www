<template>
  <div class="app_main">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class AppMain extends Vue {}
</script>
<style lang="scss" scoped>
.app_main {
}
</style>
