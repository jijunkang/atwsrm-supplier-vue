<template>
  <basic-container style="width: 100%;height: 97%;overflow: hidden;overflow: scroll">
    <div style="margin:20px 5px">
      <el-button type="primary"
                 size="mini"
                 @click="addData()">添 加
      </el-button>
      <el-button size="mini"
                 @click="delAll()">清 空
      </el-button>
      <el-button size="mini"
                 type="danger"
                 plain
                 @click="delRows()">删 除
      </el-button>
    </div>
    <!--对账表-->
    <div class="avue-crud">
      <avue-crud :option="option"
                 :data="selectedData"
                 v-model="form"
                 ref="apCrud"
                 class="hide-assembly"
                 :row-style="rowStyle"
                 @selection-change="selectionOperation">
        <template slot-scope="{row,index}" slot="recThisQty">
          <el-input v-model="row.recThisQty" placeholder="" size="mini"
                    @change="changeRecThisQty(row,index)"
                    :disabled="row.disabled"
                    clearable></el-input>
        </template>
        <!--订单编号 行号-->
        <template slot-scope="scope" slot="poItems">
          <span> {{scope.row.poCode}}</span>
          <span v-if="scope.row.type !='KK'"> {{scope.row.poLn}}</span>
        </template>
        <!--收货单号 行号-->
        <template slot-scope="scope" slot="rcvItems">
          <span> {{scope.row.rcvCode}}</span>
          <span v-if="scope.row.type !='KK'"> {{scope.row.rcvLn}}</span>
        </template>
      </avue-crud>
    </div>
    <!--金额合计-->
    <div style="position: relative;top: 100px;">
      <sum-column :sumColumn="sumColumn"></sum-column>
    </div>
    <div style="font-size: 14px;margin: 10px 0px">上传发票：<span style="color: #999999">支持文件格式：.png .jpg .pdf  单个文件不能超过2M</span>
    </div>
    <avue-crud ref="invoice_crud" :option="invoiceOption" :data="invoiceData" class="hide-pagination">
      <template slot="menuLeft">
        <el-button size="mini" type="primary" @click="addRowBtn">添加一行</el-button>
      </template>
      <template slot-scope="{row,index}" slot="attachment">
        <el-button v-if="row.attachment" type="text" size="mini"
                   @click="downAttachment(row.attachment)">查看
        </el-button>
        <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/blade-resource/oss/endpoint/put-file"
            :headers="{'Blade-Auth':token}"
            :before-upload="beforeUpload"
            :on-success="(response, file, fileList) => uploadSuccessHandle(response, file, fileList, row.$index)"
            :on-error="handleError"
            :file-list="fileList"
            :show-file-list="false"
            style="display: inline;margin-left:5px">
          <el-button type="primary" size="mini">{{row.attachment?"重新上传":"上传"}}</el-button>
        </el-upload>
      </template>
      <template slot-scope="{row,index}" slot="menu">
        <el-button @click="delBtn(index)" size="mini" type="text">删除</el-button>
      </template>
    </avue-crud>
    <div style="text-align: left;margin: 20px 5px">
      <el-button size="mini" type="primary" @click="submit"
                 v-loading.fullscreen.lock="fullscreenLoading">
        提 交
      </el-button>
    </div>

    <!--新增弹窗-->
    <el-dialog title="选择对账" :visible.sync="dialogTableVisible" append-to-body=false :close-on-click-modal=false @close="closeDialog"
               width="90%"
               @open="openDialog">
      <div id="table">
        <avue-crud :option="waitOption"
                   :table-loading="loading"
                   :data="waitData"
                   :page="page"
                   ref="crud"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   :row-style="rowStyle">
          <template slot="menuLeft">
            <el-button type="primary"
                       size="mini"
                       v-if=""
                       @click="getSelList">添加并返回
            </el-button>
            <el-button type="primary"
                       size="mini"
                       v-if=""
                       @click="getSelContinue">继续添加
            </el-button>
          </template>
          <!--订单编号 行号-->
          <template slot-scope="scope" slot="poCode">
            <span> {{scope.row.poCode}}</span>
            <span v-if="scope.row.type !='KK'"> {{scope.row.poLn}}</span>
          </template>
          <!--收货单号 行号-->
          <template slot-scope="scope" slot="rcvCode">
            <span> {{scope.row.rcvCode}}</span>
            <span v-if="scope.row.type !='KK'"> {{scope.row.rcvLn}}</span>
          </template>
          <!--到货日期-->
          <template slot-scope="scope" slot="rcvDate">
            <span> {{$dateUtils.Time(scope.row.rcvDate)}}</span>
          </template>
        </avue-crud>
      </div>
      <!--金额合计-->
      <sum-column :sumColumn="dialogSumColumn"></sum-column>
    </el-dialog>
  </basic-container>
