<template>
  <avue-crud id="contact_crud" :option="option"
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
             @on-load="onLoad">
    <template slot="menuLeft">
      <el-button type="primary"
                 size="small"
                 v-if="permission.contact_add"
                 icon="el-icon-plus"
                 @click="handleAdd">新 增
      </el-button>
      <el-button type="primary" icon="el-icon-chat-line-square" size="small">发送短信</el-button>
      <el-button type="primary"
                 size="small"
                 v-if="permission.contact_export"
                 icon="el-icon-upload2"
                 @click="handleExcel">导 出
      </el-button>
      <el-button type="danger"
                 size="small"
                 icon="el-icon-delete"
                 plain
                 v-if="permission.contact_delete"
                 @click="handleDelete">删 除
      </el-button>
    </template>
    <template slot-scope="scope" slot="menu">
      <!--      <el-button type="text" icon="el-icon-view" size="small"-->
      <!--                 @click="handleView(scope.row,scope.index)">查看-->
      <!--      </el-button>-->
      <!--      <el-button type="text" icon="el-icon-edit" size="small"-->
      <!--                 @click="handleEdit(scope.row,scope.index)">编辑-->
      <!--      </el-button>-->
      <el-button type="text" size="mini" icon="el-icon-chat-line-square" @click="">短信</el-button>
      <el-button type="text" size="mini" icon="el-icon-info" @click="">详情</el-button>
      <el-button type="text" size="mini" icon="el-icon-delete" @click="handleDel(scope.row,scope.index)">删除</el-button>
    </template>
    <template slot="searchMenu">
      <el-button size="small" @click="showFilterDialog">高级搜索</el-button>
    </template>
  </avue-crud>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/customer/contact";
    import {mapGetters}                              from "vuex";

    export default {
        props   :[],
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
                    size       :'mini',
                    dialogType :'drawer',
                    dialogWidth:'800px',
                    labelWidth :'200px',
                    menuWidth  :'180px',
                    column     :[
                        {
                            label :"客户ID",
                            prop  :"customerId",
                            search:false,
                            hide  :true,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入客户ID",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"联系人姓名",
                            prop  :"realName",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入姓名 ",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"手机号码",
                            prop  :"phoneNumber",
                            search:false,
                            align :'center',
                            width :'100px',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入手机号码",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"性别",
                            prop  :"sex",
                            search:false,
                            hide  :true,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入性别",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"角色",
                            prop  :"role",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入角色",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"部门职位",
                            prop  :"deptPost",
                            search:false,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入部门职位",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label      :"生日",
                            prop       :"birthday",
                            search     :false,
                            type       :'datetime',
                            valueFormat:'yyyy-MM-dd HH:mm:ss',
                            format     :'yyyy-MM-dd',
                            align      :'center',
                            width      :'120px',
                            rules      :[
                                {
                                    required:true,
                                    message :"请输入生日",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"固定电话",
                            prop  :"telephoneNumber",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入固定电话",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"传真号码",
                            prop  :"faxNumber",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入传真号码",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"电子邮箱",
                            prop  :"email",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入电子邮箱",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"微信账号",
                            prop  :"wechat",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入微信账号",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"QQ账号",
                            prop  :"qq",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入QQ账号",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"所在省",
                            prop  :"province",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入所在省",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"所在市 ",
                            prop  :"city",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入所在市 ",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"所在区",
                            prop  :"district",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入所在区",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"详细地址",
                            prop  :"address",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入详细地址",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"证件类型",
                            prop  :"certificateType",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入证件类型",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"证件号码",
                            prop  :"idNumber",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入证件号码",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"备注信息",
                            prop  :"remarks",
                            search:false,
                            align :'center',
                            hide  :true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入备注信息",
                                    trigger :"blur"
                                }
                            ]
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
  #contact_crud .avue-crud.avue-crud-header{
    display :none;
  }
</style>
