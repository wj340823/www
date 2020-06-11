<template>
    <suc-map
            ref="mapObject"
            :options="olMap.map"
            v-bind.sync="olMap.map.view"
    >
        <template v-for="layer in olMap.baseLayer">
            <ol-layer :options="layer"></ol-layer>
        </template>
    </suc-map>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    @Component
    export default class mapView extends Vue {
        olMap: any = this.$getMapConfig();
    }
</script>
