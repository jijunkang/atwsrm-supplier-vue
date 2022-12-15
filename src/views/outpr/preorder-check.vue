<template>
  <el-dialog title="委外预订单审核" :visible.sync="preOrderCheck" width="50%" :modal-append-to-body="false" @close="closePreorder">
    <avue-form ref="preOrderForm" v-model="preOrderForm" :option="preOrderOption">
      <template slot="menuForm">
        <el-button type="primary" @click="submitPreCheck">提 交</el-button>
        <el-button @click="handleEmpty_PreCheck">清 空</el-button>
      </template>
    </avue-form>
  </el-dialog>
</template>

<script>
  export default {
    props:['checkData','preOrderCheck'],
    name:"prorder-check",
    data(){
      return{
        preOrderForm:{},
        preOrderOption: {
          emptyBtn :false,
          submitBtn:false,
          column   :[
            { type: "textarea",
              label: "订单审核",
              span: 24,
              display: true,
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入订单审核内容",
                trigger: "blur"
              }],
            }
          ]
        },
      }
    },
    methods:{
      closePreorder(){
        this.$emit('closePreorder', false)
        this.$refs.preOrderForm.resetForm()
        this.$nextTick(() => {
          this.$refs.preOrderForm.clearValidate()
        });
      },
      refreshPreorder(){
        this.$emit('refreshPreorder')
      },
      handleEmpty_PreCheck(){
        this.preOrderForm.remark='';
        this.$refs.preOrderForm.clearValidate();
      },
      submitPreCheck(){
        this.preOrderForm.id=this.checkData.checkId
        this.preOrderForm.status=this.checkData.checkStatus
        poremindCheck(this.preOrderForm).then(()=>{
          this.$message({
            type   :"success",
            message:"提交成功!"
          });
          this.closePreorder()
          this.refreshPreorder()
        })
      },
    }
  }
</script>

<style scoped>

</style>
