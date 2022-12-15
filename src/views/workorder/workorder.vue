<template>
  <div>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @filter-change="filterChange"
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
                   size="small"
                   v-if="permission.workorder_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.workorder_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <!--        <el-button type="text" icon="el-icon-edit" size="small"-->
        <!--                   @click="handleEdit(scope.row,scope.index)">编辑-->
        <!--        </el-button>-->
        <el-button type="text" icon="el-icon-delete" size="small"
                   @click="handleDel(scope.row,scope.index)">删除
        </el-button>
      </template>
      <template slot="searchMenu">
        <el-button size="small" @click="showFilterDialog">高级搜索</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/workorder/workorder";
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
                    height     :'auto',
                    calcHeight :350,
                    tip        :true,
                    border     :true,
                    searchBtn  :false,
                    index      :false,
                    addBtn     :false,
                    editBtn    :false,
                    viewBtn    :false,
                    delBtn     :false,
                    selection  :true, //行可勾选
                    size       :'small',
                    dialogType :'drawer',
                    dialogWidth:'800px',
                    labelWidth :'200px',
                    menuWidth  :'180px',
                    column     :[
                        {
                            label :"工单编号",
                            prop  :"code",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入工单编号",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"工单标题",
                            prop  :"title",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入工单标题",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"工单详情",
                            prop  :"details",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入工单详情",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"工单类型",
                            prop  :"type",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入工单类型",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"紧急程度",
                            prop  :"emergencyLevel",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入紧急程度",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"处理部门",
                            prop  :"processingDept",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入处理部门",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"处理人员",
                            prop  :"processingStaff",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入处理人员",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"状态",
                            prop  :"processingStaff",
                            search:false,
                            align :'center',
                        },
                        {
                            label :"发起时间",
                            prop  :"createTime",
                            search:false,
                            align :'center',
                            type  :"date",
                            format:'yyyy-mm-dd',
                        },
                    ]
                },
                data         :[]
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {};
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
                // todo
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
                this.query            = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params, done);
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
            onLoad(page, params = {}, done = () => {}){
                this.loading = true;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                    done();
                });
            },
            refreshChange(){
                this.onLoad(this.page);
            },
            showFilterDialog(){
                this.$refs.crud.$refs.dialogFilter.box = true
            },
            filterChange(params){
                //TODO
                console.log('过滤器参数：', params);
            }
        }
    };
</script>

<style>
</style>
