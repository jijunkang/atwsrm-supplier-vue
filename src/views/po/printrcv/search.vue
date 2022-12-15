<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
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
               v-loading.fullscreen.lock="fullscreenLoading">
      <template slot="menuLeft">
        <el-button type="primary"
                   class="el-button--small"
                   @click="doBusiness">保 存
        </el-button>
        <el-button type="warning"
                   class="el-button--small"
                   @click="doExport">导 出
        </el-button>
      </template>
<!--      <template slot-scope="scope" slot="statusSearch">-->
<!--        <el-select-->
<!--                v-model="search.status"-->
<!--                multiple-->
<!--                placeholder="请输入选择状态"-->
<!--                size="mini"-->
<!--        >-->
<!--          <el-option-->
<!--                  v-for="item in statusOptions"-->
<!--                  :key="item.dictKey"-->
<!--                  :label="item.dictValue"-->
<!--                  :value="item.dictKey">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </template>-->
      <!--详情-->
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="mini"
                   @click="doInfo(scope.row)">详情
        </el-button>
      </template>
      <!--物流单号-->
      <template slot-scope="scope" slot="businessCode">
        <el-input
                v-model="scope.row.businessCode"
                size="mini"
                clearable
        ></el-input>
      </template>
      <!--物流商家-->
      <template slot-scope="scope" slot="rcvCode">
        <el-button type="text" size="mini" style="margin-left: -9px;"
                   @click="doInfo(scope.row)">
          {{scope.row.rcvCode}}
        </el-button>
      </template>
      <template slot-scope="scope" slot="businessName">
        <el-select
                v-model="scope.row.businessName"
                placeholder="请选择物流供应商"
                size="mini"
                clearable>
          <el-option
                  v-for="item in businessOptions"
                  :label="item.label"
                  :value="item.value"
                  style="width:350px">
          </el-option>
        </el-select>
      </template>
    </avue-crud>

    <!--查看送货单信息-->
    <el-dialog title="送货单信息如下："  :before-close="closeDialog"  :visible.sync="dialogTableVisibleOfDO" append-to-body=false width="87%">
      <div id="boxtitle">
        <div style="margin: 0px 20px 20px 10px;">
          <span>送货单号：</span>
          <span>{{rcvCodeOfUpdate}}</span>
        </div>
      </div>
      <table class="printtable">
        <thead>
        <tr>
          <th class="checked">序号</th>
          <th class="po">订单单号</th>
          <th class="poln">订单行号</th>
          <th class="itemcode">物料编号</th>
          <th class="itemname">物料描述</th>
          <th class="tcNum">订单数量</th>
          <th class="notSendNum">未送货数量</th>
          <th class="progoodsnum">未到货数量</th>
          <th class="rcvnum">送货数量</th>
          <th class="unqualifiednum" v-if="this.isOutCheck == '1'">不合格数量</th>
          <th class="tcuom">送货单位</th>
          <th class="input">炉/批号</th>
          <th class="input">备注</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(list,index) in newtableData" v-model="show">
          <th class="checked">{{index+1}}</th>
          <td class="po">{{list.poCode}}</td>
          <td class="poln">{{list.poLn}}</td>
          <td class="itemcode">{{list.itemCode}}</td>
          <td class="itemname">{{list.itemName}}</td>
          <td class="tcNum">{{list.tcNum}}</td>
          <td class="notSendNum">{{list.notSendNum}}</td>
          <td class="progoodsnum">{{list.proGoodsNum}}</td>
          <td class="rcvnum">{{list.rcvNum}}</td>
          <td class="unqualifiednum" v-if="list.isOutCheck == '1'">{{list.unqualifiedNum}}</td>
          <td class="tcuom">{{list.tcUom}}</td>
          <td class="input">{{list.heatCode}}</td>
          <td class="input">{{list.doRemark}}</td>
        </tr>
        </tbody>
      </table>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {poReceive,poReceiveUpdate, poReceivePage, doPage, doDetail, doCancel,doBusiness,DO_STATUS} from "@/api/poreceive/poReceive";
  import {objToUrlParam}                                from "@/util/func";

  export default {
    data(){
      return {
        isOutCheck : '',
        rcvCodeOfUpdate   :'',
        DO_STATUS:DO_STATUS,
        statusOptions          :[],//状态
        form              :{},
        formOfOrder       :{},
        show              :true,
        batchnumval       :'',
        remarksval        :'',
        checkedAll        :false,
        loading           :true,
        fullscreenLoading :false,//页面整加载
        dialogTableVisibleOfDO:false, //送货单信息
        dialogTableVisible:false,
        doUpdateFlag      :true,
        page              :{
          pageSize   :20,
          currentPage:1,
          total      :0
        },
        pageOfItemInfoOfDO: {
          pageSize: 20,
          currentPage: 1,
          total: 0
        },
        pageOfOrder: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        newtableData:[],
        selectionList     :[],
        selectionListOfOrder     :[],
        option            :{
          height:630,
          tip: true,
          border: true,
          index: false,
          addBtn: false,
          editBtn: false,
          viewBtn: false,
          delBtn: false,
          selection: true, //行可勾选
          size: 'mini',
          menu:false,
          searchMenuSpan:6,
          column        :[
            {
              label   :"送货单号",
              prop    :"rcvCode",
              align   :'left',
              sortable:true,
              type    :"input",
              slot    :true,
              search  :true,
              searchSpan:8,
            },
            {
              label     :"订单号",
              prop      :"poCode",
              type      :"input",
              hide:true
            },
            {
              label   :"物料编号",
              prop    :"itemCode",
              align   :'left',
              sortable:true,
              type    :"input",
              width:250,
              hide:true,
              search    :true,
              searchSpan:8,
              searchLabelWidth:120,
            },
            {
              label   :"物料描述",
              prop    :"itemName",
              align   :'left',
              sortable:true,
              type    :"input",
              hide:true,
              search    :true,
              searchSpan:8,
              searchLabelWidth:120,
            },
            {  label   :"创建时间",
              prop    :"createTimeRecord",
              align   :'left',
              width:175,
              sortable:true,
            },
            {  label   :"创建方",
              prop    :"creater",
              align   :'left',
              width:100,
              sortable:true,
            },
            {  label   :"更新时间",
              prop    :"updateTime",
              align   :'left',
              width:175,
              sortable:true,
            },
            {  label   :"更新方",
              prop    :"updater",
              align   :'left',
              width:100,
              sortable:true,
            },
            {  label   :"物流商家",
              prop    :"businessName",
              align   :'left',
              slot:true,
              width:300,
              sortable:true,
            },
            {  label   :"物流单号",
              prop    :"businessCode",
              align   :'left',
              width:300,
              slot:true,
              sortable:true,
            },
            {
              label           :"检验方式",
              width           :90,
              prop            :"isOutCheck",
              align           :'center',
              sortable        :true,
              type            :"select",
              dicData         :[
                {
                  "label":"外检",
                  "value":"1",
                },
                {
                  "label":"内检",
                  "value":"0",
                },
              ]
            },
            {
              label: "状态",
              prop: "status",
              align: 'center',
              sortable: true,
              width:100,
              type: "select",
              dicUrl: '/api/blade-system/dict-biz/dictionary?code=do_status',
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              search: true,
              searchSpan: 6,
            },
            {
              label:'操作',
              prop :'operating',
              slot :true,
              width:50,
              fixed:'right',
              align:'center',
            },
          ]
        },
        businessOptions: [{
            value: '顺丰速运',
            label: '顺丰速运'
          }, {
            value: '邮政快递',
            label: '邮政快递'
          }, {
            value: '中通快递',
            label: '中通快递'
          }, {
            value: '圆通速递',
            label: '圆通速递'
          }, {
            value: '申通快递',
            label: '申通快递'
          }, {
            value: '韵达快递',
            label: '韵达快递'
          }, {
            value: '京东快递',
            label: '京东快递'
          }, {
            value: '百世快递',
            label: '百世快递'
          }, {
            value: '德邦快递',
            label: '德邦快递'
          }, {
            value: '国通快递',
            label: '国通快递'
          }, {
            value: '天天快递',
            label: '天天快递'
          }, {
            value: '速尔快递',
            label: '速尔快递'
          }, {
            value: '优速快递',
            label: '优速快递'
          }, {
            value: '跨越速运',
            label: '跨越速运'
          }, {
            value: '宅急送',
            label: '宅急送'
          },{
            value: '专车 (物流单号栏位格式：姓名-手机号码)',
            label: '专车 (物流单号栏位格式：姓名-手机号码)'
          }, {
            value: '其他 (物流单号栏位格式：单号-物流方式)',
            label: '其他 (物流单号栏位格式：单号-物流方式)'
          }],
        value: '',
      };
    },
    methods   :{
      closeDialog() {
        this.dialogTableVisibleOfDO = false
      },
      searchReset(){
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done){
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, this.query);
        done();
      },
      selectionChange(list){
        this.selectionList = list;
        this.itemCode      = []
        this.selectionList.forEach(item => {
          this.itemCode.push(item.itemCode)
        })
      },
      selectionClear(){
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
        // 解决表头错位问题
        this.$refs.crud.refreshTable();
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
      onLoad(page, params = {}){
        this.loading = true;
        params.descs  = 'rcv_code'
        doPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data      = res.data.data;
          data.records.forEach(item => {
            if (item.createTimeRecord == null) {
              item.createTimeRecord = item.createTime;
            }
            item.status = this.DO_STATUS[item.status];
          })
          this.page.total = data.total;
          this.data       = data.records;
          this.loading    = false;
          this.selectionClear();
        });
      },
      // 详 情
      doInfo(row){
        this.fullscreenLoading = true
        this.dialogTableVisibleOfDO = true
        this.newtableData = []
        this.rcvCodeOfUpdate = ''
        doDetail(this.pageOfItemInfoOfDO.currentPage, this.pageOfItemInfoOfDO.pageSize, {rcvCode:row.rcvCode}).then(res => {
          const data = res.data.data;
          this.rcvCodeOfUpdate = row.rcvCode;
          this.pageOfItemInfoOfDO = data;
          this.newtableData = data;
          this.isOutCheck = this.newtableData[0].isOutCheck
        }).finally(() => {
          this.fullscreenLoading = false
          this.doUpdateFlag = true
        })
      },
      // 保 存
      doBusiness(){
        if (this.selectionList.length == 0) {
          this.$message.warning("保存时、请至少选择一条送货单!");
          return;
        }

        this.$confirm('此操作将更改选中的送货单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var selectData = JSON.parse(JSON.stringify(this.selectionList))
          var req       = selectData.map(item => {
            return {rcvCode:item.rcvCode,businessCode:item.businessCode,businessName:item.businessName};
          });
          doBusiness(req).then(res => {
            this.$message.success("保存成功!");
            this.refreshChange()
          }).finally(() => {
            this.fullscreenLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });
        });
      },
      // 导 出
      doExport() {
        let rcvCodes =''
        if(this.selectionList.length>0){
          let selData = JSON.parse(JSON.stringify(this.selectionList))
          for (let rowData of selData) {
            rcvCodes = rcvCodes + ',' + rowData.rcvCode;
          }
        }

        let req = {}
        req = {
          "Blade-Auth": this.$store.getters.token,
          "rcvCodes":rcvCodes,
          ...this.query,
        };
        window.open('/api/blade-poreceive/poReceive/export?' + objToUrlParam(req));
      },
    },
  };
