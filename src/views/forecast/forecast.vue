<template>
  <div>
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
        <template slot="searchMenu">
          <el-button icon="el-icon-download" type="primary" size="small" @click="handleExcel">导出</el-button>
        </template>
        <template slot="menuLeft">
          <el-button type="primary"
                     size="small"
                     v-if="permission.forecast_add"
                     icon="el-icon-plus"
                     @click="handleAdd">新 增
          </el-button>
          <el-button type="primary"
                     size="small"
                     v-if="permission.forecast_export"
                     icon="el-icon-upload2"
                     @click="handleExcel">导 出
          </el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     v-if="permission.forecast_delete"
                     @click="handleDelete">删 除
          </el-button>
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
      </avue-crud>
    </basic-container>

  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/forecast/forecast";
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
                    title         :"情报中心报表",
                    height        :'auto',
                    calcHeight    :350,
                    tip           :true,
                    border        :true,
                    menu          :false,
                    header        :false,
                    index         :false,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    columnBtn     :false,
                    selection     :true, //行可勾选
                    size          :'mini',
                    dialogType    :'drawer',
                    dialogWidth   :'800px',
                    labelWidth    :'200px',
                    column        :[
                        {
                            label :"物料编号",
                            prop  :"item_code",
                            align :'center',
                            type  :"input",
                            search:true,
                            searchSpan:8,
                        },
                        {
                            label     :"物料名称",
                            prop      :"item_name",
                            align     :'center',
                            type      :"input",
                            search    :true,
                            searchSpan:8,
                            overHidden:true,
                        },
                        {
                            label:"球座标记",
                            prop :"mark",
                            align:'center',
                            type :"input",
                        },
                        {
                            label:"供应商编号",
                            prop :"sup_code",
                            align:'center',
                            type :"input",
                        },
                        {
                            label           :"供应商名称",
                            prop            :"sup_name",
                            align           :'center',
                            type            :"input",
                            search          :true,
                            searchSpan:8,
                            searchLabelWidth:90,
                            overHidden      :true,
                        }
                    ]
                },
                "data"       :[
                    {
                        "item_code":"1503010065",
                        "item_name":"锻棒-φ160-A105",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :3570,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503100075",
                        "item_name":"锻棒-φ160-F304",
                        "mark"     :null,
                        "sup_code" :"MAT-005",
                        "sup_name" :"苏州龙达海金属材料有限公司",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :2142,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503100101",
                        "item_name":"锻棒-φ160-F304L",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :476,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503010057",
                        "item_name":"锻棒-φ170-A105",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :2724,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503100102",
                        "item_name":"锻棒-φ170-F304L",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :134,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503010602",
                        "item_name":"锻棒-φ170-F321",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :268,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503010597",
                        "item_name":"锻棒-φ170-LF2",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :238,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503010064",
                        "item_name":"锻棒-φ190-A105",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :2970,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503100104",
                        "item_name":"锻棒-φ190-F304L",
                        "mark"     :null,
                        "sup_code" :"MAT-005",
                        "sup_name" :"苏州龙达海金属材料有限公司",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :198,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }, {
                        "item_code":"1503010603",
                        "item_name":"锻棒-φ190-F321",
                        "mark"     :null,
                        "sup_code" :"",
                        "sup_name" :"",
                        "2019_6"   :null,
                        "2019_7"   :null,
                        "2019_8"   :396,
                        "2019_9"   :null,
                        "2019_10"  :null,
                        "2019_11"  :null,
                        "2019_12"  :null
                    }
                ]
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.forecast_add, false),
                    viewBtn:this.vaildData(this.permission.forecast_view, false),
                    delBtn :this.vaildData(this.permission.forecast_delete, false),
                    editBtn:this.vaildData(this.permission.forecast_edit, false)
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
        created(){
            this.addDate()
        },
        methods :{
            addDate(){
                let option = this.option.column, date = [], date_cn = [];
                for(let index in this.data[0]){
                    date_cn.push(index);
                    date.push(index.split("_").join("年") + "月");
                }
                date_cn = date_cn.splice(5, 7);
                date    = date.splice(5, 7);
                date.forEach(function(item, index){
                    option.push({label:item, prop:date_cn[index], align:'center', type:"input"});
                });
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
                    // const data = res.data.data;
                    // this.page.total = data.total;
                    // this.data = data.records;
                    this.loading = false;
                    console.log(res.data.data)
                    this.selectionClear();
                });
            }
        }
    };
</script>

<style scoped>

</style>