<template>
    <basic-container>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="selData"
                   :page="page"
                   v-model="form"
                   ref="crud"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   @on-load="onLoad"
                   v-loading.fullscreen.lock="fullscreenLoading"
                   :search.sync="search">
<!--            <template slot="menuLeft">-->
<!--                <el-button type="primary" class="el-button&#45;&#45;small" @click="">保 存</el-button>-->
<!--                <el-button type="primary" class="el-button&#45;&#45;small"  @click="">导 出</el-button>-->
<!--            </template>-->

            <template slot-scope="scope" slot="planDate">
                <el-date-picker
                        v-model="scope.row.planDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format=timestamp
                        @change="changebatchDate"
                        size="small"
                        style="width:296px"
                >
                </el-date-picker>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
    import {getVmiConsumeReport} from "@/api/report/report";

    export default {
        data() {
            return {
                search:{},
                statusOptions          :[],//状态
                form: {},
                loading: true,
                fullscreenLoading: false,//页面整加载
                page             :{
                    pageSize   :20,
                    pageSizes  :[20, 100, 500, 1000, 2000],
                    currentPage:1,
                    total      :0
                },
                selectionList: [],
                option: {
                    maxHeight: 565,
                    tip: true,
                    border: true,
                    index: false,
                    addBtn: false,
                    editBtn: false,
                    viewBtn: false,
                    delBtn: false,
                    selection: true, //行可勾选
                    size: 'mini',
                    menu: false,
                    searchMenuSpan: 6,
                    column: [
                        {
                            label: "供应商编码",
                            prop: "supCode",
                            align: 'left',
                            type: "input",
                            width:120,
                        },
                        {
                            label: "供应商名称",
                            prop: "supName",
                            align: 'left',
                            type: "input",
                            width:250,
                            overHidden:true,
                        },
                        {
                            label: "物料编码",
                            prop: "itemCode",
                            align: 'left',
                            type: "input",
                            width:150,
                            sortable: true,
                            search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                        },
                        {
                            label: "物料描述",
                            prop: "itemName",
                            align: 'left',
                            sortable: true,
                            type: "input",
                            search: true,
                            searchLabelWidth: 120,
                            searchSpan: 8,
                            searchRange: true,
                            width:350,
                        },
                        {
                            label: "订单总数量",
                            prop: "poNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            width:200,
                        },
                        {
                            label: "入存总数量",
                            prop: "storeTotalNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                        },
                        {
                            label: "库存数量",
                            prop: "storeNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            hide:true,
                        },
                        {
                            label: "已结算数量",
                            prop: "balNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                        },
                        {
                            label: "库存未结算数量",
                            prop: "notBalNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                        },
                        {
                            label: "已用但未结算数量",
                            prop: "usedButNotBalNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            hide:true,
                        },
                    ]
                },
                selData: [],
            };
        },
        methods: {
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                this.query = Object.assign({}, params);
                this.page.currentPage = 1;
                this.onLoad(this.page, this.query);
                done();
            },
            selectionChange(list) {
                this.selectionList = list;
                this.itemCode = []
                this.selectionList.forEach(item => {
                    this.itemCode.push(item.itemCode)
                })
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
                // 解决表头错位问题
                this.$refs.crud.refreshTable();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
                this.onLoad(this.page, this.query);
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            changebatchDate(val) {
                this.selectionList.forEach(item => {
                    item.checkUpdateDate = val;
                });
            },
            changebatchRemark(val) {
                this.selectionList.forEach(item => {
                    item.remark = val;
                });
            },
            changebatchSeq(val) {
                this.selectionList.forEach(item => {
                    item.seq = val;
                });
            },
            changebatchAnticipation(val) {
                this.selectionList.forEach(item => {
                    item.anticipation = val;
                });
            },
            onLoad(page, params = {}) {
                this.loading = true;
                getVmiConsumeReport(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    this.selData = []
                    const data = res.data.data;
                    this.page.total = data.total
                    console.log(data)
                    data.records.forEach(item => {

                    })
                    this.selData = data.records;
                    this.selectionClear();
                    this.loading = false;
                });
            },
        },
        created(){
        }
    };
</script>

<style>
    .el-table .cell {
        white-space: pre-line;
    }

    .el-card__body .el-table span {
        white-space: nowrap;
    }

</style>
<style scoped="scoped" lang="scss">

    /* 改变搜索栏位一行有几个搜做*/
    /deep/ .el-col-md-8 {
        width : 18%
    }

    /deep/ .el-card__body .avue-crud__menu .avue-crud__left .el-button--small, .el-card__body .avue-crud__menu .avue-crud__left .el-button--small.is-round {
        padding: 8px 16px;
    }

    /deep/ .el-card__body .el-table th > .cell {
        height: 30px;
        line-height: 30px;
    }
    /deep/ .el-col-6 {
        width:15.5%
    }

    /deep/ .antiYellowCss {
        background-color: yellow!important;
        color:black !important;
    }

    /deep/ .antiRedCss {
        background-color: orangered!important;
        color:white !important;
    }

    /deep/ .antiGreenCss {
        background-color: lightseagreen!important;
        color:white !important;
    }
</style>
