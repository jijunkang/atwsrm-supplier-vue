<template>
  <basic-container id="table">
    <ul class="item-list">
      <li :class="{active:buttonKey==item.status }"
          v-for="(item,index) in statisticsData" @click="getKeys(item.status)">
        {{item.title+'('+item.count+')'}}
      </li>
    </ul>
    <div v-show="buttonKey==AP_STATUS.WAIT">
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
                 @on-load="onLoad"
                 :row-style="rowStyle">
        <template slot="menuLeft">
          <p style="font-size: 14px;line-height: 28px;margin:0px 0px 5px 0px">
            以下截止到昨天23:59:59 根据到货单生成的对账单
          </p>
          <el-button type="primary"
                     size="mini"
                     @click="reconciliation">对 账
          </el-button>
          <el-button type="primary"
                     size="mini"
                     @click="handleExcel">导 出
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
        <!--  物料编号-->
        <template slot-scope="scope" slot="itemCode">
          <el-button type="text" size="mini"
                     @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
          </el-button>
        </template>
      </avue-crud>
    </div>
    <div v-show="buttonKey==AP_STATUS.WAITCHECK||buttonKey==AP_STATUS.PASS">
      <avue-crud :option="reconciledOption"
                 :table-loading="loading"
                 :data="reconciledData"
                 :page="pageReconciled"
                 ref="crud"
                 @search-change="searchChangeReconciled"
                 @search-reset="searchResetReconciled"
                 @selection-change="selectionChange"
                 @current-change="currentChangeReconciled"
                 @size-change="sizeChangeReconciled"
                 @refresh-change="refreshChangeReconciled"
                 @on-load="onLoadReconciled">
        <template slot="menuLeft">

        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="mini"
                     @click="detail(scope.row)">详情
          </el-button>
        </template>
      </avue-crud>
    </div>
    <div v-show="buttonKey==AP_STATUS.REFUSE">
      <avue-crud :option="returnedOption"
                 :table-loading="loading"
                 :data="returnedDate"
                 :page="pageReturned"
                 ref="crud"
                 @search-change="searchChangeReturned"
                 @search-reset="searchResetreturned"
                 @selection-change="selectionChange"
                 @current-change="currentChangeReturned"
                 @size-change="sizeChangReturnede"
                 @refresh-change="refreshChangeReturned"
                 @on-load="onLoadReturned">
        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="mini"
                     @click="detail(scope.row)">详情
          </el-button>
        </template>
      </avue-crud>
    </div>
    <!--金额合计-->
    <sum-column :sumColumn="sumColumn"></sum-column>
    <!--对账-->
    <apapplay-contrast :Visible="reconciliationVisible" @closeReconciliation="closeReconciliation"
                       :selectedData="reconciliationSelectData" @refresh="refreshChange"></apapplay-contrast>
    <!--对账详情（供应商对账单）-->
    <apapplay-detail :detailVisible="supReconciliationVisible" @closeDetail="closeDetail"
                     :selectedData="reconDetailSelectData" @refreshReconciled="refreshChangeReconciled"
                     :status="buttonKey"></apapplay-detail>
    <!--物料编码-->
    <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>
  </basic-container>
</template>

