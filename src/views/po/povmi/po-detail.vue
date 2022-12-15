<template>
  <div>
    <el-dialog title="订单详情"
               :visible.sync="dialogTableVisiblePo"
               :append-to-body="true"
               @close="closeEdit"
               width="80%"
               @opened="orderDetail"
               v-loading.fullscreen.lock="fullscreenLoading">
      <container>
          <div id="avue-detail">
              <avue-detail :option="po_detail" v-model="form" v-if="isNew">
                  <template slot-scope="scope" slot="contractForm">
                      <!--历史合同-->
                      <div id="viewBox" style="margin-left: 30px;">
                          <!--<span v-if="fileList!=''">历史合同：</span>-->
                          <span v-for="(list,index) in fileListUrl" id="viewFile">
                      <el-button class="pic" type="text" icon="el-icon-picture-outline" size="medium"
                                 :disabled="scope.row.contract ==''"
                                 @click="viewImages(list.url)">
                      </el-button>
                      <el-button type="text" id="view" class="big" icon="el-icon-view" size="medium"
                                 :disabled="scope.row.contract ==''" @click="viewImages(list.url)">
                      </el-button>
                      <el-button
                              v-if="form.contractStatus==CON_STATUS.INIT || form.contractStatus==CON_STATUS.AUDIT || form.contractStatus==CON_STATUS.FAIL"
                              type="text" class="viewImg" icon="el-icon-circle-close" size="medium"
                              @click="handleRemove(index)">
                      </el-button>
                  </span>
                      </div>
                  </template>
                  <!--订单总金额-->
                  <template slot-scope="scope" slot="docAmountForm">{{form.docAmount|formatMoney}}</template>
              </avue-detail>
              <!--分割线**********************分割线**********************-->

              <!--新模块 新数据-->
              <avue-detail :option="po_detail_new" v-model="form" v-if="!isNew">
                  <!--订单总金额-->
                  <template slot-scope="scope" slot="docAmountForm">{{form.docAmount|formatMoney}}</template>
              </avue-detail>
          </div>
        <avue-crud :data="poData.records"
                   :option="po_crud"
                   v-model="crud_form"
                   @selection-change="selectionChange"
                   :page="page"
                   :permission="permissionList"
                   :before-open="beforeOpen"
                   ref="crud"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @row-del="rowDel"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange">
          <template slot="menuLeft">
            <div style="margin-bottom:15px">
            <span v-if="form.status==PO_STATUS.INIT" style="margin-right: 10px">
               <el-button type="primary" size="mini" @click="cancelOrder()">取消订单</el-button>
              <el-button type="primary" size="mini" @click="confirmOrder()">确认订单</el-button>
            </span>
            </div>
            <el-button type="primary" size="mini" @click="downAllDwg()">下载全部图纸
            </el-button>
            <el-button type="primary" size="mini" @click="downAllCraft()">下载全部工艺文件
            </el-button>
            <el-button type="primary" size="mini" @click="downAllCheck()">下载全部检验标准
            </el-button>
            <el-button type="primary" size="mini" @click="downAllProcess()">下载全部上一道工序图纸
            </el-button>
          </template>
          <!--      物料编号-->
          <template slot-scope="scope" slot="itemCode">
            <el-button type="text" size="mini"
                       @click="dialogTableVisible=true,handleItemCode(scope.row)">{{scope.row.itemCode}}
            </el-button>
          </template>
          <!--        单价-->
          <template slot-scope="scope" slot="price">{{scope.row.price|formatMoney}}</template>
          <!--        金额-->
          <template slot-scope="scope" slot="amount">{{scope.row.amount|formatMoney}}</template>
          <!--        状态-->
          <template slot="status" slot-scope="scope">
            {{form.status|statusFmt(scope.row.u9StatusCode,scope.row.arvGoodsNum)}}
          </template>
        </avue-crud>
        <!--物料编码-->
        <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>

      </container>
    </el-dialog>
  </div>
</template>

