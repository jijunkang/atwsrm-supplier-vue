<template>
  <basic-container>
    <div style="color: #00a680">
    <avue-data-display class="avue-data-display-wel"  :option="dataOption"  id="custom-count-list"></avue-data-display>
    </div>
    <el-card class="box-card center">
      <h4>交货及时率</h4>
      <ve-line :data="chartData" :legend-visible="false" :settings="chartSettings"></ve-line>
    </el-card>
    <el-card class="box-card center">
      <h4>质量合格率</h4>
      <ve-line :data="chartQuality" :legend-visible="false" :settings="chartSettings_quality"></ve-line>
    </el-card>
  </basic-container>


</template>
<style lang="scss" >
  .avue-data-display-wel .title{
    font-size:19px;
  }
</style>
<script>
  import {mapGetters} from "vuex";
  import VeLine from "v-charts/lib/line.common";
  import {PO_STATUS} from "@/api/po/po";
  import {taskstatistics}  from "@/api/desk/dashboard"
  import {chart}  from "@/api/supplier/suppliertendency"

  export default {
    name: "wel",
    data(){
      return {
        isGreen:false,
        centerData:[],
        dataOption: {
          span: 4,
          data: [],
        },
        chartData: {
          columns: ["date", "arvRate"],
          dimension: ["date"],
          rows: []
        },
        chartSettings: {
          // 设置坐标轴格式
          yAxisType: ["percent"],
          //   设置坐标轴标题
          yAxisName: ["交货及时率"],
          //   设置数据格式
          datatype: {
            "arvRate": "percent"
          },
          //   设置数据别名
          labelMap: {
            "date": "日期",
            "arvRate": "交货及时率"
          }
        },
        activeNames: ['1', '2', '3'],
        logActiveNames: ['9'],

        chartQuality: {
          columns: ["date", "passRate"],
          dimension: ["date"],
          rows: []
        },
        chartSettings_quality: {
          // 设置坐标轴格式
          yAxisType: ["percent"],
          //   设置坐标轴标题
          yAxisName: ["质量合格率"],
          //   设置数据格式
          datatype: {
            "passRate": "percent"
          },
          //   设置数据别名
          labelMap: {
            "date": "日期",
            "passRate": "质量合格率"
          }
        },
      };
    },
    components: {VeLine},
    computed: {
      ...mapGetters(["userInfo"]),
    },
    created(){
      taskstatistics().then((res) => {
       this.dataOption.data=res.data.data
        this.changeStyle()
      });
      //交货及时率，到货及时率
      chart().then((res)=>{
        let data=res.data.data.reverse()
        this.chartData.rows=data
        this.chartQuality.rows=data
      })
    },
    methods: {
      handleChange(val){
        console.log(val);
      },
      changeStyle(){
        this.$nextTick(() => {
          this.dataOption.data.forEach((item, index) => {
            let itemDom = document.getElementById("custom-count-list").getElementsByClassName("count")[index];
            if (item.count > 0) {
              itemDom.style.color = 'red'
            } else {
              itemDom.style.color = 'green'
            }
          })
        })
      }
    },
  };
</script>