<script>
    import {getPageList}                                  from "@/api/ap/aprcv";
    import {getApList, getStatistics, AP_STATUS, saveAps} from "@/api/ap/ap";
    import {negativeMoney}                                from '@/util/money';
    import apapplayContrast                               from './apapplay-contrast'
    import apapplayDetail                                 from './apapplay-detail'
    import itemCode                                       from '../item/item-code'
    import sumColumn                                      from "../finance/sumColumnList"
    import {apmoney}                                      from '@/util/apMoney';
    import {objToUrlParam}                                from "@/util/func";
    import {totalAmount}                                  from "@/util/sumColumnList";

    export default {
        components:{apapplayContrast, apapplayDetail, itemCode, sumColumn},
        data(){
            return {
                AP_STATUS               :AP_STATUS,
                statisticsData          :[],
                itemform                :{},
                buttonKey               :0,
                query                   :{},
                form                    :{},
                loading                 :false,
                page                    :{
                    pageSizes  :[100, 200, 500, 1000, 2000],
                    pageSize   :100,
                    currentPage:1,
                    total      :0
                },
                pageReconciled          :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                pageReturned            :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                reconciliationVisible   :false,//对账
                supReconciliationVisible:false,//供应商对账单
                dialogTableVisible      :false,//物料
                fullscreenLoading       :false,//页面整加载
                waitData                :[],
                reconciledData          :[],
                returnedDate            :[],
                reconciliationSelectData:[],
                reconDetailSelectData   :[],
                selectionList           :[],
                sumColumn               :[],//金额合计
                waitOption              :{
                    height        :350,
                    // calcHeight :350,
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
                            label     :"订单编号",
                            width     :150,
                            prop      :"poCode",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            slot      :true,
                            search    :true,
                            searchSpan:6,
                        },
                        {
                            label     :"收货单号",
                            width     :180,
                            prop      :"rcvCode",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            slot      :true,
                            search    :true,
                            searchSpan:6,
                        },
                        {
                            label     :"物料编号",
                            minWidth  :110,
                            prop      :"itemCode",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            slot      :true,
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
                            sumprice:true,
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
                                return negativeMoney(value)
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
                            label      :"到货日期",
                            width      :120,
                            prop       :"rcvDate",
                            align      :'center',
                            sortable   :true,
                            type       :"date",
                            searchRange:true,
                            format     :"yyyy-MM-dd",
                            valueFormat:"timestamp",
                            search     :true,
                            searchSpan :6,
                            slot       :true,
                        }
                    ]
                },
                reconciledOption        :{
                    height        :350,
                    // calcHeight :350,
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
                    menuWidth     :80,
                    menu          :true,
                    searchMenuSpan:8,
                    column        :[
                        {
                            label           :"对账单编号",
                            prop            :"apCode",
                            align           :'center',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :8,
                        },
                        {
                            label           :"对账单生成日期",
                            prop            :"createTime",
                            align           :'center',
                            sortable        :true,
                            type            :"date",
                            searchRange     :true,
                            format          :"yyyy-MM-dd",
                            valueFormat     :"yyyy-MM-dd HH:mm:ss",
                            search          :true,
                            searchLabelWidth:120,
                            searchSpan      :8,
                        },
                        {
                            label    :"对账单金额",
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
                returnedOption          :{
                    height        :350,
                    // calcHeight :350,
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
                    menuWidth     :80,
                    menu          :true,
                    searchMenuSpan:8,
                    column        :[
                        {
                            label           :"对账单编号",
                            prop            :"apCode",
                            align           :'center',
                            sortable        :true,
                            type            :"input",
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:90,
                            searchSpan      :8,
                        },
                        {
                            label           :"对账单生成日期",
                            prop            :"createTime",
                            align           :'center',
                            sortable        :true,
                            type            :"date",
                            searchRange     :true,
                            format          :"yyyy-MM-dd",
                            valueFormat     :"yyyy-MM-dd HH:mm:ss",
                            search          :true,
                            searchLabelWidth:120,
                            searchSpan      :8,
                        },
                        {
                            label    :"对账单金额",
                            prop     :"taxAmount",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return negativeMoney(value)
                            }
                        },
                        {
                            label      :"退回时间",
                            prop       :"backDate",
                            align      :'center',
                            sortable   :true,
                            type       :"date",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                        },
                        {
                            label     :"退回原因",
                            prop      :"remark",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                        },
                        {
                            label   :"退回采购员",
                            prop    :"backBuyer",
                            align   :'center',
                            sortable:true,
                            props   :{
                                label:'realName',
                                value:'id'
                            },
                            dicUrl  :'/api/blade-user/purch-list',
                        },
                    ]
                },
            }
        },
        methods   :{
            handleExcel(){
              if (this.selectionList.length>0){
                let req = {
                  "Blade-Auth":this.$store.getters.token,
                  selectionIds: this.selectionList.map(row => row.id,).join(","),
                };
                window.open('/api/blade-ap/aprcv/export?' + objToUrlParam(req));
              }else {
                let req = {
                  "Blade-Auth": this.$store.getters.token,
                  ...this.query
                };
                window.open('/api/blade-ap/aprcv/export?' + objToUrlParam(req));
              }
            },
            getSumColumn(){
                if(this.buttonKey == AP_STATUS.WAIT){
                    this.sumColumn = totalAmount(this.waitOption.column, this.selectionList)
                }else if(this.buttonKey == AP_STATUS.WAITCHECK || this.buttonKey == AP_STATUS.PASS){
                    this.sumColumn = totalAmount(this.reconciledOption.column, this.selectionList)
                }else if(this.buttonKey == AP_STATUS.REFUSE){
                    this.sumColumn = totalAmount(this.returnedOption.column, this.selectionList)
                }
            },
            selectionChange(list){
                this.selectionList = list;
                this.getSumColumn()
            },
            selectionClear(){
                this.selectionList = [];
                this.getSumColumn()
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            //待对账表
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                done();
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
            },
            refreshChange(){
                this.onLoad(this.page, this.query);
                this.getStatisticsHandle();
            },
            onLoad(page, params = {}){
                this.loading = true;
                let req      = {
                    ...this.query
                };
                getPageList(page.currentPage, page.pageSize, req).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.waitData   = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            //对账弹框
            reconciliation(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                let add         = 0
                let taxSubTotal = 0
                let VMITypeCount    = 0;
                let othersTypeCount = 0;
                for(var i = 0; i < this.selectionList.length; i++){
                    if(this.selectionList[i].poCode.indexOf("VMI") > -1) {
                      VMITypeCount++;
                    } else {
                      othersTypeCount++;
                    }

                    if(this.selectionList[i].type == 'KK'){
                        taxSubTotal = this.selectionList[i].taxSubTotal
                    }else{
                        taxSubTotal = (this.selectionList[i].rcvActualQty - this.selectionList[i].accumRecQty) * this.selectionList[i].taxPrice
                    }
                    add += Number(taxSubTotal)
                }
                if( VMITypeCount * othersTypeCount > 0){
                  return this.$message.error("VMI订单 不可以与 普通订单 同时结算.请分开结算!");
                }
                if(add < 0){
                    return this.$message.warning("价税合计相加不能小于0");
                }
                let SelectDataList     = []
                let selectionListClone = JSON.parse(JSON.stringify(this.selectionList))
                selectionListClone.forEach(item => {
                    item = apmoney(item)
                    SelectDataList.push(item)
                })
                this.reconciliationSelectData = JSON.parse(JSON.stringify(SelectDataList))
                console.log(this.reconciliationSelectData)
                this.reconciliationVisible = true
            },
            //关闭对账弹框
            closeReconciliation(){
                this.reconciliationVisible = false
            },
            //已对账
            searchResetReconciled(){
                this.query = {};
                this.onLoadReconciled(this.pageReconciled);
            },
            searchChangeReconciled(params, done){
                done();
                if(!params.createTime){
                    params.createTimeStart = ''
                    params.createTimeEnd   = ''
                }
                if(params.createTime){
                    if(params.createTime.length > 1){
                        params.createTimeStart = params.createTime[0]
                        params.createTimeEnd   = params.createTime[1].substring(0, 11) + '23:59:59'
                    }
                }
                this.query = Object.assign({}, params);
                delete this.query.createTime
                this.pageReconciled.currentPage = 1;
                this.onLoadReconciled(this.pageReconciled, this.query);
            },
            currentChangeReconciled(currentPage){
                this.pageReconciled.currentPage = currentPage;
            },
            sizeChangeReconciled(pageSize){
                this.pageReconciled.pageSize = pageSize;
            },
            refreshChangeReconciled(){
                this.onLoadReconciled(this.pageReconciled, this.query);
                this.getStatisticsHandle();
            },
            onLoadReconciled(page, params = {}){
                this.loading = true;
                let req      = {
                    "status":this.buttonKey,
                    ...this.query
                };
                getApList(page.currentPage, page.pageSize, req).then(res => {
                    const data                = res.data.data;
                    this.pageReconciled.total = data.total;
                    this.reconciledData       = data.records;
                    this.loading              = false;
                    this.selectionClear();
                });
            },
            //批量生成应付单
            batchPay(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm('是否确认生成应付单?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    let apEntities = []
                    this.selectionList.forEach(obj => {
                        apEntities.push({'id':obj.id})
                    })

                    this.fullscreenLoading = true
                    saveAps({apEntities:apEntities}).then(() => {
                        this.$message.success("已成功生成应付单")
                        this.onLoadReconciled(this.pageReconciled);
                    }).finally(() => {
                        this.fullscreenLoading = false
                    })
                }).catch(() => {
                });
            },
            //已退回
            searchResetreturned(){
                this.query = {};
                this.onLoadReturned(this.pageReturned);
            },
            searchChangeReturned(params, done){
                done();
                if(!params.createTime){
                    params.createTimeStart = ''
                    params.createTimeEnd   = ''
                }
                if(params.createTime){
                    if(params.createTime.length > 1){
                        params.createTimeStart = params.createTime[0]
                        params.createTimeEnd   = params.createTime[1].substring(0, 11) + '23:59:59'
                    }
                }
                this.query = Object.assign({}, params);
                delete this.query.createTime
                this.pageReturned.currentPage = 1;
                this.onLoadReturned(this.pageReturned, this.query);
            },
            currentChangeReturned(currentPage){
                this.pageReturned.currentPage = currentPage;
            },
            sizeChangReturnede(pageSize){
                this.pageReturned.pageSize = pageSize;
            },
            refreshChangeReturned(){
                this.onLoadReturned(this.pageReturned, this.query);
                this.getStatisticsHandle();
            },
            onLoadReturned(page, params = {}){
                this.loading = true;
                let req      = {
                    "status":this.buttonKey,
                    ...this.query
                };
                getApList(page.currentPage, page.pageSize, req).then(res => {
                    const data              = res.data.data;
                    this.pageReturned.total = data.total;
                    this.returnedDate       = data.records;
                    this.loading            = false;
                    this.selectionClear();
                });
            },
            getStatisticsHandle(){
                getStatistics().then(res => {
                    this.statisticsData = res.data.data;
                });
            },
            //切换标签
            getKeys(key){
                this.buttonKey = key
                this.getStatisticsHandle();
                this.selectionClear()
            },
            //供应商对账单（详情）
            detail(row){
                this.reconDetailSelectData    = row
                this.supReconciliationVisible = true
            },
            closeDetail(){
                this.supReconciliationVisible = false
            },
            //物料编码组件
            handleItemCode(row){
                this.dialogTableVisible = true
                this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
            },
            closedialog(){
                this.dialogTableVisible = false
            },
            //扣款数据标红
            rowStyle({row, column, rowIndex}){
                if(row.taxSubTotal < 0){
                    return {color:'red'};
                }
            },
            //获取当前路由
            getRoute(){
                var url = window.location.href
                console.log(url, 'url')
                if(url.indexOf("=") != -1){
                    let status = url.substring(url.lastIndexOf("=") + 1, url.length);
                    console.log(status)
                    if(status == AP_STATUS.REFUSE){
                        this.buttonKey = status
                    }
                }
            }
        },
        created(){
            this.getStatisticsHandle();
            // this.getRoute()
        },
        watch     :{
            // '$route':'getRoute',
            'buttonKey'(newV, oldV){
                this.query = {};
                if(this.buttonKey == AP_STATUS.WAIT){
                    this.page = {"pageSizes":[100, 200, 500, 1000, 2000], "pageSize":100, "currentPage":1, "total":0}
                    this.onLoad(this.page, this.query)
                }else if(this.buttonKey == AP_STATUS.WAITCHECK){
                    this.pageReconciled = {"pageSize":10, "currentPage":1, "total":0}
                    this.onLoadReconciled(this.pageReconciled, this.query)
                }else if(this.buttonKey == AP_STATUS.PASS){
                    this.pageReconciled = {"pageSize":10, "currentPage":1, "total":0}
                    this.onLoadReconciled(this.pageReconciled, this.query)
                }else if(this.buttonKey == AP_STATUS.REFUSE){
                    this.pageReturned = {"pageSize":10, "currentPage":1, "total":0}
                    this.onLoadReturned(this.pageReturned, this.query)
                }
            }
        }
    }
</script>

<style scoped="scoped" lang="scss">
  .item-list{
    width: 100%;
    height: 44px;
    list-style: none;
    padding-left: 0px;
    background-color: #fff;
    box-sizing: border-box;
    border: 1px solid rgba(228, 228, 228, 1);
    border-right: 0px;
    margin-top: 0px;

    li{
      width: 134px;
      height: 44px;
      float: left;
      line-height: 44px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;

      &:hover{
        cursor: pointer;
      }
    }

    .active{
      height: 40px;
      color: rgb(0, 121, 254);
      border-width: 0px 0px 2px;
      border-style: solid;
      border-color: rgb(0, 121, 254);
      border-left: 0px;
      border-top: 0px;
      border-right: 0px;
    }
  }

  .ul{
    list-style: none;
    padding-inline-start: 0px;
    margin: 0px;

    span:last-child{
      margin-left: 5px;
    }
  }

  #table /deep/ .el-row{
    background-color: #fff;
  }

  #table /deep/ .avue-crud__pagination{
    margin-top: 50px;
  }
</style>