<script>
    import itemCode                                                                           from '../../item/item-code'
    import {accept, getDetail, PO_STATUS, CON_STATUS, PO_STATUS_PAIR, updatecontract, cancel,getVmiInfo} from "@/api/po/po";
    import {getItemdDwg, getItemCraft, getItemCheck, getItemProcess}                          from "@/api/item/item"
    import {mapGetters}                                                                       from "vuex";

    export default {
        name      :"po-vmi-detail",
        props     :['dialogTableVisiblePo', 'poData', 'poId'],
        computed  :{
            ...mapGetters(["permission", "userInfo"]),
        },
        components:{itemCode},
        data(){
            return {
                isNew:false,
                vmiData :"",
                dialogTableVisibleOfContract:false,
                dataOfContract   :[],
                selectionList    :[],
                PO_STATUS        :PO_STATUS,
                CON_STATUS       :CON_STATUS,
                PO_STATUS_PAIR   :PO_STATUS_PAIR,
                fullscreenLoading:false,
                data             :[],
                form             :{},
                pageOfContract: {
                  pageSize: 10,
                  currentPage: 1,
                  total: 0
                },
                itemform         :{},
                token            :'',
                codeList         :[],
                urlData          :[],//合同
                fileList         :[],
                urlName          :[],
                fileListUrl      :[],
                uploadUrlList    :'',
                po_detail        :{
                column:[
                  {
                    label:'订单编号',
                    prop :'orderCode',
                    span :8,
                  },
                  {
                    label      :'下单日期',
                    prop       :'docDate',
                    span       :8,
                    type       :"datetime",
                    format     :"yyyy-MM-dd",
                    valueFormat:"yyyy-MM-dd",
                    formatter  :function(row, value, label, column){
                      return value = value > 0 ? value * 1000 : ''
                    },
                  },
                  {
                    label:'供应商编号',
                    prop :'supCode',
                    span :8,
                  },
                  {
                    label:'供应商名称',
                    prop :'supName',
                    span :8,
                  },
                  {
                    label    :'订单状态',
                    prop     :'status',
                    span     :8,
                    dicUrl   :'/api/blade-system/dict-biz/dictionary?code=po_status',
                    props    :{
                      label:"dictValue",
                      value:"dictKey"
                    },
                    formatter:function(row, value, label, column){
                      return value ? value.toString() : '';
                    },
                  },
                  {
                    label   :'订单总金额',
                    prop    :'docAmount',
                    span    :8,
                    formslot:true,
                  },
                  {
                    label   :'合同影像',
                    prop    :'contract',
                    span    :8,
                    formslot:true,
                  },
                  {
                    label  :'拒绝原因',
                    prop   :'remark',
                    display:false,
                    span   :16,
                  },
                ]
              },
                po_detail_new        :{
                    column:[
                        {
                            label:'订单编号',
                            prop :'orderCode',
                            span :8,
                        },
                        {
                            label      :'下单日期',
                            prop       :'docDate',
                            span       :8,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label:'供应商编号',
                            prop :'supCode',
                            span :8,
                        },
                        {
                            label:'供应商名称',
                            prop :'supName',
                            span :8,
                        },
                        {
                            label    :'订单状态',
                            prop     :'status',
                            span     :8,
                            dicUrl   :'/api/blade-system/dict-biz/dictionary?code=po_status',
                            props    :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            formatter:function(row, value, label, column){
                                return value ? value.toString() : '';
                            },
                        },
                        {
                            label   :'订单总金额',
                            prop    :'docAmount',
                            span    :8,
                            formslot:true,
                        },
                        {
                            label  :'拒绝原因',
                            prop   :'remark',
                            display:false,
                            span   :16,
                        },
                    ]
                },
                po_crud          :{
                    maxHeight     :500,
                    tip           :true,
                    border        :true,
                    page          :false,
                    align         :'center',
                    menuAlign     :'center',
                    selection     :true,
                    menu          :false,
                    addBtn        :false,
                    refreshBtn    :false,
                    columnBtn     :false,
                    size          :'mini',
                    selectionWidth:60,
                    simplePage    :1,
                    column        :[
                        {
                            label   :'行号',
                            prop    :'poLn',
                            sortable:true,
                            width   :70,
                        },
                        {
                            label   :'料号',
                            prop    :'itemCode',
                            sortable:true,
                            slot    :true,
                            width   :110,
                        },
                        {
                            label     :'物料描述',
                            prop      :'itemName',
                            sortable  :true,
                            width     :150,
                            align     :'left',
                            overHidden:true,
                        },
                        {
                            label   :'项目号',
                            prop    :'proNo',
                            sortable:true,
                            width   :115,
                        },
                        {
                            label   :'计价单位',
                            prop    :'priceUom',
                            sortable:true,
                            width   :85,
                        },
                        {
                            label   :'采购单位',
                            prop    :'tcUom',
                            sortable:true,
                            width   :85,
                        },
                        {
                            label   :'数量',
                            prop    :'tcNum',
                            sortable:true,
                            width   :70,
                        },
                        {
                            label      :'需求交期',
                            prop       :'reqDate',
                            sortable   :true,
                            width      :85,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label      :'承诺交期',
                            prop       :'supConfirmDate',
                            sortable   :true,
                            width      :85,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label      :'修改交期',
                            prop       :'supUpdateDate',
                            sortable   :true,
                            width      :85,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },

                        },
                        {
                            label   :'到货数量',
                            prop    :'rcvGoodsNum',
                            sortable:true,
                            width   :85,
                        },
                        {
                            label   :'未到数量',
                            prop    :'proGoodsNum',
                            sortable:true,
                            width   :85,
                        },
                        {
                            label   :'单价',
                            prop    :'price',
                            sortable:true,
                            align   :'right',
                            slot    :true,
                            width   :70,
                        },
                        {
                            label   :'金额',
                            prop    :'amount',
                            sortable:true,
                            width   :70,
                            align   :'right',
                            slot    :true,
                        },
                        {
                            label   :'加工费',
                            prop    :'laborCost',
                            sortable:true,
                            width   :80,
                            align   :'right',
                        },
                        {
                          label   :'材料费',
                          prop    :'materialCost',
                          sortable:true,
                          width   :80,
                          align   :'right',
                        },
                        {
                          label     :"最终用户",
                          width     :100,
                          prop      :"endUser",
                          align     :'center',
                          sortable  :true,
                          type      :"input",
                        },
                        {
                            label:'U9状态',
                            prop :'u9Status',
                            hide :true,
                        },
                        {
                            label:'状态',
                            prop :'status',
                            slot :true,
                        }
                    ]
                }
            }
        },
        methods   :{
            orderDetail(){
                this.isNew = false;
                this.fileListUrl = []
                var url          = ''
                getDetail(this.poId).then((res) => {
                    this.form = res.data.data
                    if(this.form.contract != ''){
                        url = this.form.contract.split("|")
                        url.forEach(item => {
                            this.fileListUrl.push({"url":item, response:{data:{"link":item}}})
                        })
                        this.fileList = this.fileListUrl

                        if (this.fileList!=''){
                            this.isNew = true;
                        }

                        // this.fileList.forEach((obj,index)=>{
                        //   obj.name=this.urlName[index]
                        // })
                    }
                });
            },
            closeEdit(){
                this.$emit('closefunc', false)
                this.fileList = []
            },
            refreshPo(){
                this.$emit('refreshpoIndex')
            },
            handleItemCode(row){
                var itemData = []
                itemData.push({'itemCode':row.itemCode, 'itemDesc':row.itemName})
                this.itemform = itemData[0]
            },
            // 合同信息
            handleContract() {
              this.vmiData = this.poData.records[0].poCode;
            },
            closedialog(){
                this.dialogTableVisible = false
            },
            closeContractDialog(){
              this.dialogTableVisibleOfContract = false
            },
            selectionChange(list){
                this.selectionList = list;
                this.codeList      = []
                for(var i = 0; i < this.selectionList.length; i++){
                    this.codeList.push(this.selectionList[i].itemCode)
                }
            },
            selectionClear(){
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            //确认订单
            confirmOrder(){
                this.$confirm('是否确认订单?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.fullscreenLoading = true
                    accept({"id":this.poId}).then((res) => {
                        if(res.data.code == 200){
                            this.$message({
                                type   :"success",
                                message:"操作成功!"
                            });
                        }
                        this.orderDetail()
                        this.refreshPo()
                    }).finally(() => {
                        this.fullscreenLoading = false
                    })
                }).catch(() => {

                });
            },

            //取消订单
            cancelOrder(){
                this.$confirm('是否取消订单?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.fullscreenLoading = true
                    cancel({"id":this.poId}).then((res) => {
                        // console.log(res)
                        if(res.data.code == 200){
                            this.$message({
                                type   :"success",
                                message:"操作成功!"
                            });
                        }
                        this.orderDetail()
                        this.refreshPo()
                    }).finally(() => {
                        this.fullscreenLoading = false
                    })
                }).catch(() => {

                });
            },
            //下载合同
            downloadContract(po){
                let type = po.templateType;
                let id   = po.id
                let href = ''
                switch(type){
                    case "A":
                      href = '/print_0716.html?id=';
                      break;
                    case "B":
                      href = '/print_0720.html?id=';
                      break;
                    case "C":
                      href = '/print_0717.html?id=';
                      break;
                    case "D":
                      href = '/print_0718.html?id=';
                      break;
                    case "E":
                      href = '/print_0722.html?id=';
                      break;
                    case "AW":
                      href = '/print_0716_w.html?id=';
                      break;
                    case "BW":
                      href = '/print_0720_w.html?id=';
                      break;
                    case "CW":
                      href = '/print_0717_w.html?id=';
                      break;
                    case "DW":
                      href = '/print_0718_w.html?id=';
                      break;
                    case "EW":
                      href = '/print_0722_W.html?id=';
                      break;
                    case "isWeight":
                      href = '/print_0721.html?id=';
                      break;
                    case "PC-017":
                      href = '/print_0719.html?id=';
                }
                if(type == ""){
                    window.open("/print_0716.html?id=" + id)
                }else{
                    window.open(href + id)
                }
            },
            //上传合同操作
            handleRemove(index){
                this.$confirm('是否删除此合同?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.fileList.splice(index, 1)
                    this.urlData = []
                    this.fileList.forEach(item => {
                        this.urlData.push(item.response.data.link)
                    })
                    this.uploadUrlList = this.urlData.join('|');
                    updatecontract({"id":this.poId, "contract":this.uploadUrlList}).then((res) => {
                        this.orderDetail()
                        this.refreshPo()
                    })
                }).catch(() => {

                });

            },
            handlePreview(file){
                console.log(file);
            },
            beforeUpload(){
                this.fullscreenLoading = true
            },
            handleSuccess(res, file, fileList){
                this.urlData = []
                console.log(fileList)
                // this.urlName = []
                fileList.forEach(item => {
                    var url = item.response.data.link
                    this.urlData.push(url)
                    // this.urlName.push(item.name)
                })
                this.uploadUrlList = this.urlData.join('|');
                if(res.code === 200){
                    this.$message({
                        message:'上传成功！',
                        type   :'success'
                    });
                    // this.$refs.upload.clearFiles()
                    updatecontract({"id":this.poId, "contract":this.uploadUrlList, "contractStatus":CON_STATUS.AUDIT}).then((res) => {
                        this.orderDetail()
                        this.refreshPo()
                        // this.fileList = []
                    })
                    this.fullscreenLoading = false
                }else{
                    this.$message({
                        message:'上传失败',
                        type   :'error'
                    });
                    this.fullscreenLoading = false
                }
            },
            handleError(){
                this.fullscreenLoading = false
            },
            //查看影像
            viewImages(url){
                window.open(url)
            },
            //批量下载图纸
            downAllDwg(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.codeList.toString()
                getItemdDwg({
                    "itemCode":itemCodeList
                }).then(data => {
                    window.open(data.result.url)
                    // this.selectionClear()
                }).catch(() => {
                    // this.selectionClear()
                });
            },
            downAllCraft(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.codeList.toString()
                getItemCraft({
                    "itemCode":itemCodeList
                }).then(data => {
                    window.open(data.result.url)
                })
            },
            downAllCheck(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.codeList.toString()
                getItemCheck({
                    "itemCode":itemCodeList
                }).then(data => {
                    window.open(data.result.url)
                })
            },
            downAllProcess(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.codeList.toString()
                getItemProcess({
                    "itemCode":itemCodeList
                }).then((data) => {
                    window.open(data.result.url)
                })
            }
        },
        created(){
            this.token                   = "bearer " + this.$store.getters.token;
            //this.po_crud.column[17].hide = this.userInfo.tenant_id.substring(0, 3) !== 'PC-';

        },
        watch     :{
            'form.status'(){
                var remark = this.po_detail.column[7];
                if(this.form.status == PO_STATUS.CONTRACT_REFUSE){
                    remark.display = true
                }else{
                    remark.display = false
                }
            }
        },
        filters   :{
          /*
           * 金钱格式化
           */
            formatMoney(num){
                if(!num){
                    return '0.00';
                }
                num = num.toString().replace(/\$|\,/g, '');
                if(isNaN(num))
                    num = "0";
                let sign  = (num == (num = Math.abs(num)));
                num       = Math.floor(num * 100 + 0.50000000001);
                let cents = num % 100;
                num       = Math.floor(num / 100).toString();
                if(cents < 10)
                    cents = "0" + cents;
                for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                      num.substring(num.length - (4 * i + 3));
                return (((sign) ? '' : '-') + num + '.' + cents);
            },
            //状态
            statusFmt:function(key, u9, arvGoodsNum){
                if(key <= 0){
                    return ''
                }
                if(u9 == 2){
                    return PO_STATUS_PAIR[key]
                }else if(u9 == 3){
                    return '自然关闭'
                }else if(u9 == 4){
                    if(arvGoodsNum > 0){
                        return '部分取消'
                    }else if(arvGoodsNum == 0){
                        return '全部取消'
                    }
                }else if(u9 == 5){
                    return '超额关闭'
                }else{
                    return ''
                }

            }
        },
    }
