<template>
  <basic-container>
    <el-col :span="16">
      <table border="1px" id="detail">
        <tr>
          <td>处理方式：</td>
          <td>{{form.processType}}</td>
          <td>返修流程：</td>
          <td>{{form.repairProcess}}</td>
          <td>罚款金额：</td>
          <td>{{$moneyUtils.formatMoney(form.finePrice)}}</td>
        </tr>
        <tr>
          <td>纠正要求来源：</td>
          <td>{{form.source}}</td>
          <td>发生时间：</td>
          <td>{{$dateUtils.dateFormat(new Date(form.discovererTime*1000),'yyyy-MM-dd hh:mm:ss')}}</td>
          <td>要求完成日期：</td>
          <td>{{$dateUtils.Time(form.reqTime)}}</td>
        </tr>
        <tr>
          <td>项目号：</td>
          <td>{{form.proNo}}</td>
          <td>采购单编号：</td>
          <td>{{form.poCode}}</td>
          <td>报告单号：</td>
          <td>{{form.reportCode}}</td>
        </tr>
        <tr>
          <td>不合格品单号：</td>
          <td>{{form.code}}</td>
          <td>不合格数量：</td>
          <td>{{form.unQualifiedQty}}</td>
          <td>炉批号：</td>
          <td>{{form.furnaceNo}}</td>
        </tr>
        <tr>
          <td>物料编号：</td>
          <td>{{form.itemCode}}</td>
          <td>物料描述：</td>
          <td colspan="3">{{form.itemName}}</td>
        </tr>
        <tr>
          <td>处理状态：</td>
          <td>{{NCR_STATUS_PAIR[form.status]}}</td>
          <td>结案人：</td>
          <td>{{form.caseName}}</td>
          <td>结案时间：</td>
          <td>{{form.caseTime}}</td>
        </tr>
      </table>
    </el-col>
    <div class="text">
      <el-col :span="16">
        <el-alert
            type="info"
            :closable="false"
            style="padding-left: 0px;margin:20px 0 0 0">
          <template slot='title'>
            <span style="font-size: 14px">问题描述</span>
          </template>
        </el-alert>
        <el-input
            type="textarea"
            :rows="5"
            :disabled="true"
            resize="none"
            size="small"
            placeholder="请输入内容"
            v-model="form.problemDesc">
        </el-input>
      </el-col>
      <el-col :span="16">
        <p>
          <span style="font-size: 14px">不良品图片</span>
        </p>
        <div class="imgView" @click="openImg(item)" v-for="item in form.imgs" v-if="form.imgs!=''">
                    <span>
                        <img width="100px" height="100px" :src="item" alt="">
                    </span>
        </div>
        <el-dialog :visible.sync="dialogVisible" :append-to-body=true width="40%">
          <el-button type="primary" plain size="mini" style="float: right;margin:5px 0px 15px 0px" @click="down">下载</el-button>
          <img width="100%" :src="imgUrl" alt="">
        </el-dialog>
      </el-col>
      <el-col :span="16">
        <span style="font-size:14px;font-weight:700;">是否接受罚款：</span>
        <el-radio v-model="isAccept" :label=1 :disabled="form.isAccept===1">接受</el-radio>
        <el-radio v-model="isAccept" :label=0 :disabled="form.isAccept===1">不接受</el-radio>
        <div style="font-size:14px;color:red">
          若确认接受罚款，则不能再次进行更改操作。
        </div>
      </el-col>
      <el-col :span="16">
        <el-alert
            type="info"
            :closable="false"
            style="padding-left: 0px;margin:20px 0 0 0">
          <template slot='title'>
            <span style="font-size: 14px">根本原因</span>
          </template>
        </el-alert>
        <div style="position:relative">
          <el-input
              type="textarea"
              :rows="5"
              resize="none"
              size="small"
              placeholder="请输入内容"
              :disabled="form.status===NCR_STATUS.INIT"
              v-model="form.cause">
          </el-input>
          <el-button class="button"
                     size="mini"
                     @click="submitCause(form.cause)"
                     v-if="form.status!=NCR_STATUS.INIT"
                     v-loading.fullscreen.lock="fullscreenLoading">提 交
          </el-button>
        </div>

      </el-col>
      <el-col :span="16">
        <el-alert
            type="info"
            :closable="false"
            style="padding-left: 0px;margin:20px 0 0 0">
          <template slot='title'>
            <span style="font-size: 14px">纠正措施</span>
          </template>
        </el-alert>
        <div class="talkbox">
          <div class="measures">
            <template v-for="item in form.rectifyList">
              <div :class="['message',{position:item.deptType=='sup'}]">
                <div class="message-title">{{`${item.deptName} ${item.replyUser} ${item.createTime}`}}</div>
                <div :class="['message-text',{msgcolor:item.deptType=='sup'}]">{{item.content}}</div>
              </div>
            </template>
          </div>
          <div style="position:relative">
            <el-input
                type="textarea"
                :rows="4"
                resize="none"
                size="small"
                placeholder="请输入内容"
                v-model="rectifyMsg">
            </el-input>
            <div class="inputbox">
              <span style="margin-left: 10px;">回复人：</span>
              <el-input
                  placeholder="请输入回复人"
                  v-model="rectifyUser"
                  size="mini"
                  style="width:220px">
              </el-input>
              <el-button class="button" size="mini" @click="rectifySendMsg"
                         v-if="form.status!=NCR_STATUS.INIT"
                         v-loading.fullscreen.lock="fullscreenLoading">回 复
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <el-alert
            type="info"
            :closable="false"
            style="padding-left: 0px;margin:20px 0 0 0">
          <template slot='title'>
            <span style="font-size: 14px">预防措施</span>
          </template>
        </el-alert>
        <div class="talkbox">
          <div class="measures">
            <template v-for="item in form.preventList">
              <div :class="['message',{position:item.deptType=='sup'}]">
                <div class="message-title">{{`${item.deptName} ${item.replyUser} ${item.createTime}`}}</div>
                <div :class="['message-text',{msgcolor:item.deptType=='sup'}]">{{item.content}}</div>
              </div>
            </template>
          </div>
          <div style="position:relative">
            <el-input
                type="textarea"
                :rows="4"
                resize="none"
                size="small"
                placeholder="请输入内容"
                v-model="preventMsg">
            </el-input>
            <div class="inputbox">
              <span style="margin-left: 10px;">回复人：</span>
              <el-input
                  placeholder="请输入回复人"
                  v-model="preventUser"
                  size="mini"
                  style="width:220px">
              </el-input>
              <el-button class="button" size="mini" @click="preventSendMsg"
                         v-if="form.status!=NCR_STATUS.INIT"
                         v-loading.fullscreen.lock="fullscreenLoading">回 复
              </el-button>
            </div>
          </div>
        </div>

      </el-col>
      <el-col :span="16">
        <div style="height:50px"></div>
      </el-col>
    </div>
  </basic-container>
