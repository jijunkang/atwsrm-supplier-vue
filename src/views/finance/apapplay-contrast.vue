<template>
  <basic-container>
    <el-dialog title="对账" :visible.sync="Visible" :append-to-body="true" width="75%"
               @close="closeReconciliation()" @open="open">
      <div class="avue-crud">
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="selectedData"
                   :page="page"
                   v-model="form"
                   ref="crud"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   class="hide-pagination">
          <template slot="menuLeft">
            <span>供应商名称：{{supName}}</span>
          </template>
          <template slot-scope="scope" slot="recThisQty">
            <el-input v-model="scope.row.recThisQty" placeholder="" size="mini"
                      @change="changeRecThisQty(scope.row)"
                      :disabled="scope.row.disabled"
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
      <div style="margin-top:30px">
        <sum-column :sumColumn="sumColumn"></sum-column>
      </div>
      <div style="font-size: 14px;margin: 10px 0px">上传发票：<span style="color: #999999">支持文件格式：.png .jpg .pdf  单个文件不能超过2M</span>
      </div>
      <avue-crud ref="invoice_crud" :option="invoiceOption" :data="invoiceData">
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
      <el-row style="text-align: left;margin-top: 15px">
        <el-button size="small" @click="closeReconciliation">取 消</el-button>
        <el-button size="small" type="primary" @click="submit"
                   v-loading.fullscreen.lock="fullscreenLoading">
          提 交
        </el-button>
      </el-row>
    </el-dialog>
  </basic-container>
</template>

<script>
    import {negativeMoney} from '@/util/money';
    import {dzSubmit,dzSubmitVmi}      from "@/api/ap/ap";
    import {apmoney}       from '@/util/apMoney';
    import {totalAmount}   from "@/util/sumColumnList";
    import sumColumn       from "../finance/sumColumnList"

    export default {
        components:{sumColumn},
        props     :['Visible', 'selectedData'],
        data(){
            return {
                token            :'',
                form             :{},
                fullscreenLoading:false,
                fileListUrl      :'',
                supName          :'',
                option           :{
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
                    menuWidth  :120,
                    menu       :false,
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
                            width     :180,
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
                invoiceOption    :{
                    maxHeight :250,
                    border    :true,
                    addBtn    :false,
                    editBtn   :false,
                    cellBtn   :false,
                    cancelBtn :false,
                    delBtn    :false,
                    addRowBtn :false,
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
                invoiceData      :[
                    {
                        id         :0,
                        invoiceCode:'',
                        invoiceDate:'',
                        attachment :'',
                        $cellEdit  :true
                    }
                ],
                sumColumn        :[],//金额合计
            }
        },
        methods   :{
            open(){
                this.invoiceData = [
                    {
                        id         :0,
                        invoiceCode:'',
                        invoiceDate:'',
                        attachment :'',
                        $cellEdit  :true
                    }
                ]
                this.selectedData.forEach(item => {
                    if(item.type == 'KK'){
                        item.disabled = true
                    }else{
                        item.disabled = false
                    }
                })
                this.supName = this.selectedData[0].supName
                this.getSumColumn()
            },
            getSumColumn(){
                this.sumColumn = totalAmount(this.option.column, this.selectedData)
            },
            closeReconciliation(){
                this.$emit('closeReconciliation')
            },
            refresh(){
                this.$emit('refresh')
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
                let add = 0
                for(var i = 0; i < this.selectedData.length; i++){
                    let qyt = Math.abs(this.selectedData[i].rcvActualQty) - Math.abs(this.selectedData[i].accumRecQty)
                    if(this.selectedData[i].recThisQty === '' || Math.abs(this.selectedData[i].recThisQty) > qyt){
                        return this.$message.warning('请正确填写本次对账数量')
                    }
                    add += Number(this.selectedData[i].taxSubTotal)
                }
                if(add < 0){
                    return this.$message.warning("价税合计相加不能小于0");
                }
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

                if(apRcvVos[0]['poCode'].indexOf('VMI') > -1) {
                  dzSubmitVmi(req).then(() => {
                    this.$message.success("提交成功")
                    this.closeReconciliation()
                    this.refresh()
                  }).finally(() => {
                    this.fullscreenLoading = false
                  });
                } else {
                  dzSubmit(req).then(() => {
                    this.$message.success("提交成功")
                    this.closeReconciliation()
                    this.refresh()
                  }).finally(() => {
                    this.fullscreenLoading = false
                  });
                }



            },
            //修改本次对账数量进行运算
            changeRecThisQty(row){
                let qyt = Math.abs(row.rcvActualQty) - Math.abs(row.accumRecQty)
                if(Math.abs(row.recThisQty) > qyt){
                    return this.$message.warning('本次对账数量不可大于（实收数量-累计对账数量）')
                }
                row = apmoney(row)
                this.getSumColumn()
            }
        },
        created(){
            this.token = "bearer " + this.$store.getters.token;
        }
    }
</script>

<style scoped lang="scss">
  .avue-crud /deep/ .avue-crud__menu{
    min-height: 10px;
  }

  #sumColumnList{
    top: -15px
  }
</style>
