import { Notice } from "iview";

const SucNotice = Notice;
export default SucNotice;

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 全局提示
         */
        $SucNotice: Notice;
    }
}
