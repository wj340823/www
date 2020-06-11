<template>
    <div style="height:100%">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class EmptyView extends Vue {}
</script>