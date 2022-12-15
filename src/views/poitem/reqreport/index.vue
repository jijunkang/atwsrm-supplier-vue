<template>
  <basic-container>
    <template>
      <el-alert
              type="warning"
              :closable="false"
              style="padding: 9px;">
        <template slot='title'>
          <div style="font-size:14px">
            提示：淡黄色为预测计划数量 ，淡蓝色为需求订单数量。
          </div>
        </template>
      </el-alert>
    </template>
    <div style="height: 10px"></div>
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
               :row-style="rowStyle"
               :cell-style="cellStyle"
               v-loading.fullscreen.lock="fullscreenLoading">
      <template slot="menuLeft">
        <ul class="item-list">
          <li :class="{active:buttonKey==item.key }"
              v-for="(item,index) in statisticsData" @click="getKeys(item.key)">
            {{item.title}}
          </li>
        </ul>

        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="handleExcelM"
                   v-if="this.buttonKey==='materialdev'">导 出
        </el-button>

        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="handleExcelP"
                   v-if="this.buttonKey==='procardctrl'">导 出
        </el-button>

        <!--                <el-button type="primary"-->
        <!--                           size="mini"-->
        <!--                           @click="handleExcel">导 入Excel-->
        <!--                </el-button>-->
        <!--                <p style="color: red ;font-size: 11px;display: inline;margin-left: 10px">注：导入Excel仅能修改交期。日期格式为：2018-08-08</p>-->
      </template>
      <!-- 订单号-->
      <template slot-scope="scope" slot="poItems">
        <ul class="ul">
          <li v-for="item in scope.row.poItems">
            <span> {{item.poCode}}</span>
            <span> {{item.poLn}}</span>
          </li>
        </ul>
      </template>
      <!--  物料编号-->
      <template slot-scope="scope" slot="itemCode">
        <el-button type="text" size="mini"
                   @click="handleItemCode(scope.row)">{{scope.row.itemCode}}
        </el-button>
      </template>
    </avue-crud>
    <!--物料编码-->
    <item-code :dialogTableVisible="dialogTableVisible" @closefunc="closedialog" :itemform="itemform"></item-code>
  </basic-container>
</template>