</script>

<style scoped lang="scss">
  #boxtitle{
    padding: 15px 0;
    display: inline-block;
  }

  .item-list {
    width: 100%;
    height: 44px;
    list-style: none;
    padding-left: 0px;
    background-color: rgba(245, 245, 245, 1);
    box-sizing: border-box;
    border: 1px solid rgba(228, 228, 228, 1);
    border-right: 0px;
    margin-top: 0px;

    li {
      width: 120px;
      height: 44px;
      float: left;
      line-height: 44px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;

      &:hover {
        cursor: pointer;
      }

      border-right: 1px solid rgba(228, 228, 228, 1);
    }

    .active {
      background-color: #fff;
      color: rgb(0, 121, 254);
    }
  }

  // ------------------ start ------------ //
  /deep/ .el-table__body-wrapper{
    z-index: 2
  }

  /* 改变搜索栏位一行有几个搜做*/
  /deep/ .el-col-md-8 {
    width : 18%
  }

  /deep/ .el-dialog__body{
    padding-bottom: 25px;
  }


  #printOrder{
    width: 100%;
    background-color: white;
  }

  #avue-view{
    background-color: white;
  }

  #boxtitle{
    padding: 15px 0;
    display: inline-block;
  }

  .span{
    margin-left: 25px;
  }

  .btn{
    display: inline-block;
    height: 38px;
    padding: 0 18px;
    border: none;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    margin: 25px 0px;
    border-radius: 5%;
  }

  .add-btn{
    background-color: #048b3d;
    color: white;
  }

  .clear-btn{
    margin-left: 20px;
    border: 1px solid darkgrey;
  }

  #table{
    width: 100%;
    margin-top: 30px;
    text-align: left;
  }

  .select1{
    width: 300px !important;
  }

  .printtable{
    width: 100%;
    font-size: 12px;
    border-collapse: collapse;
    border-top: 1px solid rgba(204, 208, 211, 0.6);
    border-left: 1px solid rgba(204, 208, 211, 0.6);

    ::-webkit-scrollbar{
      width: 10px;
      height: 7px;
      background-color: transparent;
    }
  }

  .printtable tbody{
    display: block;
    max-height: 350px;
    overflow-y: scroll;
  }

  /*设置头与内容自动对齐*/
  .printtable thead, tbody tr{
    display: table;
    width: 100%;
    table-layout: fixed; /**表格列的宽度由表格宽度决定，不由内容决定*/
  }

  /*给滚动条预留宽度*/
  .printtable thead{
    width: calc(100% - 15px);
    background: #FAFAFA;
  }

  .printtable thead tr:nth-child(1){
    color: slategrey;
  }

  .printtable, td, th{
    padding: 5px;
    border-bottom: 1px solid rgba(204, 208, 211, 0.6);
    border-right: 1px solid rgba(204, 208, 211, 0.6);
  }

  /*弹窗样式*/
  .form-control{
    width: 200px;
  }

  #search_btn{
    background-color: #10a66a;
    color: white;
  }

  .el-dialog{
    width: 80%;
  }

  /*//列宽*/
  .checked{
    width: 30px;
  }

  .po{
    width: 10%;
    text-align: center;
  }

  .poln{
    width: 55px;
    text-align: center;
  }

  .itemcode{
    width: 10%;
    text-align: center;
  }

  .itemname{
    text-align: center;
  }

  .rcvnum{
    width: 130px;
    text-align: center;
  }

  .progoodsnum{
    width: 80px;
    text-align: center;
  }

  .tcNum{
    width: 80px;
    text-align: center;
  }

  .notSendNum{
    width: 80px;
    text-align: center;
  }

  .unqualifiednum{
    width: 70px;
    text-align: center;
  }

  .tcuom{
    width: 55px;
    text-align: center;
  }

  .input{
    width: 15%;
    text-align: center;
  }

  .operation{
    width: 50px;
  }

  /deep/ .el-card__body .avue-crud__menu .avue-crud__left .el-button--small, .el-card__body .avue-crud__menu .avue-crud__left .el-button--small.is-round {
    padding: 8px 16px;
  }

  /* 改变搜索栏位一行有几个搜做*/
  /deep/ .el-col-md-8 {
    width : 16%
  }
</style>

