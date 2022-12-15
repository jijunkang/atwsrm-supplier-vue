<template>
  <basic-container id="supCentral">
    <avue-detail :option="supInfodetail" v-model="form">
    </avue-detail>
    <div class="agree">
      <el-checkbox v-model="checked">同意安特威采购合同条约</el-checkbox>
      <span><a @click="down()" style="font-size: 14px">下载打印采购合同条约</a></span>
      <el-upload
          action="/api/blade-resource/oss/endpoint/put-file"
          :headers="{'Blade-Auth':token}"
          list-type="picture-card"
          :on-preview="handlePictureCardPreviewCon"
          :on-success='handleSuccess'
          :file-list="fileList"
          :on-remove="handleRemoveCon">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisibleCon" append-to-body=false>
        <img width="100%" :src="uploadUrl" alt="">
      </el-dialog>
      <div style="width:148px;text-align:center;font-size: 14px">上传采购合同条约</div>
      <div style="width:148px;text-align:center;">
        <el-button type="primary" size="small" style="margin-top: 5px" @click="uploadContract()">提交</el-button>
      </div>

    </div>
    <div style="font-size: 18px;margin: 25px 0">企业资质</div>
    <table class="aptitudeTable" border="1" cellspacing="0" cellpadding="0" v-for="(list,index) in tableData">
      <tr style="background-color: lightgrey">
        <td>{{list.name}}</td>
        <td>证件有效期</td>
        <td>审核状态</td>
        <td>操作</td>
      </tr>
      <tr>
        <td>
          <div style="display:inline-block;float: left">
            <el-upload
                action="/api/blade-resource/oss/endpoint/put-file"
                :headers="{'Blade-Auth':token}"
                :on-preview="handlePictureCardPreview"
                :on-success='handlePermit'
                :file-list="list.fileListPermit"
                :on-remove="handleRemove"
                :show-file-list="false"
                :limit="1"
                style="display: inline-block">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button  style="margin-left: 10px" type="text" size="mini" v-if="list.imgSrc !='' " @click="viewImages(list.imgSrc)">查看影像</el-button>
          </div>
        </td>
        <td>
          <div style="display:inline-block;float: left;margin-left: 5px">
            <el-date-picker
                v-model="list.termStart"
                type="date"
                placeholder="选择起始日期"
                format="yyyy-MM-dd"
                value-format=timestamp
                :picker-options="pickerOptions"
                size="small"
            >
            </el-date-picker>
            &emsp;
            <span v-if="list.isForever == false">
              <el-date-picker
                  v-model="list.termEnd"
                  type="date"
                  placeholder="选择结束日期"
                  format="yyyy-MM-dd"
                  value-format=timestamp
                  :picker-options="pickerOptions"
                  size="small"
              >
              </el-date-picker>
            </span>
            <span style="margin: 15px 15px;font-size: 14px">长期有效</span>
            <el-checkbox v-model="list.isForever"></el-checkbox>
          </div>

        </td>
        <td>{{list.status|statusFmt}}</td>
        <td>
          <el-button type="primary" size="small" @click="submit(list,index)">提交</el-button>
        </td>
      </tr>
    </table>
  </basic-container>
</template>

