export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicTreeDemo'
    }, {
        id: 'KGX',
        title: '可勾选',
        component: 'CheckTreeDemo'
    }, {
        id: 'LJZZDY',
        title: '懒加载自定义叶子节点',
        component: 'LazyTreeDemo'
    }, {
        id: 'MRZKGX',
        title: '默认展开和默认勾选',
        component: 'ExpandTreeDemo',
        desc: '<div>分别通过<span class="wordNotice">default-expanded-keys</span>和<span class="wordNotice">default-checked-keys</span>' +
            '设置默认展开和默认选中的节点。</div>' +
            '<div>需要注意的是，此时必须设置<span class="wordNotice">node-key</span>，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。</div>'
    }, {
        id: 'JYZT',
        title: '禁用状态',
        component: 'DisabledTreeDemo'
    }, {
        id: 'SJDXZ',
        title: '树节点的选择',
        component: 'NodeTreeDemo',
        desc: '<div>本例展示如何获取和设置选中节点。获取和设置各有两种方式：通过<span class="wordNotice">node</span>' +
            '或通过<span class="wordNotice">key</span>。' +
            '如果需要通过<span class="wordNotice">key</span>来获取或设置，则必须设置<span class="wordNotice">node-key</span>'
    }, {
        id: 'ZDYJDNR',
        title: '自定义节点内容',
        component: 'RenderTreeDemo',
        desc: '<div>可以通过两种方法进行树节点内容的自定义：<span class="wordNotice">render-content</span>和' +
            '<span class="wordNotice">scoped slot</span>。</div>' +
            '<div>使用<span class="wordNotice">render-content</span>指定渲染函数，该函数返回需要的节点区内容即可。渲染函数的用法请参考 Vue 文档。</div>' +
            '<div>使用<span class="wordNotice">scoped slot</span>会传入两个参数<span class="wordNotice">node</span>和' +
            '<span class="wordNotice">data</span>，分别表示当前节点的 Node 对象和当前节点的数据。</div>'
    }, {
        id: 'JDGL',
        title: '节点过滤',
        component: 'FilterTreeDemo',
        desc: '<div>在需要对节点进行过滤时，调用<span class="wordNotice">Tree</span>实例的<span class="wordNotice">filter</span>方法，' +
            '参数为关键字。需要注意的是，此时需要设置</div><div><span class="wordNotice">filter-node-method</span>，值为过滤函数。</div>'
    }],
    api: {
        props: [
            {
                attr: 'data',
                desc: '展示数据',
                type: 'Array',
                default: '-'
            }, {
                attr: 'empty-text',
                desc: '内容为空的时候展示的文本',
                type: 'String',
                default: '-'
            }, {
                attr: 'node-key',
                desc: '每个树节点用来作为唯一标识的属性，整棵树应该是唯一的',
                type: 'String',
                default: '-'
            }, {
                attr: 'props',
                desc: '配置选项，具体看 interface Props',
                type: 'Object',
                default: '-'
            }, {
                attr: 'render-after-expand',
                desc: '是否在第一次展开某个树节点后才渲染其子节点',
                type: 'Boolean',
                default: 'true'
            }, {
                attr: 'load',
                desc: '加载子树数据的方法，仅当 lazy 属性为 true 时生效',
                type: 'Function(node, resolve)',
                default: '-'
            }, {
                attr: 'render-content',
                desc: '树节点的内容区的渲染 Function',
                type: 'Function(h, {node, data, store})',
                default: '-'
            }, {
                attr: 'highlight-current',
                desc: '是否高亮当前选中节点，默认值是 false',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'default-expand-all',
                desc: '是否默认展开所有节点',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'expand-on-click-node',
                desc: '是否在点击节点的时候展开或者收缩节点，默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点',
                type: 'Boolean',
                default: 'true'
            }, {
                attr: 'check-on-click-node',
                desc: '是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'auto-expand-parent',
                desc: '展开子节点的时候是否自动展开父节点',
                type: 'Boolean',
                default: 'true'
            }, {
                attr: 'default-expanded-keys',
                desc: '默认展开的节点的 key 的数组',
                type: 'Array',
                default: '-'
            }, {
                attr: 'show-checkbox',
                desc: '节点是否可被选择',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'check-strictly',
                desc: '在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'default-checked-keys',
                desc: '默认勾选的节点的 key 的数组',
                type: 'Array',
                default: '-'
            }, {
                attr: 'current-node-key',
                desc: '当前选中的节点',
                type: 'String | Number',
                default: '-'
            }, {
                attr: 'filter-node-method',
                desc: '对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏',
                type: 'Function(value, data, node)',
                default: '-'
            }, {
                attr: 'accordion',
                desc: '是否每次只打开一个同级树节点展开',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'indent',
                desc: '相邻级节点间的水平缩进，单位为像素',
                type: 'Number',
                default: '16'
            }, {
                attr: 'icon-class',
                desc: '自定义树节点的图标',
                type: 'String',
                default: '-'
            }, {
                attr: 'lazy',
                desc: '是否懒加载子节点，需与 load 方法结合使用',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'draggable',
                desc: '是否开启拖拽节点功能',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'allow-drag',
                desc: '判断节点能否被拖拽',
                type: 'Function(node)',
                default: '-'
            }, {
                attr: 'allow-drop',
                desc: '拖拽时判定目标节点能否被放置。 type 参数有三种情况："prev"、"inner" 和 "next"，分别表示放置在目标节点前、' +
                    '插入至目标节点和放置在目标节点后',
                type: 'Function(draggingNode, dropNode, type)',
                default: '-'
            }
        ],
        interfaces: [
            {
                text: 'interface Props {\n' +
                    '    label?: string|((data:any, node:any)=>string),\n' +
                    '    children?: string,\n' +
                    '    disabled?: (data:any, node:any)=>boolean | boolean,\n' +
                    '    isLeaf?: (data:any, node:any)=>boolean | boolean\n' +
                    '}'
            }
        ],
        events: [
            {
                name: 'node-click',
                desc: '节点被点击时的回调',
                params: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。'
            },
            {
                name: 'node-contextmenu',
                desc: '当某一节点被鼠标右键点击时会触发该事件',
                params: '共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。'
            },
            {
                name: 'check-change',
                desc: '节点选中状态发生变化时的回调',
                params: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点'
            },
            {
                name: 'check',
                desc: '当复选框被点击的时候触发',
                params: '共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，' +
                    '包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性'
            },
            {
                name: 'current-change',
                desc: '当前选中节点变化时触发的事件',
                params: '共两个参数，依次为：当前节点的数据，当前节点的 Node 对象'
            },
            {
                name: 'node-expand',
                desc: '节点被展开时触发的事件',
                params: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身'
            },
            {
                name: 'node-collapse',
                desc: '节点被关闭时触发的事件',
                params: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身'
            },
            {
                name: 'node-drag-start',
                desc: '节点开始拖拽时触发的事件',
                params: '共两个参数，依次为：被拖拽节点对应的 Node、event'
            },
            {
                name: 'node-drag-enter',
                desc: '拖拽进入其他节点时触发的事件',
                params: '共三个参数，依次为：被拖拽节点对应的 Node、所进入节点对应的 Node、event'
            },
            {
                name: 'node-drag-leave',
                desc: '拖拽离开某个节点时触发的事件',
                params: '共三个参数，依次为：被拖拽节点对应的 Node、所离开节点对应的 Node、event'
            },
            {
                name: 'node-drag-over',
                desc: '在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）',
                params: '共三个参数，依次为：被拖拽节点对应的 Node、当前进入节点对应的 Node、event'
            },
            {
                name: 'node-drag-end',
                desc: '拖拽结束时（可能未成功）触发的事件',
                params: '共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、' +
                    '被拖拽节点的放置位置（before、after、inner）、event'
            },
            {
                name: 'node-drop',
                desc: '拖拽成功完成时触发的事件',
                params: '共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event'
            },
        ],
        methods: [
            {
                name: 'filter',
                desc: '对树节点进行筛选操作',
                params: '接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数'
            },
            {
                name: 'updateKeyChildren',
                desc: '通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性',
                params: '(key, data) 接收两个参数，1. 节点 key 2. 节点数据的数组'
            },
            {
                name: 'getCheckedNodes',
                desc: '若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组',
                params: '(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false'
            },
            {
                name: 'setCheckedNodes',
                desc: '设置目前勾选的节点，使用此方法必须设置 node-key 属性',
                params: '(nodes) 接收勾选节点数据的数组'
            },
            {
                name: 'getCheckedKeys',
                desc: '若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组',
                params: '(leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false'
            },
            {
                name: 'setCheckedKeys',
                desc: '通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性',
                params: '(keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false'
            },
            {
                name: 'setChecked',
                desc: '通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性',
                params: '(key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，' +
                    '节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false'
            },
            {
                name: 'getHalfCheckedNodes',
                desc: '若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组',
                params: '-'
            },
            {
                name: 'getHalfCheckedKeys',
                desc: '若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组',
                params: '-'
            },
            {
                name: 'getCurrentKey',
                desc: '获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null',
                params: '-'
            },
            {
                name: 'getCurrentNode',
                desc: '获取当前被选中节点的 data，若没有节点被选中则返回 null',
                params: '-'
            },
            {
                name: 'setCurrentKey',
                desc: '通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性',
                params: '(key) 待被选节点的 key，若为 null 则取消当前高亮的节点'
            },
            {
                name: 'setCurrentNode',
                desc: '通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性',
                params: '(node) 待被选节点的 node'
            },
            {
                name: 'getNode',
                desc: '根据 data 或者 key 拿到 Tree 组件中的 node',
                params: '(data) 要获得 node 的 key 或者 data'
            },
            {
                name: 'remove',
                desc: '删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性',
                params: '(data) 要删除的节点的 data 或者 node'
            },
            {
                name: 'append',
                desc: '为 Tree 中的一个节点追加一个子节点',
                params: '(data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node'
            },
            {
                name: 'insertBefore',
                desc: '为 Tree 的一个节点的前面增加一个节点',
                params: '(data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node'
            },
            {
                name: 'insertAfter',
                desc: '为 Tree 的一个节点的后面增加一个节点',
                params: '(data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node'
            },
        ],
        slot: [{
            name: '无',
            desc: '自定义树节点的内容，参数为 { node, data }'
        }]
    }
}