<script>
  import {reqReport, submitUpdate, reqReport2, savesCraftCtrl, updateCraftCtrl} from "@/api/poitem/poitem";
  import {PO_STATUS_PAIR}                                                                from "@/api/po/po";
  import {allParent}                                                                     from "@/api/item/craftctrl";
  import {mapGetters}                                                                    from "vuex";
  import itemCode                                                                        from '../../item/item-code'
  import {objToUrlParam}                                                                 from "@/util/func";

  export default {
    components:{itemCode},
    data(){
      return {
        statisticsData    :[{title:'物料索引', key:'materialdev'}, {title:'订单索引', key:'procardctrl'}],
        buttonKey         :'materialdev',
        dialogTableVisible:false,
        dialogReviseDate  :false,//修改交期
        fullscreenLoading :false,
        dialogMaintainNode:false,//维护节点
        form              :{},
        formRevise        :{},
        query             :{},
        route             :'',
        itemform          :{},
        loading           :true,
        page              :{
          pageSize   :10,
          currentPage:1,
          total      :0
        },
        selectionList     :[],
        option            :{},
        optionMaterCtr            :{
          height        :350,
          tip           :true,
          border        :true,
          menu          :false,
          index         :false,
          addBtn        :false,
          editBtn       :false,
          viewBtn       :false,
          delBtn        :false,
          columnBtn     :false,
          selection     :false, //行可勾选
          size          :'mini',
          dialogType    :'drawer',
          dialogWidth   :'800px',
          labelWidth    :'200px',
          searchMenuSpan:6,
          column        :[
            {
              label           :"物料编号",
              prop            :"itemCode",
              align           :'center',
              type            :"input",
              width           :110,
              sortable        :true,
              search          :true,
              searchSpan      :6,
              searchLabelWidth:90,
              slot            :true,
              fixed           :'left',
            },
            {
              label           :"物料描述",
              prop            :"itemName",
              align           :'left',
              type            :"input",
              minWidth        :220,
              overHidden      :true,
              sortable        :true,
              search          :true,
              searchSpan      :6,
              searchLabelWidth:90,
              fixed           :'left',
            },
            {
              label     :"总数量",
              prop      :"total",
              align     :'center',
              type      :"input",
              overHidden:true,
              width     :75,
              sortable  :true,
              fixed     :'left',
            },
            {
              label     :"订单号",
              prop      :"poItems",
              align     :'center',
              type      :"input",
              overHidden:true,
              width     :135,
              sortable  :true,
              slot      :true,
            },
            {
              label     :"延期未送货数量",
              prop      :"delayQties",
              align     :'center',
              type      :"input",
              overHidden:true,
              formatter:(row, value, label, column) => {
                if(value > 0){
                  return '<span style="color: red">'+ value +'</span>'
                }
                return value;
              },
              width     :100,
              sortable  :true,
              fixed     :'left',
            }
          ]
        },
        optionCraftCtrl   :{
          height        :350,
          tip           :true,
          border        :true,
          menu          :false,
          index         :false,
          addBtn        :false,
          editBtn       :false,
          viewBtn       :false,
          delBtn        :false,
          columnBtn     :false,
          selection     :false, //行可勾选
          size          :'mini',
          dialogType    :'drawer',
          dialogWidth   :'800px',
          labelWidth    :'200px',
          searchMenuSpan:6,
          column        :[
            {
              label     :"订单",
              prop      :"poCode",
              align     :'center',
              type      :"input",
              overHidden:true,
              width     :150,
              sortable  :true,
              slot      :false,
              search          :true,
              fixed           :'left',
              formatter:(row, value, label, column) => {
                return value + " " + row.poLn;
              },
            },
            {
              label           :"物料编号",
              prop            :"itemCode",
              align           :'center',
              type            :"input",
              width           :110,
              sortable        :true,
              search          :true,
              searchSpan      :6,
              searchLabelWidth:90,
              slot            :true,
              fixed           :'left',
            },
            {
              label           :"物料描述",
              prop            :"itemName",
              align           :'left',
              type            :"input",
              minWidth        :220,
              overHidden      :true,
              sortable        :true,
              search          :true,
              searchSpan      :6,
              searchLabelWidth:90,
              fixed           :'left',
            },
            {
              label     :"总数量",
              prop      :"total",
              align     :'center',
              type      :"input",
              overHidden:true,
              width     :75,
              sortable  :true,
              fixed     :'left',
            },
            {
              label     :"延期未送货数量",
              prop      :"delayQties",
              align     :'center',
              type      :"input",
              overHidden:true,
              formatter:(row, value, label, column) => {
                if(value > 0){
                  return '<span style="color: red">'+ value +'</span>'
                }
                return value;
              },
              width     :100,
              sortable  :true,
              fixed     :'left',
            }
          ]
        },
        data              :[],
        current_month     :[],
        nexHalfYear       :[],
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
      opColumnAdd(){
        let now               = new Date();
        let date              = new Date();
        let currYear = now.getFullYear();
        let currMonth = now.getMonth();
        let currDate = now.getDate();
        let currentMonthDays = this.$dateUtils.getMonthDays(currYear, currMonth);
        this.current_month    = [];
        this.nexHalfYear      = [];
        /*******************/

        if(currDate < 20){
          for(let i = 1; i<=currentMonthDays; i++){
            let month = "";
            if(currMonth  < 9){
              month = "0" +  (currMonth + 1);
            }else{
              month =  currMonth + 1
            }
            let day = "";
            if(i  < 10){
              day = "0" +  i;
            }else{
              day =  i
            }

            let everyDay = currYear + "-" + month + "-" + day;
            this.current_month.push(everyDay);
          }
        }else{
          // 20至当前月最后一天
          for(let i = 20; i<=currentMonthDays; i++){
            let month = "";
            if(currMonth  < 9){
              month = "0" +  (currMonth + 1);
            }else{
              month =  currMonth + 1
            }
            let day = "";
            if(i  < 10){
              day = "0" +  i;
            }else{
              day =  i
            }

            let everyDay = currYear + "-" + month + "-" + day;
            this.current_month.push(everyDay);
          }
          // 下个月整月
          let currMonth1 = currMonth + 1;
          currMonth += 1;
          currentMonthDays = this.$dateUtils.getMonthDays(currYear, currMonth1);
          for(let i = 1; i<=currentMonthDays; i++){
            let month = "";
            if(currMonth1  < 9){
              month = "0" +  (currMonth1 + 1);
            }else{
              month =  currMonth1 + 1
            }
            let day = "";
            if(i  < 10){
              day = "0" +  i;
            }else{
              day =  i
            }

            let everyDay = currYear + "-" + month + "-" + day;
            this.current_month.push(everyDay);
          }
        }


        let today = this.$dateUtils.dateFormat(new Date(), 'yyyy-MM-dd')
        let currentIndex = this.current_month.findIndex(item=>{
          return item==today
        })

        this.current_month.forEach(v=>{
          let lable = v.split('-')[1]+'/'+v.split('-')[2]
          this.option.column.push({
            prop : v,
            label: lable,
            align: 'center',
            type : "input"
          })
        })
        /************************/
        date = this.$dateUtils.dateAdd('d', 1, date)
        if(currDate < 20){
          date = this.$dateUtils.dateAdd("m", 1, date);
        }else{
          date = this.$dateUtils.dateAdd("m", 2, date);
        }
        this.nexHalfYear.push(this.$dateUtils.dateFormat(date, 'yyyy-MM'))
        for(var i = 1; i<6; i++){
          date = this.$dateUtils.dateAdd("m", 1, date);
          let everyMonth = this.$dateUtils.dateFormat(date, 'yyyy-MM');
          this.nexHalfYear.push(everyMonth)
        }

        this.nexHalfYear.forEach((item, index) => {
          let lable = item.split('-')[1]
          lable     = Number(lable[0]) === 0 ? lable[1] + '月' : lable + '月'
          this.option.column.push({
            prop :item,
            label:lable,
            align:'center',
            type :"input"
          })
        })

        if(this.buttonKey === 'materialdev'){
          this.nexHalfYear.forEach((item, index) => {
            let lable = item.split('-')[1]
            lable     = Number(lable[0]) === 0 ? lable[1] + '月' : lable + '月'
            let prop  = item.split('-')[0] + '/' + item.split('-')[1]
            if(currDate < 20){
              this.option.column.push({
                prop :prop,
                label:lable,
                align:'center',
                type :"input"
              })
            }else{
              prop  = item.split('-')[0] + '/';
              let month = "";
              if(currMonth  < 9){
                month = "0" +  (currMonth + 1);
              }else{
                month =  currMonth + 1
              }


              let monthkey = currMonth + 1 + index;
              if(monthkey  < 9){
                monthkey = "0" +  monthkey;
              }
              prop += monthkey;
              lable = currMonth + 1 + index + '月';
              this.option.column.push({
                prop :prop,
                label:lable,
                align:'center',
                type :"input"
              })
            }

          })
        }else{
          this.nexHalfYear.forEach((item, index) => {
            let lable = item.split('-')[1]
            lable     = Number(lable[0]) === 0 ? lable[1] + '月' : lable + '月'
            let prop  = item.split('-')[0] + '/' + item.split('-')[1]
            if(currDate < 20){
              this.option.column.push({
                prop :prop,
                label:lable,
                align:'center',
                hide :true,
                type :"input"
              })
            }else{
              prop  = item.split('-')[0] + '/';
              let month = "";
              if(currMonth  < 9){
                month = "0" +  (currMonth + 1);
              }else{
                month =  currMonth + 1
              }


              let monthkey = currMonth + 1 + index;
              if(monthkey  < 9){
                monthkey = "0" +  monthkey;
              }
              prop += monthkey;
              lable = currMonth + 1 + index + '月';
              this.option.column.push({
                prop :prop,
                label:lable,
                align:'center',
                hide :true,
                type :"input"
              })
            }

          })
        }

      },
      addOpColumn(mockData){
        this.data = mockData;
        mockData.forEach((item, i) => {
          if(this.buttonKey === 'materialdev'){
            item.columnValues.forEach((v) => {
              let date = v.date;
              this.data[i][date] = `${v.qty}` > 0 ? v.qty : ''
            })
          }else{
            item.columnValues2.forEach((v) => {
              let date = v.date;
              this.data[i][date] = `${v.qty}` > 0 ? v.qty : ''
            })
          }

        })
        //console.log(this.data)
      },
      getclosedit(){
        this.tabledrawer = false
      },
      handleAdd(){
        this.$refs.crud.rowAdd();
      },
      handleExcelM(){
        let req = {
          "Blade-Auth":this.$store.getters.token,
          ...this.query
        };
        window.open('/api/blade-po/poitem/poItemExport?' + objToUrlParam(req));
      },
      handleExcelP(){
        let req = {
          "Blade-Auth":this.$store.getters.token,
          ...this.query
        };
        window.open('/api/blade-po/poitem/poItemExport2?' + objToUrlParam(req));
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
        if(this.buttonKey === 'materialdev'){
          this.onLoad(this.page)
        }else{
          this.onLoadCtrlNode(this.page)
        }
      },
      searchChange(params, done){
        done();
        this.query            = params;
        this.page.currentPage = 1;
        if(this.buttonKey === 'materialdev'){
          this.onLoad(this.page, params);
        }else{
          this.onLoadCtrlNode(this.page, params)
        }
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
        this.refreshChange()
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
        this.refreshChange()
      },
      refreshChange(){
        if(this.buttonKey === 'materialdev'){
          this.onLoad(this.page, this.query);
        }else{
          this.onLoadCtrlNode(this.page, this.query)
        }
      },
      onLoad(page, params = {}, done = () => {}){
        this.loading = true;
        reqReport(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.addOpColumn(data.records)
          this.page.total = data.total;
          this.loading    = false;
          this.selectionClear();
          done();
        });
      },
      onLoadCtrlNode(page, params = {}){
        this.loading = true;
        reqReport2(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          //this.opColumnAdd();
          this.addOpColumn(data.records)
          this.page.total = data.total;
          this.loading    = false;
        });
      },

      cellStyle({row, column, rowIndex, columnIndex}){
        if(this.option.column.length == 5){ // 数据切换时先加载了cellstyle
          this.opColumnAdd();
        }

        if(this.buttonKey === 'materialdev'){
          var dateLength  = row.columnValues.length
          var fixedColumn = this.option.column.length - dateLength
          for(var i = 0; i < dateLength; i++){
            var m    = fixedColumn + i
            let prop = this.option.column[m].prop
            let n    = row.columnValues.findIndex((value, index, arr) => value.date == prop);

            if(n != - 1 && columnIndex == m && row.columnValues[n].isMeetOptDate == 0){
              return {color:'red'}
            }
          }
        }else{
          var dateLength  = row.columnValues2.length
          var fixedColumn = this.option.column.length - dateLength
          for(var i = 0; i < dateLength; i++){
            var m    = fixedColumn + i
            let prop = this.option.column[m].prop
            let n    = row.columnValues2.findIndex((value, index, arr) => value.date == prop);

            if(n != - 1 && columnIndex == m && row.columnValues2[n].isMeetOptDate == 0){
              return {color:'red'}
            }
          }
        }


        if(columnIndex > this.option.column.length - 7){
          return {"background-color":"#f8e498"}
        }
        if(columnIndex > this.option.column.length - 13 && columnIndex <= this.option.column.length - 7){
          return {"background-color":"#d4f7f8"}
        }
      },
      headerStyle({row, column, rowIndex, columnIndex}){
        if(columnIndex > this.option.column.length - 7){
          return 'header-color'
        }
        if(columnIndex > this.option.column.length - 13 && columnIndex <= this.option.column.length - 7){
          return 'req-header-color'
        }
      },

      handleItemCode(row){
        this.dialogTableVisible = true
        this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
      },
      closedialog(){
        this.dialogTableVisible = false
      },
      getKeys(key){
        this.page      = {"pageSize":10, "currentPage":1, "total":0}
        this.buttonKey = key
        this.query     = {};
        this.dataChange()
      },
      rowStyle({row, column, rowIndex}){
        var timestamp = Date.parse(new Date());
        var nowDate   = parseInt(timestamp / 1000);
        if(row.supUpdateDate > 0){
          if(row.supUpdateDate < nowDate){
            return {color:'red'};
          }
        }else if(row.supConfirmDate > 0){
          if(row.supConfirmDate < nowDate){
            return {color:'red'};
          }
        }else if(row.reqDate > 0){
          if(row.reqDate < nowDate){
            return {color:'red'};
          }
        }
      },
      //数据切换
      dataChange(){
        if(this.buttonKey === 'materialdev'){
          this.option = this.optionMaterCtr
          this.onLoad(this.page)
        }else{
          this.option = this.optionCraftCtrl
          this.onLoadCtrlNode(this.page)
        }
      },
    },
    created   :function(e){
      this.query.view = this.$route.query.view;
      this.route      = this.$route.path
      this.token      = "bearer " + this.$store.getters.token;
      this.dataChange()
      this.opColumnAdd()
      // this.selSearch()
    },
    handleItemCode(row){
      this.itemform           = {"itemCode":row.itemCode, "itemDesc":row.itemName}
      this.dialogTableVisible = true
    },
    watch     :{
      "$route":{
        deep:true,
        handler(newV, oldV){
          // if(newV.path == this.route){
          if(newV.query.buttonKey){
            this.buttonKey = newV.query.buttonKey
            this.dataChange()
          }
          // }

        }
      }
    }
  };
</script>

<style scoped lang="scss">
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

  .ul{
    list-style: none;
    padding-inline-start: 0px;
    margin: 0;

    .ul-li{
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 2px 0px;
      border-bottom: 1px solid #EBEEF5;

      &:last-child{
        border-bottom: 0px solid #EBEEF5;
      }

      &.finish{
        background-color: #C6EFCE;
      }

      &.overdue{
        background-color: #FFC7CE;
      }
    }
  }

  #table /deep/{
    .el-table--mini td, .el-table--mini th{
      padding: 0px 0px;
      height: 32px;
      line-height: 32px
    }
  }

  #dialog-table /deep/ .avue-crud__pagination{
    display: none;
  }

  .switch-text /deep/{
    .el-switch__label{
      color: #cccccc;
    }

    .el-switch__label.is-active{
      color: #409EFF;
    }
  }
</style>
