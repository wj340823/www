import {VNode, CreateElement} from "vue";
import {Message, MessageConfig} from 'iview';

interface Config extends MessageConfig {
    desc?: string
}

interface SucMessageInterface {
    info(options?: Config | string): any;

    success(options?: Config | string): any;

    warning(options?: Config | string): any;

    error(options?: Config | string): any;

    loading(options?: Config | string): any;

    config(options?: Config): void;

    destroy(): void;
}

const MessageObject: Message = Message as any;
type MsgType = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'config';

let messageFunc = function (type: MsgType, options?: Config | string) {
    if (!options) {
        if(type==='config'){
            return MessageObject.config();
        }else{
            return MessageObject[type]();
        }
    }
    let tempOptions: Config;
    if (typeof options === 'string') {
        tempOptions = {
            content: options,
            desc: ''
        };
    } else {
        tempOptions = options;
    }

    let params = {
        content: tempOptions.content,
        duration: tempOptions.duration,
        closable: tempOptions.closable,
        onClose: tempOptions.onClose,
        render: (h?: CreateElement): VNode => {
            if (h) {
                let renderArr: VNode[] = [
                    h('span', {
                        class: 'suc-message-desc'
                    }, tempOptions.desc)
                ];
                if (tempOptions.render) {
                    renderArr.push(tempOptions.render(h));
                }
                return h('div', {
                    class: 'suc-message-reder-text'
                }, renderArr);
            }
            return {} as VNode;
        }
    };
    if(type==='config') {
        return MessageObject.config(params);
    }else{
        return MessageObject[type](params);
    }
}
let SucMessage: SucMessageInterface = {
    info: function (options?: Config | string) {
        return messageFunc('info', options);
    },
    success: function (options?: Config | string) {
        return messageFunc('success', options);
    },
    warning: function (options?: Config | string) {
        return messageFunc('warning', options);
    },
    error: function (options?: Config | string) {
        return messageFunc('error', options);
    },
    loading: function (options?: Config | string) {
        return messageFunc('loading', options);
    },
    config(options?: Config) {
        messageFunc('config', options);
    },
    destroy() {
        MessageObject.destroy();
    }
};

export {
    SucMessage
}

declare module "vue/types/vue" {
    interface Vue {
        /**
         * 全局提示
         */
        $SucMessage: SucMessageInterface;
    }
}
