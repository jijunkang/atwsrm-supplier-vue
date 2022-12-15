<template>
  <basic-container>
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
        <!--        <el-button type="primary"-->
        <!--                   size="mini"-->
        <!--                   icon="el-icon-check"-->
        <!--                   @click="submitQuote">提交报价-->
        <!--        </el-button>-->
        <el-button type="primary"
                   size="mini"
                   @click="downAllDwg()">批量下载图纸
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="downAllProcess()">批量下载上一道工序图纸
        </el-button>
      </template>
      <template slot="prDate" slot-scope="scope">
        <span>{{ new Date(scope.row.prDate*1000)|dateFormat}}</span>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="mini" @click="quotePri(scope.row)">确认接单</el-button>
        <el-button type="text" size="mini" @click="refuse(scope.row)" v-if="scope.row.inquiryWay!='price_lib'">拒绝接单</el-button>
      </template>
      <!--  物料编号-->
      <template slot-scope="scope" slot="itemCode">
        <el-button type="text" size="mini"
                   @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
        </el-button>
      </template>
      <!--      工序编号-->
      <template slot-scope="scope" slot="processCode">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList">{{item.processCode}}</li>
        </ul>
      </template>
      <!--      工序名称-->
      <template slot-scope="scope" slot="processName">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList ">{{item.processName}}</li>
        </ul>
      </template>
      <!--      工序单价-->
      <template slot-scope="scope" slot="workPrice">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList">{{$moneyUtils.formatMoney(item.price)}}</li>
        </ul>
      </template>
      <!--      工序准备工时费用-->
      <template slot-scope="scope" slot="firstSetupCostList">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList ">{{$moneyUtils.formatMoney(item.firstSetupCost)}}</li>
        </ul>
      </template>
      <!--      首件准备工时费用-->
      <template slot-scope="scope" slot="firstSetupCost">
        {{$moneyUtils.formatMoney(scope.row.firstSetupCost)}}
      </template>
      <!--      材料费-->
      <template slot-scope="scope" slot="materialCost">
        {{$moneyUtils.formatMoney(scope.row.materialCost)}}
      </template>
      <!--      物料总价-->
      <template slot-scope="scope" slot="total">
        {{$moneyUtils.formatMoney(scope.row.total)}}
      </template>

      <!--      设备型号-->
      <template slot-scope="scope" slot="machineModel">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList">{{item.machineModel}}</li>
        </ul>
      </template>
      <!--      设备品牌-->
      <template slot-scope="scope" slot="machineBrand">
        <ul class="ul">
          <li v-for="item in scope.row.processPriceList ">{{item.machineBrand}}</li>
        </ul>
      </template>
    </avue-crud>
    <!--物料编码-->
    <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>
    <!--    接单-->
    <el-drawer
        title="接单"
        :visible.sync="drawer_confirm"
        size='600px'
        @close="closeDrawer">
      <div id="content" style="width: 100%;height: 90%;overflow: hidden;overflow: scroll">
        <avue-detail :option="confirmDetail" v-model="confirmDetailForm" id="confirmDetail"></avue-detail>
        <avue-form :option="confirmOption"
                   v-model="formConfirm"
                   ref="editform">
          <template slot="menuForm">
            <el-button type="primary" @click="handleData">提 交</el-button>
            <el-button @click="handleEmpty">清 空</el-button>
          </template>
        </avue-form>
      </div>
    </el-drawer>
    <!-- 拒绝接单-->
    <el-drawer
        title="拒绝接单"
        :visible.sync="drawer_refuse"
        size='600px'
        @close="closeDrawer_refuse">
      <div style="margin-top:50px">
        <avue-form :option="refuseOption"
                   v-model="formRefuse"
                   ref="formRefuse">
          <template slot="menuForm">
            <el-button type="primary" @click="handleData_refuse">提 交</el-button>
            <el-button @click="handleEmpty_refuse">清 空</el-button>
          </template>
        </avue-form>
      </div>
    </el-drawer>
  </basic-container>
</template>