</script>

<style scoped>
  #avue-detail /deep/ .avue-detail__box{
    min-height  :35px;
    line-height :35px;

  }

  #avue-detail /deep/ .avue-detail__label{
    font-weight :900;
  }

  #avue-detail /deep/ .avue-group__item > div:nth-child(7) .avue-detail__box{
    display :flex;
  }

  .big :hover{
    cursor :url("/img/magnifier.png") 16 16, auto;
  }

  #viewBox{
    display   :flex;
    flex-wrap :wrap;
  }

  #viewBox :hover{
    background-color :#f1f1f1;
  }

  #viewFile{
    display         :flex;
    margin-right    :5px;
    border          :1px solid #c0ccda;
    border-radius   :6px;
    box-sizing      :border-box;
    width           :100px;
    height          :43px;
    flex-direction  :row;
    justify-content :center;
    align-items     :center;
    margin-bottom   :5px;
  }

  .viewImg /deep/ .el-icon-circle-close:before{
    color :rgba(205, 0, 0, 0.88);
  }

  .pic /deep/ .el-icon-picture-outline:before{
    font-size :30px;
    color     :rgba(205, 0, 0, 0.88);
    /*line-height: 43px;*/
    /*margin-right: 10px;*/
  }

  .pic :hover{
    cursor :url("/img/magnifier.png") 16 16, auto;
  }

  .pic{
    padding :0px 0px;
  }
</style>
