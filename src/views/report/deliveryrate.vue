<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="form-inline">
        <span class="margin-right">供应商名称：</span>
        <el-form-item label="">
          <el-select v-model="formInline.supplier" filterable placeholder="请选择供应商">
            <el-option v-for="(item,index) in suppliers" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <span class="margin-right">日期：</span>
        <el-date-picker
            class="margin-right"
            v-model="formInline.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card center">
      <h4>供应商交货及时率</h4>
      <ve-line :data="chartData" :legend-visible="false" :settings="chartSettings"></ve-line>
    </el-card>
  </div>
</template>

<script>
    import VeLine from "v-charts/lib/line.common";

    export default {
        components: {VeLine},
        data() {
            //   报表配置项
            this.chartSettings = {
                // 设置坐标轴格式
                yAxisType: ["percent"],
                //   设置坐标轴标题
                yAxisName: ["交货及时率(%)"],
                //   设置数据格式
                datatype: {
                    "value": "percent"
                },
                //   设置数据别名
                labelMap: {
                    "date": "日期",
                    "value": "交货及时率"
                }
            };
            return {
                suppliers: [{
                    value: '永嘉通球阀门有限公司',
                    label: '永嘉通球阀门有限公司'
                }, {
                    value: '上海中洲特种合金材料股份有限公司',
                    label: '上海中洲特种合金材料股份有限公司'
                }, {
                    value: '苏州九城贸易有限公司',
                    label: '苏州九城贸易有限公司'
                }],
                formInline: {
                    supplier: null,
                    date: null
                },
                chartData: {
                    columns: ["date", "value"],
                    dimension: ["date"],
                    rows: [
                        {"date": "2018-12", "value": 0.39},
                        {"date": "2019-02", "value": 0.52},
                        {"date": "2019-04", "value": 0.52},
                        {"date": "2019-06", "value": 0.569999},
                        {"date": "2019-08", "value": 0.66},
                        {"date": "2019-10", "value": 0.78}
                    ]
                }
            };
        },
        methods: {
            onSubmit() {
                this.$message({
                    showClose: true,
                    message: this.formInline
                });
            }
        }
    };
</script>

<style scoped>
  .box-card {
    margin-bottom: 10px;
  }

  .margin-right {
    margin-right: 10px;
  }

  .center {
    text-align: center;
  }

  .form-inline {
    height: 40px;
  }
</style>