<script>
    import {getList, accept, unaccept, OUTPREORDER_STATUS} from "@/api/outpr/outpr";
    import {getItemdDwg, getItemProcess}                   from "@/api/item/item"
    import {mapGetters}                                    from "vuex";
    import {dateFormat}                                    from '@/util/date';
    import itemCode                                        from '../item/item-code'
    import {formatMoney}                                   from '@/util/money';

    export default {
        components:{itemCode},
        data(){
            return {
                form              :{},
                formConfirm       :{},
                confirmDetailForm :{},
                formRefuse        :{},
                query             :{
                    status:OUTPREORDER_STATUS.WAIT_ACCEPT,
                },
                itemform          :{},
                loading           :true,
                fullscreenLoading :false,//页面整加载
                dialogTableVisible:false,//审核
                drawer_confirm    :false,//报价
                drawer_refuse     :false,
                preCheck          :false,
                detailData        :{},
                page              :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                selectionList     :[],
                option            :{
                    height        :350,
                    // calcHeight: '',
                    tip           :true,
                    border        :true,
                    index         :false,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    selection     :true, //行可勾选
                    selectable    :(row, index) => {
                        return row;
                    },
                    size          :'mini',
                    dialogType    :'drawer',
                    dialogWidth   :'800px',
                    labelWidth    :'200px',
                    menuWidth     :145,
                    searchMenuSpan:6,
                    column        :[
                        {
                            label   :"物料编号",
                            width   :110,
                            prop    :"itemCode",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                        },
                        {
                            label     :"物料名称",
                            prop      :"itemName",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                        },
                        {
                            label   :"工序编号",
                            width   :85,
                            prop    :"processCode",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"工序名称",
                            width   :85,
                            prop    :"processName",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"工序单价",
                            width   :85,
                            prop    :"workPrice",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"工序准备工时费用",
                            width   :125,
                            prop    :"firstSetupCostList",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"首件准备工时费用",
                            width   :125,
                            prop    :"firstSetupCost",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            hide    :true,
                            slot    :true,
                        },
                        {
                            label   :"材料费",
                            width   :70,
                            prop    :"materialCost",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                        },
                        {
                            label   :"含税单价",
                            width   :80,
                            prop    :"price",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            formatter(row, value){
                                value = ((row.materialCost + row.price) * row.priceNum + row.firstSetupCost) / row.priceNum
                                return formatMoney(value)
                            }
                        },
                        {
                            label   :"数量",
                            width   :60,
                            prop    :"priceNum",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                        },
                        {
                            label   :"计价单位",
                            width   :85,
                            prop    :"priceUom",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                            dicUrl  :"/api/blade-system/dict-biz/dictionary?code=item_uom",
                            props   :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            hide    :true,
                        },
                        {
                            label   :"交易单位",
                            width   :85,
                            prop    :"tcUom",
                            align   :'center',
                            sortable:true,
                            type    :"input",
                            dicUrl  :"/api/blade-system/dict-biz/dictionary?code=item_uom",
                            props   :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                        },
                        {
                            label   :"物料总价",
                            width   :85,
                            prop    :"total",
                            align   :'right',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                        },
                        {
                            label      :"生单日期",
                            width      :110,
                            prop       :"prDate",
                            align      :'center',
                            sortable   :true,
                            search     :true,
                            searchSpan :6,
                            type       :"date",
                            searchRange:true,
                            format     :"yyyy-MM-dd",
                            valueFormat:"timestamp",
                            slot       :true,
                            hide       :true,
                        },
                        {
                            label      :"回复截止日期",
                            width      :110,
                            prop       :"rcvEndtime",
                            align      :'center',
                            sortable   :true,
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            hide       :true,
                        },
                        {
                            label      :"要求交期",
                            width      :85,
                            prop       :"reqDate",
                            align      :'center',
                            sortable   :true,
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            hide:true
                        },
                        {
                            label      :"承诺交期",
                            width      :85,
                            prop       :"supDeliveryTime",
                            align      :'center',
                            sortable   :true,
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                             hide:true
                        },
                        {
                            label   :"设备型号",
                            width   :85,
                            prop    :"machineModel",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"设备品牌",
                            width   :85,
                            prop    :"machineBrand",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            slot    :true,
                            hide    :true,
                        },
                        {
                            label   :"备注",
                            width   :100,
                            prop    :"remark",
                            align   :'center',
                            sortable:true,
                            hide    :true,
                        },
                        {
                            label        :"状态",
                            width        :100,
                            prop         :"status",
                            align        :'center',
                            sortable     :true,
                            search       :true,
                            searchValue:`${OUTPREORDER_STATUS.WAIT_ACCEPT}`,
                            searchSpan   :6,
                            type         :"select",
                            dicUrl       :'/api/blade-system/dict-biz/dictionary?code=outpreorder_status',
                            props        :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            formatter    :function(row, value, label, column){
                                return value ? value.toString() : '';
                            },
                        },
                    ]
                },
                confirmDetail     :{
                    column:[
                        {
                            label:"物料编号",
                            prop :"itemCode",
                            type :"input",
                            span :24,
                        },
                        {
                            label:"物料描述",
                            prop :"itemName",
                            type :"input",
                            span :24,
                        },
                        // {
                        //     label      :"要求交期",
                        //     prop       :"reqDate",
                        //     formatter  :function(row, value, label, column){
                        //         return value = value > 0 ? value * 1000 : ''
                        //     },
                        //     type       :"datetime",
                        //     format     :"yyyy-MM-dd",
                        //     valueFormat:"yyyy-MM-dd",
                        //     span       :12,
                        //     hide:true
                        // },
                        {
                            label:"需求数量",
                            prop :"priceNum",
                            type :"input",
                            span :12,
                        },
                    ]
                },
                confirmOption     :{
                    emptyBtn  :false,
                    submitBtn :false,
                    labelWidth:110,
                    column    :[
                        {
                            label        :"承诺交期",
                            prop         :"supDeliveryTime",
                            span         :24,
                            display      :true,
                            type         :"date",
                            pickerOptions:{
                                disabledDate(time){
                                    return time.getTime() < Date.now() - 8.64e7;
                                }
                            },
                            format       :"yyyy-MM-dd",
                            valueFormat  :"timestamp",
                            rules        :[
                                {
                                    required:true,
                                    message :"选择承诺交期",
                                    trigger :"change"
                                }
                            ]
                        }, {
                            label  :"备注",
                            prop   :"remark",
                            type   :"textarea",
                            span   :24,
                            display:true,
                        }
                    ]
                },
                refuseOption      :{
                    emptyBtn  :false,
                    submitBtn :false,
                    labelWidth:110,
                    column    :[
                        {
                            label  :"备注",
                            prop   :"remark",
                            type   :"textarea",
                            span   :24,
                            display:true,
                        }
                    ]
                },
                idList            :[],
                itemCode          :[],
                data              :[]
            };
        },
        computed  :{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.u9_pr_add, false),
                    viewBtn:this.vaildData(this.permission.u9_pr_view, false),
                    delBtn :this.vaildData(this.permission.u9_pr_delete, false),
                    editBtn:this.vaildData(this.permissformslotu9_pr_edit, false)
                };
            },
            ids(){
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods   :{
            handleAdd(){
                this.$refs.crud.rowAdd();
            },
            handleView(row, index){
                this.dialogFormVisible = true
                getDetail(row.id).then(res => {
                    this.detailData = res.data.data
                });
                // this.$refs.crud.rowAdd(row, index);
            },
            handleEdit(row, index){
                this.$refs.crud.rowEdit(row, index);
            },
            handleDel(row, index){
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(row.id);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                  });
            },
            rowSave(row, loading, done){
                add(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowUpdate(row, index, loading, done){
                update(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowDel(row){
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(row.id);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                  });
            },
            handleDelete(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(this.ids);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                      this.$refs.crud.toggleSelection();
                  });
            },
            beforeOpen(done, type){
                if(["edit", "view"].includes(type)){
                    getDetail(this.form.id).then(res => {
                        this.form = res.data.data;
                    });
                }
                done();
            },
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                done();
                if (!params.prDate) {
                    params.prDateStart = ''
                    params.prDateEnd = ''
                }
                if (params.prDate) {
                    if (params.prDate.length > 1) {
                        params.prDateStart = parseInt(params.prDate[0] / 1000)
                        params.prDateEnd = parseInt(params.prDate[1] / 1000 + (24 * 60 * 60) - 1)
                    }
                }
                this.query = Object.assign({}, params);
                delete this.query.prDate
                this.page.currentPage = 1;
                this.onLoad(this.page, this.query);
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

            handleItemCode(row){
                this.dialogTableVisible = true
                this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
            },

            closedialog(){
                this.dialogTableVisible = false
            },
            onLoad(page, params = {}){
                this.loading = true;
                params.ascs  = 'status'
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },

            //批量下载图纸
            downAllDwg(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.itemCode.toString()
                getItemdDwg({"itemCode":itemCodeList}).then(data => {
                    window.open(data.result.url)
                });
            },
            downAllProcess(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                var itemCodeList = this.itemCode.toString()
                getItemProcess({"itemCode":itemCodeList}).then((data) => {
                    window.open(data.result.url)
                })
            },
            //确认接单
            quotePri(row){
                this.drawer_confirm = true,
                  this.idList = row.id
                this.confirmDetailForm = row
                // console.log(this.idList)
            },
            //批量提交
            submitQuote(){
                this.idList = []
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                for(var i = 0; i < this.selectionList.length; i++){
                    this.idList.push(this.selectionList[i].id)
                }
                this.drawer_confirm = true
                // console.log(this.idList)
            },
            //提交确认接单
            handleData(formConfirm, done){
                // if(this.formConfirm.supDeliveryTime <= 0 ||this.formConfirm.supDeliveryTime ==''){
                //   this.$message.warning("请选择承诺交期");
                //   return;
                // }
                this.$refs.editform.validate((v) => {
                    if(v){
                        var supTime            = this.formConfirm.supDeliveryTime
                        var time               = supTime / 1000
                        this.fullscreenLoading = true
                        accept({"id":this.idList, "supDeliveryTime":time, "remark":this.formConfirm.remark}).then(() => {
                            this.$message({
                                type   :"success",
                                message:"操作成功!"
                            });
                            this.drawer_confirm = false
                            this.onLoad(this.page);
                        }).finally(() => {
                            this.fullscreenLoading = false
                        })
                    }
                })
            },
            handleEmpty(){
                this.$refs.editform.resetForm()
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                });
            },
            closeDrawer(){
                this.$refs.editform.resetForm()
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                });
            },
            //拒绝接单
            refuse(row){
                this.drawer_refuse = true,
                  this.idList = row.id
            },
            handleData_refuse(){
                this.fullscreenLoading = true
                unaccept({"id":this.idList, "remark":this.formRefuse.remark}).then(() => {
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                    this.drawer_refuse = false
                    this.onLoad(this.page);
                    this.$refs.formRefuse.resetForm()
                    this.$nextTick(() => {
                        this.$refs.formRefuse.clearValidate()
                    });
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            handleEmpty_refuse(){
                this.$refs.formRefuse.resetForm()
                this.$nextTick(() => {
                    this.$refs.formRefuse.clearValidate()
                });
            },
            closeDrawer_refuse(){
                this.$refs.formRefuse.resetForm()
                this.$nextTick(() => {
                    this.$refs.formRefuse.clearValidate()
                });
            },

        },
        filters   :{
            dateFormat:function(value){
                var fmt = 'yyyy-MM-dd';
                return dateFormat(value, fmt)
            }
        }
    };
</script>

<style scoped>
  .ul{
    list-style           :none;
    padding-inline-start :0px;
  }

  #confirmDetail /deep/ .avue-detail__label{
    min-width :110px;
  }
</style>
