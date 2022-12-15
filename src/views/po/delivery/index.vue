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
               :row-style="rowStyle"
               v-loading.fullscreen.lock="fullscreenLoading">
      <template slot="menuLeft">
        <ul class="item-list">
          <li :class="{active:buttonKey==item.key }"
              v-for="(item,index) in statisticsData" @click="getKeys(item.key)">
            {{item.title}}
          </li>
        </ul>
        <el-button type="primary"
                   size="mini"
                   @click="ReviseDate()"
                   v-show="false">修改交期
        </el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="handleExcelM"
                   v-if="this.buttonKey==='materialdev'">导 出
        </el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="handleExcelP"
                   v-if="this.buttonKey==='procardctrl'">导 出
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="maintainNode"
                   v-if="this.buttonKey==='procardctrl'">维护节点
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="handleSave"
                   v-if="this.buttonKey==='procardctrl'">保 存
        </el-button>
        <!--                <el-button type="primary"-->
        <!--                           size="mini"-->
        <!--                           @click="handleExcel">导 入Excel-->
        <!--                </el-button>-->
        <!--                <p style="color: red ;font-size: 11px;display: inline;margin-left: 10px">注：导入Excel仅能修改交期。日期格式为：2018-08-08</p>-->
      </template>
      <!--卡控序号-->
      <template slot-scope="scope" slot="sort">
        <ul class="ul">
          <li v-for="item in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">{{item.sort}}
          </li>
        </ul>
      </template>
      <!--卡控节点名称-->
      <template slot-scope="scope" slot="name">
        <ul class="ul">
          <li v-for="item in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">{{item.name}}
          </li>
        </ul>
      </template>
      <!--计划完成日期-->
      <template slot-scope="scope" slot="planConfirmDate">
        <ul class="ul">
          <li v-for="item in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">
            <el-date-picker
                v-model="item.planConfirmDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format=timestamp
                size='mini'
            >
            </el-date-picker>
          </li>
        </ul>
      </template>
      <!--是否完工-->
      <template slot-scope="scope" slot="isComplete">
        <ul class="ul switch-text">
          <li v-for="(item,index) in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">
            <el-switch v-model="item.isComplete"
                       active-text="是"
                       inactive-text="否"
                       :active-value="1"
                       :inactive-value="0"
                       @change="switchChange(item.isComplete,scope.row,index)">
            </el-switch>
          </li>
        </ul>
      </template>
      <!--供应商备注-->
      <template slot-scope="scope" slot="supRemark">
        <ul class="ul">
          <li v-for="item in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">
            <el-input v-model="item.supRemark"
                      size="mini"
                      clearable>
            </el-input>
          </li>
        </ul>
      </template>
      <!--采购部备注-->
      <template slot-scope="scope" slot="purchRemark">
        <ul class="ul">
          <li v-for="item in scope.row.poItemCraftCtrlNodeVos"
              :class="['ul-li',{finish:item.backcolor=='green',overdue:item.backcolor=='red'}]">
            <!--              <el-input v-model="item.purchRemark"-->
            <!--                        size="mini"-->
            <!--                        clearable>-->
            <!--              </el-input>-->
            {{item.purchRemark}}
          </li>
        </ul>
      </template>
      <!--      物料编号-->
      <template slot-scope="scope" slot="itemCode">
        <el-button type="text" size="mini" @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
        </el-button>
      </template>
      <!--        状态-->
      <template slot="status" slot-scope="scope">
        {{fmtStatus(scope.row.poStatus,scope.row.u9StatusCode,scope.row.arvGoodsNum)}}
      </template>
    </avue-crud>
    <!--物料编码-->
    <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>
    <!--        修改交期-->
    <el-dialog title="修改交期" :visible.sync="dialogReviseDate" :append-to-body="true" width="45%" @close="closeReviseDate()">
      <avue-form :option="ReviseDateOp"
                 v-model="formRevise"
                 @reset-change="emptytChange"
                 ref="editform"
                 @submit="handleData">
      </avue-form>
    </el-dialog>
    <!--维护节点-->
    <el-dialog title="维护节点" :visible.sync="dialogMaintainNode" :append-to-body="true" width="45%">
      <div id="dialog-table">
        <avue-crud :option="optionMaintainNode"
                   :table-loading="loading"
                   :data="MaintainNodeData"
                   ref="crud_maintainnode">
          <!--计划完成日期-->
          <template slot-scope="scope" slot="planConfirmDate">
            <el-date-picker
                v-model="scope.row.planConfirmDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format=timestamp
                size='mini'
            >
            </el-date-picker>
          </template>
          <!--是否完工-->
          <template slot-scope="scope" slot="isComplete">
            <div class="switch-text">
              <el-switch v-model="scope.row.isComplete"
                         active-text="是"
                         inactive-text="否"
                         :active-value="1"
                         :inactive-value="0"
                         @change="isCompleteChange(scope.row.isComplete,scope.row.$index)">
              </el-switch>
            </div>
          </template>
          <!--供应商备注-->
          <template slot-scope="scope" slot="supRemark">
            <el-input v-model="scope.row.supRemark"
                      size="mini"
                      clearable>
            </el-input>
          </template>
        </avue-crud>
      </div>
      <el-row style="text-align: right;margin-top: 15px">
        <el-button size="mini" @click="dialogMaintainNode = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitMaintainNode"
                   v-loading.fullscreen.lock="fullscreenLoading">
          保 存
        </el-button>
      </el-row>
    </el-dialog>
  </basic-container>
