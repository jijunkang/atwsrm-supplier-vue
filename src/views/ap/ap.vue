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
                   v-if="permission.ap_add"
                   icon="el-icon-plus"
                   @click="handleAdd">新 增
        </el-button>
        <el-button type="primary"
                   size="mini"
                   v-if="permission.ap_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.ap_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="mini"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" icon="el-icon-edit" size="mini"
                   @click="handleEdit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" icon="el-icon-delete" size="mini"
                   @click="handleDel(scope.row,scope.index)">删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/ap/ap";
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
                        {
                            label   :"主键",
                            width   :100,
                            prop    :"id",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label   :"租户ID",
                            width   :100,
                            prop    :"tenantId",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label          :"应付单号",
                            width          :100,
                            prop           :"apCode",
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
                            label      :"合计",
                            width      :100,
                            prop       :"amount",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label          :"供应商编号",
                            width          :100,
                            prop           :"supCode",
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
                            label      :"供应商名称",
                            width      :100,
                            prop       :"supName",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label          :"发票号",
                            width          :100,
                            prop           :"invoiceCode",
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
                            label      :"开票日期",
                            width      :100,
                            prop       :"invoiceDate",
                            align      :'center',
                            sortable   :true,
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label   :"创建人",
                            width   :100,
                            prop    :"createUser",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label   :"创建部门",
                            width   :100,
                            prop    :"createDept",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label      :"创建时间",
                            width      :100,
                            prop       :"createTime",
                            align      :'center',
                            sortable   :true,
                            type       :"",
                            format     :"yyyy-MM-dd hh:mm:ss",
                            valueFormat:"yyyy-MM-dd hh:mm:ss",
                        },
                        {
                            label   :"修改人",
                            width   :100,
                            prop    :"updateUser",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label      :"修改时间",
                            width      :100,
                            prop       :"updateTime",
                            align      :'center',
                            sortable   :true,
                            type       :"",
                            format     :"yyyy-MM-dd hh:mm:ss",
                            valueFormat:"yyyy-MM-dd hh:mm:ss",
                        },
                        {
                            label   :"状态",
                            width   :100,
                            prop    :"status",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                        {
                            label   :"是否已删除",
                            width   :100,
                            prop    :"isDeleted",
                            align   :'center',
                            sortable:true,
                            type    :"",
                        },
                    ]
                },
                data         :[]
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.ap_add, false),
                    viewBtn:this.vaildData(this.permission.ap_view, false),
                    delBtn :this.vaildData(this.permission.ap_delete, false),
                    editBtn:this.vaildData(this.permission.ap_edit, false)
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
            }
        }
    };
</script>

<style>
</style>