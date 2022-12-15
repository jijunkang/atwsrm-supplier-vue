<template>
    <basic-container>
        <div>
            <avue-crud :option="option"
                       :table-loading="loading"
                       :data="data"
                       :page="page"
                       :permission="permissionList"
                       :before-open="beforeOpen"
                       v-model="form"
                       ref="crud"
                       @row-update="rowUpdate"
                       @row-save="rowSave"
                       @row-del="rowDel"
                       @search-change="searchChange"
                       @search-reset="searchReset"
                       @selection-change="selectionChange"
                       @current-change="currentChange"
                       @size-change="sizeChange"
                       @refresh-change="refreshChange"
                       @on-load="onLoad"
                       v-loading.fullscreen.lock="fullscreenLoading">
                <template slot="menuLeft">
                    <!-- v-if="permission.io_export"-->
                    <el-button type="warning"
                               size="mini"
                               icon="el-icon-upload2"
                               @click="handleExcel">导 出
                    </el-button>
                    <!--v-if="permission.io_add" -->
                    <el-upload
                            action="/api/blade-io/io/importprice"
                            :headers="{'Blade-Auth':token}"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccessHandle"
                            :on-error="handleError"
                            style="display:inline-block;margin:0 10px">
                        <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-download"
                        >导入报价
                        </el-button>
                    </el-upload>
                    <el-button type=""
                               size="mini"
                               icon="el-icon-download"
                               @click="downAllDwg()">批量下载图纸
                    </el-button>
                    <el-button type=""
                               size="mini"
                               icon="el-icon-download"
                               @click="downAllProcess()">批量下载上一道工序图纸
                    </el-button>
                    <el-button type="primary"
                               size="mini"
                               @click="submitQuote">批量报价
                    </el-button>
                    <br>
                    <span style="color:red;font-size:12px">*导入报价 含税单价、承诺交期必填。承诺交期时间格式为：2020-08-08</span>
                </template>
                <template slot-scope="scope" slot="menu">
                    <el-button type="text" size="mini"
                               @click="quotePriShow(scope.row)">查看
                    </el-button>
                    <el-button type="text" size="mini"
                               v-if="scope.row.banQuotedPrice"
                               @click="quotePri(scope.row)">报价
                    </el-button>
                </template>
                <!--      含税单价-->
                <template slot-scope="scope" slot="quotePrice">
                    {{$moneyUtils.formatMoney(scope.row.quotePrice)}}
                </template>
                <!--  物料编号-->
                <template slot-scope="scope" slot="itemCode">
                    <el-button type="text" size="mini"
                               @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
                    </el-button>
                </template>
            </avue-crud>
            <!--物料编码-->
            <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog"
                       :itemform="itemform"></item-code>
            <!--批量报价-->
            <quote-batch :quoteBatch="quoteBatch" @closeQuotedBatch="closeQuotedBatch" :idList="idList"
                         :havePrice="havePrice" @refresh="refreshChange"></quote-batch>
            <!--报价-->
            <el-drawer
                    title="报价"
                    :visible.sync="drawer_quotedprice"
                    size='660px'
                    @close="closeDrawer">
                <div style="width: 100%;height: 90%;overflow: hidden;overflow: scroll">
                    <div id="avue-detail">
                        <avue-detail :option="quotePriOp" v-model="quotePriData"></avue-detail>
                    </div>
                    <avue-form :option="quotePriOption"
                               v-model="formQuote"
                               @reset-change="emptytChange"
                               ref="editform"
                               @submit="handleData"
                               :upload-after="uploadAfter"
                               v-loading.fullscreen.lock="fullscreenLoading">
                    </avue-form>
                </div>

            </el-drawer>
            <!--查看报价-->
            <el-drawer
                    title="查看报价"
                    :visible.sync="view_quotedprice"
                    size='800px'
                    @close="">
                <div style="margin-top:50px">
                    <avue-detail :option="option_detail" v-model="detailData">
                        <template slot-scope="scope" slot="attachmentForm">
                            <el-button type="text" size="mini"
                                       v-if="scope.row.attachment != ''"
                                       @click="viewAttach(scope.row.attachment)">查看报价附件
                            </el-button>
                        </template>
                    </avue-detail>
                </div>
            </el-drawer>
        </div>
    </basic-container>
