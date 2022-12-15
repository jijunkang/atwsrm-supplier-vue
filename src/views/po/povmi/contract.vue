<template>
  <el-dialog title=""
             :visible.sync="dialogTableVisibleOfContract"
             :append-to-body="true"
             @opened="vmiDetail"
             @close="closeEdit"
             width="75%">
    <avue-crud
            :option="contractOption"
            :page="pageOfContract"
            :data="dataOfContract">
    </avue-crud>
  </el-dialog>
</template>

<script>
  import {getVmiInfo} from "@/api/po/po";


  export default {
    name: "contract.vue",
    props: ['dialogTableVisibleOfContract', 'poCode'],
    data() {
      return {
        dataOfContract:[],
        pageOfContract: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        contractOption   :{
          height: 400,
          tip: false,
          index: true,
          indexLabel: "序号",
          menu: false,
          border: true,
          addBtn: false,
          editBtn: false,
          viewBtn: false,
          delBtn: false,
          size: 'mini',
          labelWidth: 200,
          menuWidth: 200,
          columnBtn: false, // 筛选哪些列显示
          refreshBtn: false,
          searchBtn: false,
          column:[
            {
              label:'订单编号',
              prop :'poCode',
              span :8,
            },
            {
              label:'订单行号',
              prop :'poLn',
              span :8,
            },
            {
              label:'物料编号',
              prop :'itemCode',
              span :8,
            },
            {
              label:'结算单号',
              prop :'rcvCode',
              span :8,
            },
            {
              label:'结算单号',
              prop :'行号',
              span :8,
            },
            {
              label:'结算个数',
              prop :'rcvNum',
              span :8,
            },
            {
              label   :'合同影像',
              prop    :'contract',
              span    :8,
              formslot:true,
            },
          ]
        },
      }
    },
    methods: {
      closeEdit() {
        this.$emit('closefuncOfDlialog', false)
      },
      vmiDetail() {
        getVmiInfo(this.pageOfContract.currentPage, this.pageOfContract.pageSize, this.poCode).then(res => {
          this.dataOfContract = res.data.data;
        });
      },
    },
  }
</script>

<style scoped>
</style>
