import { Component, Vue } from "vue-property-decorator";

@Component
export default class AutoHeight extends Vue {
    heightMixin: number|string = 0;
    autoHeightMixin(height: number, needUnit: boolean = false) {
        const vm = this;
        // 先移除 resize 和 autoHeight 事件
        window.removeEventListener("autoHeight", () => {
            vm.heightMixin = window.innerHeight - height;
        });
        window.removeEventListener("resize", () => {
            window.dispatchEvent(event);
        });

        // 自定义第三方事件
        const event = new Event("autoHeight");
        // 添加 自定义高度事件 事件
        window.addEventListener(
            "autoHeight",
            () => {
                vm.heightMixin = window.innerHeight - height;
                needUnit ? (vm.heightMixin = vm.heightMixin + "px") : null;
            },
            false
        );
        // 添加 resize 事件
        window.addEventListener("resize", () => {
            window.dispatchEvent(event);
        });
        // 触发一次事件
        window.dispatchEvent(event);
    }
}
