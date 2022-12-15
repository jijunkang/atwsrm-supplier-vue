<template>
  <basic-container>
    <el-drawer
        title="报价"
        :visible.sync="quoteBatch"
        size='660px'
        @close="closeQuotedBatch"
        @open="openQuotedBatch">
      <div style="width: 100%;height: 90%;overflow: hidden;overflow: scroll">
        <avue-form :option="quotePriOption"
                   v-model="formQuote"
                   @reset-change="emptytChange"
                   ref="editform"
                   @submit="handleData"
                   :upload-after="uploadAfter"
                   v-loading.fullscreen.lock="fullscreenLoading">
        </avue-form>
      </div>
    </el-drawer>
  </basic-container>
</template>

<script>

    import {subPrice} from "@/api/io/io";

    export default {
        props  :['quoteBatch', 'idList', 'havePrice'],
        data(){
            return {
                fullscreenLoading:false,//页面整加载
                form             :{},
                formQuote        :{},
                uploadUrl        :'',
                loading          :true,
                quoteBatch       :false,
                token            :'',
                quotePriOption   :{
                    labelWidth:110,
                    column    :[
                        {
                            label        :"承诺交期",
                            prop         :"promiseDate",
                            span         :24,
                            display      :true,
                            type         :"date",
                            pickerOptions:{
                                disabledDate(time){
                                    return time.getTime() < Date.now() - 8.64e7;
                                }
                            },
                            format       :"yyyy-MM-dd",
                            valueFormat  :"timestamp",
                            formatter    :function(row, value, label, column){
                                return value = value > 0 ? value * 1000 : '';
                            },
                            rules        :[
                                {
                                    required:true,
                                    message :"选择承诺交期",
                                    trigger :"change"
                                }
                            ]
                        }, {
                            label  :"报价",
                            prop   :"quotePrice",
                            type   :"input",
                            span   :24,
                            display:true,
                            rules  :[
                                {
                                    required:true,
                                    message :"请输入报价",
                                    trigger :"blur",
                                }
                            ],
                        }, {
                            label  :"供应商备注",
                            prop   :"supRemark",
                            type   :"textarea",
                            span   :24,
                            display:true,
                        },
                        {
                            label       :"上传附件",
                            prop        :"attachment",
                            type        :"upload",
                            propsHttp   :{
                                res:'data',
                                url:'link',
                            },
                            action      :'/api/blade-resource/oss/endpoint/put-file',
                            span        :24,
                            display     :true,
                            // showFileList: true,
                            // multiple: true,
                            // limit: 10,
                            canvasOption:{},
                        },
                    ]
                },
                data             :[]
            };
        },
        methods:{
            openQuotedBatch(){
                this.token = "bearer " + this.$store.getters.token;
                if(this.havePrice){//有价格报交期
                    this.quotePriOption.column[1].display = false
                }else{
                    this.quotePriOption.column[1].display = true
                }
            },
            //提交
            handleData(formQuote, done){
                this.formQuote.attachment = this.uploadUrl
                this.formQuote.quotePrice = parseFloat(this.formQuote.quotePrice);
                let reqData               = {...this.formQuote};
                if((!reqData.quotePrice || reqData.quotePrice <= 0) && !this.havePrice){
                    this.$message({
                        type   :"error",
                        message:"请输入正确的价格"
                    });
                    done();
                    return false;
                }
                reqData.promiseDate = parseInt(reqData.promiseDate / 1000);
                let arr             = []
                this.idList.forEach(item => {
                    arr.push({
                        ioId       :item,
                        attachment :this.uploadUrl,
                        quotePrice :reqData.quotePrice,
                        promiseDate:reqData.promiseDate,
                        supRemark  :reqData.supRemark,
                    })
                })
                this.fullscreenLoading = true
                subPrice(arr).then(() => {
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                    this.closeQuotedBatch()
                    this.refresh()
                }).finally(() => {
                    done()
                    this.fullscreenLoading = false
                });
            },
            //关闭抽屉的回调
            closeQuotedBatch(){
                this.uploadUrl = ''
                this.$refs.editform.resetForm()
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                });
                this.$emit('closeQuotedBatch')
            },
            refresh(){
                this.$emit('refresh')
            },
            //上传文件
            uploadAfter(res, done, loading){
                this.uploadUrl = res.link
                done()
            },
            //excel导入
            beforeUpload(file){
                this.fullscreenLoading = true
                let Xls                = file.name.split('.');
                if(Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx'){
                    return file
                }else{
                    this.$message.error('上传文件只能是 xls/xlsx 格式!')
                    this.fullscreenLoading = false
                    return false
                }
            },
            uploadSuccessHandle(res, file, fileList){
                if(res.code === 200){
                    this.$message({
                        message:'导入成功！',
                        type   :'success'
                    });
                    this.refreshChange();
                    this.fullscreenLoading = false
                }else{
                    this.$message({
                        message:res.msg,
                        type   :'error'
                    });
                    this.fullscreenLoading = false
                }
            },
            handleError(){
                this.fullscreenLoading = false
            },
        },
    };

</script>


<style scoped lang="scss">
</style>