</template>

<script>
    import {getDeliveryList, submitUpdate, craftCtrlPage, savesCraftCtrl, updateCraftCtrl} from "@/api/poitem/poitem";
    import {PO_STATUS_PAIR}                                                                from "@/api/po/po";
    import {allParent}                                                                     from "@/api/item/craftctrl";
    import {mapGetters}                                                                    from "vuex";
    import itemCode                                                                        from '../../item/item-code'
    import {objToUrlParam}                                                                 from "@/util/func";

    export default {
        components:{itemCode},
        data(){
            return {
                statisticsData    :[{title:'物料交付', key:'materialdev'}, {title:'工艺卡控', key:'procardctrl'}],
                buttonKey         :'materialdev',
                dialogTableVisible:false,
                dialogReviseDate  :false,//修改交期
                fullscreenLoading :false,
                dialogMaintainNode:false,//维护节点
                form              :{},
                formRevise        :{},
                query             :{},
                route             :'',
                itemform          :{},
                loading           :true,
                page              :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                selectionList     :[],
                option            :{},
                optionMaterCtr    :{
                    height        :350,
                    // calcHeight: 350,
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
                    labelWidth    :'200px',
                    menu          :false,
                    searchMenuSpan:8,
                    column        :[
                        {
                            label     :"订单号",
                            prop      :"poCode",
                            width     :120,
                            align     :'left',
                            type      :"input",
                            sortable  :true,
                            search    :true,
                            searchSpan:8
                        },
                        {
                            label   :"订单行号",
                            width   :85,
                            prop    :"poLn",
                            align   :'center',
                            type    :"input",
                            sortable:true,

                        },
                        {
                            label     :"物料编号",
                            prop      :"itemCode",
                            align     :'left',
                            type      :"input",
                            width     :110,
                            search    :true,
                            searchSpan:8,
                            sortable  :true,
                            slot      :true,

                        },
                        {
                            label     :"物料名称",
                            minWidth  :200,
                            overHidden:true,
                            prop      :"itemName",
                            align     :'left',
                            type      :"input",
                            search    :true,
                            sortable  :true,
                            searchSpan:8,
                        },
                        {
                          label   :"ABC分类",
                          width   :85,
                          prop    :"codeType",
                          align   :'center',
                          type    :"select",
                        },
                        {
                            label   :"采购单位",
                            width   :85,
                            prop    :"tcUom",
                            align   :'center',
                            type    :"select",
                            sortable:true,
                        },
                        {
                            label   :"采购数量",
                            width   :85,
                            prop    :"tcNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"到货数量",
                            width   :85,
                            prop    :"rcvGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"实收数量",
                            width   :85,
                            prop    :"arvGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"未到货数量",
                            width   :110,
                            prop    :"proGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"退补数量",
                            width   :85,
                            prop    :"fillGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"项目号",
                            width   :120,
                            prop    :"proNo",
                            align   :'center',
                            type    :"input",
                            sortable:true,
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
                            width      :90,
                            prop       :"supConfirmDate",
                            align      :'center',
                            sortable   :true,
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                        },
                        {
                            label      :"修改后的交期",
                            width      :110,
                            prop       :"supUpdateDate",
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
                          label      :"第一批交货日期",
                          width      :110,
                          prop       :"firstDeliveryDate",
                          align      :'center',
                          sortable   :true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value * 1000 : ''
                          },
                          type       :"datetime",
                          format     :"yyyy-MM-dd",
                          valueFormat:"yyyy-MM-dd",
                        },
                        {
                          label   :"第一批交货数量",
                          width   :85,
                          prop    :"firstDeliveryNum",
                          align   :'center',
                          type    :"input",
                          sortable:true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value : ''
                          },
                        },
                        {
                          label      :"第二批交货日期",
                          width      :110,
                          prop       :"secondDeliveryDate",
                          align      :'center',
                          sortable   :true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value * 1000 : ''
                          },
                          type       :"datetime",
                          format     :"yyyy-MM-dd",
                          valueFormat:"yyyy-MM-dd",
                        },
                        {
                          label   :"第二批交货数量",
                          width   :85,
                          prop    :"secondDeliveryNum",
                          align   :'center',
                          type    :"input",
                          sortable:true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value : ''
                          },
                        },
                        {
                          label      :"第三批交货日期",
                          width      :110,
                          prop       :"thirdDeliveryDate",
                          align      :'center',
                          sortable   :true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value * 1000 : ''
                          },
                          type       :"datetime",
                          format     :"yyyy-MM-dd",
                          valueFormat:"yyyy-MM-dd",
                        },
                        {
                          label   :"第三批交货数量",
                          width   :85,
                          prop    :"thirdDeliveryNum",
                          align   :'center',
                          type    :"input",
                          sortable:true,
                          formatter  :function(row, value, label, column){
                            return value = value > 0 ? value : ''
                          },
                        },
                        {
                            label:"状态",
                            width:100,
                            prop :"status",
                            align:'center',
                            type :"input",
                            slot :true,
                        },
                        {
                            label     :"资料齐全",
                            prop      :"isDeliverablesFull",
                            align     :'center',
                            type      :"select",
                            sortable  :true,
                            // search:true,
                            searchSpan:8,
                            formatter :(row, value, label, column) => {
                                return value > 0 ? '是' : '否';
                            },
                            hide      :true,
                        },
                        {
                            label     :"最终用户",
                            width     :230,
                            prop      :"endUser",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            search    :true,
                            searchSpan:8,
                        },

                    ]
                },
                optionCraftCtrl   :{
                    height     :350,
                    // calcHeight: 350,
                    tip        :false,
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
                    menu       :false,
                    // searchMenuSpan:8,
                    column     :[
                        {
                            label           :"订单号",
                            prop            :"poCode",
                            width           :120,
                            align           :'left',
                            type            :"input",
                            sortable        :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :8
                        },
                        {
                            label   :"订单行号",
                            width   :85,
                            prop    :"poLn",
                            align   :'center',
                            type    :"input",
                            sortable:true,

                        },
                        {
                            label           :"物料编号",
                            prop            :"itemCode",
                            align           :'left',
                            type            :"input",
                            width           :110,
                            search          :true,
                            searchSpan      :8,
                            searchLabelWidth:100,
                            sortable        :true,
                            slot            :true,

                        },
                        {
                            label     :"物料名称",
                            minWidth  :200,
                            overHidden:true,
                            prop      :"itemName",
                            align     :'left',
                            type      :"input",
                            search    :true,
                            sortable  :true,
                            searchSpan:8,
                        },
                        {
                            label           :"工艺卡控类型",
                            width           :100,
                            overHidden      :true,
                            prop            :"craftCtrlNodeName",
                            align           :'center',
                            type            :"select",
                            dicData         :[],
                            search          :true,
                            sortable        :true,
                            searchSpan      :8,
                            searchLabelWidth:100,
                        },
                        {
                            label     :"卡控序号",
                            width     :80,
                            overHidden:true,
                            prop      :"sort",
                            align     :'center',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label     :"卡控节点名称",
                            width     :100,
                            overHidden:true,
                            prop      :"name",
                            align     :'center',
                            type      :"select",
                            slot      :true,
                            // search          :true,
                            // searchSpan      :8,
                            // searchLabelWidth:100,
                        },
                        {
                            label     :"计划完成日期",
                            width     :130,
                            overHidden:true,
                            prop      :"planConfirmDate",
                            align     :'center',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label     :"是否完工",
                            width     :110,
                            overHidden:true,
                            prop      :"isComplete",
                            align     :'center',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label     :"供应商备注",
                            width     :150,
                            overHidden:true,
                            prop      :"supRemark",
                            align     :'left',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label     :"采购部备注",
                            width     :150,
                            overHidden:true,
                            prop      :"purchRemark",
                            align     :'left',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label           :"工艺卡控节点",
                            width           :100,
                            overHidden      :true,
                            prop            :"nodeStatus",
                            align           :'center',
                            type            :"select",
                            slot            :true,
                            search          :true,
                            searchSpan      :8,
                            searchLabelWidth:100,
                            hide            :true,
                            dicData         :[
                                {
                                    label:'未维护',
                                    value:10
                                },
                                {
                                    label:'逾期',
                                    value:20
                                }
                            ]
                        },
                        {
                            label   :"采购单位",
                            width   :85,
                            prop    :"tcUom",
                            align   :'center',
                            type    :"select",
                            sortable:true,
                        },
                        {
                            label   :"采购数量",
                            width   :85,
                            prop    :"tcNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"到货数量",
                            width   :85,
                            prop    :"rcvGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"实收数量",
                            width   :85,
                            prop    :"arvGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"未到货数量",
                            width   :110,
                            prop    :"proGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"退补数量",
                            width   :85,
                            prop    :"fillGoodsNum",
                            align   :'center',
                            type    :"input",
                            sortable:true,
                        },
                        {
                            label   :"项目号",
                            width   :120,
                            prop    :"proNo",
                            align   :'center',
                            type    :"input",
                            sortable:true,
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
                            width      :90,
                            prop       :"supConfirmDate",
                            align      :'center',
                            sortable   :true,
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                        },
                        {
                            label      :"修改后的交期",
                            width      :110,
                            prop       :"supUpdateDate",
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
                            label:"状态",
                            width:100,
                            prop :"status",
                            align:'center',
                            type :"input",
                            slot :true,
                        },
                        {
                            label     :"资料齐全",
                            prop      :"isDeliverablesFull",
                            align     :'center',
                            type      :"select",
                            sortable  :true,
                            // search:true,
                            searchSpan:8,
                            formatter :(row, value, label, column) => {
                                return value > 0 ? '是' : '否';
                            },
                            hide      :true,
                        },
                        {
                            label     :"最终用户",
                            width     :230,
                            prop      :"endUser",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            overHidden:true,
                            search    :true,
                            searchSpan:8,
                        },

                    ]
                },
                ReviseDateOp      :{
                    labelWidth:110,
                    column    :[
                        {
                            label        :"修改交期",
                            prop         :"Date",
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
                            formatter    :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : '';
                            },
                        },
                        {
                            label  :"备注",
                            prop   :"remark",
                            type   :"textarea",
                            span   :24,
                            display:true,
                        },
                    ]
                },
                data              :[],
                parentList        :[],
                childList         :[],
                //维护节点
                optionMaintainNode:{
                    maxHeight     :250,
                    tip           :true,
                    border        :true,
                    index         :false,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    selection     :false, //行可勾选
                    size          :'mini',
                    menuWidth     :100,
                    menu          :false,
                    searchMenuSpan:6,
                    column        :[
                        {
                            label     :"卡控序号",
                            width     :80,
                            overHidden:true,
                            prop      :"sort",
                            align     :'center',
                            type      :"input",
                        },
                        {
                            label     :"卡控节点名称",
                            width     :100,
                            overHidden:true,
                            prop      :"name",
                            align     :'left',
                            type      :"input",
                        },
                        {
                            label     :"计划完成日期",
                            width     :130,
                            overHidden:true,
                            prop      :"planConfirmDate",
                            align     :'center',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label     :"是否完工",
                            width     :110,
                            overHidden:true,
                            prop      :"isComplete",
                            align     :'center',
                            type      :"input",
                            slot      :true,
                        },
                        {
                            label        :"供应商备注",
                            minWidthwidth:150,
                            overHidden   :true,
                            prop         :"supRemark",
                            align        :'left',
                            type         :"input",
                            slot         :true,
                        },
                    ]
                },
                MaintainNodeData  :[],
            };
        },
        computed  :{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.item_add, false),
                    viewBtn:this.vaildData(this.permission.item_view, false),
                    delBtn :this.vaildData(this.permission.item_delete, false),
                    editBtn:this.vaildData(this.permission.item_edit, false)
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
            getclosedit(){
                this.tabledrawer = false
            },
            handleAdd(){
                this.$refs.crud.rowAdd();
            },
            handleExcelM(){
                let req = {
                    "Blade-Auth":this.$store.getters.token,
                    ...this.query
                };
                window.open('/api/blade-po/poitem/deliveryexport?' + objToUrlParam(req));
            },
            handleExcelP(){
                let req = {
                    "Blade-Auth":this.$store.getters.token,
                    ...this.query
                };
                window.open('/api/blade-po/poitem/craftctrlexport?' + objToUrlParam(req));
            },
            handleView(row, index){
                this.$refs.crud.rowAdd(row, index);
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
                if(this.buttonKey === 'materialdev'){
                    this.onLoad(this.page)
                }else{
                    this.onLoadCtrlNode(this.page)
                }
            },
            searchChange(params, done){
                done();
                this.query            = params;
                this.page.currentPage = 1;
                if(this.buttonKey === 'materialdev'){
                    delete params["craftCtrlNodeName"];
                    delete params["nodeStatus"];
                    this.onLoad(this.page, params);
                }else{
                    this.onLoadCtrlNode(this.page, params)
                }
            },
            selectionChange(list){
                this.selectionList = list;
            },
            selectionClear(){
                this.selectionList = [];
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
            refreshChange(){
                if(this.buttonKey === 'materialdev'){
                    this.onLoad(this.page, this.query);
                }else{
                    this.onLoadCtrlNode(this.page, this.query)
                }
            },
            onLoad(page, params = {}){
                this.loading = true;
                getDeliveryList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            onLoadCtrlNode(page, params = {}){
                this.loading = true;
                for(let key in this.query){
                    if(key == "craftCtrlNodeName"){
                        this.query["craftCtrlCode"] = this.query[key];
                        delete this.query[key];
                    }
                }
                craftCtrlPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data = res.data.data;
                    let today  = new Date(new Date(new Date().toLocaleDateString()).getTime()) / 1000;
                    data.records.forEach(item => {
                        item.poItemCraftCtrlNodeVos.forEach(v => {
                            if(v.isComplete === 1){
                                v.backcolor = 'green'
                            }else if(v.planConfirmDate && v.planConfirmDate > 0 && today > v.planConfirmDate && v.isComplete != 1){
                                v.backcolor = 'red'
                            }
                            v.planConfirmDate = v.planConfirmDate > 0 ? v.planConfirmDate * 1000 : ''
                        })
                    })
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            handleItemCode(row){
                this.dialogTableVisible = true
                this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
            },
            closedialog(){
                this.dialogTableVisible = false
            },
            //修改交期
            ReviseDate(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.dialogReviseDate = true
            },
            //关闭对话框
            closeReviseDate(){
                this.$refs.editform.resetForm()
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                });
            },
            //提交
            handleData(formRevise, done){
                if(this.formRevise.Date == '' && this.formRevise.remark == ''){
                    this.$message.error("修改交期和备注不可都为空")
                    done()
                    return;
                }
                var reviseDate = parseInt(this.formRevise.Date / 1000);
                var req        = {}
                this.selectionList.forEach((item) => {
                    item.poItemId = item.id
                    item.date     = reviseDate
                    item.note     = this.formRevise.remark
                })
                req                    = this.selectionList.map(({poItemId, date, note}) => ({poItemId, date, note}))
                // console.log(req)
                this.fullscreenLoading = true
                submitUpdate(req).then(() => {
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });

                    this.dialogReviseDate = false
                    this.onLoad(this.page);
                }).finally(() => {
                    done()
                    this.fullscreenLoading = false
                });
            },
            getKeys(key){
                this.page      = {"pageSize":10, "currentPage":1, "total":0}
                this.buttonKey = key
                this.query     = {};
                this.dataChange()
            },
            //是否完工
            switchChange(e, row, index){
                row.poItemCraftCtrlNodeVos.forEach((v, i) => {
                    if(e == 1 && index > i){ //打开状态 index前面的都打开
                        v.isComplete = 1
                    }
                    if(e == 0 && index < i){ //关闭状态 index后面的的都关闭
                        v.isComplete = 0
                    }
                })
            },
            //节点保存
            handleSave(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                let dataList = JSON.parse(JSON.stringify(this.selectionList))
                for(let item of dataList){
                    let flag = false
                    for(let val of item.poItemCraftCtrlNodeVos){
                        if(val.planConfirmDate){
                            flag                = true
                            val.planConfirmDate = val.planConfirmDate / 1000
                        }else{
                            val.planConfirmDate = ''
                        }
                    }
                    if(!flag){
                        return this.$message.warning("保存内容不能为空！");
                    }
                }
                this.fullscreenLoading = true
                savesCraftCtrl(dataList).then((res) => {
                    this.$message({
                        type   :"success",
                        message:"保存成功!"
                    });
                    this.refreshChange()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            //维护节点
            maintainNode(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                for(var i = 0; i < this.selectionList.length; i++){
                    if(this.selectionList[0].craftCtrlNodeName != this.selectionList[i].craftCtrlNodeName){
                        return this.$message.warning("请选择同一卡控类型");
                    }
                }
                this.MaintainNodeData = JSON.parse(JSON.stringify(this.selectionList[0].poItemCraftCtrlNodeVos))
                this.MaintainNodeData.forEach(item => {
                    item.planConfirmDate = ''
                    item.isComplete      = 0
                    item.supRemark       = ''
                })
                this.dialogMaintainNode = true
            },
            //1.是否完工
            isCompleteChange(e, index){
                this.MaintainNodeData.forEach((v, i) => {
                    if(e == 1 && index > i){ //打开状态 index前面的都打开
                        v.isComplete = 1
                    }
                    if(e == 0 && index < i){ //关闭状态 index后面的的都关闭
                        v.isComplete = 0
                    }
                })
            },
            submitMaintainNode(){
                let flag = false
                for(let val of this.MaintainNodeData){
                    if(val.planConfirmDate){
                        flag = true
                    }
                }
                if(!flag){
                    return this.$message.warning("保存内容不能为空！");
                }
                let newList = JSON.parse(JSON.stringify(this.selectionList))
                newList.forEach(item => {
                    item.poItemCraftCtrlNodeVos.forEach((val, index) => {
                        val.planConfirmDate = this.MaintainNodeData[index].planConfirmDate
                        val.isComplete      = this.MaintainNodeData[index].isComplete
                        val.supRemark       = this.MaintainNodeData[index].supRemark
                    })
                })
                let newArr                 = [].concat.apply([], newList.map(item => {
                    return item.poItemCraftCtrlNodeVos;
                }))
                let poItemCraftCtrlNodeVos = []
                poItemCraftCtrlNodeVos     = newArr.map(item => {
                    return {
                        "id"             :item.id,
                        "poItemId"       :item.poItemId,
                        "planConfirmDate":item.planConfirmDate / 1000,
                        "isComplete"     :item.isComplete,
                        "supRemark"      :item.supRemark
                    }
                })
                let req                    = {
                    "craftCtrlNodeId"       :this.selectionList[0].craftCtrlNodeId,
                    "poItemCraftCtrlNodeVos":poItemCraftCtrlNodeVos
                }
                this.fullscreenLoading     = true
                updateCraftCtrl(req).then((res) => {
                    this.$message({
                        type   :"success",
                        message:"保存成功!"
                    });
                    this.dialogMaintainNode = false
                    this.refreshChange()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            //数据过期修改 承诺 要求交期 < 当前大
            rowStyle({row, column, rowIndex}){
                var timestamp = Date.parse(new Date());
                var nowDate   = parseInt(timestamp / 1000);
                if(row.supUpdateDate > 0){
                    if(row.supUpdateDate < nowDate){
                        return {color:'red'};
                    }
                }else if(row.supConfirmDate > 0){
                    if(row.supConfirmDate < nowDate){
                        return {color:'red'};
                    }
                }else if(row.reqDate > 0){
                    if(row.reqDate < nowDate){
                        return {color:'red'};
                    }
                }
            },
            fmtStatus(poStatus, u9, arvGoodsNum){
                if(poStatus <= 0){
                    return ''
                }
                if(u9 == 2){
                    return PO_STATUS_PAIR[poStatus]
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
            },
            //数据切换
            dataChange(){
                if(this.buttonKey === 'materialdev'){
                    this.option = this.optionMaterCtr
                    this.onLoad(this.page)
                }else{
                    this.option = this.optionCraftCtrl
                    this.onLoadCtrlNode(this.page)
                    this.selSearch()
                }
            },
            //下拉框搜索
            selSearch(){
                allParent().then(({data}) => {
                    this.parentList                                     = data.data;
                    let craftCtrlIndex                                  = this.optionCraftCtrl.column.findIndex(item => {
                        return item.prop == 'craftCtrlNodeName'
                    })
                    this.optionCraftCtrl.column[craftCtrlIndex].dicData = this.parentList.map(item => {
                        return {label:item.name, value:item.code}
                    });
                });
            },
        },
        created   :function(e){
            this.query.view = this.$route.query.view;
            this.route      = this.$route.path
            this.token      = "bearer " + this.$store.getters.token;
            this.dataChange()
            // this.selSearch()
        },
        watch     :{
            "$route":{
                deep:true,
                handler(newV, oldV){
                    // if(newV.path == this.route){
                        if(newV.query.buttonKey){
                            this.buttonKey = newV.query.buttonKey
                            this.dataChange()
                        }
                    // }

                }
            }
        }
    };
</script>

<style scoped lang="scss">
  .item-list{
    width: 100%;
    height: 44px;
    list-style: none;
    padding-left: 0px;
    background-color: #fff;
    box-sizing: border-box;
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
    margin: 0;

    .ul-li{
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 2px 0px;
      border-bottom: 1px solid #EBEEF5;

      &:last-child{
        border-bottom: 0px solid #EBEEF5;
      }

      &.finish{
        background-color: #C6EFCE;
      }

      &.overdue{
        background-color: #FFC7CE;
      }
    }
  }

  #table /deep/{
    .el-table--mini td, .el-table--mini th{
      padding: 0px 0px;
      height: 32px;
      line-height: 32px
    }
  }

  #dialog-table /deep/ .avue-crud__pagination{
    display: none;
  }

  .switch-text /deep/{
    .el-switch__label{
      color: #cccccc;
    }

    .el-switch__label.is-active{
      color: #409EFF;
    }
  }
</style>
