export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicCascaderDemo',
        desc: '<div>级联选择对数据有较严格要求，请参照示例的格式使用<span class="wordNotice">data</span>，' +
            '每项数据至少包含<span class="wordNotice">value</span>、<span class="wordNotice">label</span>两项，' +
            '子集为<span class="wordNotice">children</span>，以此类推。</div>' +
            '<div><span class="wordNotice">value</span>为当前选择的数据的<span class="wordNotice">value</span>值的数组，' +
            '比如<span class="wordNotice">[\'beijing\', \'gugong\']</span>，按照级联顺序依次排序，使用' +
            '<span class="wordNotice">v-model</span>进行双向绑定</div>'
    },{
        id: 'MRZ',
        title: '默认值',
        component: 'DefaultCascaderDemo'
    },{
        id: 'ZDYXS',
        title: '自定义显示',
        component: 'DiyCascaderDemo',
        desc: '<br />通过设置<span class="wordNotice">slot</span>可以自定义显示内容，不局限于输入框。'
    },{
        id: 'JY',
        title: '禁用',
        component: 'DisabledCascaderDemo',
        desc: '<div>设置属性<span class="wordNotice">disabled</span>可以禁用组件。</div>' +
            '<div>给某项数据设置<span class="wordNotice">disabled: true</span>可以禁用某一项。</div>'
    },{
        id: 'XZJGB',
        title: '选择即改变',
        component: 'SelectCascaderDemo'
    },{
        id: 'ZDYYXX',
        title: '自定义已选项',
        component: 'CustomCascaderDemo',
        desc: '对于显示的结果，可以通过<span class="wordNotice">render-format</span>接收一个函数来自定义。'
    },{
        id: 'DTJZXX',
        title: '动态加载选项',
        component: 'LoadCascaderDemo',
        desc: '<div>使用<span class="wordNotice">load-data</span>属性可以异步加载子选项，需要给数据增加' +
            '<span class="wordNotice">loading</span>来标识当前是否在加载中。</div>' +
            '<div><span class="wordNotice">load-data</span>的第二个参数为回调，如果执行，则会自动展开当前项的子列表。</div>'
    },{
        id: 'SS',
        title: '搜索 ',
        component: 'FilterCascaderDemo',
        desc: '使用属性<span class="wordNotice">filterable</span>可直接搜索选项并选择。'
    }],
    api: {
        props: []
    }
}
