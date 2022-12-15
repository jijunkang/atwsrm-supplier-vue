<template>
  <el-dialog title=""
             :visible.sync="dialogTableVisible"
             :append-to-body="true"
             @close="closeEdit"
             width="45%"
  >
    <div style="height:200px">
      <span style="margin:10px 30px 0px 42px">物料编号：{{itemform.itemCode}}</span>
      <span>物料描述：{{itemform.itemDesc}}</span>
      <div style="padding:40px 40px 0 40px;">
        <el-button type="text" icon="el-icon-download" size="medium"
                   @click="getDwg()">图纸
        </el-button>
        <el-button type="text" icon="el-icon-download" size="medium"
                   @click="getCraft()">工艺文件
        </el-button>
        <el-button type="text" icon="el-icon-download" size="medium"
                   @click="getCheck()">检验标准
        </el-button>
        <el-button type="text" icon="el-icon-download" size="medium"
                   @click="getProcess()">上一道工序图纸
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {getItemdDwg, getItemCraft, getItemCheck, getItemProcess} from "@/api/item/item"

  export default {
    name: "item-code.vue",
    props: ['dialogTableVisible', 'itemform'],
    data() {
      return {
      }
    },
    methods: {
      closeEdit() {
        this.$emit('closefunc', false)
      },
      getDwg() {
        getItemdDwg({"itemCode":this.itemform.itemCode}).then(data => {
          window.open(data.result.url)
        });
      },
      getCraft() {
        getItemCraft({"itemCode":this.itemform.itemCode}).then(data => {
          window.open(data.result.url)
        })
      },
      getCheck() {
        getItemCheck({"itemCode":this.itemform.itemCode}).then(data => {
          window.open(data.result.url)
        })
      },
      getProcess() {
        getItemProcess({"itemCode":this.itemform.itemCode}).then((data) => {
          window.open(data.result.url)
        })
      }
    },
  }
</script>

<style scoped>
</style>
