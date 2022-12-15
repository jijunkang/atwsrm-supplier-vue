<template>
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
               @on-load="onLoad"
               id="curd"
               :search.sync="search">
      <template slot-scope="scope" slot="orderCodeSearch">
        <el-input v-model="search.orderCode"></el-input>
      </template>
      <template slot-scope="scope" slot="docDateSearch">
        <el-date-picker
            v-model="search.docDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </template>
      <template slot-scope="scope" slot="statusSearch">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
              v-for="item in poStatus"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey">
          </el-option>
        </el-select>
      </template>
      <template slot="menuLeft">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <div style="color:red;font-size:12px">
          提示：本系统所有金额均以6位小数精度进行运算，页面金额保留两位小数（四舍五入）显示，发票金额以最终对账合计金额为准，请悉知。
        </div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="mini"
                   @click="dialogTableVisiblePo=true,getpoDetail(scope.row)">详情
        </el-button>
      </template>
      <template slot-scope="scope" slot="docAmount">{{ scope.row.docAmount|formatMoney }}</template>
      <template slot-scope="scope" slot="contract">
        <el-button v-for="(list,index) in scope.row.fileListUrl" type="text" size="mini"
                   v-if="scope.row.contract !=''" @click="viewImages(list.url)">查看影像
        </el-button>
      </template>
    </avue-crud>
    <!--订单详情-->
    <po-detail :dialogTableVisiblePo="dialogTableVisiblePo" @closefunc="closedialog"
               @refreshpoIndex="refreshpoIndex"
               :poData="poData" :poId="poId"></po-detail>
  </basic-container>
</template>

<script>
import {getVmiList, getDetail, add, update, remove, getPoItem, getPoStatus, exportExcel} from "@/api/po/po";
import {mapGetters} from "vuex";
import poDetail from "./po-detail"
import {objToUrlParam} from "@/util/func";

