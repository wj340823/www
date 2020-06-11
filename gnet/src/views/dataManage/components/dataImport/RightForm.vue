<template>
    <div class="right-form">
        <div
            v-if="type == 'vector'"
            style="width: 100%;height:calc(100% - 50px)"
        >
            <suc-form :config="{ 'label-width': 100 }" class="main-view">
                <suc-form-item class="item" :config="{ label: '服务代号' }">
                    <suc-input
                        placeholder="名称"
                        v-model="vectorData.dataName"
                        class="w250"
                    >
                    </suc-input>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '坐标系' }">
                    <suc-select
                        class="w250"
                        v-model="vectorData.wkid"
                        :options="projOptions"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '添加附件' }">
                    <label for="upload">
                        <img src="@/assets/data/upload.png" class="upload" />
                    </label>
                    <input
                        type="file"
                        ref="upload"
                        id="upload"
                        class="w250"
                        multiple="multiple"
                        @change="getFile"
                    />
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '描述' }">
                    <textarea class="w250">{{ vectorData.desc }}</textarea>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '数据类型' }">
                    <suc-select
                        class="w250"
                        v-model="vectorData.importType"
                        :options="vectorData.typeList"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '类别选择' }">
                    <suc-select
                        class="w250"
                        v-model="vectorData.kindSelected"
                        :options="vectorData.kinds"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '分组' }">
                    <suc-select
                        class="w250"
                        v-model="vectorData.groupId"
                        :options="vectorData.groups"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item">
                    <suc-checkbox
                        v-model="vectorData.check"
                        style="display: inline-block"
                        >数据质检
                    </suc-checkbox>
                    <suc-button
                        type="primary"
                        style="display: inline-block"
                        @on-click="gotoCheck"
                        >质检配置
                    </suc-button>
                </suc-form-item>
                <div class="item fileList">
                    <div class="list-tit">附件列表</div>
                    <p
                        class="list-con"
                        v-for="(file, index) in vectorData.fileLists"
                        :key="index"
                    >
                        {{ file.name }}
                        <Icon type="md-close" @click="delFile(index)"></Icon>
                    </p>
                </div>
            </suc-form>
        </div>
        <div
            v-if="type != 'vector'"
            style="width: 100%;height:calc(100% - 50px)"
        >
            <suc-form :config="{ 'label-width': 100 }" class="main-view">
                <suc-form-item class="item" :config="{ label: '配置类型' }">
                    <suc-select
                        class="w250"
                        v-model="rasterData.type"
                        :options="rasterData.typeList"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '服务代号' }">
                    <suc-input
                        placeholder="名称"
                        v-model="rasterData.serviceId"
                        class="w250"
                    >
                    </suc-input>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '服务地址' }">
                    <suc-input
                        placeholder="名称"
                        v-model="rasterData.serviceAdd"
                        class="w250"
                    >
                    </suc-input>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '服务类型' }">
                    <suc-select
                        class="w250"
                        v-model="rasterData.type"
                        :options="rasterData.typeList"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '坐标系' }">
                    <suc-select
                        class="w250"
                        v-model="rasterData.wkid"
                        :options="projOptions"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '可见范围' }">
                    <suc-input
                        placeholder="名称"
                        v-model="rasterData.zoom[0]"
                        class="w90"
                        style="display: inline-block"
                    >
                    </suc-input>
                    -
                    <suc-input
                        placeholder="名称"
                        v-model="rasterData.zoom[1]"
                        class="w90"
                        style="display: inline-block"
                    >
                    </suc-input>
                </suc-form-item>
                <suc-form-item
                    class="item"
                    :config="{ label: '三维类型' }"
                    v-if="type == '3D'"
                >
                    <suc-select
                        class="w250"
                        v-model="rasterData.three"
                        :options="rasterData.threeList"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '描述' }">
                    <textarea class="w250">{{ rasterData.desc }}</textarea>
                </suc-form-item>

                <suc-form-item class="item" :config="{ label: '类别选择' }">
                    <suc-select
                        class="w250"
                        v-model="rasterData.kindSelected"
                        :options="rasterData.kinds"
                    ></suc-select>
                </suc-form-item>
                <suc-form-item class="item" :config="{ label: '分组' }">
                    <suc-select
                        class="w250"
                        v-model="rasterData.groupId"
                        :options="vectorData.groups"
                    ></suc-select>
                </suc-form-item>
            </suc-form>
        </div>
        <div class="footer">
            <suc-button
                style="width: 200px"
                @on-click="importFile"
                :disabled="validStatus"
                >导入
            </suc-button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import {
        SucButton,
        SucInput,
        SucSelect,
        SucFormItem,
        SucForm,
        SucCheckbox
    } from "@suc/ui";
    import { SelectOptions } from "@suc/ui/interfaces";
    import { data } from "@/api";
    import { Icon } from "iview";
    import {
        VectorDataConfig,
        RasterDataConfig
    } from "@/views/dataManage/components/interface";
    import {
        FILETYPE,
        getAllCategory,
        getAllGroup
    } from "@/views/dataManage/components/regular";

    @Component({
        components: {
            SucButton,
            SucInput,
            SucSelect,
            SucFormItem,
            SucForm,
            SucCheckbox,
            Icon
        }
    })
    export default class RightForm extends Vue {
        @Prop() type!: string;
        projOptions: SelectOptions = [
            {
                label: "EPSG:4326",
                value: 4326
            },
            {
                label: "EPSG:3857",
                value: 3857
            }
        ];
        groupOptions: SelectOptions = [];
        //矢量数据表单
        vectorData: VectorDataConfig = {
            dataName: "",
            wkid: 4326,
            file: "",
            fileLists: [],
            desription: "",
            importType: "shapefile",
            typeList: FILETYPE,
            kindSelected: "",
            kinds: [],
            groupId: "",
            groups: [],
            check: false
        };
        //栅格数据和三位数据（因为不用上传文件 就一个三维影像区别所以放一起）
        rasterData: RasterDataConfig = {
            type: "",
            typeList: [],
            serviceId: "",
            serviceAdd: "",
            serviceType: "",
            serviceTypeList: [],
            wkid: "",
            zoom: [0, 20],
            three: "",
            threeList: [],
            desription: "",
            kindSelected: "",
            kinds: [],
            groupId: ""
        };

        //判断是否可以提交
        get validStatus() {
            if (this.type == "vector") {
            } else {
            }
            return false;
        }

        dataInit() {
            console.log();
        }

        gotoCheck() {
            this.$router.push("/data/dataCheckConfig");
        }

        getFile() {
            let fileInput: any = this.$refs.upload;
            this.vectorData.fileLists = fileInput.files;
        }

        importFile() {
            let url: string = "";
            let fd = new FormData();
            if (this.type == "vector") {
                url = "/gnet/data/vector";
                this.vectorData.fileLists.forEach((item: any) => {
                    fd.append("files", item);
                });
                fd.append(
                    "data",
                    JSON.stringify({
                        ...this.vectorData,
                        type: this.type
                    })
                );
                fd.append("vectorType", this.vectorData.importType);
                data.postDataFile(url, {}, fd);
            } else if (this.type == "raster") {
            } else {
            }
        }

        delFile(index: number) {
            this.vectorData.fileLists = Array.from(
                this.vectorData.fileLists
            ).filter((item: any, i: number) => i != index);
        }

        async created() {
            let list;
            let groups;
            try {
                list = await getAllCategory();
                this.vectorData.kinds = list.map((item: any) => {
                    return {
                        label: item.categoryName,
                        value: item.categoryId
                    };
                });
                this.vectorData.kindSelected = this.vectorData.kinds[0].value;
                groups = await getAllGroup();

                this.vectorData.groups = groups.map((item: any) => {
                    return {
                        label: item.groupName,
                        value: item.groupId
                    };
                });
                this.vectorData.groupId = this.vectorData.groups[0].value;
            } catch (e) {
                this.$SucMessage.error("error");
            }
        }
    }
