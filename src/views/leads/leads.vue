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
                   v-if="permission.leads_add"
                   icon="el-icon-plus"
                   @click="handleAdd">新 增
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.leads_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.leads_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small"
                   @click="handleConversion(scope.row,scope.index)">转化
        </el-button>
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
    </avue-crud>

    <el-drawer title="转化为客户" size="600px" :visible.sync="isConversionVisible">
      <el-divider></el-divider>
      <div class="drawer-wrap">
        <avue-form ref="addForm" v-model="conversionFormData" :option="conversionFormOption"></avue-form>
      </div>
    </el-drawer>

  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/leads/leads";
    import {mapGetters}                              from "vuex";

    export default {
        data(){
            return {
                form                :{},
                query               :{},
                loading             :true,
                isConversionVisible :false,
                page                :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                conversionFormData  :[],
                conversionFormOption:{
                    "column":[
                        {
                            "type"   :"select",
                            "label"  :"客户等级",
                            dicUrl   :"/api/blade-system/dict/dictionary?code=客户等级",
                            props    :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            "span"   :24,
                            "display":true,
                            "prop"   :"1572951456387_37912",
                        },
                        {
                            "type"   :"select",
                            "label"  :"归属销售",
                            "dicData":[
                                {
                                    "label":"选项一",
                                    "value":0
                                },
                                {
                                    "label":"选项二",
                                    "value":1
                                },
                                {
                                    "label":"选项三",
                                    "value":2
                                }
                            ],
                            "span"   :24,
                            "display":true,
                            "prop"   :"1572951486922_62755"
                        },
                        {
                            "type"   :"select",
                            "label"  :"客户状态",
                            dicUrl   :"/api/blade-system/dict/dictionary?code=客户状态",
                            props    :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            "span"   :24,
                            "display":true,
                            "prop"   :"1572951512743_33312"
                        },
                        {
                            "type"   :"textarea",
                            "label"  :"备注",
                            "span"   :24,
                            "display":true,
                            "prop"   :"1572951524917_56096"
                        }
                    ],
                },
                selectionList       :[],
                option              :{
                    height     :'auto',
                    calcHeight :350,
                    tip        :true,
                    border     :true,
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
                    column     :[
                        {
                            label      :"主键",
                            prop       :"id",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                            align      :'center',
                        },
                        {
                            label      :"租户ID",
                            prop       :"tenantId",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                            align      :'center',
                        },
                        {
                            label :"联系人",
                            prop  :"name",
                            type  :"input",
                            search:true,
                            align :'center',
                            rules :[
                                {
                                    required:true,
                                    message :"请输入联系人",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label :"性别",
                            align :'center',
                            prop  :"sex",
                            type  :"select",
                            dicUrl:"/api/blade-system/dict/dictionary?code=sex",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            rules :[
                                {
                                    required:true,
                                    message :"请输入性别",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label :"行业",
                            align :'center',
                            prop  :"industry",
                            type  :"select",
                            dicUrl:"/api/blade-system/dict/dictionary?code=industry",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            search:true,
                        },
                        {
                            label :"手机号码",
                            align :'center',
                            prop  :"moblie",
                            type  :"input",
                            search:true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入手机号码",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"地址",
                            align:'center',
                            prop :"address",
                            type :"input",
                            span :24,
                        },
                        {
                            label :"企业名称",
                            align :'center',
                            prop  :"companyName",
                            type  :"input",
                            search:true,
                        },
                        {
                            label:"职务",
                            align:'center',
                            prop :"position",
                            type :"input",
                        },
                        {
                            label:"销售线索详情",
                            align:'center',
                            prop :"leadDetails",
                            type :"textarea",
                            span :24,
                            hide :true,
                            rules:[
                                {
                                    required:true,
                                    message :"请输入销售线索详情",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label :"来源",
                            align :'center',
                            prop  :"source",
                            type  :"select",
                            search:false,
                        },
                        {
                            label:"谁开发的",
                            align:'center',
                            prop :"devSales",
                            type :"select",
                        },
                        {
                            label:"指派给哪个销售",
                            align:'center',
                            prop :"assignedTo",
                            type :"select",
                        },
                        {
                            label:"电子邮箱",
                            align:'center',
                            prop :"email",
                            type :"input",
                        },
                        {
                            label      :"是否转换",
                            align      :'center',
                            prop       :"isTransformed",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"转换成的客户ID",
                            align      :'center',
                            prop       :"customerId",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"转换成的商家ID",
                            prop       :"businessId",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"创建人",
                            prop       :"createUser",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"创建部门",
                            prop       :"createDept",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"创建时间",
                            prop       :"createTime",
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
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"修改时间",
                            prop       :"updateTime",
                            type       :"input",
                            format     :"yyyy-MM-dd hh:mm:ss",
                            valueFormat:"yyyy-MM-dd hh:mm:ss",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"是否已删除",
                            prop       :"isDeleted",
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                    ]
                },
                data                :[]
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.leads_add, false),
                    viewBtn:this.vaildData(this.permission.leads_view, false),
                    delBtn :this.vaildData(this.permission.leads_delete, false),
                    editBtn:this.vaildData(this.permission.leads_edit, false)
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
            handleConversion(row, index){
                this.isConversionVisible = true;
            },
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
