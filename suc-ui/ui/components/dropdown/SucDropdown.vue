<template>
    <i-dropdown class="suc-dropdown"
                :class="styles"
                v-bind="$attrs"
                v-on="$listeners"
                :transfer-class-name="transferClassName">
        <slot></slot>
        <template slot="list">
            <slot name="list"></slot>
        </template>
    </i-dropdown>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import { Dropdown, DropdownItem, DropdownMenu } from "iview";

    @Component({
        inheritAttrs: false,
        components: {
            IDropdown: Dropdown,
            IDropdownItem: DropdownItem,
            IDropdownMenu: DropdownMenu
        }
    })
    export default class SucDropdown extends Vue {

        @Prop({default: "normal"}) type!: string;

        get styles() {
            return {
                normal: this.type === 'normal',
                bubble: this.type === 'bubble'
            }
        }

        get transferClassName() {
            if (this.type === 'normal') {
                return "suc-normal-dropdown"
            } else if (this.type === 'bubble') {
                return "suc-bubble-dropdown"
            } else {
                return ""
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>
