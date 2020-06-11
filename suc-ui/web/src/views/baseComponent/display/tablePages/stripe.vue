<template>
    <suc-table
        :data="tableData"
        stripe
        size="mini"
    >
        <suc-table-column
            prop="date"
            label="日期"
            width="180"
        >
        </suc-table-column>
        <suc-table-column
            prop="name"
            label="姓名"
            width="180"
        >
        </suc-table-column>
        <suc-table-column
            prop="address"
            label="地址"
        >
        </suc-table-column>
    </suc-table>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucTable, SucTableColumn } from "@suc/ui";

@Component({
    components: {
        SucTable,
        SucTableColumn
    }
})
export default class StripeTableDemo extends Vue {
    tableData: any = [
        {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
        },
        {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
        },
        {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
        },
        {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
        }
    ];
}
</script>