</script>

<style scoped lang="scss">
    .right-form {
        float: left;
        margin-left: 16px;
        width: calc(100% - 230px);
        height: calc(100% - 16px);
        border: 1px solid #dedede;
        font-size: 14px;

        .main-view {
            width: 100%;
            height: 100%;
            padding: 14px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;

            .item {
                width: 300px;
                min-height: 40px;
                margin: 16px 10px;

                .w250 {
                    width: 250px;
                }

                .w90 {
                    width: 90px;
                }

                input[type="file"] {
                    display: none;
                }

                .upload {
                    width: 22px;
                    vertical-align: middle;
                }
            }

            .fileList {
                border-radius: 10px;
                border: 1px solid #dedede;
                padding: 10px;
                width: 500px;

                .list-tit {
                    padding-left: 10px;
                    background-color: rgb(239, 245, 253);
                    //border-bottom: 1px solid #eee;
                    line-height: 40px;
                    margin-bottom: 10px;
                }

                .list-con {
                    padding-left: 10px;
                    background-color: rgb(242, 242, 242);
                    line-height: 40px;
                    margin-bottom: 3px;

                    i {
                        float: right;
                        margin-top: 14px;
                        margin-right: 10px;
                        font-size: 14px;
                    }
                }
            }
        }

        .footer {
            text-align: center;
        }
    }
</style>
