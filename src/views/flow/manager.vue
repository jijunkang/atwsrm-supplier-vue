<template>
  <div>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :page="page"
               :permission="permissionList"
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
                   v-if="permission.flow_manager_remove"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   v-if="permission.flow_manager_state"
                   plain
                   class="none-border"
                   @click.stop="handleState(scope.row,scope.index)">变更状态
        </el-button>
        <el-button type="text"
                   size="small"
                   v-if="permission.flow_manager_image"
                   plain
                   class="none-border"
                   @click.stop="handleImage(scope.row,scope.index)">流程图
        </el-button>
        <el-button type="text"
                   size="small"
                   v-if="permission.flow_manager_remove"
                   plain
                   class="none-border"
                   @click.stop="handleSlotDelete(scope.row,scope.index)">删除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="version">
        <el-tag>v{{row.version}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="suspensionState">
        <el-tag>{{row.suspensionState===1?'激活':'挂起'}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="category">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="流程图"
               append-to-body
               :visible.sync="flowBox"
               :fullscreen="true">
      <iframe
          :src=flowUrl
          width="100%"
          height="700"
          title="流程图"
          frameBorder="no"
          border="0"
          marginWidth="0"
          marginHeight="0"
          scrolling="no"
          allowTransparency="yes">
      </iframe>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="flowBox = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="流程变更"
               append-to-body
               :visible.sync="stateBox"
               width="20%">
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item label="流程状态">
          <el-select v-model="flowState" placeholder="请选择" value="">
            <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="stateBox = false">关 闭</el-button>
        <el-button type="primary"
                   @click="handleDoState">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {mapGetters}                                 from "vuex";
    import {managerList, changeState, deleteDeployment} from "@/api/flow/flow";
    import {flowCategory}                               from "@/util/flow";

    export default {
        data(){
            return {
                form         :{},
                selectionId  :'',
                selectionList:[],
                query        :{},
                loading      :true,
                page         :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                flowBox      :false,
                flowUrl      :'',
                stateBox     :false,
                flowState    :'',
                stateOptions :[
                    {
                        value:'active',
                        label:'激活'
                    }, {
                        value:'suspend',
                        label:'挂起'
                    }
                ],
                option       :{
                    height      :'auto',
                    calcHeight  :350,
                    tip         :false,
                    border      :true,
                    index       :true,
                    selection   :true,
                    editBtn     :false,
                    addBtn      :false,
                    viewBtn     :false,
                    delBtn      :false,
                    dialogWidth :900,
                    dialogHeight:400,
                    menuWidth   :150,
                    column      :[
                        {
                            label:'流程主键',
                            prop :'id',
                        },
                        {
                            label:'流程标识',
                            prop :'key',
                            width:150,
                        },
                        {
                            label:'流程名称',
                            prop :'name',
                            width:150,
                        },
                        {
                            label :"流程分类",
                            type  :"select",
                            row   :true,
                            dicUrl:"/api/blade-system/dict/dictionary?code=flow",
                            props :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            slot  :true,
                            prop  :"category",
                            search:true,
                            width :100,
                        },
                        {
                            label:'流程版本',
                            prop :'version',
                            slot :true,
                            width:80,
                        },
                        {
                            label:'状态',
                            prop :'suspensionState',
                            slot :true,
                            width:80,
                        },
                        {
                            label:'部署时间',
                            prop :'deploymentTime',
                            width:165,
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
                    delBtn:this.vaildData(this.permission.flow_manager_remove, false),
                };
            },
            ids(){
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            },
            deploymentIds(){
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.deploymentId);
                });
                return ids.join(",");
            }
        },
        methods :{
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
                      return deleteDeployment(this.deploymentIds);
                  })
                  .then(() => {
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                      this.$refs.crud.toggleSelection();
                      this.onLoad(this.page);
                  });
            },
            handleSlotDelete(row){
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return deleteDeployment(row.deploymentId);
                  })
                  .then(() => {
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                      this.$refs.crud.toggleSelection();
                      this.onLoad(this.page);
                  });
            },
            handleState(row){
                this.stateBox    = true;
                this.selectionId = row.id;
            },
            handleDoState(){
                if(!this.flowState){
                    this.$message({
                        type   :"warn",
                        message:"请先选择流程状态!"
                    });
                    return;
                }
                changeState({processId:this.selectionId, state:this.flowState}).then(res => {
                    const data = res.data;
                    if(data.success){
                        this.$message({
                            type   :"success",
                            message:data.msg
                        });
                        this.stateBox = false;
                        this.onLoad(this.page);
                    }else{
                        this.$message({
                            type   :"warn",
                            message:data.msg
                        });
                    }
                })
            },
            handleImage(row){
                this.flowUrl = `/api/blade-flow/process/resource-view?processDefinitionId=${row.id}`;
                this.flowBox = true;
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
                const values = {
                    ...params,
                    category:(params.category) ? flowCategory(params.category) : null
                }
                this.loading = true;
                managerList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
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
  .none-border{
    border           :0;
    background-color :transparent !important;
  }
</style>
