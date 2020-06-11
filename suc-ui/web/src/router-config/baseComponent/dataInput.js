const baseRouter = "/main/baseComponent/dataInput";
export default {
    routers: [
        {
            path: 'dataInput',
            meta: {
                name: 'dataInput'
            },
            component: () => import('@/components/EmptyView.vue'),
            children: [
                {
                    path: '',
                    redirect: 'input',
                },
                {
                    path: 'cascader',
                    meta: {
                        name: 'cascader'
                    },
                    component: () => import('@/views/baseComponent/dataInput/cascader.vue')
                },
                {
                    path: 'checkbox',
                    meta: {
                        name: 'checkbox'
                    },
                    component: () => import('@/views/baseComponent/dataInput/checkbox.vue')
                },
                {
                    path: 'datePicker',
                    meta: {
                        name: 'datePicker'
                    },
                    component: () => import('@/views/baseComponent/dataInput/datePicker.vue')
                },
                {
                    path: 'input',
                    meta: {
                        name: 'input'
                    },
                    component: () => import('@/views/baseComponent/dataInput/input.vue')
                },
                {
                    path: 'radio',
                    meta: {
                        name: 'radio'
                    },
                    component: () => import('@/views/baseComponent/dataInput/radio.vue')
                },
                {
                    path: 'select',
                    meta: {
                        name: 'select'
                    },
                    component: () => import('@/views/baseComponent/dataInput/select.vue')
                },
                {
                    path: 'timePicker',
                    meta: {
                        name: 'timePicker'
                    },
                    component: () => import('@/views/baseComponent/dataInput/timePicker.vue')
                },
                {
                    path: 'transfer',
                    meta: {
                        name: 'transfer'
                    },
                    component: () => import('@/views/baseComponent/dataInput/transfer.vue')
                },
                {
                    path: 'form',
                    meta: {
                        name: 'form'
                    },
                    component: () => import('@/views/baseComponent/dataInput/form.vue')
                }
            ]
        }
    ],
    menus: [
        {
            label: "Input 输入框",
            router: `${baseRouter}/input`
        },
        {
            label: "Radio 单选框",
            router: `${baseRouter}/radio`
        },
        {
            label: "Checkbox 多选框",
            router: `${baseRouter}/checkbox`
        },
        {
            label: "Select 选择器",
            router: `${baseRouter}/select`
        },
        {
            label: "Datepicker 日期选择器",
            router: `${baseRouter}/datePicker`
        },
        {
            label: "TimePicker 时间选择器",
            router: `${baseRouter}/timePicker`
        },
        {
            label: "Transfer 穿梭框",
            router: `${baseRouter}/transfer`
        },
        {
            label: "Cascader 级联选择",
            router: `${baseRouter}/cascader`
        },
        {
            label: "Form 表单验证",
            router: `${baseRouter}/form`
        }
    ]
};
//# sourceMappingURL=dataInput.js.map