</template>

<script>

    import {getInquiringPage, getDetail, add, update, remove, subPrice, IO_STATUS} from "@/api/io/io";
    import {getItemdDwg, getItemProcess} from "@/api/item/item"
    import {INQUIRY_WAY} from "@/api/pr/pr"
    import {mapGetters} from "vuex";
    import itemCode from '../item/item-code'
    import quoteBatch from '../io/quote-pricebatch'
    import {objToUrlParam} from "@/util/func";

    export default {
        components: {itemCode, quoteBatch},
        data() {
            return {
                fullscreenLoading: false,//页面整加载
                form: {},
                formQuote: {
                    quotePrice: '',
                    inquiryWay: '',
                    promiseDate: '',
                },
                itemform: {},
                query: {
                    status: IO_STATUS.INIT
                },
                detailData: {},
                quotePriData: {},
                uploadUrl: '',
                idList: [],
                itemCode: [],
                loading: true,
                drawer_quotedprice: false,
                quoteBatch: false,
                view_quotedprice: false,
                dialogTableVisible: false,//物料
                havePrice: false,//有价格报交期
                needPrice: false,//需要报价和交期
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                selectionList: [],
                token: '',
                option: {
                    // height: 350,
                    calcHeight    :350,
                    tip: true,
                    border: true,
                    index: false,
                    addBtn: false,
                    editBtn: false,
                    viewBtn: false,
                    delBtn: false,
                    selection: true, //行可勾选
                    columnBtn: false, //列控制显隐
                    size: 'mini',
                    dialogType: 'drawer',
                    dialogWidth: '800px',
                    labelWidth: '120px',
                    menuWidth: 100,
                    searchMenuSpan: 6,
                    column: [
                        {
                            label: "主键",
                            width: 100,
                            prop: "id",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false,
                            hide: true,
                        },
                        {
                            label: "物料编号",
                            prop: "itemCode",
                            align: 'left',
                            sortable: true,
                            type: "input",
                            width: 110,
                            slot: true,
                        },
                        {
                            label: "物料名称",
                            prop: "itemName",
                            align: 'left',
                            sortable: true,
                            type: "input",
                            width: 200,
                            overHidden: true,

                        },
                        {
                            label: "材质",
                            width: 120,
                            prop: "matQuality",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            overHidden: true,
                            search: true,
                            searchSpan: 6,
                        },
                        {
                            label: "数量",
                            width: 80,
                            prop: "priceNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                        },

                        {
                            label: "交易单位",
                            width: 85,
                            prop: "tcUom",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            dicUrl: "/api/blade-system/dict-biz/dictionary?code=item_uom",
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            },
                        },
                        {
                            label: "计价单位",
                            width: 85,
                            prop: "priceUom",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            dicUrl: "/api/blade-system/dict-biz/dictionary?code=item_uom",
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            },
                            hide: true,
                        },
                        {
                            label: "询价日期",
                            width: 85,
                            prop: "createTime",
                            align: 'center',
                            sortable: true,
                            type: "date",
                            searchRange: true,
                            format: "yyyy-MM-dd ",
                            valueFormat: "yyyy-MM-dd HH:mm:ss",
                            formatter: function (row, value, label, column) {
                                var str = value.substring(0, 11)
                                return value = str
                            },
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false,
                            hide: false,
                            search: true,
                            searchSpan: 6,
                        },
                        {
                            label: "报价截止日期",
                            width: 110,
                            prop: "quoteEndtime",
                            align: 'center',
                            sortable: true,
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            hide: true,
                            valueFormat: "yyyy-MM-dd",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },

                        {
                            label: "需求日期",
                            width: 85,
                            prop: "reqDate",
                            align: 'center',
                            sortable: true,
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            valueFormat: "yyyy-MM-dd",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },

                        {
                            label: "可供货日期",
                            width: 90,
                            prop: "promiseDate",
                            align: 'center',
                            sortable: false,
                            hide: true,
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            valueFormat: "timestamp",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label: "含税单价",
                            width: 85,
                            prop: "quotePrice",
                            align: 'right',
                            sortable: false,
                            type: "input",
                            formatter: function (row, value, label, column) {
                                return value < 0 ? '' : value;
                            },
                            slot: true,
                        },
                        {
                            label: "总价",
                            width: 80,
                            prop: "",
                            align: 'right',
                            sortable: false,
                            type: "text",
                            formatter: function (row, value, label, column) {
                                if (row.quotePrice < 0) {
                                    return '';
                                }
                                let val = row.priceNum * row.quotePrice;
                                return value = val.toFixed(4)
                            },
                        },
                        {
                            label: "最终用户",
                            width: 200,
                            prop: "endUser",
                            align: 'left',
                            sortable: false,
                            type: "input",
                            hide: true,
                        },
                        {
                            label: "报价日期",
                            width: 85,
                            prop: "quoteDate",
                            align: 'center',
                            sortable: false,
                            hide: true,
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            valueFormat: "yyyy-MM-dd",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label: "加工费",
                            width: 80,
                            prop: "laborCost",
                            align: 'right',
                            sortable: false,
                            hide: true,
                            type: "text",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value : 0
                            },
                        },
                        { //
                            label: "材料费",
                            width: 80,
                            prop: "materialCost",
                            align: 'center',
                            sortable: false,
                            hide: true,
                            type: "text",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value : 0
                            },
                        },
                        {
                            label: "状态",
                            searchSpan: 6,
                            prop: "status",
                            align: 'center',
                            sortable: true,
                            type: "select",
                            search: true,
                            searchValue: `${IO_STATUS.INIT}`,
                            dicUrl: '/api/blade-system/dict-biz/dictionary?code=io_status',
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            },
                            formatter: function (row, value, label, column) {
                                return value ? value.toString() : '';
                            },
                        },

                        {
                            label: "拒绝原因",
                            width: 100,
                            prop: "refuseCause",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            hide: true,
                        },
                    ]
                },
                option_detail: {
                    column: [
                        {
                            label: "承诺交期",
                            prop: "promiseDate",
                            span: 8,
                            type: "date",
                            format: "yyyy-MM-dd",
                            valueFormat: "timestamp",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : '';
                            },
                        }, {
                            label: "报价",
                            prop: "quotePrice",
                            type: "input",
                            span: 8,
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value : '';
                            },
                        },
                        {
                            label: "附件",
                            prop: "attachment",
                            type: "upload",
                            span: 8,
                            formslot: true,
                        }, {
                            label: "供应商备注",
                            prop: "supRemark",
                            type: "textarea",
                            span: 24,
                        },
                    ]
                },
                quotePriOption: {
                    labelWidth: 110,
                    column: [
                        {
                            label: "承诺交期",
                            prop: "promiseDate",
                            span: 24,
                            display: true,
                            type: "date",
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() < Date.now() - 8.64e7;
                                }
                            },
                            format: "yyyy-MM-dd",
                            valueFormat: "timestamp",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : '';
                            },
                            rules: [
                                {
                                    required: true,
                                    message: "选择承诺交期",
                                    trigger: "change"
                                }
                            ]
                        }, {
                            label: "报价",
                            prop: "quotePrice",
                            type: "input",
                            span: 24,
                            display: true,
                            disabled: false,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入报价",
                                    trigger: "blur",
                                }
                            ]
                        }, {
                            label: "供应商备注",
                            prop: "supRemark",
                            type: "textarea",
                            span: 24,
                            display: true,
                        },
                        {
                            label: "上传附件",
                            prop: "attachment",
                            type: "upload",
                            propsHttp: {
                                res: 'data',
                                url: 'link',
                            },
                            action: '/api/blade-resource/oss/endpoint/put-file',
                            span: 24,
                            display: true,
                            // showFileList: true,
                            // multiple: true,
                            // limit: 10,
                            canvasOption: {},
                        },
                    ]
                },
                quotePriOp: {
                    column: [
                        {
                            label: "物料编号",
                            span: 8,
                            prop: "itemCode",
                            align: 'center',
                            sortable: true,
                            type: "input",
                            slot: true,
                        },
                        {
                            label: "物料名称",
                            prop: "itemName",
                            align: 'left',
                            sortable: true,
                            type: "input",
                            span: 16,
                        },
                        {
                            label: "要求数量",
                            span: 8,
                            prop: "priceNum",
                            align: 'center',
                            sortable: true,
                            type: "input",
                        },

                        {
                            label: "需求交期",
                            span: 8,
                            prop: "reqDate",
                            align: 'center',
                            sortable: true,
                            type: "datetime",
                            format: "yyyy-MM-dd",
                            valueFormat: "yyyy-MM-dd",
                            formatter: function (row, value, label, column) {
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                    ]
                },
                data: []
            };
        },
        created() {
            this.token = "bearer " + this.$store.getters.token;
            //console.error(this.option.column[12])
            this.option.column[12].hide = this.userInfo.tenant_id.substring(0, 3) !== 'PC-';
        },
        computed: {
            ...mapGetters(["permission", "userInfo"]),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.io_add, false),
                    viewBtn: this.vaildData(this.permission.io_view, false),
                    delBtn: this.vaildData(this.permission.io_delete, false),
                    editBtn: this.vaildData(this.permission.io_edit, false)
                };
            },
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods: {
            handleAdd() {
                this.$refs.crud.rowAdd();
            },
            handleExcel() {
                let req = {
                    "Blade-Auth": this.$store.getters.token,
                    ...this.query
                };
                // console.log(objToUrlParam(req))
                window.open('/api/blade-io/io/inquiringexport?' + objToUrlParam(req));
            },
            handleView(row, index) {
                this.$refs.crud.rowAdd(row, index);
            },
            handleEdit(row, index) {
                this.$refs.crud.rowEdit(row, index);
            },
            handleDel(row, index) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(row.id);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            rowSave(row, loading, done) {
                add(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowUpdate(row, index, loading, done) {
                update(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(row.id);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            handleDelete() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(this.ids);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$refs.crud.toggleSelection();
                    });
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getDetail(this.form.id).then(res => {
                        this.form = res.data.data;
                    });
                }
                done();
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                done();
                if (params.createTime) {
                    if (params.createTime.length > 1) {
                        params.createTimeStart = params.createTime[0]
                        params.createTimeEnd = params.createTime[1].substring(0, 11) + '23:59:59'
                    }
                    delete params.createTime;
                }
                // console.log(params)
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
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
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}) {
                this.loading = true;
                getInquiringPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    data.records.forEach((item) => {
                        if (item.status == IO_STATUS.INIT || item.status == IO_STATUS.QUOTED) {
                            item.banQuotedPrice = true
                        } else {
                            item.banQuotedPrice = false
                        }

                        if(item.itemCode.slice(0,2)!='15'){
                            item.matQuality = '';
                        }
                    })
                    this.data = data.records;
                    this.loading = false;
                    this.selectionClear();
                });
            },
            //查看报价
            quotePriShow(row) {
                this.view_quotedprice = true
                this.detailData = row
            },
            //查看报价附件
            viewAttach(url) {
                window.open(url)
            },
            //报价
            quotePri(row) {
                this.drawer_quotedprice = true
                this.idList = row.id
                this.formQuote.quotePrice = row.quotePrice > 0 ? row.quotePrice : '';
                this.formQuote.promiseDate = row.promiseDate > 0 ? row.promiseDate * 1000 : '';
                this.quotePriData = row;
                if (row.inquiryWay == INQUIRY_WAY.HAVE_PRICE1DATE || row.inquiryWay == INQUIRY_WAY.HAVE_PROTOCOL) {
                    this.quotePriOption.column[1].disabled = true
                } else {
                    this.quotePriOption.column[1].disabled = false
                }
            },
            //批量提交报价
            submitQuote() {
                this.idList = []
                this.havePrice = false//有价格报交期
                this.needPrice = false//需要报价和交期
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                for (var i = 0; i < this.selectionList.length; i++) {
                    if (this.selectionList[i].inquiryWay == INQUIRY_WAY.HAVE_PRICE1DATE || this.selectionList[i].inquiryWay == INQUIRY_WAY.HAVE_PROTOCOL) {//有报价
                        this.havePrice = true
                    } else {
                        this.needPrice = true
                    }
                    this.idList.push(this.selectionList[i].id)
                }
                if (!this.havePrice && this.needPrice) {//需要报价和交期（卡控相同料号）
                    for (let n = 0; n < this.selectionList.length; n++) {
                        if (this.selectionList[0].itemCode != this.selectionList[n].itemCode) {
                            this.$message.warning("请选择相同物料编号")
                            return false;
                        }
                    }
                    this.quoteBatch = true
                } else if (this.havePrice && !this.needPrice) {//有价格报交期 (只填交期)
                    this.quoteBatch = true
                } else if (this.havePrice && this.needPrice) {
                    this.$message.warning("不可批量报价")
                }
            },
            closeQuotedBatch() {
                this.quoteBatch = false
            },
            //提交
            handleData(formQuote, done) {
                this.formQuote.ioId = this.idList
                this.formQuote.attachment = this.uploadUrl
                this.formQuote.quotePrice = parseFloat(this.formQuote.quotePrice);
                let reqData = {...this.formQuote};
                if (!reqData.quotePrice || reqData.quotePrice <= 0) {
                    this.$message({
                        type: "error",
                        message: "请输入正确的价格"
                    });
                    done();
                    return false;
                }
                reqData.promiseDate = parseInt(reqData.promiseDate / 1000);
                // return console.error(reqData);
                var arr = [reqData]
                this.fullscreenLoading = true
                subPrice(arr).then(() => {
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.drawer_quotedprice = false
                    this.loading = true
                    this.onLoad(this.page);
                }).finally(() => {
                    done()
                    this.fullscreenLoading = false
                });
            },
            //关闭抽屉的回调
            closeDrawer() {
                this.uploadUrl = ''
                this.$refs.editform.resetForm()
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                });
            },
            //物料编码组件
            handleItemCode(row) {
                this.dialogTableVisible = true
                this.itemform = {"itemCode": row.itemCode, "itemDesc": row.itemName}
            },
            closedialog() {
                this.dialogTableVisible = false
            },
            //批量下载图纸
            downAllDwg() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.itemCode.toString()
                getItemdDwg({"itemCode": itemCodeList}).then(data => {
                    window.open(data.result.url)
                });
            },
            downAllProcess() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.itemCode.toString()
                getItemProcess({"itemCode": itemCodeList}).then((data) => {
                    window.open(data.result.url)
                })
            },
            //上传文件
            uploadAfter(res, done, loading) {
                this.uploadUrl = res.link
                // console.log("uploadUrl", this.uploadUrl)
                done()
            },
            //excel导入
            beforeUpload(file) {
                this.fullscreenLoading = true
                let Xls = file.name.split('.');
                if (Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx') {
                    return file
                } else {
                    this.$message.error('上传文件只能是 xls/xlsx 格式!')
                    this.fullscreenLoading = false
                    return false
                }
            },
            uploadSuccessHandle(res, file, fileList) {
                if (res.code === 200) {
                    this.$message({
                        message: '导入成功！',
                        type: 'success'
                    });
                    this.refreshChange();
                    this.fullscreenLoading = false
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                    this.fullscreenLoading = false
                }
            },
            handleError() {
                this.fullscreenLoading = false
            },
        },

    };

</script>


<style scoped lang="scss">
    #avue-detail /deep/ .avue-detail__box {
        min-height: 20px;
        line-height: 20px;
    }
</style>
