<template>
    <div :class="wrapClass">
       <transfer v-bind="normalizeConfig" :data="normalizeData" v-on="$listeners">
           <slot></slot>
       </transfer>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Transfer } from 'iview';
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    import { TransferDataItem, TransferConfig } from './interface'

    @Component({
        components:{Transfer}
    })
    export default class SucTransfer extends Vue {
        @Prop({default: () => ({})}) config?: TransferConfig;
        @Prop({type: Boolean, default:false}) disabled?: boolean;

        get wrapClass() {
            let result = `${ELEMENT_CLASS_PREFIX}transfer`;
            if(this.disabled){
                result+=` ${ELEMENT_CLASS_PREFIX}transfer-disabled`;
            }
            return result;
        }

        get normalizeConfig() {
            let result = Object.assign({}, this.config);
            delete result.data;
            return result;
        }

        get normalizeData() {
            if(!this.config||!this.config.data){
                return [];
            }
            return this.config.data.map((item:TransferDataItem)=>{
                let resultItem = Object.assign({}, item);
                resultItem.disabled = item.disabled||this.disabled;
                return resultItem;
            })
        }
    }
</script>
