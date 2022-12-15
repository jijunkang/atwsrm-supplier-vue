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
                   @click="doSupply">修 改
        </el-button>
        <el-button type="warning"
                   v-if="false"
                   class="el-button--small"
                   @click="doUpdate">修 改
        </el-button>
        <el-button type="info"
                   size="medium"
                   v-if="false"
                   @click="doCancel">作 废
        </el-button>
      </template>
    </avue-crud>

    <!--查看送货单信息-->
    <el-dialog title="送货单信息如下："  :before-close="closeDialog"  :visible.sync="dialogTableVisibleOfDO" append-to-body=false width="87%">
        <div id="boxtitle">打印送货单</div>
        <!--    <hr>-->
        <div style="margin-bottom:20px">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     v-if="this.doUpdateFlag"
                     @click="addSup()">新增
          </el-button>
          <el-button size="small"
                     icon="el-icon-delete"
                     v-if="this.doUpdateFlag"
                     @click="delall()">清空
          </el-button>
        </div>
        <table class="printtable">
          <thead>
          <tr>
            <th class="checked">
              <el-checkbox v-model="checkedAll" @change="checkAll()"></el-checkbox>
            </th>
            <th class="checked">序号</th>
            <th class="po">订单单号</th>
            <th class="poln">订单行号</th>
            <th class="itemcode">物料编号</th>
            <th class="itemname">物料描述</th>
            <th class="notSendNum">未送货数量</th>
            <th class="progoodsnum">未到货数量</th>
            <th class="rcvnum">送货数量</th>
            <th class="unqualifiednum" v-if="this.isOutCheck == '1'">不合格数量</th>
            <th class="tcuom">送货单位</th>
            <th class="input">炉/批号</th>
            <th class="input">备注</th>
            <th class="operation" >操作</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td colspan="7" style="color: red;text-align: right"> 批量输入：</td>
            <td class="input">
              <el-input v-model="batchnumval" size="mini" placeholder="批量输入炉号" @change="changebatchNum()"></el-input>
            </td>
            <td class="input">
              <el-input v-model="remarksval" size="mini" placeholder="批量备注" @change="changeremarks()"></el-input>
            </td>
            <td class="operation"></td>
          </tr>
          <tr v-for="(list,index) in newtableData" v-model="show">
            <td class="checked">
              <el-checkbox v-model="list.checked" @change="checkOne(list.checked)"></el-checkbox>
            </td>
            <th class="checked">{{index+1}}</th>
            <td class="po">{{list.poCode}}</td>
            <td class="poln">{{list.poLn}}</td>
            <td class="itemcode">{{list.itemCode}}</td>
            <td class="itemname">{{list.itemName}}</td>
            <td class="notSendNum">{{list.notSendNum}}</td>
            <td class="progoodsnum">{{list.proGoodsNum}}</td>
            <td class="rcvnum">
              <el-input-number v-model="list.rcvNum" size="mini"></el-input-number>
            </td>
            <td class="unqualifiednum" v-if="list.isOutCheck == '1'">{{list.unqualifiedNum}}</td>
            <td class="tcuom">{{list.tcUom}}</td>
            <td class="input">
              <el-input v-model="list.heatCode" size="mini"></el-input>
            </td>
            <td class="input">
              <el-input v-model="list.doRemark" size="mini"></el-input>
            </td>
            <td class="operation" >
              <a href="javascript:;" class="el-icon-circle-plus" style="font-size: 16px; color:blue;"
                 @click="addrows(index)" v-if="doUpdateFlag"></a>
              <a href="javascript:;" class="el-icon-remove"
                 style="font-size: 16px; color:red;margin-left: 10px" @click="delrows(index)" v-if="doUpdateFlag"></a>
            </td>
          </tr>
          </tbody>
        </table>
        <div id="table">
          <el-button
                  type="primary"
                  size="small"
                  @click="all()">全部送货
          </el-button>
          <el-button
                  type="primary"
                  size="small"
                  @click="printing()">补打
          </el-button>
        </div>
    </el-dialog>

    <!--新增弹窗-->
    <el-dialog title="选择订单" width="87%" :visible.sync="dialogTableVisible" append-to-body=false @close="closeDialogOfOrder" @open="openDialogOfOrder">
      <avue-crud :option="orderOption"
                 :table-loading="loading"
                 :data="orderList"
                 :page="pageOfOrder"
                 v-model="formOfOrder"
                 ref="crudOfOrder"
                 @search-change="searchChangeOfOrder"
                 @search-reset="searchResetOfOrder"
                 @selection-change="selectionChangeOfOrder"
                 @current-change="currentChangeOfOrder"
                 @size-change="sizeChangeOfOrder"
                 @refresh-change="refreshChangeOfOrder"
                 @on-load="onLoadOfOrder">
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
      </avue-crud>
    </el-dialog>

  </basic-container>