</template>
<script>
    import sumColumn                    from "../finance/sumColumnList"
    import {getPageList}                from "@/api/ap/aprcv";
    import {formatMoney, negativeMoney} from '@/util/money';
    import {dzSubmit}                   from "@/api/ap/ap";
    import {apmoney}                    from '@/util/apMoney';
    import {totalAmount}                from "@/util/sumColumnList";
    import {mapGetters}                 from "vuex";

    export default {
        components:{sumColumn},
        name      :"apapplaybatch",
        data(){
            return {
                supCode           :'',//供应商编码
                //对账表
                token             :'',
                fullscreenLoading :false,
                fileListUrl       :'',
                supName           :'',
                selectedData      :[],//所选的对账数据
                option            :{
                    maxHeight  :300,
                    tip        :true,
                    border     :true,
                    index      :false,
                    addBtn     :false,
                    editBtn    :false,
                    viewBtn    :false,
                    delBtn     :false,
                    selection  :true, //行可勾选
                    size       :'mini',
                    dialogType :'drawer',
                    dialogWidth:'800px',
                    labelWidth :'200px',
                    menuWidth  :120,
                    menu       :false,
                    refreshBtn :false,
                    columnBtn  :false,
                    simplePage :1,
                    column     :[
                        {
                          label: "组织代码",
                          width: 100,
                          prop: "orgCode",
                          align: 'center',
                          overHidden: true,
                          hidden: true,
                          searchLabelWidth: 90,
                          searchSpan: 6,
                          type: "select",
                          dicUrl: '/api/blade-system/dict-biz/dictionary?code=org_code',
                          props: {
                            label: "dictValue",
                            value: "dictKey"
                          },
                        },
                        {
                            label     :"订单编号 行号",
                            width     :150,
                            prop      :"poItems",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            slot      :true
                        },
                        {
                            label     :"收货单号 行号",
                            width     :120,
                            prop      :"rcvItems",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            slot      :true
                        },
                        {
                            label     :"物料编号",
                            minWidth  :110,
                            prop      :"itemCode",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                        },
                        {
                            label     :"物料描述",
                            minWidth  :180,
                            prop      :"itemName",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                        },
                        {
                            label      :"到货日期",
                            width      :120,
                            prop       :"rcvDate",
                            align      :'center',
                            sortable   :true,
                            type       :"date",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            }
                        },
                        {
                            label   :"计价单位",
                            width   :80,
                            prop    :"uom",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"实收数量",
                            width   :80,
                            prop    :"rcvActualQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"累计对账数量",
                            width   :115,
                            prop    :"accumRecQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"本次对账数量",
                            width   :115,
                            prop    :"recThisQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            sumprice:true,
                        },
                        {
                            label    :"含税单价",
                            width    :80,
                            prop     :"taxPrice",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
                        },
                        {
                            label    :"税组合",
                            width    :80,
                            prop     :"taxRate",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return value >= 0 ? value * 100 + '%' : '';
                            }
                        },
                        {
                            label    :"价税合计",
                            width    :80,
                            prop     :"taxSubTotal",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            },
                            sumprice :true,
                        },
                        {
                            label    :"未税金额",
                            width    :80,
                            prop     :"noTaxAmount",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
                        },
                        {
                            label    :"税额",
                            width    :80,
                            prop     :"taxAmount",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
                        },
                    ]
                },
                invoiceOption     :{
                    maxHeight :200,
                    border    :true,
                    addBtn    :false,
                    editBtn   :false,
                    cellBtn   :false,
                    cancelBtn :false,
                    addRowBtn :false,
                    delBtn    :false,
                    size      :'mini',
                    menuWidth :120,
                    refreshBtn:false,
                    columnBtn :false,
                    simplePage:1,
                    column    :[
                        {
                            label:'发票编号',
                            prop :'invoiceCode',
                            cell :true,
                            align:'left',
                        }, {
                            label      :'开票时间',
                            prop       :'invoiceDate',
                            type       :'date',
                            cell       :true,
                            align      :'center',
                            format     :"yyyy-MM-dd",
                            valueFormat:"timestamp",
                        }, {
                            label:'发票影像',
                            prop :'attachment',
                            slot :true,
                            cell :true,
                            align:'center',
                        }
                    ]
                },
                invoiceData       :[
                    {
                        id         :0,
                        invoiceCode:'',
                        invoiceDate:'',
                        attachment :'',
                        $cellEdit  :true
                    }
                ],
                sumColumn         :[],//金额合计
                selectionApList   :[],//勾选对账数据
                //对账弹框
                dialogTableVisible:false,
                query             :{},
                form              :{},
                loading           :false,
                page              :{
                    pageSizes  :[100, 200, 500, 1000, 2000],
                    pageSize   :100,
                    currentPage:1,
                    total      :0
                },
                waitOption        :{
                    height        :350,
                    calcHeight    :350,
                    tip           :true,
                    border        :true,
                    index         :false,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    selection     :true, //行可勾选
                    size          :'mini',
                    dialogType    :'drawer',
                    dialogWidth   :'800px',
                    labelWidth    :'200px',
                    menuWidth     :120,
                    menu          :false,
                    searchMenuSpan:6,
                    column        :[
                        {
                            label           :"供应商名称",
                            prop            :"supName",
                            align           :'left',
                            sortable        :true,
                            type            :"input",
                            minWidth        :140,
                            overHidden      :true,
                            search          :false,
                            searchLabelWidth:90,
                            searchSpan      :6,
                        },
                        {
                            label           :"订单编号",
                            width           :150,
                            prop            :"poCode",
                            align           :'center',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            slot            :true,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :6,
                        },
                        {
                            label           :"收货单号",
                            width           :120,
                            prop            :"rcvCode",
                            align           :'center',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            slot            :true,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :6,
                        },
                        {
                            label           :"物料编号",
                            minWidth        :110,
                            prop            :"itemCode",
                            align           :'left',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            slot            :false,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :6,
                        },
                        {
                            label           :"物料描述",
                            minWidth        :180,
                            prop            :"itemName",
                            align           :'left',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :6,
                        },
                        {
                            label   :"实收数量",
                            width   :80,
                            prop    :"rcvActualQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"累计对账数量",
                            width   :115,
                            prop    :"accumRecQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"本次对账数量",
                            width   :115,
                            prop    :"currRecQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                            sumprice:true,
                            // hide    :true,
                        },
                        {
                            label   :"计价单位",
                            width   :80,
                            prop    :"uom",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label    :"含税单价",
                            width    :80,
                            prop     :"taxPrice",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return formatMoney(value)
                            }
                        },
                        {
                            label    :"价税合计",
                            minWidth :100,
                            prop     :"taxSubTotal",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            },
                        },
                        {
                            label    :"本次对账金额",
                            width    :110,
                            prop     :"currTaxSubTotal",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            sumprice :true,
                            // hide     :true,
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            },
                        },
                        {
                            label    :"税组合",
                            width    :80,
                            prop     :"taxRate",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return value >= 0 ? value * 100 + '%' : '';
                            }
                        },
                        {
                            label           :"到货日期",
                            width           :120,
                            prop            :"rcvDate",
                            align           :'center',
                            sortable        :true,
                            type            :"date",
                            format          :"yyyy-MM-dd",
                            valueFormat     :"timestamp",
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :6,
                            searchRange     :true,
                            slot            :true,
                        }
                    ]
                },
                waitData          :[],
                selectionList     :[],
                dialogSumColumn   :[],
            }
        },
        computed  :{
            ...mapGetters(["userInfo"]),
        },
        methods   :{
            open(){
                this.token = "bearer " + this.$store.getters.token;
                this.selectedData.forEach(item => {
                    if(item.type == 'KK'){
                        item.disabled = true
                    }else{
                        item.disabled = false
                    }
                })
                let SelectDataList     = []
                let selectionListClone = JSON.parse(JSON.stringify(this.selectedData))
                selectionListClone.forEach(item => {
                    item = apmoney(item)
                    SelectDataList.push(item)
                })
                this.selectedData = JSON.parse(JSON.stringify(SelectDataList))
                this.getSumColumn()
            },
            getSumColumn(){
                this.sumColumn = totalAmount(this.option.column, this.selectedData)
            },
            //添加一行
            addRowBtn(){
                this.$refs.invoice_crud.rowCellAdd({invoiceCode:'', invoiceDate:'', attachment:''})
            },
            //删除行
            delBtn(index){
                this.invoiceData.splice(index, 1)
            },
            //下载附件
            downAttachment(attachment){
                window.open(attachment);
            },
            //上传
            beforeUpload(file){
                this.fullscreenLoading = true
            },
            uploadSuccessHandle(res, file, fileList, index){
                if(res.code === 200){
                    this.$message({
                        message:'上传成功！',
                        type   :'success'
                    });
                    this.fileListUrl                   = res.data.link
                    this.invoiceData[index].attachment = this.fileListUrl
                    this.fullscreenLoading             = false

                }else{
                    this.$message({
                        message:res.msg,
                        type   :'error'
                    });
                    this.fullscreenLoading = false
                }
            },
            handleError(){
                this.fullscreenLoading = false
            },
            //提交
            submit(){

                let firstorgCode=this.selectedData[0].orgCode;

                let add = 0
                let VMITypeCount    = 0;
                let othersTypeCount = 0;
                for(var i = 0; i < this.selectedData.length; i++){

                    if(firstorgCode != this.selectedData[i].orgCode){
                      return this.$message.warning("请选择相同组织代码");
                    }

                    if(this.selectionList[i].poCode.indexOf("VMI") > -1) {
                      VMITypeCount++;
                    } else {
                      othersTypeCount++;
                    }
                    let qyt = Math.abs(this.selectedData[i].rcvActualQty) - Math.abs(this.selectedData[i].accumRecQty)
                    if(this.selectedData[i].recThisQty === '' || Math.abs(this.selectedData[i].recThisQty) > qyt){
                        return this.$message.warning('请正确填写本次对账数量')
                    }
                    add += Number(this.selectedData[i].taxSubTotal)
                }
                if( VMITypeCount * othersTypeCount > 0){
                  return this.$message.error("VMI订单 不可以与 普通订单 同时结算.请分开结算!");
                }

                if(add < 0){
                    return this.$message.warning("价税合计相加不能小于0");
                }
                let data = JSON.parse(JSON.stringify(this.invoiceData))
                if(data.length <= 0 || !data){
                    return this.$message.warning("请填写发票信息");
                }
                for(var i = 0; i < data.length; i++){//!data[i].attachment
                    if(!data[i].invoiceCode){
                        return this.$message.warning('请填写发票编号')
                    }
                    if(!data[i].invoiceDate){
                        return this.$message.warning('请填写开票时间')
                    }
                    data[i].invoiceDate = data[i].invoiceDate / 1000
                }
                let apRcvVos           = this.selectedData
                let req                = {
                    supCode        :this.selectedData[0].supCode,
                    supName        :this.selectedData[0].supName,
                    apRcvVos       :apRcvVos,
                    invoiceEntities:data
                }
                this.fullscreenLoading = true
                dzSubmit(req).then(() => {
                    this.$message.success("提交成功")
                    this.delAll()
                }).finally(() => {
                    this.fullscreenLoading = false
                });
            },
            //修改本次对账数量进行运算
            changeRecThisQty(row, index){
                let qyt = Math.abs(row.rcvActualQty) - Math.abs(row.accumRecQty)
                if(Math.abs(row.recThisQty) > qyt){
                    return this.$message.warning('本次对账数量不可大于（实收数量-累计对账数量）')
                }
                row = apmoney(row)
                this.getSumColumn()
            },
            //对账弹框
            //新增
            addData(){
                if(this.supCode == ''){
                    return this.$message.warning('请选择供应商')
                }
                this.dialogTableVisible = true
            },
            //清空
            delAll(){
                this.selectedData = []
                this.invoiceData  = [
                    {
                        id         :0,
                        invoiceCode:'',
                        invoiceDate:'',
                        attachment :'',
                        $cellEdit  :true
                    }
                ]
                this.getSumColumn()
            },
            //勾选删除
            delRows(){
                if(this.selectionApList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm('是否删除勾选数据？', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.selectionApList.forEach(item => {
                        let index = this.selectedData.findIndex((value, index, arr) => value.id == item.id)
                        this.selectedData.splice(index, 1)
                    })
                    this.getSumColumn()
                    this.selectionOperationClear()
                })
            },
            //选择操作
            selectionOperation(list){
                this.selectionApList = list
            },
            selectionOperationClear(){
                this.selectionApList = [];
                this.$refs.apCrud.toggleSelection();
            },
            openDialog(){
                this.onLoad(this.page);
            },
            getContorl(e){
                for(var m = 0; m < this.selectedData.length; m++){
                    for(var j = 0; j < this.selectionList.length; j++){
                        if(this.selectionList[j].id == this.selectedData[m].id){
                            this.selectionList.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                for(var n = 0; n < this.selectionList.length; n++){
                    this.selectedData.push(this.selectionList[n])
                }
                this.open()
                this.dialogTableVisible = e;
            },
            //添加并返回
            getSelList(){
                this.getContorl(false)
            },
            //继续添加
            getSelContinue(){
                this.getContorl(true)
                this.selectionClear()
            },
            getDialogSumColumn(){
                this.dialogSumColumn = totalAmount(this.waitOption.column, this.selectionList)
            },
            selectionChange(list){
                this.selectionList = list;
                this.getDialogSumColumn()
            },
            selectionClear(){
                this.selectionList = [];
                this.getDialogSumColumn()
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
                this.refreshChange()
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
                this.refreshChange()
            },
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                if(!params.rcvDate){
                    params.rcvDateStart = ''
                    params.rcvDateEnd   = ''
                }
                if(params.rcvDate){
                    if(params.rcvDate.length > 1){
                        params.rcvDateStart = parseInt(params.rcvDate[0] / 1000)
                        params.rcvDateEnd   = parseInt(params.rcvDate[1] / 1000 + (24 * 60 * 60) - 1)
                    }
                }
                this.query = Object.assign({}, params);
                delete this.query.rcvDate
                this.page.currentPage = 1;
                this.onLoad(this.page, this.query);
                done();
            },
            refreshChange(){
                this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}){
                this.loading = true;
                let req      = {
                    supCode:this.supCode,
                    ...this.query
                };
                getPageList(page.currentPage, page.pageSize, req).then(res => {
                    const data = res.data.data;
                    data.records.forEach(item => {
                        let currRecQty       = item.rcvActualQty - item.accumRecQty
                        item.currRecQty      = currRecQty
                        item.currTaxSubTotal = currRecQty * item.taxPrice
                    })
                    this.page.total = data.total;
                    this.waitData   = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            //扣款数据标红
            rowStyle({row, column, rowIndex}){
                if(row.taxSubTotal < 0){
                    return {color:'red'};
                }
            },
        },
        created(){
            this.$route.meta.$keepAlive = false
            this.supCode                = this.userInfo.tenant_id
            this.open()
        }
    }
</script>

<style scoped lang="scss">
  #table /deep/ .avue-crud__pagination{
    margin-top: 50px;
  }
</style>
