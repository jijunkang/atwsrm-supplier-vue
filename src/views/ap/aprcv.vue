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
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary"
                   size="mini"
                   v-if="permission.aprcv_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="applyHandle">申请付款
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row,scope.index)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row,scope.index)">编辑</el-button>
        <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDel(scope.row,scope.index)">删除</el-button>
      </template>
    </avue-crud>

    <!-- 申请付款弹出框 -->
    <el-dialog title="申请付款" :visible.sync="applyDialogVisible" :append-to-body="true" width="50%">
      <avue-form :option="applyFormOption" v-model="applyFormData"></avue-form>
    </el-dialog>


  </basic-container>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/ap/aprcv";
    import {mapGetters}                              from "vuex";

    export default {
        data(){
            return {
                form         :{},
                query        :{},
                loading      :true,
                page         :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                selectionList:[],
                option       :{
                    height        :'auto',
                    calcHeight    :30,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    tip           :false,
                    searchShow    :true,
                    searchMenuSpan:6,
                    border        :true,
                    index         :false,
                    size          :'mini',
                    selection     :true,  //行可勾选
                    overHidden    :true, //超出隐藏
                    dialogType    :'drawer',
                    dialogWidth   :'800px',
                    column        :[
                        // {
                        //   label: "主键",
                        //   width:100,
                        //   prop: "id",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                        // {
                        //   label: "供应商编号",
                        //   width:100,
                        //   prop: "supCode",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "input",
                        //   addDisplay: false,
                        //   editDisplay: false,
                        //   viewDisplay: false,
                        //   search: true,
                        //   searchSpan:4,
                        //   searchClearable:true,
                        // },
                        // {
                        //   label: "供应商名称",
                        //   width:100,
                        //   prop: "supName",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "input",
                        //   addDisplay: false,
                        //   editDisplay: false,
                        //   viewDisplay: false,
                        // },
                        {
                            label      :"到货日期",
                            width      :100,
                            prop       :"rcvDate",
                            align      :'center',
                            sortable   :true,
                            type       :"date",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label          :"RCV单号",
                            width          :100,
                            prop           :"rcvCode",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :true,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label          :"RCV行号",
                            width          :100,
                            prop           :"rcvLn",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :true,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label          :"订单号",
                            width          :100,
                            prop           :"poCode",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :true,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label          :"订单行号",
                            width          :100,
                            prop           :"poLn",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :true,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label          :"料号",
                            width          :100,
                            prop           :"itemCode",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :false,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label          :"物料名称",
                            width          :100,
                            prop           :"itemName",
                            align          :'center',
                            sortable       :true,
                            type           :"input",
                            addDisplay     :false,
                            editDisplay    :false,
                            viewDisplay    :false,
                            search         :false,
                            searchSpan     :4,
                            searchClearable:true,
                        },
                        {
                            label      :"实收数量",
                            width      :100,
                            prop       :"rcvActualQty",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"单位",
                            width      :100,
                            prop       :"uom",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"含税单价",
                            width      :100,
                            prop       :"price",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"价税合计",
                            width      :100,
                            prop       :"total",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"税组合",
                            width      :100,
                            prop       :"taxGroup",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"应付单ID",
                            width      :100,
                            prop       :"apId",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        // {
                        //   label: "应付单号",
                        //   width:100,
                        //   prop: "apCode",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "input",
                        //   addDisplay: false,
                        //   editDisplay: false,
                        //   viewDisplay: false,
                        //   search: true,
                        //   searchSpan:4,
                        //   searchClearable:true,
                        // },
                        // {
                        //   label: "应付单行号",
                        //   width:100,
                        //   prop: "apLn",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "input",
                        //   addDisplay: false,
                        //   editDisplay: false,
                        //   viewDisplay: false,
                        //   search: true,
                        //   searchSpan:4,
                        //   searchClearable:true,
                        // },
                        // {
                        //   label: "创建人",
                        //   width:100,
                        //   prop: "createUser",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                        // {
                        //   label: "创建部门",
                        //   width:100,
                        //   prop: "createDept",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                        // {
                        //   label: "创建时间",
                        //   width:100,
                        //   prop: "createTime",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        //   format: "yyyy-MM-dd hh:mm:ss",
                        //   valueFormat: "yyyy-MM-dd hh:mm:ss",
                        // },
                        // {
                        //   label: "修改人",
                        //   width:100,
                        //   prop: "updateUser",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                        // {
                        //   label: "修改时间",
                        //   width:100,
                        //   prop: "updateTime",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        //   format: "yyyy-MM-dd hh:mm:ss",
                        //   valueFormat: "yyyy-MM-dd hh:mm:ss",
                        // },
                        // {
                        //   label: "状态",
                        //   width:100,
                        //   prop: "status",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                        // {
                        //   label: "是否已删除",
                        //   width:100,
                        //   prop: "isDeleted",
                        //   align:'center',
                        //   sortable:true,
                        //   type: "",
                        // },
                    ]
                },
                data         :[],

                applyDialogVisible:false, // 申请弹窗
                applyFormData     :{},
                applyFormOption   :{
                    dialogType:'drawer',
                    "column"  :[
                        {
                            "type"    :"input",
                            "label"   :"发票号",
                            "span"    :24,
                            "display" :true,
                            "prop"    :"invoice_code",
                            "required":true,
                            "rules"   :[
                                {
                                    "required":true,
                                    "message" :"发票号必须填写"
                                }
                            ]
                        },
                        {
                            "type"       :"date",
                            "label"      :"开票日期",
                            "span"       :24,
                            "display"    :true,
                            "prop"       :"1581766966264_10177",
                            "required"   :true,
                            "rules"      :[
                                {
                                    "required":true,
                                    "message" :"发票号必须填写"
                                }
                            ],
                            "placeholder":"",
                            "format"     :"yyyy-MM-dd",
                            "valueFormat":"yyyy-MM-dd hh:mm:ss"
                        }
                    ]
                },
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.aprcv_add, false),
                    viewBtn:this.vaildData(this.permission.aprcv_view, false),
                    delBtn :this.vaildData(this.permission.aprcv_delete, false),
                    editBtn:this.vaildData(this.permission.aprcv_edit, false)
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
        methods :{
            handleAdd(){
                this.$refs.crud.rowAdd();
            },
            handleExcel(){
                this.$refs.crud.rowExcel();
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
                this.onLoad(this.page);
            },
            searchChange(params, done){
                done();
                this.query = params;
                this.onLoad(this.page, params);
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
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            refreshChange(){
                this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}){
                this.loading = true;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {

                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            /** 申请付款 */
            applyHandle(){
                if(this.selectionList.length === 0){
                    this.$message.warning('请勾选数据');
                    return false;
                }
                this.applyDialogVisible = true;
            }
        }
    };
</script>

<style>
</style>
