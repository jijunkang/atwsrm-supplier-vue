<template>
  <basic-container>
    <el-dialog title="供应商对账单" :visible.sync="detailVisible" :append-to-body="true" width="75%"
               @close="closeDetail()" @open="open">
      <div id="rejectDetail" v-if="pageStatus == AP_STATUS.REFUSE">
        <span>退回时间：{{$dateUtils.Time(itemInfo.backDate)}}</span>
        <span>退回原因：{{itemInfo.remark}}</span>
      </div>
      <table border="1px" id="detail">
        <tr>
          <td>对账单号：</td>
          <td>{{itemInfo.apCode}}</td>
          <td>对账单金额(含税）：</td>
          <td>{{$moneyUtils.negativeMoney(itemInfo.taxAmount)}}</td>
          <td>供应商编码：</td>
          <td>{{itemInfo.supCode}}</td>
        </tr>
        <tr>
          <td>生成日期：</td>
          <td>{{itemInfo.createTime}}</td>
          <td>供应商名称：</td>
          <td>{{itemInfo.supName}}</td>
          <td>对账类型：</td>
          <td>{{itemInfo.type}}</td>
        </tr>
        <tr>
          <td>状态：</td>
          <td>{{AP_STATUS_PAIR[itemInfo.status]}}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
      <div class="avue-crud-title">收货明细</div>
      <avue-crud :option="option"
                 :table-loading="loading"
                 :data="reconciliationData"
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
                 class="hide-pagination">
        <template slot="menuLeft">
<!--          <el-button type="primary" size="mini"-->
<!--                     @click="addData"-->
<!--                     v-if="pageStatus!=AP_STATUS.PASS">新 增-->
<!--          </el-button>-->
          <el-button type="primary" size="mini"
                     @click="handleExcel">导 出
          </el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="mini"
                     @click="remove(scope.row)"
                     v-if="pageStatus != AP_STATUS.PASS">移除
          </el-button>
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
      <!--金额合计-->
      <div style="margin-top:30px">
        <sum-column :sumColumn="sumColumn"></sum-column>
      </div>
      <div class="avue-crud-title">发票</div>
      <div id="invoice-crud">
        <avue-crud ref="invoice_crud" :option="invoiceOption" :data="invoiceData">
          <template slot="menuLeft">
            <el-button size="mini" type="primary" @click="addRowBtn"
                       v-if="pageStatus!=AP_STATUS.PASS">添加一行
            </el-button>
          </template>
          <template slot-scope="scope" slot="attachment">
            <el-button v-if="scope.row.attachment" type="text" size="mini"
                       @click="downAttachment(scope.row.attachment)">查看
            </el-button>
            <el-upload
                class="upload-demo"
                ref="upload"
                action="/api/blade-resource/oss/endpoint/put-file"
                :headers="{'Blade-Auth':token}"
                :before-upload="beforeUpload"
                :on-success="(response, file, fileList) => uploadSuccessHandle(response, file, fileList, scope.row.$index)"
                :on-error="handleError"
                :file-list="fileList"
                :show-file-list="false"
                style="display: inline;margin-left:5px"
                v-if="pageStatus!=AP_STATUS.PASS">
              <el-button type="primary" size="mini">{{scope.row.attachment?"重新上传":"上传"}}</el-button>
            </el-upload>
          </template>
          <template slot-scope="{row,index}" slot="menu">
            <el-button type="text" size="mini"
                       @click="delBtn(index)"
                       v-if="pageStatus!=AP_STATUS.PASS">删除
            </el-button>
          </template>
        </avue-crud>
      </div>
      <el-row style="text-align: left;margin-top: 15px">
        <el-button size="small" type="primary" @click="submitGhange"
                   v-loading.fullscreen.lock="fullscreenLoading"
                   v-if="pageStatus==AP_STATUS.WAITCHECK">
          保 存
        </el-button>
        <el-button size="small" type="primary" @click="submitGhange"
                   v-loading.fullscreen.lock="fullscreenLoading"
                   v-if="pageStatus==AP_STATUS.REFUSE">
          重新提交
        </el-button>
      </el-row>
      <!--新增收货明细-->
      <el-dialog title="添加对账单行" :visible.sync="addrowDialog" width="75%"
                 :append-to-body="true" @open="openAddRow">
        <avue-crud :option="optionAddRow"
                   :table-loading="loading_addrow"
                   :data="addrowData"
                   :page="page_addrow"
                   v-model="form_addrow"
                   ref="form_addrow"
                   @selection-change="selectionChange_addrow"
                   @current-change="currentChange_addrow"
                   @size-change="sizeChange_addrow"
                   @refresh-change="refreshChange_addrow"
                   @on-load="onLoadAddRow">
          <template slot="menuLeft">
            <span>供应商名称：{{itemInfo.supName}}</span>
          </template>
          <template slot-scope="{row,index}" slot="recThisQty">
            <el-input v-model="row.recThisQty" placeholder="" size="mini"
                      :disabled="row.disabled"
                      @change="changeRecThisQty(row,index)" clearable></el-input>
          </template>
          <!--订单编号 行号-->
          <template slot-scope="scope" slot="poItems">
            <span> {{scope.row.poCode}}</span>
            <span> {{scope.row.poLn}}</span>
          </template>
          <!--收货单号 行号-->
          <template slot-scope="scope" slot="rcvItems">
            <span> {{scope.row.rcvCode}}</span>
            <span> {{scope.row.rcvLn}}</span>
          </template>
        </avue-crud>
        <el-row style="text-align: right;margin-top: 15px">
          <el-button size="small" @click="closeAddrowDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="submitData"
                     v-loading.fullscreen.lock="fullscreenLoading">
            提 交
          </el-button>
        </el-row>
      </el-dialog>
    </el-dialog>
  </basic-container>
</template>

<script>
    import {negativeMoney}                                                       from '@/util/money';
    import {apDetail, apDetailVmi, AP_STATUS, AP_STATUS_PAIR, dtSubmit, subInvoice, dtRemove} from "@/api/ap/ap";
    import {getPageList}                                                         from "@/api/ap/aprcv";
    import {objToUrlParam}                                                       from "@/util/func";
    import {apmoney}                                                             from '@/util/apMoney';
    import {totalAmount}                                                         from "@/util/sumColumnList";
    import sumColumn                                                             from "../finance/sumColumnList"

    export default {
        components:{sumColumn},
        props     :['detailVisible', 'selectedData', 'status'],
        data(){
            return {
                AP_STATUS           :AP_STATUS,
                AP_STATUS_PAIR      :AP_STATUS_PAIR,
                token               :'',
                form                :{},
                itemInfo            :{},
                fullscreenLoading   :false,
                returnSupDialog     :false,
                addrowDialog        :false,
                fileListUrl         :'',
                returnReason        :'',
                pageStatus          :'',
                option              :{
                    maxHeight  :300,
                    tip        :true,
                    border     :true,
                    index      :false,
                    addBtn     :false,
                    editBtn    :false,
                    viewBtn    :false,
                    delBtn     :false,
                    selection  :false, //行可勾选
                    size       :'mini',
                    dialogType :'drawer',
                    dialogWidth:'800px',
                    labelWidth :'200px',
                    menuWidth  :80,
                    menu       :true,
                    refreshBtn :false,
                    columnBtn  :false,
                    simplePage :1,
                    column     :[
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
                            label   :"实收数量",
                            width   :80,
                            prop    :"rcvActualQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"本次对账数量",
                            width   :80,
                            prop    :"recThisQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                            sumprice:true,
                        },
                        {
                            label   :"累计对账数量",
                            width   :80,
                            prop    :"accumRecQty",
                            align   :'center',
                            sortable:true,
                            type    :"input",
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
                            label    :"未税单价",
                            width    :80,
                            prop     :"price",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
                        },
                        {
                            label    :"税组合(税率)",
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
                            label    :"税额",
                            width    :80,
                            prop     :"tax",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
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
                            label    :"价税合计金额",
                            width    :110,
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
                        }
                    ]
                },
                reconciliationData  :[],
                invoiceOption       :{
                    maxHeight :250,
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
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            }
                        }, {
                            label:'发票影像',
                            prop :'attachment',
                            slot :true,
                            cell :true,
                            align:'center',
                        }
                    ]
                },
                invoiceData         :[],
                optionAddRow        :{
                    maxHeight  :350,
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
                    column     :[
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
                            }
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
                page_addrow         :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                addrowData          :[],
                loading_addrow      :false,
                selectionList_addrow:[],
                sumColumn           :[],//金额合计
            }
        },
        methods   :{
            handleExcel(){
                let req = {
                    "Blade-Auth":this.$store.getters.token,
                    'id'        :this.itemInfo.id
                };
                window.open('/api/blade-ap/ap/export?' + objToUrlParam(req));
            },
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                done();
                this.query            = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            refreshChange(){
                this.onLoad(this.page, this.query);
            },
            open(){
                this.itemInfo   = this.selectedData
                this.pageStatus = this.status
                this.apDetail()
            },
            apDetail(){
              if(this.selectedData.vmiType == 1) {
                apDetailVmi({id:this.selectedData.id}).then((res) => {
                  const data = res.data.data
                  data.apInvoiceEntities.forEach(item => {
                    if(this.pageStatus != AP_STATUS.PASS){
                      item.$cellEdit   = true
                      item.invoiceDate = item.invoiceDate > 0 ? item.invoiceDate * 1000 : ''
                    }else{
                      item.$cellEdit = false
                    }
                  })
                  this.itemInfo           = data.apEntity
                  this.reconciliationData = data.apRcvVos
                  this.invoiceData        = data.apInvoiceEntities
                  this.getSumColumn()
                })
              } else {
                apDetail({id:this.selectedData.id}).then((res) => {
                  const data = res.data.data
                  data.apInvoiceEntities.forEach(item => {
                    if(this.pageStatus != AP_STATUS.PASS){
                      item.$cellEdit   = true
                      item.invoiceDate = item.invoiceDate > 0 ? item.invoiceDate * 1000 : ''
                    }else{
                      item.$cellEdit = false
                    }
                  })
                  this.itemInfo           = data.apEntity
                  this.reconciliationData = data.apRcvVos
                  this.invoiceData        = data.apInvoiceEntities
                  this.getSumColumn()
                })
              }
            },
            getSumColumn(){
                this.sumColumn = totalAmount(this.option.column, this.reconciliationData)
            },
            closeDetail(){
                this.$emit('closeDetail')
            },
            refreshReconciled(){
                this.$emit('refreshReconciled')
            },
            //修改本次对账数量进行运算
            changeRecThisQty(row, index){
                let qyt = Math.abs(row.rcvActualQty) - Math.abs(row.accumRecQty)
                if(Math.abs(row.recThisQty) > qyt){
                    return this.$message.warning('本次对账数量不可大于（实收数量-累计对账数量）')
                }
                row = apmoney(row)
            },
            //添加一行
            addRowBtn(){
                this.$refs.invoice_crud.rowCellAdd({invoiceCode:'', invoiceDate:'', attachment:''})
            },
            //删除行
            delBtn(index){
                this.invoiceData.splice(index, 1)
            },
          /*下载 附件*/
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
            //退回供应商
            returnSup(){
                this.returnSupDialog = true
            },
            //添加对账单行表
            addData(){
                this.addrowDialog = true
            },
            //移除
            remove(row){
                this.$confirm('是否确认移除本行?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.fullscreenLoading = true
                    dtRemove({"apItemId":row.apItemId, "apId":this.itemInfo.id}).then(() => {
                        this.apDetail()
                        this.refreshReconciled()
                    }).finally(() => {
                        this.fullscreenLoading = false
                    });
                }).catch(() => {

                });
            },
            closeAddrowDialog(){
                this.addrowDialog = false
            },
            //提交新增行
            submitData(){
                if(this.selectionList_addrow.length === 0){
                    this.$message.warning("请至少选择一条数据");
                    return;
                }
                let add = 0
                for(var i = 0; i < this.selectionList_addrow.length; i++){
                    let qyt = Math.abs(this.selectionList_addrow[i].rcvActualQty) - Math.abs(this.selectionList_addrow[i].accumRecQty)
                    if(this.selectionList_addrow[i].recThisQty === '' || Math.abs(this.selectionList_addrow[i].recThisQty) > qyt){
                        return this.$message.warning('请正确填写本次对账数量')
                    }
                    add += Number(this.selectionList_addrow[i].taxSubTotal)
                }
                if(this.reconciliationData.length > 0){
                    this.reconciliationData.forEach(item => {
                        add += Number(item.taxSubTotal)
                    })
                }
                if(add < 0){
                    return this.$message.warning("价税合计相加不能小于0");
                }
                let apRcvVos           = this.selectionList_addrow
                let req                = {
                    id      :this.itemInfo.id,
                    apRcvVos:apRcvVos
                }
                this.fullscreenLoading = true
                dtSubmit(req).then(() => {
                    this.$message.success("提交成功")
                    this.closeAddrowDialog()
                    this.apDetail()
                    this.refreshReconciled()
                }).finally(() => {
                    this.fullscreenLoading = false
                });
            },
            //提交修改
            submitGhange(){
                let data = JSON.parse(JSON.stringify(this.invoiceData))
                if(data.length <= 0 || !data){
                    return this.$message.warning("请填写发票信息");
                }
                for(var i = 0; i < data.length; i++){
                    if(!data[i].invoiceCode){
                        return this.$message.warning('请填写发票编号')
                    }
                    if(!data[i].invoiceDate){
                        return this.$message.warning('请填写开票时间')
                    }
                    data[i].invoiceDate = new Date(data[i].invoiceDate) / 1000
                }
                let invoiceData        = data.map(item => {
                    return {
                        "invoiceCode":item.invoiceCode,
                        "invoiceDate":item.invoiceDate,
                        "attachment" :item.attachment,
                    }
                });
                let req                = {
                    id             :this.itemInfo.id,
                    invoiceEntities:invoiceData
                }
                this.fullscreenLoading = true
                subInvoice(req).then(() => {
                    this.$message.success("提交成功")
                    this.closeDetail()
                    this.refreshReconciled()
                }).finally(() => {
                    this.fullscreenLoading = false
                });
            },
            //新增收货明细
            selectionChange_addrow(list){
                this.selectionList_addrow = list;
            },
            selectionClear_addrow(){
                this.selectionList_addrow = [];
                this.$refs.form_addrow.toggleSelection();
            },
            currentChange_addrow(currentPage){
                this.page_addrow.currentPage = currentPage;
            },
            sizeChange_addrow(pageSize){
                this.page_addrow.pageSize = pageSize;
            },
            refreshChange_addrow(){
                this.onLoadAddRow(this.page_addrow, this.query);
            },
            onLoadAddRow(page, params = {}){
                this.loading_addrow = true;
                let req             = {
                    ...this.query
                };
                getPageList(page.currentPage, page.pageSize, req).then(res => {
                    const data             = res.data.data;
                    this.page_addrow.total = data.total;
                    data.records.forEach(item => {
                        item = apmoney(item)
                        if(item.type == 'KK'){
                            item.disabled = true
                        }else{
                            item.disabled = false
                        }
                    })
                    this.addrowData     = data.records;
                    this.loading_addrow = false;
                    this.selectionClear_addrow();
                });
            },
            openAddRow(){
                this.page_addrow.currentPage = 1;
                this.refreshChange_addrow()
            }
        },
        created(){
            this.token = "bearer " + this.$store.getters.token;
        },
    }
</script>

<style scoped lang="scss">
  .avue-crud-title{
    padding-left: 10px;
    color: #666666;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    margin: 15px 0px;
  }

  #invoice-crud /deep/ .avue-crud__menu{
    min-height: 0px;
  }

  #rejectDetail{
    margin: 0px 0px 10px 5px;

    span{
      margin-right: 15px;
    }
  }

  #detail{
    border-collapse: collapse;
    margin-left: 5px;
    width: 99%;
    border: 1px solid rgb(231, 234, 236);

    tr{
      height: 32px;
      line-height: 32px;

      td{
        padding-left: 10px;
      }
    }
  }

  #detail tr > td:nth-child(odd){
    width: 140px;
    background-color: rgb(250, 250, 250);
    font-size: 14px;
    font-weight: 700;
    color: #666666;
  }

  #sumColumnList{
    top: -15px
  }
</style>
