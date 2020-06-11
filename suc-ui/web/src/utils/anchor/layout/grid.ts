export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicGridDemo'
    },{
        id: 'QKJG',
        title: '区块间隔',
        component: 'GutterGridDemo',
        desc: '通过给 row 添加 gutter 属性，可以给下属的 col 添加间距，推荐使用 (16+8n)px 作为栅格间隔'
    },{
        id: 'SGSX',
        title: '栅格顺序(Flex)',
        component: 'OrderGridDemo',
        desc: '通过 Flex 布局的 order 来改变栅格的顺序。'
    },{
        id: 'XYSBJ',
        title: '响应式布局',
        component: 'MediaGridDemo',
        desc: '参照 Bootstrap 的 响应式设计，预设六个响应尺寸：xs sm md lg xl xxl，详见 API。<br/>' +
            'span pull push offset order 属性可以通过内嵌到 xs sm md lg 属性中来使用。' +
            '其中 :xs="6" 相当于 :xs="{ span: 6 }"'
    }],
    api: {
        props: [{
            attr: 'gutter',
            desc: '栅格间距，单位 px，左右平分',
            type: 'Number',
            default: '0'
        }, {
            attr: 'type',
            desc: '布局模式，可选值为 flex 或不选，在现代浏览器下有效',
            type: 'String',
            default: '-'
        }, {
            attr: 'align',
            desc: 'flex 布局下的垂直对齐方式，可选值为top、middle、bottom',
            type: 'String',
            default: '-'
        }, {
            attr: 'justify',
            desc: 'flex 布局下的水平排列方式，可选值为start、end、center、space-around、space-between',
            type: 'String',
            default: '-'
        }, {
            attr: 'class-name',
            desc: '自定义的class名称',
            type: 'String',
            default: '-'
        }],
        subProps: [{
            attr: 'span',
            desc: '栅格的占位格数，可选值为0~24的整数，为 0 时，相当于display:none',
            type: 'Number | String',
            default: '-'
        }, {
            attr: 'order',
            desc: '栅格的顺序，在flex布局模式下有效',
            type: 'Number | String',
            default: '-'
        }, {
            attr: 'offset',
            desc: '栅格左侧的间隔格数，间隔内不可以有栅格',
            type: 'Number | String',
            default: '-'
        }, {
            attr: 'push',
            desc: '栅格向右移动格数',
            type: 'Number | String',
            default: '-'
        }, {
            attr: 'pull',
            desc: '栅格向左移动格数',
            type: 'Number | String',
            default: '-'
        }, {
            attr: 'class-name',
            desc: '自定义的class名称',
            type: 'String',
            default: '-'
        }, {
            attr: 'xs',
            desc: '<576px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }, {
            attr: 'sm',
            desc: '≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }, {
            attr: 'md',
            desc: '≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }, {
            attr: 'lg',
            desc: '≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }, {
            attr: 'xl',
            desc: '≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }, {
            attr: 'xxl',
            desc: '≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象',
            type: 'Number | Object',
            default: '-'
        }]
    }
}
