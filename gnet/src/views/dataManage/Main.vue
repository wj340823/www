<template>
    <div class="main_view">
        <right-content class="right-content"/>
    </div>
</template>

<script>
    import {Vue, Component} from 'vue-property-decorator'
    import RightContent from './components/RightContent.vue'

    @Component({
        components: { RightContent}
    })
    export default class Main extends Vue {

    }
</script>

<style scoped lang="scss">
    .right-content{
        /*float: left;*/
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
</style>