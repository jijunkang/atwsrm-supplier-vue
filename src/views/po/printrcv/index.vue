<template>
  <basic-container id="printOrder">
    <div id="boxtitle">打印送货单</div>
    <!--    <hr>-->
    <div style="margin-bottom:20px">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 @click="addSup()">新增
      </el-button>
      <el-button size="small"
                 icon="el-icon-delete"
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
        <th class="tcuom">送货单位</th>
        <th class="input">炉/批号</th>
        <th class="input">备注</th>
        <th class="operation">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="7" style="color: red;text-align: right;"> 批量输入：</td>
        <td class="input">
          <el-input v-model="batchnumval" size="mini" placeholder="批量输入炉号"
                    @change="changebatchNum()"></el-input>
        </td>
        <td class="input">
          <el-input v-model="remarksval" size="mini" placeholder="批量备注"
                    @change="changeremarks()"></el-input>
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
        <td class="tcuom">{{list.tcUom}}</td>
        <td class="input">
          <el-input v-model="list.heatCode" size="mini"></el-input>
        </td>
        <td class="input">
          <el-input v-model="list.remark" size="mini"></el-input>
        </td>
        <td class="operation">
          <a href="javascript:;" class="el-icon-circle-plus" style="font-size: 16px; color:blue;"
             @click="addrows(index)"></a>
          <a href="javascript:;" class="el-icon-remove"
             style="font-size: 16px; color:red;margin-left: 10px" @click="delrows(index)"></a>
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
          @click="printing()"
          v-loading.fullscreen.lock="fullscreenLoading">打印
      </el-button>
    </div>

    <!--新增弹窗-->
    <el-dialog title="选择订单" width="80%" :visible.sync="dialogTableVisible" append-to-body=false @close="closeDialog" @open="openDialog">
      <avue-crud :option="orderOption"
                 :table-loading="loading"
                 :data="orderList"
                 :page="page"
                 v-model="form"
                 ref="crud"
                 @search-change="searchChange"
                 @search-reset="searchReset"
                 @selection-change="selectionChange"
                 @current-change="currentChange"
                 @size-change="sizeChange"
                 @refresh-change="refreshChange"
                 @on-load="onLoad">
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
    import {getDeliveryList}                from "@/api/poitem/poitem";
    import {poReceive, poReceivePage, page} from "@/api/poreceive/poReceive";
    import {openApiUrl}                     from '@/config/env';
    import {mapGetters}                     from "vuex";

    export default {
        name    :'printrcv',
        data(){
            return {
                isOutCheck : '',
                hidden            :false,
                show              :true,
                checkedAll        :false,
                makeUpchecked     :false,//补打勾选框
                rcvCodeLoading    :false,
                celect            :false,//补打框显隐
                fullscreenLoading :false,
                checked           :[],
                partcelect        :[],
                OrderNumOptions   :[],
                rcvCodeList       :[],
                revceiveCode      :'',
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
                            width     :110,
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
                page              :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                form              :{},
                newtableData      :[],
                arr               :[],
                dialogTableVisible:false,
                messageslice      :[],
                batchnumval       :'',
                remarksval        :'',
                supCode           :'',//供应商编码
                showNew           :false,
                selList           :[],
                selectionList     :[],
            }
        },
        computed:{
            ...mapGetters(["userInfo"]),
        },
        methods :{
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
            // 全部送货
            all(){
                var arr = []
                for(var i = 0; i < this.newtableData.length; i++){
                    this.newtableData[i].rcvNum = this.newtableData[i].proGoodsNum
                }
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
                        item.remark = this.remarksval
                    })
                }else{
                    for(var i = 0; i < this.newtableData.length; i++){
                        this.newtableData[i].remark = this.remarksval
                    }
                }
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
            // 清空
            delall(){
                this.newtableData = []
                localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
            },
            // 全选
            celectall(){
                console.log(this.state)
                if(this.state == true){
                    this.partcelect = true
                }else{
                    this.partcelect = false
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
                  poCode:item.poCode,
                  poLn:item.poLn,
                  orgCode:item.orgCode,
                  piId: item.id,
                  rcvNum: item.rcvNum,
                  heatCode: item.heatCode,
                  itemCode: item.itemCode,
                  remark: item.remark,
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
                    this.fullscreenLoading = true
                    poReceive(req).then((res) => {
                        let rcvCode = res.data.data.rcvCode
                        // console.log("res",res)
                        if(res.data.code == 200){
                            window.open(`${openApiUrl}/openapi/downdopdf?code=` + rcvCode)
                        }
                    }).finally(() => {
                      this.fullscreenLoading = false
                    });
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
            searchChange(params, done){
                this.query            = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params, done);
            },
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            selectionChange(list){
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
                this.selectionList = JSON.parse(JSON.stringify(this.selList));
            },
            selectionClear(){
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            refreshChange(){
                this.page = {"pageSize":10, "currentPage":1, "total":0},
                  this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}, done = () => {}){
                this.loading = true;
                params.status = 20
                getDeliveryList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.orderList  = data.records;
                    this.loading    = false;
                    this.selectionClear();
                    done();
                });
            },
            closeDialog(){
                this.selectionClear();
                for(var i = 0; i < this.newtableData.length; i++){
                    if(this.newtableData[i].null == 1){
                        this.newtableData.splice(i, 1)
                    }
                }
                localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
                var arr           = localStorage.getItem('rev_' + this.supCode)
                this.newtableData = JSON.parse(arr);
            },
            openDialog(){
                this.onLoad(this.page);
            },
            getSelList(){
                for(var m = 0; m < this.newtableData.length; m++){
                    for(var j = 0; j < this.selectionList.length; j++){
                        if(this.selectionList[j].id == this.newtableData[m].id){
                            this.selectionList.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                for(var n = 0; n < this.selectionList.length; n++){
                    this.newtableData.push(this.selectionList[n])
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
                    for(var j = 0; j < this.selectionList.length; j++){
                        if(this.selectionList[j].id == this.newtableData[m].id){
                            this.selectionList.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                for(var n = 0; n < this.selectionList.length; n++){
                    this.newtableData.push(this.selectionList[n])
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
            //补打勾选
            rcvCodeData(){
                let params   = {"rcvCode":''}
                params.descs = 'rcv_code'
                poReceivePage(params).then(res => {
                    // console.log(res.data.data.records,'res')
                    this.OrderNumOptions = res.data.data.records
                });
            },
            makeUp(){
                if(this.makeUpchecked == true){
                    this.celect = true
                    this.rcvCodeData()
                }else{
                    this.celect          = false
                    this.OrderNumOptions = []
                    this.revceiveCode    = ''
                }
            },
            filterMethod(query){
                this.rcvCodeLoading = true;
                let params          = {"rcvCode":query}
                params.descs        = 'rcv_code'
                poReceivePage(params).then(res => {
                    this.OrderNumOptions = res.data.data.records
                });
                this.rcvCodeLoading  = false;
                this.OrderNumOptions = this.OrderNumOptions.filter(item => {
                    return item.rcvCode.toLowerCase()
                      .indexOf(query.toLowerCase()) > -1;
                });
            },
            clearRevceiveCode(){
                this.rcvCodeData()
            },
            getRcvCode(e){
                if(this.revceiveCode != ''){
                    let getRcvCode = {"rcvCode":this.revceiveCode}
                    page(getRcvCode, 1, 1000).then(res => {
                        const data      = res.data.data.records
                        this.newtableData = data.map(item => {
                            return {
                                id    :item.piId,
                              poCode:item.poCode,
                              itemCode:item.itemCode,
                              itemName:item.itemName,
                              proGoodsNum:item.proGoodsNum,
                                rcvNum:item.rcvNum,
                              tcUom:item.tcUom,
                              heatCode:item.heatCode,
                              remark:item.remark,
                              checked:false
                            };
                        });
                        localStorage.setItem('rev_' + this.supCode, JSON.stringify(this.newtableData))
                        var arr           = localStorage.getItem('rev_' + this.supCode)
                        this.newtableData = JSON.parse(arr);
                    })
                }
            }
        },
        created(){
            this.supCode      = this.userInfo.tenant_id
            var arr           = localStorage.getItem('rev_' + this.supCode)
            this.newtableData = JSON.parse(arr);
            this.newtableData.forEach(item => {
                item.checked = false
            })
        },
    }
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
    text-align: center;
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

  .notSendNum{
    width: 130px;
    text-align: center;
  }

  .progoodsnum{
    width: 130px;
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
</style>