</template>

<script>
  import {poReceive,poReceiveUpdate, poReceivePage, doPage, doDetail, doCancel} from "@/api/poreceive/poReceive";
  import {getDeliveryList}                from "@/api/poitem/poitem";
  import {openApiUrl}                     from '@/config/env';
  import {mapGetters}                     from "vuex";

  export default {
    data(){
      return {
        isOutCheck        : '',
        supCodeOfUpdate   :'',
        rcvCodeOfUpdate   :'',
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
              search    :true,
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
              width:250,
              sortable:true,
            },
            {  label   :"创建方",
              prop    :"creater",
              align   :'left',
              width:250,
              sortable:true,
            },
            {  label   :"更新时间",
              prop    :"updateTime",
              align   :'left',
              width:250,
              sortable:true,
            },
            {  label   :"更新方",
              prop    :"updater",
              align   :'left',
              width:250,
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
          ]
        },
        orderOption       :{//正式
          menu          :false,
          tip           :false,
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
          labelWidth    :200,
          searchMenuSpan:6,
          column        :[
            {
              label           :"订单号",
              prop            :"poCode",
              search          :true,
              searchSpan      :6,
              sortable        :true,
              searchLabelWidth:90,
              width           :120,
              align           :'center',
            }, {
              label:"订单行号",
              prop :"poLn",
              width:85,
              align:'center',
            },
            {
              label     :"料号",
              prop      :"itemCode",
              align     :'left',
              type      :"input",
              width     :110,
              search    :true,
              searchSpan:6,
              sortable  :true,
              search    :true,
              searchSpan:8,
              searchLabelWidth:120,
            },
            {
              label     :"物料描述",
              prop      :"itemName",
              align     :'left',
              type      :"input",
              width     :170,
              overHidden:true,
              search    :true,
              searchSpan:6,
              sortable  :true,
              search    :true,
              searchSpan:8,
              searchLabelWidth:120,
            },
            {
              label   :"采购单位",
              prop    :"tcUom",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
            }, {
              label   :"采购数量",
              prop    :"priceNum",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
            },
            {
              label   :"到货数量",
              prop    :"rcvGoodsNum",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
            },
            {
              label   :"实收数量",
              prop    :"arvGoodsNum",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
            },
            {
              label     :"未送货数量",
              prop      :"notSendNum",
              align     :'center',
              type      :"input",
              overHidden:true,
            },
            {
              label   :"未到货数量",
              prop    :"proGoodsNum",
              align   :'center',
              type    :"input",
              width   :110,
              sortable:true,
            },
            {
              label   :"退补数量",
              prop    :"fillGoodsNum",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
            },
            {
              label   :"生产单号",
              prop    :"moNo",
              align   :'center',
              type    :"input",
              width   :85,
              sortable:true,
              search    :true,
              searchSpan:6,
            },
            {
              label     :"炉批号",
              prop      :"furnaceNo",
              align     :'left',
              type      :"input",
              width     :80,
              overHidden:true,
            }, {
              label      :"要求交期",
              width      :85,
              prop       :"reqDate",
              align      :'center',
              sortable   :true,
              type       :"datetime",
              format     :"yyyy-MM-dd",
              valueFormat:"yyyy-MM-dd",
              formatter  :function(row, value, label, column){
                return value = value > 0 ? value * 1000 : ''
              },
            }, {
              label      :"可供货交期",
              width      :90,
              prop       :"supConfirmDate",
              align      :'center',
              sortable   :true,
              type       :"datetime",
              format     :"yyyy-MM-dd",
              valueFormat:"yyyy-MM-dd",
              formatter  :function(row, value, label, column){
                return value = value > 0 ? value * 1000 : ''
              },
            }, {
              label      :"修改后的交期",
              width      :110,
              prop       :"supUpdateDate",
              align      :'center',
              sortable   :true,
              type       :"datetime",
              format     :"yyyy-MM-dd",
              valueFormat:"yyyy-MM-dd",
              formatter  :function(row, value, label, column){
                return value = value > 0 ? value * 1000 : ''
              },
            },
          ]
        },//新增
        loading           :false,
        orderList         :[],
      };
    },
    methods   :{
      all(){
        var arr = []
        for(var i = 0; i < this.newtableData.length; i++){
          this.newtableData[i].rcvNum = this.newtableData[i].proGoodsNum
        }
      },
      //打印（数据存储本地）
      printing(){
        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
        var printData = JSON.parse(localStorage.getItem('rev_' + this.supCode))

        let doUnique = []
        for (let rowData of printData) {
          if (rowData.price <= 0.010000001 &&  rowData.price >= 0.00000001 && rowData.isPersent !='1') {
            return this.$message.warning(rowData.poCode + "：该订单价格未定义，请联系下单员：" + rowData.purchName);
          }
          if (rowData.rcvNum <= 0) {
            return this.$message.warning(rowData.poCode + "：该订单送货数量不可以小于等于 0 !");
          }

          let unikey = rowData.id+ rowData.heatCode;
          if (doUnique.indexOf(unikey)>-1) {
            return this.$message.warning(rowData.poCode + '-' +  rowData.itemCode + '-' + rowData.heatCode + "：同一订单行 + 同一炉号，不允许多行打印。");
          } else {
            doUnique.push(unikey);
          }
        }
        var req = printData.map(item => {
          return {
            rcvCode: this.rcvCodeOfUpdate,
            isOutCheck: this.isOutCheck,
            piId: item.id,
            rcvNum: item.rcvNum,
            heatCode: item.heatCode,
            itemCode: item.itemCode,
            remark: item.doRemark,
            itemName: item.itemName,
            supName: item.supName,
            templateType: item.templateType
          };
        });
        if(req == ''){
          this.$message({
            type   :"warning",
            message:"请选择数据!"
          });
        }else{
          poReceiveUpdate(req).then((res) => {
            let rcvCode = res.data.data.rcvCode
            // console.log("res",res)
            if(res.data.code == 200){
              window.open(`${openApiUrl}/openapi/downdopdf?code=` + rcvCode)
            }
            this.doSupply('reload');
          })
        }
      },
      closeDialog() {
        this.dialogTableVisibleOfDO = false
        this.onLoad(this.page, this.query);
      },
      closeDialogOfOrder() {
        this.dialogTableVisible = false
      },
      openDialogOfOrder(){
        this.onLoadOfOrder(this.pageOfOrder);
      },
      //全选
      checkAll(){
        this.newtableData.forEach(item => {
          item.checked = this.checkedAll
        })
      },
      checkOne(checked, index){
        var checkedT = []
        for(var i = 0; i < this.newtableData.length; i++){
          if(this.newtableData[i].checked == true){
            checkedT.push(this.newtableData[i])
          }
        }
        if(checkedT.length == this.newtableData.length){
          this.checkedAll = true
        }else{
          this.checkedAll = false
        }
        console.log("checkOne", this.newtableData)
      },
      getSelList(){
        for(var m = 0; m < this.newtableData.length; m++){
          for(var j = 0; j < this.selectionListOfOrder.length; j++){
            if(this.selectionListOfOrder[j].id == this.newtableData[m].id){
              this.selectionListOfOrder.splice(j, 1);
              j = j - 1;
            }
          }
        }
        for(var n = 0; n < this.selectionListOfOrder.length; n++){
          this.newtableData.push(this.selectionListOfOrder[n])
        }
        for(var i = 0; i < this.newtableData.length; i++){
          if(this.newtableData[i].null == 1){
            this.newtableData.splice(i, 1)
          }
        }
        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
        var arr           = localStorage.getItem('rev_' + this.supCode)
        this.newtableData = JSON.parse(arr);
        console.log("newtableData", this.newtableData)
        this.dialogTableVisible = false;
      },
      getSelContinue(){
        for(var m = 0; m < this.newtableData.length; m++){
          for(var j = 0; j < this.selectionListOfOrder.length; j++){
            if(this.selectionListOfOrder[j].id == this.newtableData[m].id){
              this.selectionListOfOrder.splice(j, 1);
              j = j - 1;
            }
          }
        }
        for(var n = 0; n < this.selectionListOfOrder.length; n++){
          this.newtableData.push(this.selectionListOfOrder[n])
        }
        for(var i = 0; i < this.newtableData.length; i++){
          if(this.newtableData[i].null == 1){
            this.newtableData.splice(i, 1)
          }
        }
        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
        var arr           = localStorage.getItem('rev_' + this.supCode)
        this.newtableData = JSON.parse(arr);
        this.selectionClear();
      },
      // 统一输入
      changebatchNum(){
        console.log("batchNum", this.newtableData)
        var checkedT = []
        for(var i = 0; i < this.newtableData.length; i++){
          if(this.newtableData[i].checked == true){
            checkedT.push(this.newtableData[i])
          }
        }
        if(checkedT.length != 0){
          checkedT.forEach((item) => {
            item.heatCode = this.batchnumval
          })
        }else{
          for(var i = 0; i < this.newtableData.length; i++){
            this.newtableData[i].heatCode = this.batchnumval
          }
        }
      },
      changeremarks(){
        console.log("remarks", this.newtableData)
        var checkedT = []
        for(var i = 0; i < this.newtableData.length; i++){
          if(this.newtableData[i].checked == true){
            checkedT.push(this.newtableData[i])
          }
        }
        if(checkedT.length != 0){
          checkedT.forEach((item) => {
            item.doRemark = this.remarksval
          })
        }else{
          for(var i = 0; i < this.newtableData.length; i++){
            this.newtableData[i].doRemark = this.remarksval
          }
        }
      },
      //新增
      addSup(){
        if(this.newtableData == '' || this.newtableData == undefined){
          this.newtableData = [{"null":1}]
        }
        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
        this.dialogTableVisible = true
      },
      // 清空
      delall(){
        this.newtableData = []
        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
      },
      // 添加行
      addrows(index){
        this.newtableData.splice(index + 1, 0, {
          id         :this.newtableData[index].id,
          poCode     :this.newtableData[index].poCode,
          itemCode   :this.newtableData[index].itemCode,
          itemName   :this.newtableData[index].itemName,
          proGoodsNum:this.newtableData[index].proGoodsNum,
          rcvNum     :this.newtableData[index].rcvNum,
          tcUom      :this.newtableData[index].tcUom,
          heatCode   :this.newtableData[index].heatCode,
          notSendNum :this.newtableData[index].notSendNum,
          supCode   :this.newtableData[index].supCode,
          supName   :this.newtableData[index].supName,
          templateType : this.newtableData[index].templateType,
          remark     :'',
          operation  :'',
          checked    :false,
        })
      },
      // 删除行
      delrows(index){
        this.newtableData.splice(index, 1)
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
        params.statuss  = '20,25'
        doPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data      = res.data.data;
          data.records.forEach(item => {
            if (item.createTimeRecord == null) {
              item.createTimeRecord = item.createTime;
            }
          })
          this.page.total = data.total;
          this.data       = data.records;
          this.loading    = false;
          this.selectionClear();
        });
      },

      searchResetOfOrder(){
        this.query = {};
        this.onLoadOfOrder(this.pageOfOrder);
      },
      searchChangeOfOrder(params, done){
        this.query = params;
        this.pageOfOrder.currentPage = 1;
        this.onLoadOfOrder(this.pageOfOrder, this.query);
        done();
      },
      selectionChangeOfOrder(list){
        list.forEach(item => {
          item.heatCode = item.furnaceNo
          item.remark   = ''
          item.checked  = false
          item.rcvNum   = item.proGoodsNum
        })
        this.dataList = JSON.parse(JSON.stringify(list));//数组对象
        this.selList  = [];
        this.dataList.forEach(item => {//{}
          if(item.heatCode.indexOf("#") != -1){//存在#
            let arr1 = item.heatCode.split("||")//拆|| ['40#asd','50#qwe']
            let arr2 = arr1.map(v => {
              let sp = v.split("#")////拆# ['40','asd'] ['50','qwe']
              return {
                ...item,
                rcvNum  :sp[0],
                heatCode:sp[1],
              };
            })
            arr2.forEach(inner => {
              this.selList.push(inner);
            })
          }else{//不存在# 不用拆
            this.selList.push(item);
          }
        })
        this.selectionListOfOrder = JSON.parse(JSON.stringify(this.selList));
      },
      selectionClearOfOrder(){
        this.selectionListOfOrder = [];
        this.$refs.crudOfOrder.toggleSelection();
        // 解决表头错位问题
        this.$refs.crudOfOrder.refreshTable();
      },
      currentChangeOfOrder(currentPage){
        this.pageOfOrder.currentPage = currentPage;
      },
      sizeChangeOfOrder(pageSize){
        this.pageOfOrder.pageSize = pageSize;
      },
      refreshChangeOfOrder(){
        this.onLoadOfOrder(this.pageOfOrder, this.query);
      },
      onLoadOfOrder(pageOfOrder, params = {}, done = () => {}){
        this.loading = true;
        getDeliveryList(pageOfOrder.currentPage, pageOfOrder.pageSize, Object.assign(params, this.query)).then(res => {
          const data      = res.data.data;
          this.pageOfOrder.total = data.total;
          this.orderList  = data.records;
          this.loading    = false;
          this.selectionClear();
          done();
        });
      },

      //补打
      doSupply(type){
        if (this.selectionList.length != 1 && type!='reload') {
          this.$message.warning("补打时、必须选择一条送货单!");
          return;
        }
        this.fullscreenLoading = true
        this.dialogTableVisibleOfDO = true
        this.newtableData = []
        let rcvCodeReq = this.rcvCodeOfUpdate;
        if(this.selectionList.length > 0) {
          rcvCodeReq = this.selectionList[0].rcvCode
          this.rcvCodeOfUpdate=''
        }
        doDetail(this.pageOfItemInfoOfDO.currentPage, this.pageOfItemInfoOfDO.pageSize, {rcvCode:rcvCodeReq}).then(res => {
          this.rcvCodeOfUpdate = rcvCodeReq;
          const data = res.data.data;
          this.pageOfItemInfoOfDO = data;
          this.newtableData = data;
          this.isOutCheck = this.newtableData[0].isOutCheck
        }).finally(() => {
          this.fullscreenLoading = false
          this.doUpdateFlag = true
        })
      },
      //修改
      doUpdate(){
        if (this.selectionList.length != 1) {
          this.$message.warning("修改时、必须选择一条送货单!");
          return;
        }
        this.fullscreenLoading = true
        this.dialogTableVisibleOfDO = true
        this.rcvCodeOfUpdate=''
        this.newtableData = []
        doDetail(this.pageOfItemInfoOfDO.currentPage, this.pageOfItemInfoOfDO.pageSize, {rcvCode:this.selectionList[0].rcvCode}).then(res => {
          this.rcvCodeOfUpdate = this.selectionList[0].rcvCode;
          const data = res.data.data;
          this.pageOfItemInfoOfDO = data;
          this.newtableData = data;
          this.isOutCheck = this.newtableData[0].isOutCheck
        }).finally(() => {
          this.fullscreenLoading = false
          this.doUpdateFlag = false
        })
      },
      //作废
      doCancel(){
        if (this.selectionList.length == 0) {
          this.$message.warning("作废时、请至少选择一条送货单!");
          return;
        }

        this.$confirm('此操作将作废选中的送货单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          var selectData = JSON.parse(JSON.stringify(this.selectionList))
          var req       = selectData.map(item => {
            return {rcvCode:item.rcvCode};
          });
          doCancel(req).then(res => {
            this.$message.success("作废成功!");
            this.refreshChange()
          }).finally(() => {
            this.fullscreenLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          });
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  #printOrder{
    width: 100%;
    background-color: white;
  }

  #avue-view{
    background-color: white;
  }

  #boxtitle{
    padding: 15px 0;
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
    text-align: center;
  }

  .tablebtn{
    display: inline;
    height: 38px;
    padding: 0 18px;
    border: none;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    background-color: #048b3d;
    color: white;
    margin-right: 15px;
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
    width: calc(100% - 13px);
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
    text-align:center;
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
    width: 230px;
    text-align: center;
  }

  .unqualifiednum{
    text-align: center;
  }

  .rcvnum{
    width: 130px;
    text-align: center;
  }

  .notSendNum{
    text-align: center;
  }

  .progoodsnum{
    text-align: center;
  }

  .tcuom{
    width: 55px;
  }

  .input{
    width: 15%;
  }

  .operation{
    width: 55px;
  }
  /* 改变搜索栏位一行有几个搜做*/
  /deep/ .el-col-md-8 {
    width : 18%
  }
  ::-webkit-scrollbar {
    width: 13px !important;
    height: 13px !important;
  }

  /deep/.el-table--scrollable-y {
    .el-table__body-wrapper::-webkit-scrollbar {
      width: 9px;
      height:9px;
    }
    .gutter {
      width: 13px !important;
    }
  }
  /deep/ .el-card__body .avue-crud__menu .avue-crud__left .el-button--small, .el-card__body .avue-crud__menu .avue-crud__left .el-button--small.is-round {
    padding: 8px 16px;
  }
</style>