<script>
    import {info, upload}                     from "@/api/supplier/supplier";
    import {list as qualList, submit, SUPQUA_STATUS_PAIR} from "@/api/supplier/supplierQualification";

    export default {
        created(){
            this.token = "bearer " + this.$store.getters.token;
            info().then((res) => {
                this.form                 = res.data.data
                this.isAgreePurchContract = this.form.isAgreePurchContract
                if(this.form.purchContract != ''){
                    var url = this.form.purchContract.split("|")
                    url.forEach((item) => {
                        this.fileList.push({"url":item, response:{data:{"link":item}}})
                    })
                }
                console.log("info", this.fileList)
            });
          qualList().then((res) => {
                var data = res.data.data
                data.forEach(item => {
                    item.termStart = item.termStart > 0 ? item.termStart * 1000 : ''
                    item.termEnd   = item.termEnd > 0 ? item.termEnd * 1000 : ''
                })
                this.tableData = data
            });
        },
        data(){
            return {
                // pickerOptions: {
                //     disabledDate(time) {
                //         return time.getTime() < Date.now() - 8.64e7;
                //     }
                // },
                SUPQUA_STATUS_PAIR  :SUPQUA_STATUS_PAIR,
                form                :{},
                dialogImageUrl      :'',
                uploadUrl           :'',
                uploadUrlList       :'',
                uploadUrlPermit     :'',
                dialogVisibleCon    :false,
                dialogVisible       :false,
                checked             :false,
                isAgreePurchContract:'',
                data                :[],
                urlData             :[],
                fileList            :[],
                fileListPermit      :[],
                token               :'',
                tableData           :[],
                supInfodetail       :{
                    icon  :'el-icon-collection-tag',
                    label :'供应商中心',
                    prop  :'group',
                    column:[
                        {
                            label:'成立日期',
                            prop :'foundDate',
                            span :8,
                        },
                        {
                            label:'供应商名称',
                            prop :'name',
                            span :8,
                        },
                        {
                            label:'电话',
                            prop :'phone',
                            span :8,
                        },
                        {
                            label:'税号',
                            prop :'nationalTaxCode',
                            span :8,
                        },
                        {
                            label:'邮箱',
                            prop :'email',
                            span :8,
                        },
                        {
                            label:'联系人',
                            prop :'ctcName',
                            span :8,
                        },
                        {
                            label:'地址',
                            prop :'address',
                            span :8,
                        },
                        {
                            label:'传真',
                            prop :'fax',
                            span :8,
                        },
                        {
                            label:'付款方式',
                            prop :'payWay',
                            span :8,
                        },
                        {
                            label    :'交货率',
                            prop     :'arvRate',
                            span     :8,
                            formatter:function(row, value, label, column){
                                return value = value * 100 + '%'
                            }
                        },
                        {
                            label    :'合格率',
                            prop     :'passRate',
                            span     :8,
                            formatter:function(row, value, label, column){
                                return value = value * 100 + '%'
                            }
                        },
                        {
                            label    :'信用等级',
                            prop     :'creditTotal',
                            span     :8,
                            formatter:function(row, value, label, column){
                                if(value >= 98){
                                    return '优';
                                }
                                if(value >= 95){
                                    return '良';
                                }
                                if(value >= 85){
                                    return '一般';
                                }
                                return '差';
                            },
                        },

                    ]
                },

            }
        },
        filters:{
            statusFmt:function(key){
                if(key <= 0){
                    return ''
                }
                return SUPQUA_STATUS_PAIR[key]
            }
        },
        methods:{
            handleRemoveCon(file, fileList){
                this.urlData = []
                fileList.forEach(item => {
                    this.urlData.push(item.response.data.link)
                })
                this.uploadUrlList = this.urlData.join('|');
            },
            handleRemove(file, fileList){
            },
            handlePictureCardPreviewCon(file){
                this.uploadUrl        = file.url;
                this.dialogVisibleCon = true;
            },
            handlePictureCardPreview(file){
                this.uploadUrlPermit = file.url;
                this.dialogVisible   = true;
            },
            //上传合同图片
            handleSuccess(res, file, fileList){
                console.log(fileList)
                this.urlData = []
                fileList.forEach(item => {
                    this.urlData.push(item.response.data.link)
                })
                this.uploadUrlList = this.urlData.join('|');
                if(res.code === 200){
                    this.$message({
                        message:'上传成功！',
                        type   :'success'
                    });
                    this.uploadUrl = res.data.link
                }else{
                    this.$message({
                        message:'上传失败',
                        type   :'error'
                    });
                }

            },
            //上传资质图片
            handlePermit(res, file, fileList, index){
                if(res.code === 200){
                    this.$message({
                        message:'上传成功！',
                        type   :'success'
                    });
                    this.uploadUrlPermit = res.data.link
                    // console.log(this.uploadUrlPermit)
                }else{
                    this.$message({
                        message:'上传失败',
                        type   :'error'
                    });
                }

            },
            uploadContract(){
                if(this.checked == false){
                    return this.$message({
                        message:'请同意安特威采购合同条约',
                        type   :'success'
                    });
                }
                if(this.isAgreePurchContract != 1){
                    return this.$message({
                        message:'您已上传过采购合同条约',
                        type   :'success'
                    });
                }
                var req = {
                    "id"                  :this.form.id,
                    "isAgreePurchContract":this.isAgreePurchContract,
                    "purchContract"       :this.uploadUrlList
                }
                upload(req).then((res) => {
                    this.$message({
                        message:'提交成功！',
                        type   :'success'
                    });
                    info().then((res) => {
                        this.isAgreePurchContract = this.form.isAgreePurchContract
                    })
                })
            },
            //下载打印合同条约
            down(){
                if(this.checked == true){
                    window.open('/static/template/purchase_agreement.pdf')
                }else{
                    this.$message({
                        message:'请同意安特威采购合同条约',
                        type   :'success'
                    });
                }
            },
            //提交
            submit(list, index){
              if(list.isForever == true){
                  list.termEnd = ""
              }
              var termStart=parseInt(list.termStart / 1000)
              var termEnd=parseInt(list.termEnd / 1000)
                let req = {
                    "code"     :list.code,
                    "id"       :list.id == -1 ? "null" : list.id,
                    "termStart":termStart,
                    "termEnd"  :termEnd,
                    "imgSrc"   :this.uploadUrlPermit == '' ? list.imgSrc : this.uploadUrlPermit,
                    "remark"   :list.remark,
                    "isForever":list.isForever ? 1 : 0
                }
              var time=termEnd-termStart
              if(list.isForever==true && termStart == ''){
                return this.$message.error("请选择起始日期")
              }else if(list.isForever==false && (termStart== '' ||termEnd== '')){
                return this.$message.error("请选择日期")
              }else if(list.isForever==false && time<0 ){
                  return this.$message.error("结束日期需大于起始日期")
              }
                submit(req).then(res => {
                   if(res.data.code==200){
                     this.$message({
                       message:'提交成功！',
                       type   :'success'
                     });
                     qualList().then((res) => {
                       var data = res.data.data
                       data.forEach(item => {
                         item.termStart = item.termStart > 0 ? item.termStart * 1000 : ''
                         item.termEnd   = item.termEnd > 0 ? item.termEnd * 1000 : ''
                       })
                       this.tableData = data
                     });
                   }else{
                     this.$message({
                       message:'提交失败！',
                       type   :'error'
                     });
                   }
                })
            },
          //查看影像
          viewImages(url){
            window.open(url)
          },
        },

    }
</script>

<style scoped>
  #supCentral{
    width            :100%;
    background-color :white;
  }

  .supInfo{
    width      :98%;
    font-size  :14px;
    border     :1px solid rgba(204, 208, 211, 0.6);
    margin-top :25px;
  }

  .supInfo, td{
    padding :8px;
  }

  .supInfo tr td:first-child{
    width :20%;
  }

  .supInfo tr td:nth-child(3){
    width :20%;
  }

  .agree{
    width      :98%;
    border     :1px solid rgba(204, 208, 211, 0.6);
    padding    :15px;
    margin-top :30px;
  }

  a{
    color :#004ca7;
  }

  a:hover{
    text-decoration       :underline;
    text-decoration-color :#004ca7;
    cursor                :pointer
  }

  .aptitudeTable{
    width     :98%;
    font-size :14px;
    border    :1px solid rgba(204, 208, 211, 0.6);
  }

  .aptitudeTable tr td{
    text-align :center;
  }
  .aptitudeTable tr:nth-child(2){
  height: 100px;
  }

  .aptitudeTable tr td:first-child{
    width      :18%;
    text-align :left;
  }
  .aptitudeTable tr td:nth-child(2){
    width      :62%;
    text-align :left;
  }

</style>