</template>

<script>
    import {getDetail, reply, NCR_STATUS_PAIR, NCR_STATUS} from "@/api/ncr/ncr";
    import {mapGetters}                                    from "vuex";

    export default {
        name    :"index",
        data(){
            return {
                NCR_STATUS_PAIR  :NCR_STATUS_PAIR,
                NCR_STATUS       :NCR_STATUS,
                form             :{},
                active           :'3',
                ncrId            :'',
                title            :'',
                imgUrl           :'',
                imgList          :[],
                rectifyMsg       :'',//纠正措施
                rectifyUser      :'',//纠正措施回复人
                preventMsg       :'',//预防措施
                preventUser      :'',//预防措施回复人
                isAccept         :'',//是否接受罚款
                dialogVisible    :false,//图片
                fullscreenLoading:false,
            }
        },
        computed:{
            ...mapGetters(["tagList", "tag"])
        },
        created(){
            this.$route.meta.$keepAlive = false
            this.getInfo()
        },
        methods :{
            getInfo(){
                this.ncrId       = this.$route.query.id
                this.tag.label   = '纠正预防改善报告'
                this.rectifyMsg  = ''
                this.preventMsg  = ''
                this.rectifyUser = localStorage.getItem('rectifyUser')
                this.preventUser = localStorage.getItem('preventUser')
                getDetail({id:this.ncrId}).then((res) => {
                    this.form          = res.data.data
                    this.isAccept      = this.form.isAccept
                    this.form.imgs     = this.form.imgs.split(',')
                    this.form.caseTime = this.form.caseTime > 0 ? this.$dateUtils.dateFormat(new Date(this.form.caseTime * 1000), 'yyyy-MM-dd hh:mm:ss') : ''
                    this.form.rectifyList.forEach((item, index) => {
                        item.createTime = item.createTime.split('-')[1] + '/' + item.createTime.split('-')[2]
                    })
                    this.form.preventList.forEach((item, index) => {
                        item.createTime = item.createTime.split('-')[1] + '/' + item.createTime.split('-')[2]
                    })
                })
            },

            openImg(img){
                this.imgUrl        = img
                this.dialogVisible = true
            },
            down(){
                window.open(this.imgUrl)
            },
            refreshDetail(){
                this.$router.push({path:'/ncr/detail', query:{id:this.form.id}})
                this.getInfo()
            },
            //根本原因回复
            submitCause(cause){
                if(this.isAccept < 0){
                    return this.$message.warning('请选择是否接受罚款')
                }
                if(!cause){
                    return this.$message.warning('请输入根本原因')
                }
                //R
                let req                = {
                    ncrId     :this.form.id,
                    reportCode:this.form.reportCode,
                    cause     :cause,
                    isAccept  :this.isAccept,
                }
                this.fullscreenLoading = true
                reply(req).then(res => {
                    this.$message.success("提交成功！")
                    this.getInfo()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            //纠正措施回复
            rectifySendMsg(){
                if(this.isAccept < 0){
                    return this.$message.warning('请选择是否接受罚款')
                }
                if(!this.rectifyUser){
                    return this.$message.warning('请输入回复人')
                }else{
                    localStorage.setItem('rectifyUser', this.rectifyUser)
                }
                if(!this.rectifyMsg){
                    return this.$message.warning('需填写回复内容')
                }
                //J
                let req                = {
                    ncrId     :this.form.id,
                    reportCode:this.form.reportCode,
                    type      :'rectify',
                    deptType  :'sup',
                    replyUser :this.rectifyUser,
                    content   :this.rectifyMsg,
                    isAccept  :this.isAccept,
                }
                this.fullscreenLoading = true
                reply(req).then(res => {
                    this.$message.success("回复成功！")
                    this.getInfo()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
            //预防措施回复
            preventSendMsg(){
                if(this.isAccept < 0){
                    return this.$message.warning('请选择是否接受罚款')
                }
                if(!this.preventUser){
                    return this.$message.warning('请输入回复人')
                }else{
                    localStorage.setItem('preventUser', this.preventUser)
                }
                if(!this.preventMsg){
                    return this.$message.warning('需填写回复内容')
                }
                //Y
                let req                = {
                    ncrId     :this.form.id,
                    reportCode:this.form.reportCode,
                    type      :'prevent',
                    deptType  :'sup',
                    replyUser :this.preventUser,
                    content   :this.preventMsg,
                    isAccept  :this.isAccept,
                }
                this.fullscreenLoading = true
                reply(req).then(res => {
                    this.$message.success("回复成功！")
                    this.getInfo()
                }).finally(() => {
                    this.fullscreenLoading = false
                })
            },
        },
    }
</script>
<style scoped="scoped" lang="scss">
  .text /deep/{
    padding-left: 20px;
    width: 100%;
    margin: 10px 0px;

    .el-textarea__inner{
      border-radius: 0 0 4px 4px;
    }
  }

  .imgView{
    width: 100px;
    height: 100px;
    background-color: #e4e4e4;
    display: inline-block;
    margin: 5px 25px 5px 0px;
  }

  .imgView:hover{
    cursor: pointer;
  }

  //头部表格
  #detail{
    border-collapse: collapse;
    margin-left: 20px;
    width: 100%;
    border: 1px solid rgb(231, 234, 236);
    font-size: 14px;

    tr{
      height: 32px;
      line-height: 32px;

      td{
        padding-left: 10px;
      }
    }
  }

  #detail tr > td:nth-child(odd){
    width: 100px;
    background-color: rgb(250, 250, 250);
    font-weight: 700;
    text-align: right;
    color: #666666;
  }

  /*#detail tr > td:nth-child(2){*/
  /*  width: 150px;*/
  /*}*/

  .talkbox /deep/{
    .measures{
      border: 1px solid #DCDFE6;
      border-bottom: 1px solid transparent;
      width: calc(100% - 2px);
      height: 230px;
      overflow: scroll;
      overflow-x: hidden;
      background-color: #F5F7FA;
      /*border-top-left-radius: 4px;*/
      /*border-top-right-radius: 4px;*/

      .message{
        display: table;
        width: 100%;
        margin: 10px 5px;
        font-size: 13px;

        &-title{
          color: #7f7f7f;
          padding: 5px;
          margin-bottom: 5px;
        }

        &-text{
          max-width: 65%;
          background-color: #FFFFFF;
          border-radius: 2px 10px 10px 10px;
          padding: 8px 10px;
          line-height: 15pt;
          display: inline-block;
          text-align: left;
          margin: 5px;

          &.msgcolor{
            background-color: #C9E7FF;
            border-radius: 10px 2px 10px 10px;
          }
        }

        &.position{
          text-align: right;
        }
      }
    }

    .el-textarea__inner{
      border-radius: 0;
      border-bottom: 1px solid transparent;

      &:focus{
        outline: 0;
        border-color: #DCDFE6;
        border-bottom: 1px solid transparent;
      }

      &:hover{
        outline: 0;
        border-color: #DCDFE6;
        border-bottom: 1px solid transparent;
      }
    }

    .inputbox{
      font-size: 13px;
      border: 1px solid #DCDFE6;
      border-top: 1px solid transparent;
      /*width: 100%;*/
      height: 40px;
      line-height: 40px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;

      .el-input__inner{
        border: 1px solid transparent;
        border-bottom: 1px solid #DCDFE6;
      }
    }
  }

  .button{
    float: right;
    position: absolute;
    bottom: 5px;
    right: 5px;
  }

  .el-alert--info.is-light{
    background-color: #409EFF;
    color: #FFFFFF;
  }

  .el-alert{
    border-radius: 0px;
  }
</style>