export default {
  components: {poDetail},
  data() {
    return {
      form: {},
      dialogTableVisibleOfContract: false, //合同信息
      query: {},
      search: {},
      status: '',
      route: '',
      poData: [],
      selData: [],
      loading: true,
      dialogTableVisiblePo: false,
      poId: '',
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      page_detail: {
        pageSize: 100000,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      poStatus: [],
      option: {
        height: 350,
        // calcHeight: '',
        tip: true,
        border: true,
        index: false,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        selection: true, //行可勾选
        size: 'mini',
        dialogType: 'drawer',
        dialogWidth: '800px',
        labelWidth: '200px',
        menuWidth: 100,
        searchMenuSpan: 6,
        column: [
          {
            label: "主键",
            prop: "id",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            span: 24,
            hide: true,
          },
          {
            label: "租户ID",
            prop: "tenantId",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            span: 24,
            hide: true,
          },
          {
            label: "订单号",
            prop: "orderCode",
            align: 'center',
            sortable: true,
            type: "input",
            search: true,
            searchslot: true,
            searchSpan: 6,
          },
          {
            label: "单据类型 U9参数  PO01",
            prop: "docType",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "下单日期",
            prop: "docDate",
            align: 'center',
            sortable: true,
            type: "date",
            searchRange: true,
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            search: true,
            searchslot: true,
            searchSpan: 6,
          },
          {
            label: "订单总金额",
            prop: "docAmount",
            align: 'center',
            sortable: true,
            type: "input",
            slot: true,
            formatter: (row, value, label, column) => {
              return value >= 0 ? value.toFixed(2) : '';
            },
          },
          {
            label: "项目号",
            prop: "proNo",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "币种编码  C001:人民币",
            prop: "tcCode",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "U9参数 固定值：316",
            prop: "bizType",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "是否含税",
            prop: "isIncludeTax",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "合同映象",
            prop: "contract",
            align: 'center',
            sortable: true,
            type: "input",
            slot: true,
            hide: true,
          },
          {
            label: "签订合同时间",
            prop: "contractTime",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "合同审核备注/拒绝原因",
            prop: "remark",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "创建时间",
            prop: "createAt",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "更新时间",
            prop: "updateAt",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "阅读时间",
            prop: "readAt",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "U9状态",
            prop: "u9StatusCode",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "U9状态",
            prop: "u9Status",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "最后同步U9时间",
            prop: "lastSyncTime",
            align: 'center',
            sortable: true,
            type: "input",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
          },
          {
            label: "拒绝原因",
            prop: "cancelCause",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "创建人",
            prop: "createUser",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "创建部门",
            prop: "createDept",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "创建时间",
            prop: "createTime",
            align: 'center',
            sortable: true,
            type: "input",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            hide: true,
            overHidden: true,
          },
          {
            label: "修改人",
            prop: "updateUser",
            align: 'center',
            sortable: true,
            type: "input",
            hide: true,
          },
          {
            label: "修改时间",
            prop: "updateTime",
            align: 'center',
            sortable: true,
            type: "input",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            hide: true,
            overHidden: true,
          },
          {
            label: "状态",
            prop: "status",
            align: 'center',
            sortable: true,
            type: "select",
            // searchValue:'',
            dicUrl: '/api/blade-system/dict-biz/dictionary?code=po_status',
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            search: true,
            searchslot: true,
            searchSpan: 6,
          },
          {
            label: "是否已删除",
            prop: "isDeleted",
            align: 'center',
            sortable: true,
            type: "input",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            span: 24,
            hide: true,
          },
        ]
      },
      data: []
    };
  },
  mounted() {
    getPoStatus().then(resp => {
      this.poStatus = resp.data.data;
    });
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.po_add, false),
        viewBtn: this.vaildData(this.permission.po_view, false),
        delBtn: this.vaildData(this.permission.po_delete, false),
        editBtn: this.vaildData(this.permission.po_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    closedialog() {
      this.dialogTableVisiblePo = false
    },
    getpoDetail(row) {
      this.poId = row.id
      getPoItem(this.page_detail.currentPage, this.page_detail.pageSize, row.id).then(res => {
        this.poData = res.data.data;
      });
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    handleExcel() {
      if (this.selectionList.length > 0) {
        let req = {
          "Blade-Auth": this.$store.getters.token,
          selectionIds: this.selectionList.map(row => row.id).join(",")
        };
        window.open('/api/blade-po/poitem/exportByVMI?' + objToUrlParam(req))
      } else {
        if (!this.search.docDate) {
          this.search.docDateStart = ''
          this.search.docDateEnd = ''
        }
        if (this.search.docDate) {
          if (this.search.docDate.length > 1) {
            this.search.docDateStart = parseInt(new Date(this.search.docDate[0]).getTime() / 1000)
            this.search.docDateEnd = parseInt(new Date(this.search.docDate[1]).getTime() / 1000 + (24 * 60 * 60) - 1)
          }
        }
        delete this.search.docDate;
        this.fullscreenLoading = true
        let req = {
          "Blade-Auth": this.$store.getters.token,
          ...this.search
        };
        window.open('/api/blade-po/poitem/exportByVMI?' + objToUrlParam(req))
      }

    },
    handleView(row, index) {
      this.$refs.crud.rowAdd(row, index);
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handleDel(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
    },
    rowSave(row, loading, done) {
      add(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        done();
        console.log(error);
      });
    },
    rowUpdate(row, index, loading, done) {
      update(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        done();
        console.log(error);
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      params = this.search;
      done();
      if (!params.docDate) {
        params.docDateStart = ''
        params.docDateEnd = ''
      }
      if (params.docDate) {
        if (params.docDate.length > 1) {
          // params.docDateStart = parseInt(params.docDate[0] / 1000)
          // params.docDateEnd = parseInt(params.docDate[1] / 1000 + (24 * 60 * 60) - 1)

          params.docDateStart = parseInt(new Date(params.docDate[0]).getTime() / 1000)
          params.docDateEnd = parseInt(new Date(params.docDate[1]).getTime() / 1000 + (24 * 60 * 60) - 1)
        }
      }
      this.query = Object.assign({}, params);
      delete this.query.docDate
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
      this.$refs.crud.refreshTable();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      params.descs = 'doc_date';
      getVmiList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        data.records.forEach(item => {
          item.status = item.status.toString()
          item.docDate = item.docDate > 0 ? this.$dateUtils.Time(item.docDate) : ''
          item.lastSyncTime = item.lastSyncTime > 0 ? this.$dateUtils.Time(item.lastSyncTime) : ''
          item.readAt = item.readAt > 0 ? this.$dateUtils.Time(item.readAt) : ''
          item.updateAt = item.updateAt > 0 ? this.$dateUtils.Time(item.updateAt) : ''
          item.createAt = item.createAt > 0 ? this.$dateUtils.Time(item.createAt) : ''
          item.contractTime = item.contractTime > 0 ? this.$dateUtils.Time(item.contractTime) : ''
          var url = ''
          item.fileListUrl = []
          url = item.contract.split("|")
          url.forEach(contractUrl => {
            item.fileListUrl.push({"url": contractUrl})
          })
        })
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },

    refreshpoIndex() {
      this.onLoad(this.page)
    },
    //查看影像
    viewImages(url) {
      window.open(url)
    },
    // this.$nextTick(),
    routeChange() {
      this.route = this.$route.query.status
      if (this.route) {
        this.query = {}
        this.query.status = this.route
        let statusIndex = this.option.column.findIndex((value, index, arr) => value.prop == 'status')
        this.option.column[statusIndex].searchValue = this.route
        this.$route.meta.$keepAlive = false
      }
    }
  },
  created() {
    this.routeChange()
  },
  activated() {
    this.routeChange()
  },
  filters: {
    /*
* 金钱格式化
*/
    formatMoney(num) {
      if (!num) {
        return '0.00';
      }
      num = num.toString().replace(/\$|\,/g, '');
      if (isNaN(num))
        num = "0";
      let sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * 100 + 0.50000000001);
      let cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10)
        cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
      return (((sign) ? '' : '-') + num + '.' + cents);
    },
  },
};
</script>

<style>
</style>
