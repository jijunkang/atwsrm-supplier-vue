<template>
    <basic-container>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="selData"
                   :page="page"
                   :current-change="pageChange"
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
            <template slot="menuLeft">
                <el-button type="primary" class="el-button--small" @click="saveDataOfCaiGou">保 存</el-button>
                <!--<el-button type="primary" class="el-button&#45;&#45;small"  @click="exportAll">导 出</el-button>
                <el-button type="primary" class="el-button&#45;&#45;small"  @click="lockPro">锁 定</el-button>
                <el-button type="primary" class="el-button&#45;&#45;small"  @click="freePro">释 放</el-button>
                <el-tag style="float:right;color:red;">备注：[ 状态 ] 栏位包括: 未送货、送货中、厂内已报检、厂外已报检、厂内已检验、厂外已检验、已点收、虚拟已入库、已关闭</el-tag>-->
            </template>

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


            <template slot-scope="scope" slot="checkUpdateDate">
                <el-date-picker
                        v-model="scope.row.checkUpdateDate"
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

            <template slot-scope="scope" slot="remark">
                <el-input
                        v-model="scope.row.remark"
                        size="mini"
                        @change="changebatchRemark"
                        clearable
                ></el-input>
            </template>

            <template slot-scope="scope" slot="anticipation">
                <el-select
                        v-model="scope.row.anticipation"
                        @change="changebatchAnticipation"
                        placeholder="请选择预判情况"
                        size="mini"
                        clearable>
                    <el-option
                            v-for="item in anticipationOptions"
                            :label="item.label"
                            :value="item.value"
                            style="width:150px">
                    </el-option>
                </el-select>
            </template>

            <template slot-scope="scope" slot="seq">
                <el-input
                        v-model="scope.row.seq"
                        size="mini"
                        @change="changebatchSeq"
                        clearable
                ></el-input>
            </template>

            <template slot-scope="scope" slot="checkStatusSearch">
                <el-select
                        v-model="search.status"
                        multiple
                        placeholder="请输入选择状态"
                        size="mini"
                >
                    <el-option
                            v-for="item in statusOptions"
                            :key="item.dictKey"
                            :label="item.dictValue"
                            :value="item.dictKey">
                    </el-option>
                </el-select>
            </template>

        </avue-crud>
    </basic-container>
</template>

