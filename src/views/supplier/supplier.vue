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
                   v-if=""
                   icon="el-icon-plus"
                   @click="table=true">新 增
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.supplier_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.supplier_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" icon="el-icon-edit" size="small"
                   @click="table=true">编辑
        </el-button>
        <el-button type="text" icon="el-icon-delete" size="small"
                   @click="handleDel(scope.row,scope.index)">删除
        </el-button>
      </template>
    </avue-crud>
    <!--添加商品供应商列表-->
    <supplier-detail :table="table" @func="getclosedetail"></supplier-detail>

  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/supplier/supplier";
    import {mapGetters}                              from "vuex";
    import supplierDetail                            from "./supplier-detail"

    export default {
        components:{supplierDetail},
        data(){
            return {
                table        :false,//drawer
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
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"供应商编码",
                            prop       :"tenantId",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"供应商登录用户id",
                            prop       :"supId",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label:"供应商编号",
                            prop :"code",
                            align:'center',
                            type :"input",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入供应商编号",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"供应商名称",
                            prop :"name",
                            align:'center',
                            type :"input",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入供应商名称",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label      :"主分类编码",
                            prop       :"typeCode",
                            align      :'center',
                            type       :"select",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                            rules      :[
                                {
                                    required:true,
                                    message :"请输入主分类编码",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"主分类名称",
                            prop :"typeName",
                            align:'center',
                            type :"select",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入主分类名称",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"国税号",
                            prop :"nationalTaxCode",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"地税号",
                            prop :"stateTaxCode",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"税率",
                            prop :"taxRate",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"手机号码",
                            prop :"mobile",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"电话号码",
                            prop :"phone",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"email",
                            prop :"email",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"传真",
                            prop :"fax",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"联系人",
                            prop :"ctcName",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"地址",
                            prop :"address",
                            align:'center',
                            type :"input",
                            span :24,
                            hide :true,
                        },
                        {
                            label:"付款方式",
                            prop :"payWay",
                            align:'center',
                            type :"select",
                            hide :true,
                        },
                        {
                            label      :"要更的付款方式",
                            prop       :"payWayChange",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"付款方式",
                            prop       :"payWayStatus",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label:"企业名称",
                            prop :"comName",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"采购员工号",
                            prop :"purchCode",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"采购员工姓名",
                            prop :"purchName",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"采购员邮箱",
                            prop :"purchEmail",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"采购类型",
                            prop :"purchType",
                            align:'center',
                            type :"select",
                            hide :true,
                        },
                        {
                            label:"检验类型",
                            prop :"checkType",
                            align:'center',
                            type :"select",
                            hide :true,
                        },
                        {
                            label:"抽检比例",
                            prop :"checkRate",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"开户行账号",
                            prop :"bankAccountCode",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"开户行名称",
                            prop :"bankName",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"账期",
                            prop :"payDate",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label:"预付款比例%",
                            prop :"payRate",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label      :"更新次数",
                            prop       :"updateCnt",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"采购合约",
                            prop       :"purchContract",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"状态",
                            prop       :"status",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"中标调价次数",
                            prop       :"readjustCount",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"弃标次数",
                            prop       :"giveupCount",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"质量合格率",
                            prop       :"passRate",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"交货率",
                            prop       :"arvRate",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                        },
                        {
                            label      :"是否同意采购合同",
                            prop       :"isAgreePurchContract",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"供应风险等级",
                            prop       :"riskLevel",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"连续出现高供应风险的次数",
                            prop       :"riskHightCount",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"资质分",
                            prop       :"techScoreA",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"技术分_b",
                            prop       :"techScoreB",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"技术分_c",
                            prop       :"techScoreC",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"商务分",
                            prop       :"bizScore",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"资质过期的数量",
                            prop       :"qlfExceedCount",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"资质需要审核的数量",
                            prop       :"qlfCheckCount",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"信用分数合计",
                            prop       :"creditTotal",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label      :"模板类型 ",
                            prop       :"templateType",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
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
                data         :[]
            };
        },
        computed  :{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.supplier_add, true),
                    viewBtn:this.vaildData(this.permission.supplier_view, false),
                    delBtn :this.vaildData(this.permission.supplier_delete, false),
                    editBtn:this.vaildData(this.permission.supplier_edit, false)
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
            getclosedetail(){
                this.table = false
            },
            handleExcel(){
                this.$refs.crud.rowExcel();
            },
            handleView(row, index){
                this.$refs.crud.rowAdd(row, index);
            },
            // handleEdit (row, index) {
            //     this.$refs.crud.rowEdit(row, index);
            // },
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
