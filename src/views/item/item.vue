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
                   v-if="permission.item_add"
                   icon="el-icon-plus"
                   @click="tabledrawer=true">新 增
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.item_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.item_delete"
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
    <!--编辑物料信息-->
    <item-detail :tabledrawer="tabledrawer" @closefunc="getclosedit"></item-detail>
  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/item/item";
    import {mapGetters}                              from "vuex";
    import itemDetail                                from './item-detail'

    export default {
        components:{itemDetail},
        data(){
            return {
                tabledrawer  :false,//drawer
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
                    tip        :false,
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
                            label :"物料编码",
                            prop  :"code",
                            align :'center',
                            type  :"input",
                            search:true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入物料编码",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label :"物料名称",
                            prop  :"name",
                            align :'center',
                            type  :"input",
                            search:true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入物料名称",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label :"品牌名称",
                            prop  :"brand",
                            align :'center',
                            type  :"select",
                            dicUrl:"/api/blade-system/dict/dictionary?code=sex",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                        },
                        {
                            label      :"品牌ID",
                            prop       :"brandId",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
                        },
                        {
                            label           :"主分类编码",
                            prop            :"mainCode",
                            align           :'center',
                            type            :"input",
                            hide            :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :5,
                            rules           :[
                                {
                                    required:true,
                                    message :"请输入主分类编码",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label           :"主分类名称",
                            searchLabelWidth:100,
                            searchSpan      :5,
                            prop            :"mainName",
                            align           :'center',
                            type            :"select",
                            dicUrl          :"/api/blade-system/dict/dictionary?code=sex",
                            props           :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            search          :true,
                            rules           :[
                                {
                                    required:true,
                                    message :"请输入主分类名称",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"物料规格",
                            prop :"specs",
                            align:'center',
                            type :"input",
                        },
                        {
                            label:"物料材质",
                            prop :"matQuality",
                            align:'center',
                            type :"input",
                        },
                        {
                            label:"物料属性",
                            prop :"itemAttr",
                            align:'center',
                            type :"input",
                        },
                        {
                            label:"物料描述",
                            prop :"desc",
                            align:'center',
                            type :"input",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入物料描述",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"标准交期",
                            prop :"standardDate",
                            align:'center',
                            type :"input",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入标准交期 单位：天",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"标准价格",
                            prop :"standardPrice",
                            align:'center',
                            type :"input",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入标准价格",
                                    trigger :"blur"
                                }
                            ],
                        },
                        {
                            label:"物料采购属性",
                            prop :"purAttr",
                            align:'center',
                            type :"input",
                        },
                        {
                            label :"是否需要停顿",
                            prop  :"isStop",
                            align :'center',
                            type  :"radio",
                            dicUrl:"/api/blade-system/dict/dictionary?code=yes_no",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            hide  :true,
                        },
                        {
                            label:"报价期限",
                            prop :"quoteLimit",
                            align:'center',
                            type :"input",
                        },
                        {
                            label:"修改次数",
                            prop :"updateCnt",
                            align:'center',
                            type :"input",
                            hide :true,
                        },
                        {
                            label :"是否序列化",
                            prop  :"sOrN",
                            align :'center',
                            type  :"radio",
                            dicUrl:"/api/blade-system/dict/dictionary?code=yes_no",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
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
                            label      :"状态",
                            prop       :"status",
                            align      :'center',
                            type       :"input",
                            addDisplay :false,
                            editDisplay:false,
                            viewDisplay:false,
                            hide       :true,
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
