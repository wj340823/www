import { Modal, ModalConfig } from "iview"
let SucConfirm = (<any>Modal).confirm;
export {
    SucConfirm
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 全局提示
         */
        $SucConfirm: (config?: ModalConfig | string) => void;
    }
}
