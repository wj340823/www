<template>
    <div>
        <top-nav
            :config="config"
            :name="mainView.name"
            @searchEvent="getSearchName"
            @openAddModal="getTopNavOperate"
        />
        <div style="padding: 10px 16px">
            <suc-table
                :data="mainView.data"
                stripe
                :border="true"
                :height="heightMixin"
                v-loading="mainView.loading"
                v-if="config.operateType != 'datalist'"
            >
                <suc-table-column type="index" label="序"></suc-table-column>
                <!--category-->
                <suc-table-column
                    label="类别名称"
                    v-if="config.operateType == 'kind'"
                >
                    <template slot-scope="scope">
                        <span class="goto-item" @click="gotoItem(scope.row)">{{
                            scope.row.categoryName
                        }}</span>
                    </template>
                </suc-table-column>
                <suc-table-column
                    label="分组名称"
                    v-if="config.operateType == 'group'"
                >
                    <template slot-scope="scope">
                        <span class="goto-item" @click="gotoItem(scope.row)">{{
                            scope.row.groupName
                        }}</span>
                    </template>
                </suc-table-column>
                <suc-table-column prop="size" label="大小"></suc-table-column>
                <suc-table-column
                    prop="updateTime"
                    label="更新时间"
                ></suc-table-column>
                <suc-table-column
                    prop="categoryName"
                    label="描述"
                ></suc-table-column>
                <suc-table-column prop="type" label="操作" align="center">
                    <template slot-scope="scope">
                        <span
                            class="operate-edit"
                            @click="openModal(scope.row, 'edit')"
                            >修改</span
                        >
                        <span
                            class="operate-del"
                            @click="openModal(scope.row, 'del')"
                            >删除</span
                        >
                    </template>
                </suc-table-column>
            </suc-table>
            <suc-table
                :data="mainView.data"
                stripe
                :border="true"
                :height="heightMixin"
                v-loading="mainView.loading"
                v-if="config.operateType == 'datalist'"
            >
                <suc-table-column type="index" label="序"></suc-table-column>

                <suc-table-column label="图层代号">
                    <template slot-scope="scope">
                        <span class="goto-item">{{ scope.row.dataName }}</span>
                    </template>
                </suc-table-column>
                <suc-table-column label="坐标系" prop="wkid"></suc-table-column>
                <suc-table-column
                    label="数据类型"
                    prop="type"
                ></suc-table-column>
                <suc-table-column
                    label="描述"
                    prop="description"
                ></suc-table-column>
                <suc-table-column
                    label="发布状态"
                    prop="isRelease"
                ></suc-table-column>
                <suc-table-column
                    label="所属服务"
                    prop="serverName"
                ></suc-table-column>
                <suc-table-column prop="type" label="操作" align="center">
                    <template slot-scope="scope">
                        <span
                            class="operate-edit"
                            @click="openModal(scope.row, 'edit')"
                            >修改</span
                        >
                        <span
                            class="operate-del"
                            @click="openModal(scope.row, 'del')"
                            >删除</span
                        >
                    </template>
                </suc-table-column>
            </suc-table>
        </div>
        <suc-page
            :total="mainView.data.length"
            show-elevator
            :page-size="page.size"
            align="right"
            style="margin-right: 16px"
            :current="page.no"
        />
        <!--        <operate-modal v-if="operate.show" :operate="operate" @closeOperateModal="closeOperateModal"></operate-modal>-->
        <suc-modal
            :config="config1"
            v-model="operate.show"
            @on-cancel="closeOperateModal"
        >
            <div class="content"></div>
            <div class="footer">
                <operate-modal></operate-modal>
            </div>
        </suc-modal>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { TopNav, OperateModal } from "../components";
    import {
        TopParamConfig,
        Operate,
        Page,
        MainViewConfig
    } from "../components/interface";
    import { SucTable, SucTableColumn, SucPage, SucModal } from "@suc/ui";
    import AutoHeight from "@/mixins/autoHeight";
    import { data } from "@/api";
    import { ModalConfig } from "@suc/ui/interfaces";
    import moment from "moment";
    const OP = {
        add: "新增",
        edit: "修改",
        del: "删除"
    };
    @Component({
        components: {
            TopNav,
            OperateModal,
            SucTable,
            SucTableColumn,
            SucPage,
            SucModal
        }
    })
    export default class MainView extends AutoHeight {
        //头部配置
        config: TopParamConfig = {
            label: "数据查看",
            searchable: true,
            importable: true,
            operate: true,
            operateType: "kind"
        };
        //弹框配置
        config1: ModalConfig = {
            title: "",
            width: 600,
            "footer-hide": true,
            closable: false
        };
        //mainView 主配置
        mainView: MainViewConfig = {
            data: [],
            name: "",
            categoryId: "",
            groupId: "",
            loading: false
        };
        page: Page = {
            no: 1,
            size: 10
        };
        operate: Operate = {
            show: false,
            data: null,
            type: "edit",
            title: "",
            configType: ""
        };
        //查分类
        async searchResult() {
            let url, params;
            if (this.config.operateType == "kind") {
                url = "/gnet/data/category/page";
                params = {
                    key: this.mainView.name,
                    pageNo: this.page.no,
                    pageSize: this.page.size
                };
            } else if (this.config.operateType == "group") {
                url = "/gnet/data/group/page";
                params = {
                    key: this.mainView.name,
                    categoryId: this.mainView.categoryId,
                    pageNo: this.page.no,
                    pageSize: this.page.size
                };
            } else {
                url = "/gnet/data/page";
                params = {
                    dataName: this.mainView.name,
                    groupId: this.mainView.groupId,
                    pageNo: this.page.no,
                    pageSize: this.page.size
                };
            }
            let list: any;
            this.mainView.loading = true;
            try {
                list = await data.getData(params, url);
                this.mainView.data = list.data.data;
            } catch {
                this.$SucMessage.error("error");
            }
            this.mainView.loading = false;
        }

        //分页初始化
        pageInit() {
            this.page = {
                no: 1,
                size: 10
            };
        }
        //获取搜索名
        getSearchName(name: string) {
            this.mainView.name = name;
            this.searchResult();
        }
        //打开新增弹框
        getTopNavOperate() {
            this.openModal(null, "add");
        }
        //打开弹框
        openModal(
            data: any,
            type: "add" | "edit" | "del",
            name: string = "类别"
        ) {
            if (this.config.operateType == "kind") {
                this.config1.title = OP[type] + "类别";
            } else {
                this.config1.title = OP[type] + "分组";
            }
            this.operate.show = true;
            this.operate.type = type;
            this.operate.data = data;
            this.operate.configType = this.config.operateType;
        }
        //关闭弹框
        closeOperateModal() {
            this.operate.show = false;
        }
        //去下一级目录
        gotoItem(item: any) {
            this.mainView.categoryId = "";
            this.mainView.groupId = "";
            this.mainView.name = "";
            this.pageInit();
            if (this.config.operateType == "kind") {
                this.mainView.categoryId = item.categoryId || "";
                this.config.operateType = "group";
            } else if (this.config.operateType == "group") {
                this.mainView.groupId = item.groupId || "";
                this.config.operateType = "datalist";
                this.config.operate = false;
            } else {
            }
            this.searchResult();
        }

        created(): void {
            this.autoHeightMixin(180);
            this.searchResult();
        }
    }
</script>

<style scoped lang="scss">
    .goto-item {
        color: #4aa2fe;

        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .operate-edit {
        color: #4aa2fe;
        margin: 0 10px;
        cursor: pointer;
    }

    .operate-del {
        color: red;
        margin: 0 10px;
        cursor: pointer;
    }
</style>
