<template>
  <basic-container id="table">
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
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click="handleShow(scope.row)">详情</el-button>
      </template>
      <template slot-scope="scope" slot="menuLeft">
        <ul class="item-list">
          <li :class="{active:buttonKey==item.status }"
              v-for="(item,index) in statisticsData" @click="getKeys(item.status)">
            {{item.title}}{{item.count >0 ?`(${item.count})`:''}}
          </li>
        </ul>
      </template>
      <template slot-scope="scope" slot="itemCode">
        <el-button type="text" size="mini"
                   @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
        </el-button>
      </template>
    </avue-crud>
    <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>
  </basic-container>
</template>

<script>
    import {getList, NCR_STATUS, getCount} from "@/api/ncr/ncr";
    import {mapGetters}                    from "vuex";
    import {formatMoney}                   from '@/util/money';
    import itemCode                        from '../item/item-code'

    export default {
        components:{itemCode},
        data(){
            return {
                NCR_STATUS        :NCR_STATUS,
                statisticsData    :[{title:'全部', status:'', count:-1}, {title:'未结案', status:10, count:''}],
                buttonKey         :'',
                form              :{},
                query             :{},
                itemform          :{},
                loading           :true,
                dialogTableVisible:false,
                page              :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                selectionList     :[],
                option            :{
                    height        :350,
                    calcHeight    :350,
                    menu          :true,
                    menuWidth     :80,
                    tip           :true,
                    border        :true,
                    index         :false,
                    addBtn        :false,
                    editBtn       :false,
                    viewBtn       :false,
                    delBtn        :false,
                    selection     :false, //行可勾选
                    size          :'mini',
                    dialogType    :'drawer',
                    dialogWidth   :'800px',
                    labelWidth    :200,
                    indexLabel    :'序号',
                    searchMenuSpan:6,
                    column        :[
                        {
                            label           :"不合格品单号",
                            prop            :"code",
                            align           :'center',
                            sortable        :true,
                            width           :110,
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :6,
                        },
                        {
                            label           :"报告单号",
                            prop            :"reportCode",
                            align           :'center',
                            sortable        :true,
                            width           :110,
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :6,
                        },
                        {
                            label           :"采购订单号",
                            prop            :"poCode",
                            align           :'center',
                            sortable        :true,
                            width           :110,
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :6,
                        },
                        {
                            label           :"物料编号",
                            prop            :"itemCode",
                            align           :'center',
                            type            :"input",
                            width           :110,
                            sortable        :true,
                            slot            :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :6,
                        },
                        {
                            label           :"物料描述",
                            prop            :"itemName",
                            align           :'left',
                            sortable        :true,
                            type            :"input",
                            minWidth        :200,
                            overHidden      :true,
                            search          :true,
                            searchLabelWidth:100,
                            searchSpan      :6,
                        },
                        {
                            label     :"不良数量",
                            prop      :"unQualifiedQty",
                            align     :'center',
                            sortable  :true,
                            type      :"input",
                            width     :85,
                            overHidden:true,
                            formatter :function(row, value, label, column){
                                return value = value > 0 ? value : ''
                            },
                        },
                        {
                            label     :"炉批号",
                            prop      :"furnaceNo",
                            align     :'left',
                            type      :"input",
                            overHidden:true,
                            width     :110,
                            sortable  :true,
                        },
                        {
                            label      :"不良发生时间",
                            prop       :"discovererTime",
                            align      :'center',
                            sortable   :true,
                            width      :120,
                            type       :"datetime",
                            format     :"yyyy-MM-dd",
                            valueFormat:"yyyy-MM-dd HH:mm:ss",
                            formatter  :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : ''
                            },
                            overHidden :true,
                        },
                        {
                            label   :"确认人",
                            prop    :"confirmName",
                            type    :"input",
                            align   :'center',
                            width   :80,
                            sortable:true,
                        },
                        {
                            label    :"是否接受扣款",
                            minWidth :110,
                            prop     :"isAccept",
                            type     :"input",
                            align    :'center',
                            sortable :true,
                            dicData  :[
                                {
                                    label:'是',
                                    value:1
                                },
                                {
                                    label:'否',
                                    value:0
                                }
                            ],
                            formatter:function(row, value, label, column){
                                return value < 0 ? '' : value
                            }
                        },
                        {
                            label    :"扣款金额",
                            width    :80,
                            prop     :"finePrice",
                            align    :'right',
                            sortable :true,
                            type     :"input",
                            formatter:function(row, value, label, column){
                                return formatMoney(value)
                            }
                        },
                        {
                            label    :"处理状态",
                            width    :100,
                            prop     :"status",
                            type     :"input",
                            align    :'center',
                            sortable :true,
                            dicUrl   :'/api/blade-system/dict-biz/dictionary?code=ncr_status',
                            props    :{
                                label:"dictValue",
                                value:"dictKey"
                            },
                            formatter:(row, value, label, column) => {
                                return value ? value.toString() : '';
                            },
                        },
                    ]
                },
                data              :[],
            };
        },
        computed  :{
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
        methods   :{
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
                // console.log(row)
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
            //新增品牌
            rowSave(row, loading, done){
                // console.log(row)
                save(row).then(() => {
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
                let req      = {
                    "status":this.buttonKey,
                    ...this.query
                };
                getList(page.currentPage, page.pageSize, req).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                });
            },
            handleItemCode(row){
                this.dialogTableVisible = true
                this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
            },
            closedialog(){
                this.dialogTableVisible = false
            },
            handleShow(row){
                this.$router.push({path:'/ncr/detail', query:{id:row.id}})
            },
            getKeys(key){
                this.page      = {"pageSize":10, "currentPage":1, "total":0}
                this.buttonKey = key
                this.refreshChange()
                this.getCount()
            },
            getCount(){
                getCount().then(res => {
                    const count                  = res.data.data.count
                    this.statisticsData[1].count = count
                }).finally(() => {

                })
            },
            navTo(){
                if(this.$route.query.status){
                    this.buttonKey = this.$route.query.status
                    this.onLoad(this.page)
                }
            }
        },
        created(){
            this.route = this.$route.path
            this.getCount()
            this.navTo()
        },
        watch     :{
            "$route":{
                deep:true,
                handler(newV, oldV){
                    if(newV.path == this.route){
                        if(newV.query.status){
                            this.buttonKey = newV.query.status
                            this.onLoad(this.page)
                        }
                    }
                }
            }
        }
    };
</script>

<style scoped lang="scss">
  #table /deep/ .el-row{
    background-color: #fff;
  }

  .item-list{
    width: 100%;
    height: 44px;
    list-style: none;
    padding-left: 0px;
    background-color: #fff;
    box-sizing: border-box;
    border-right: 0px;
    margin-top: 0px;

    li{
      width: 134px;
      height: 44px;
      float: left;
      line-height: 44px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;

      &:hover{
        cursor: pointer;
      }
    }

    .active{
      height: 40px;
      color: rgb(0, 121, 254);
      border-width: 0px 0px 2px;
      border-style: solid;
      border-color: rgb(0, 121, 254);
      border-left: 0px;
      border-top: 0px;
      border-right: 0px;
    }
  }
</style>
