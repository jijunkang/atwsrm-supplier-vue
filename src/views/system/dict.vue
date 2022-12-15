<template>
  <div>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.dict_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <!--导出-->
        <el-button type="primary" @click="handleExcel" style="width: 80.64px;height: 34.41px;position: relative;top: 3px">导出</el-button>
        <!--上传-->
        <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/blade-system/dict/importExcel"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-success='handleSuccess'
            :limit="1"
            :file-list="fileList"
            :show-file-list="false"
            style="display: inline">
          <el-button size="small" type="primary" style="margin: 15px 10px 15px 10px;width: 80.64px;height: 34.41px;position: relative;top: 1px">导入Excel
          </el-button>
        </el-upload>
      </template>
      <template slot-scope="{row}"
                slot="isSealed">
        <el-tag>{{row.isSealed===0?'否':'是'}}</el-tag>
      </template>
    </avue-crud>
  </div>
</template>

<script>
    import {
        getList,
        remove,
        update,
        add,
        getDict,
        getDictTree
    }                   from "@/api/system/dict";
    import {mapGetters} from "vuex";

    export default {
        data(){
            return {
                fileList     :[],
                page         :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                form         :{},
                selectionList:[],
                query        :{},
                loading      :true,
                option       :{
                    excelBtn    :false,
                    menu        :true,
                    align       :'center',
                    tip         :false,
                    tree        :true,
                    border      :true,
                    index       :false,
                    selection   :true,
                    viewBtn     :true,
                    dialogWidth :880,
                    dialogHeight:320,
                    page        :{
                        pageSize   :10,
                        currentPage:1,
                        total      :0
                    },
                    column      :[
                        {
                            label :"字典编号",
                            prop  :"code",
                            search:true,
                            align :'left',
                            span  :24,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入字典编号",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label:"ID",
                            prop :"id",

                        },
                        {
                            label:"字典键值",
                            prop :"dictKey",
                            type :"number",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入字典键值",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label :"字典名称",
                            prop  :"dictValue",
                            search:true,
                            rules :[
                                {
                                    required:true,
                                    message :"请输入字典名称",
                                    trigger :"blur"
                                }
                            ]
                        },
                        {
                            label  :"上级字典",
                            prop   :"parentId",
                            type   :"tree",
                            dicData:[],
                            hide   :true,
                            props  :{
                                label:"title"
                            },
                            rules  :[
                                {
                                    required:false,
                                    message :"请选择上级字典",
                                    trigger :"click"
                                }
                            ]
                        },
                        {
                            label  :"是否封存",
                            prop   :"isSealed",
                            type   :'select',
                            dicData:[
                                {
                                    label:"否",
                                    value:0
                                },
                                {
                                    label:"是",
                                    value:1
                                }
                            ],
                            slot   :true,
                            rules  :[
                                {
                                    required:true,
                                    message :"请选择是否封存",
                                    trigger :"blur"
                                }
                            ],
                            hide   :true,
                        },
                        {
                            label :"字典备注",
                            prop  :"remark",
                            search:true,
                        },
                        {
                            label:"字典排序",
                            prop :"sort",
                            type :"number",
                            rules:[
                                {
                                    required:true,
                                    message :"请输入字典排序",
                                    trigger :"blur"
                                }
                            ]
                        },
                    ]
                },
            };
        },
        computed:{
            ...mapGetters(["permission"]),
            permissionList(){
                return {
                    addBtn :this.vaildData(this.permission.dict_add, false),
                    viewBtn:this.vaildData(this.permission.dict_view, false),
                    delBtn :this.vaildData(this.permission.dict_delete, false),
                    editBtn:this.vaildData(this.permission.dict_edit, false)
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
                console.log(this.selectionList)
                var arr = []
                for(var i = 0; i < this.selectionList.length; i++){
                    for(var j = 0; j < this.selectionList[i].children.length; j++){
                        arr.push(this.selectionList[i].children[j])
                    }
                }
                for(var n = 0; n < arr.length; n++){
                    this.selectionList.push(arr[n])
                }
                console.log(this.selectionList)

            },
            selectionClear(){
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
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
                    getDict(this.form.id).then(res => {
                        this.form = res.data.data;
                    });
                }
                done();
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
                    this.data = res.data.data;
                    getDictTree().then(res => {
                        const data                        = res.data.data;
                        const index                       = this.$refs.crud.findColumnIndex("parentId");
                        this.option.column[index].dicData = data;
                    });
                    this.loading = false;
                    this.selectionClear();
                });
            },
            //上传
            handleRemove(file, fileList){
                console.log(file, fileList);
            },
            handlePreview(file){
                console.log(file);
            },
            beforeAvatarUpload(file){
                let Xls = file.name.split('.');
                if(Xls[1] === 'xls' || Xls[1] === 'xlsx'){
                    return file
                }else{
                    this.$message.error('上传文件只能是 xls/xlsx 格式!')
                    return false
                }
            },
            handleSuccess(res, file, fileList){
                if(res.code === 200){
                    this.$message({
                        message:'上传成功！',
                        type   :'success'
                    });
                }else{
                    this.$message({
                        message:'上传失败',
                        type   :'error'
                    });
                }

            },
            handleExcel(){
                this.$refs.crud.rowExcel();
            },
        }
    };
</script>

<style>
</style>