<script>
    import {getCaiGouSchedule,saveDataOfCaiGou} from "@/api/supplier/supplier";
    import func from "@/util/func";
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                limitsPermersion:true,
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
                            label: "子项目号",
                            prop: "proNo",
                            align: 'left',
                            type: "input",
                            width:90,
                            //search    :true,
                            searchSpan:8,
                            sortable: true,
                            searchLabelWidth:120,
                            hide:true,
                        },
                        {
                            label: "子项目需求数量",
                            prop: "proNum",
                            align: 'center',
                            type: "input",
                            width:100,
                            overHidden:true,
                            hide:true,
                        },
                        {
                            label: "合同交期",
                            prop: "agreeDate",
                            align: 'left',
                            sortable: true,
                            overHidden:true,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            hide:true,
                        },
                        {
                            label: "计划交期",
                            prop: "planDate",
                            align: 'left',
                            sortable: true,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            //search    :true,
                            searchLabelWidth: 120,
                            searchSpan: 8,
                            searchRange: true,
                            hide:true,
                        },
                        {
                            label: "单据编号",
                            prop: "poCode",
                            align: 'left',
                            sortable: true,
                            width:150,
                            type: "input",
                            overHidden:true,
                            search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                        },
                        {
                            label: "行号",
                            prop: "poLn",
                            align: 'left',
                            sortable: true,
                            width:60,
                            type: "input",
                            search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                        },
                        {
                            label: "单据编号-行号",
                            prop: "poCodeLn",
                            align: 'left',
                            sortable: true,
                            width:120,
                            type: "input",
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            hide:true,
                        },
                        {
                            label: "供应商",
                            prop: "supName",
                            align: 'left',
                            sortable: true,
                            width:180,
                            type: "input",
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            hide:true,
                        },
                        {
                            label: "物料编号",
                            prop: "itemCode",
                            align: 'left',
                            sortable: true,
                            width:120,
                            type: "input",
                            search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            overHidden:true
                        },
                        {
                            label: "物料名称",
                            prop: "itemName",
                            sortable: true,
                            align: 'left',
                            search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            overHidden:true
                        },
                        {
                            label: "订单数量",
                            prop: "orderNum",
                            align: 'center',
                            sortable: true,
                            width:120,
                        },
                        {
                            label: "需求数量",
                            prop: "reqNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            hide:true,
                        },
                        {
                            label: "未收货数量",
                            prop: "notRcvNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            width:120,
                        },
                        {
                            label: "确认交期（到厂日期）",
                            prop: "checkUpdateDate",
                            width: 150,
                            align: 'left',
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            valueFormat: "yyyy-MM-dd",
                            sortable: true,
                            slot:true,
                            search: true,
                            searchLabelWidth: 120,
                            searchSpan: 8,
                            searchRange: true,
                        },
                        {
                            label: "需求日期",
                            prop: "reqDate",
                            align: 'left',
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            sortable: true,
                            width: 150,
                        },
                        {
                            label: "备注",
                            prop: "remark",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            slot:true,
                        },
                        {
                            label: "回厂预判",
                            width: 140,
                            prop: "anticipation",
                            align: 'center',
                            sortable: true,
                            slot:true,
                            type: "select",
                            //search    :true,
                            searchLabelWidth: 120,
                            searchSpan: 8,
                            hide:true,
                            dicData: [
                                {
                                    "label": "肯定能回",
                                    "value": "肯定能回",
                                },
                                {
                                    "label": "可能能回",
                                    "value": "可能能回",
                                },
                                {
                                    "label": "基本不能回",
                                    "value": "基本不能回",
                                }
                            ]
                        },
                        {
                            label: "子项缺料项数",
                            prop: "lackItemNum",
                            align: 'center',
                            type: "input",
                            width:90,
                            sortable: true,
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            hide:true,
                        },
                        {
                            label: "(WW/PO)交期",
                            prop: "wwpoDate",
                            width:110,
                            align: 'left',
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "当前需求日期",
                            prop: "nowReqDate",
                            width:110,
                            align: 'left',
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "到货状态",
                            prop: "arrivalStatus",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "状态",
                            prop: "checkStatus",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            searchslot:true,
                            type      :"select",
                            props     :{
                                label:'dictValue',
                                value:'dictKey'
                            },
                            hide:true,
                            dicUrl    :'/api/blade-system/dict-biz/dictionary?code=do_status'
                        },
                        {
                            label: "入库状态",
                            prop: "storeStatus",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "订单数量",
                            prop: "tcNum",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "责任人",
                            prop: "person",
                            align: 'left',
                            type: "input",
                            sortable: true,
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            hide:true,
                        },
                        {
                            label: "ABC类",
                            prop: "codeType",
                            align: 'center',
                            type: "input",
                            sortable: true,
                            hide:true,
                        },
                        {
                            label: "是否是四大件",
                            width: 90,
                            prop: "isFourBigItem",
                            align: 'center',
                            sortable: true,
                            type: "select",
                            //search    :true,
                            searchSpan:8,
                            searchLabelWidth:120,
                            hide:true,
                            dicData: [
                                {
                                    "label": "四大件",
                                    "value": "1",
                                },
                                {
                                    "label": "非四大件",
                                    "value": "0",
                                },
                            ]
                        },
                        {
                            label: "次序",
                            prop: "seq",
                            align: 'left',
                            type: "input",
                            width:90,
                            sortable: true,
                            slot:true,
                            hide:true,
                        },
                        {
                            label: "已修改次数",
                            prop: "limits",
                            align: 'center',
                            width:90,
                            sortable: true,
                            hide:true,
                        },
                    ]
                },
                selData: [],
                anticipationOptions: [{
                    value: '肯定能回',
                    label: '肯定能回'
                }, {
                    value: '可能能回',
                    label: '可能能回'
                }, {
                    value: '基本不能回',
                    label: '基本不能回'
                }]
            };
        },
        computed: {
            ...mapGetters(["permission","userInfo"])
        },
        methods: {
            getPermission(e) {
                if(this.userInfo.account == '180411'){
                    this.limitsPermersion = false;
                }
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                if(!params.planDate){
                    params.planDateStart = ''
                    params.planDateEnd   = ''
                }

                if(!params.checkUpdateDate){
                    params.checkUpdateDateStart = ''
                    params.checkUpdateDateEnd   = ''
                }

                if(params.planDate){
                    if(params.planDate.length > 1){
                        params.planDateStart = params.planDate[0]
                        params.planDateEnd   = params.planDate[1]
                    }
                }

                if(params.checkUpdateDate){
                    if(params.checkUpdateDate.length > 1){
                        params.checkUpdateDateStart = params.checkUpdateDate[0]
                        params.checkUpdateDateEnd   = params.checkUpdateDate[1]
                    }
                }

                this.query = Object.assign({}, params);
                delete this.query.planDate
                delete this.query.checkUpdateDate
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
            // 预判格式
            antiClass({row,column,rowIndex,columnIndex}){
                // 预判
                var anticipation = row.anticipation

                //第5列 添加 绿 类
                if (columnIndex == 5  && anticipation == '肯定能回') {
                    return 'antiGreenCss'
                }
                //第5列 添加 黄 类
                if (columnIndex == 5  && anticipation == '可能能回') {
                    return 'antiYellowCss'
                }
                //第6列 添加 红 类
                if (columnIndex == 5  && anticipation == '基本不能回') {
                    return 'antiRedCss'
                }

            },
            exportAll(){
                if(this.selectionList.length>0){
                    let selData = JSON.parse(JSON.stringify(this.selectionList))
                    for (let rowData of selData) {
                        if(rowData.wwpoDate!='') {rowData.wwpoDate = rowData.wwpoDate.substr(0,10)}
                        if(rowData.agreeDate!='') {rowData.agreeDate = rowData.agreeDate.substr(0,10)}
                        if(rowData.planDate!='') {rowData.planDate = rowData.planDate.substr(0,10)}
                        if(rowData.reqDate!='') {rowData.reqDate = rowData.reqDate.substr(0,10)}
                        if(rowData.checkUpdateDate!='') {rowData.checkUpdateDate = rowData.checkUpdateDate.substr(0,10)}
                    }

                    this.$export.excel({
                        title: "采购送货计划表",
                        columns: [
                            { label: "子项目号", prop: "proNo" },
                            { label: "子项目需求数量", prop: "proNum" },
                            { label: "合同交期", prop: "agreeDate" },
                            { label: "计划交期", prop: "planDate" },
                            { label: "单据编号", prop: "poCode" },
                            { label: "行号", prop: "poLn" },
                            { label: "编号-行号", prop: "poCodeLn" },
                            { label: "供应商", prop: "supName" },
                            { label: "物料编号", prop: "itemCode" },
                            { label: "物料名称", prop: "itemName" },
                            { label: "订单数量", prop: "orderNum" },
                            { label: "需求数量", prop: "reqNum" },
                            { label: "未收货数量", prop: "notRcvNum" },
                            { label: "审核修改交期", prop: "checkUpdateDate" },
                            { label: "备注", prop: "remark" },
                            { label: "回厂预判", prop: "anticipation" },
                            { label: "缺物料数量", prop: "lackItemNum" },
                            { label: "（WW/PO）交期", prop: "wwpoDate" },
                            { label: "需求日期", prop: "reqDate" },
                            { label: "状态", prop: "checkStatus" },
                            { label: "入库状态", prop: "storeStatus" },
                            { label: "责任人", prop: "person" },
                            { label: "次序", prop: "seq" },
                            { label: "已修改次数", prop: "limits" }
                        ],
                        data: selData
                    });

                    // 若有选中行的情况，还是按照选中行打印
                    //this.$refs.crud.rowExcel();
                } else {
                    let req = {}
                    req = {
                        "Blade-Auth": this.$store.getters.token,
                        ...this.query,
                    };
                    window.open('/api/blade-supplier/supplier/exportCaiGouAll?' + func.objToUrlParam(req));
                }
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
            saveDataOfCaiGou() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请至少选择一条数据");
                    return;
                }

                let selData = JSON.parse(JSON.stringify(this.selectionList))

                let scheduleList = []
                for (let rowData of selData) {
                    scheduleList.push({
                        "proNo": rowData.proNo,
                        "proNum": rowData.proNum,
                        "agreeDate":rowData.agreeDate,
                        "planDate":rowData.planDate,
                        "poCode":rowData.poCode,
                        "poLn":rowData.poLn,
                        "supName":rowData.supName,
                        "itemCode":rowData.itemCode,
                        "itemName":rowData.itemName,
                        "orderNum":rowData.orderNum,
                        "reqNum":rowData.reqNum,
                        "lackItemNum":rowData.lackItemNum,
                        "wwpoDate":rowData.wwpoDate,
                        "reqDate":rowData.reqDate,
                        "nowReqDate":rowData.nowReqDate,
                        "checkUpdateDate":rowData.checkUpdateDate,
                        "remark":rowData.remark,
                        "arrivalStatus":rowData.arrivalStatus,
                        "checkStatus":rowData.checkStatus,
                        "storeStatus":rowData.storeStatus,
                        "dutyPerson":rowData.dutyPerson,
                        "seq":rowData.seq,
                        "anticipation":rowData.anticipation,
                        "limits":rowData.limits==''?'0':rowData.limits,
                    })
                }
                let req = {
                    "scheduleList": scheduleList,
                }
                this.fullscreenLoading = true
                saveDataOfCaiGou(req).then(() => {
                    this.$message.success("批量修改成功!");
                    this.refreshChange()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            onLoad(page, params = {}) {
                this.loading = true;
                getCaiGouSchedule(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    this.selData = []
                    const data = res.data.data;
                    this.page.total = data.total
                    console.log(data)
                    data.records.forEach(item => {
                        if(item.checkUpdateDate == ''){
                            item.checkUpdateDate = '';
                        } else {
                            item.checkUpdateDate = new Date(item.checkUpdateDate);
                        }

                        if(item.poCode.indexOf("PR")>-1){
                            item.orderNum = '';
                            item.notRcvNum = '';
                            if(item.lackItemNum=='-1'){
                                item.lackItemNum = '';
                                item.storeStatus = '';
                                item.checkStatus = '';
                            }
                        }

                        if(item.proNo == '' || item.proNo == '无'){
                            item.lackItemNum = '';
                        }

                        if(item.proNum < 0){
                            item.proNum = '';
                        }
                        if(item.reqNum < 0){
                            item.reqNum = '';
                        }
                    })
                    this.selData = data.records;
                    this.selectionClear();
                    this.loading = false;
                });
            },
        },
        created(){
            this.getPermission()
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
        width : 25%
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
