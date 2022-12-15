<template>
  <div>
    <avue-crud :option="option"
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
               :table-loading="loading"
               @on-load="onLoad"
    >
      <!--      @on-load="onLoad"     :table-loading="loading"-->
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   @click="handleAdd">新 增
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.brand_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <p style="display: inline;margin-left: 15px">在此列表中的<span style="color: red;">启用</span>的品牌所属的物料将在询价流程中<span style="color: red;">挂起</span></p>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" icon="el-icon-edit" size="small"
                   @click="handleEdit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" icon="el-icon-delete" size="small"
                   @click="handleDel(scope.row,scope.index)">删除
        </el-button>
      </template>
      <template slot="state" slot-scope="scope">
        <el-switch v-model="scope.row.value"
                   :active-value="1"
                   :inactive-value="0"
                   @change="changeValue($event,scope.row.id)">
        </el-switch>
      </template>

    </avue-crud>
  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/brand/brand";
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
                    menu       :false,
                    tip        :true,
                    border     :true,
                    index      :true,
                    addBtn     :false,
                    editBtn    :false,
                    viewBtn    :false,
                    delBtn     :false,
                    selection  :true, //行可勾选
                    size       :'small',
                    dialogType :'drawer',
                    dialogWidth:'800px',
                    labelWidth :'200px',
                    indexLabel :'序号',
                    column     :[
                        {
                            hide       :true,
                            label      :"主键",
                            prop       :"id",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            hide       :true,
                            label      :"供应商编码",
                            prop       :"tenantId",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label :"品牌名称",
                            prop  :"name",
                            align :'center',
                            type  :"input",
                            search:true,

                        },
                        {
                            label :"是否生效",
                            prop  :"isEnable",
                            align :'center',
                            type  :"switch",
                            dicUrl:"/api/blade-system/dict/dictionary?code=yes_no",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            hide  :true,
                        },
                        {
                            label      :"创建人",
                            prop       :"createUser",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"创建部门",
                            prop       :"createDept",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"创建时间",
                            prop       :"createTime",
                            align      :'center',
                            type       :"input",
                            format     :"yyyy-MM-dd hh:mm:ss",
                            valueFormat:"yyyy-MM-dd hh:mm:ss",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"修改人",
                            prop       :"updateUser",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"修改时间",
                            prop       :"updateTime",
                            align      :'center',
                            type       :"input",
                            format     :"yyyy-MM-dd hh:mm:ss",
                            valueFormat:"yyyy-MM-dd hh:mm:ss",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label:"状态",
                            prop :"state",
                            type :'switch',
                            align:'center',
                            slot :true,
                            cell :true,
                        },
                        {
                            label      :"是否已删除",
                            prop       :"isDeleted",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                    ]
                },
                // data: []
                data         :[
                    {
                        name:'MORC',
                    }, {
                        name:'FISHER',
                    }
                ]
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.brand_add, false),
                    viewBtn:this.vaildData(this.permission.brand_view, false),
                    delBtn :this.vaildData(this.permission.brand_delete, false),
                    editBtn:this.vaildData(this.permission.brand_edit, false)
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
                this.query            = params;
                this.page.currentPage = 1;
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
                    // const data = res.data.data;
                    // this.page.total = data.total;
                    // this.data = data.records;
                    this.loading = false;
                    this.selectionClear();
                });
            },
            changeValue(isShow, id){
                console.log(isShow)
            }
        }
    };
</script>

<style>
</style>
