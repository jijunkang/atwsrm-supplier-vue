<template>
  <div id="editInformation">
    <el-drawer
        title="编辑供应商信息"
        :visible.sync="table"
        direction="rtl"
        size="70%"
        @close="closeDrawer">
      <div id="content" style="width: 100%;height: 100%;overflow: hidden;overflow: scroll">
        <!--基本信息-->
        <avue-form :option="option" v-model="form" @submit="handleSubmit">
          <template slot="group1Header">
            <i class="el-icon-collection-tag"style="margin-right: 8px;font-size: 20px;"></i><span style="margin-right: 20px;width: 100px">基本信息</span>
            <span style="color: red;width: 130px">* 供应商编码：</span>
            <div style="width: 200px;display: inline"><el-input v-model="code" placeholder=""></el-input></div>
          </template>
        </avue-form>
        <!--近3年财务状况-->
        <el-table
            :data="tableData"
            border
            style="width: 98%;margin: 0 auto;"
            align="center"
            :cell-style='cellStyle'
            :header-cell-style='rowClass'
         >
          <el-table-column
              prop="year"
              label="年份"
              width="70">
          </el-table-column>
          <el-table-column
              prop="allmoney"
              label="企业总资产"
              width="100">
          </el-table-column>
          <el-table-column
              prop="totaldebt"
              label="总负债">
          </el-table-column>
          <el-table-column
              prop="currentassets"
              label="流动资产">
          </el-table-column>
          <el-table-column
              prop="currentliabilities"
              label="流动负债">
          </el-table-column>
          <el-table-column
              prop="businessincome"
              label="营业收入">
          </el-table-column>
          <el-table-column
              prop="netprofit"
              label="净利润">
          </el-table-column>
          <el-table-column
              prop="assetliabilityratio"
              label="资产负债率"
              width="100">
          </el-table-column>
          <el-table-column
              prop="liquidityratio"
              label="流动比率">
          </el-table-column>
          <el-table-column
              prop="totalassets"
              label="总资产收益率"
              width="120">
          </el-table-column>
        </el-table>
        <!--银行账号-->
        <avue-form :option="account"></avue-form>
        <el-table
            :data="bankAccount"
            border
            style="width: 98%;margin: 5px auto;"
            align="center"
            :cell-style='cellStyle'
            :header-cell-style='rowClass'>
          <el-table-column
              prop="banknum"
              label="银行编号"
          >
          </el-table-column>
          <el-table-column
              prop="bankname"
              label="银行名称"
          >
          </el-table-column>
          <el-table-column
              prop="openbankname"
              label="开户行名称"
              width="120">
          </el-table-column>
          <el-table-column
              prop="accountname"
              label="账户名称">
          </el-table-column>
          <el-table-column
              prop="openbankaddress"
              label="开户行地址"
              width="120">
          </el-table-column>
          <el-table-column
              prop="openbanktel"
              label="开户行电话"
              width="120">
          </el-table-column>
          <el-table-column
              prop="accounttype"
              label="账户类型">
          </el-table-column>
          <el-table-column
              prop="state"
              label="状态">
          </el-table-column>
        </el-table>
        <avue-form :option="agreement"></avue-form>
        <div id="g5" style="margin-left:45px ;height:50px">
          <span>*下载模板：</span>
          <a href="#">供应商合作条款下载</a>
          <a href="#">供应商连接承诺模板</a>
          <a href="#">供应商合作补充协议下载</a>
        </div>
        <avue-form :option="uploaddoc"></avue-form>
        <avue-form :option="certificate"></avue-form>
        <!--资质证书-->
        <el-table
            :data="certificates"
            border
            style="width: 98%;margin: 0 auto;"
            align="center"
            :cell-style='cellStyle'
            :header-cell-style='rowClass'>
          <el-table-column
              prop="certificatename"
              label="资质证书名称"
          >
          </el-table-column>
          <el-table-column
              prop="getdate"
              label="取得日期"
          >
          </el-table-column>
          <el-table-column
              prop="termofvalidity"
              label="有效期">
          </el-table-column>
          <el-table-column
              prop="tcb"
              label="发证机构">
          </el-table-column>
          <el-table-column
              prop="uploadattach"
              label="上传附件">
          </el-table-column>
        </el-table>
        <avue-form :option="informations" v-model="forminform"></avue-form>
        <avue-form :option="customers"></avue-form>
        <!--主要客户和市场-->
        <el-table
            :data="certificatesm"
            border
            style="width: 98%;margin: 0 auto;margin-bottom: 20px;"
            align="center"
            :cell-style='cellStyle'
            :header-cell-style='rowClass'>
          <el-table-column
              prop="customersname"
              label="客户名称"
          >
          </el-table-column>
          <el-table-column
              prop="customersindustry"
              label="客户所属行业"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.customersindustry" placeholder="请选择" @change="valuenum" >
                <el-option
                    v-for="item in industrys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              prop="customertelsname"
              label="客户联系人姓名"
          >
          </el-table-column>
          <el-table-column
              prop="customerstel"
              label="客户联系电话">
          </el-table-column>
          <el-table-column
              prop="customersemail"
              label="客户联系邮箱">
          </el-table-column>
        </el-table>
        <span style="margin-left: 15px;">主市场</span>
        <div style="width: 98%;margin:0 auto;margin-bottom: 25px;">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="textarea"
              resize="none"
          >
          </el-input>
        </div>
        <!--主要产品-->
        <avue-form :option="mainproduct"></avue-form>
        <el-table
            :data="keyproduct"
            border
            style="width: 98%;margin: 0 auto;margin-bottom: 20px;"
            align="center"
            :cell-style='cellStyle'
            :header-cell-style='rowClass'>
          <el-table-column
              prop="keyproductname"
              label="产品名称"
          >
          </el-table-column>
          <el-table-column
              prop="keyproductnum"
              label="产品编号"
          >
          </el-table-column>
          <el-table-column
              prop="monthproduct"
              label="每月产量"
          >
          </el-table-column>
          <el-table-column
              prop="period"
              label="交期周期">
          </el-table-column>
          <el-table-column
              prop="remarks"
              label="备注">
          </el-table-column>
        </el-table>
        <!--发生给供应商的资料-->
        <avue-form :option="senddata"></avue-form>
        <avue-crud :data="data" :option="senddatatable" v-model="obj" :before-close="beforeOpen">
          <template slot-scope="scope" slot="menu">
            <el-button type="primary"
                       size="small"
                       plain>发送
            </el-button>
          </template>
        </avue-crud>
        <!--供应商建档流程记录信息-->
        <avue-form :option="processrecord">

          <template slot="recordHeader">
            <i class="el-icon-collection-tag"style="margin-right: 8px;font-size: 20px;"></i><span style="margin-right: 20px;width:220px">供应商建档流程记录信息</span>
            <span style="color: red;width: 130px">* 采购员：</span>
            <div style="width: 200px;display: inline"><el-input v-model="buyer" placeholder=""></el-input></div>
          </template>
        </avue-form>
        <!--时间线-->
        <div class="block" style="margin-left: 25px">
          <el-timeline>
            <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp"
                placement="top">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>

  </div>
</template>
<script>
    export default {
        name: 'supplier-detail',
        props: ['table'],
        data() {
            return {
                obj: {},
                textarea: '',
                code: '',
                buyer:'',
                tableData: [{
                    year: '2019',
                    allmoney: '',
                    totaldebt: '',
                    currentassets: '',
                    currentliabilities: '',
                    businessincome: '',
                    netprofit: '',
                    assetliabilityratio: '',
                    liquidityratio: '',
                    totalassets: ''
                }, {
                    year: '2018',
                    allmoney: '',
                    totaldebt: '',
                    currentassets: '',
                    currentliabilities: '',
                    businessincome: '',
                    netprofit: '',
                    assetliabilityratio: '',
                    liquidityratio: '',
                    totalassets: ''
                }, {
                    year: '2017',
                    allmoney: '',
                    totaldebt: '',
                    currentassets: '',
                    currentliabilities: '',
                    businessincome: '',
                    netprofit: '',
                    assetliabilityratio: '',
                    liquidityratio: '',
                    totalassets: ''
                }],
                bankAccount: [{
                    banknum: '',
                    bankname: '',
                    openbankname: '',
                    accountname: '',
                    openbankaddress: '',
                    openbanktel: '',
                    accounttype: '基本户',
                    state: '',
                }, {
                    banknum: '',
                    bankname: '',
                    openbankname: '',
                    accountname: '',
                    openbankaddress: '',
                    openbanktel: '',
                    accounttype: '一般户',
                    state: '',
                }, {
                    banknum: '',
                    bankname: '',
                    openbankname: '',
                    accountname: '',
                    openbankaddress: '',
                    openbanktel: '',
                    accounttype: '一般户',
                    state: '',
                }],
                certificates: [{
                    certificatename: '',
                    getdate: '',
                    termofvalidity: '',
                    tcb: '',
                    uploadattach: '',
                }, {
                    certificatename: '',
                    getdate: '',
                    termofvalidity: '',
                    tcb: '',
                    uploadattach: '',
                }, {
                    certificatename: '',
                    getdate: '',
                    termofvalidity: '',
                    tcb: '',
                    uploadattach: '',
                }],
                certificatesm: [{
                    customersname: '',
                    customersindustry: '',
                    customertelsname: '',
                    customerstel: '',
                    customersemail: ''
                }, {
                    customersname: '',
                    customersindustry: '',
                    customertelsname: '',
                    customerstel: '',
                    customersemail: ''
                }, {
                    customersname: '',
                    customersindustry: '',
                    customertelsname: '',
                    customerstel: '',
                    customersemail: ''
                }],
                industrys: [{
                    value: '选项1',
                    label: '字典1'
                }, {
                    value: '选项2',
                    label: '字典2'
                }, {
                    value: '选项3',
                    label: '字典3'
                }, {
                    value: '选项4',
                    label: '字典4'
                }, {
                    value: '选项5',
                    label: '字典5'
                }],
                value:'',
                keyproduct: [{
                    keyproductname: '',
                    keyproductnum: '',
                    monthproduct: '',
                    period: '',
                    remarks: ''
                }, {
                    keyproductname: '',
                    keyproductnum: '',
                    monthproduct: '',
                    period: '',
                    remarks: ''
                }, {
                    keyproductname: '',
                    keyproductnum: '',
                    monthproduct: '',
                    period: '',
                    remarks: ''
                }],
                data: [
                    {
                        senddate: '',
                        sendcontent: '模板名称',
                        email: '',
                        sendstate: '',
                        signsin: '',
                    }, {
                        senddate: '',
                        sendcontent: '模板名称',
                        email: '',
                        sendstate: '',
                        signsin: '',
                    }, {
                        senddate: '',
                        sendcontent: '模板名称',
                        email: '',
                        sendstate: '',
                        signsin: '',
                    }
                ],
                activities: [{
                    content: '姓名（采购部-采购员）',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-success'
                }, {
                    content: '姓名（采购部 - 部门经理）',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87',
                    size: 'large',
                    icon: 'el-icon-refresh'
                }, {
                    content: '姓名（副总经理）',
                    // timestamp: '2018-04-03 20:46',
                    size: 'large',
                    icon: 'el-icon-more',
                }, {
                    content: '姓名（副总经理）',
                    icon: 'el-icon-more',
                    size: 'large',
                    // timestamp: '2018-04-03 20:46'
                }],
                form: {
                    //group1基本信息
                    enterprisename: '',
                    legalrepresent: '',
                    runaddress: '',
                    primarycontactname: "",
                    cellphone: '',
                    enterprisephone: '',
                    contactemail: '',
                    fax: '',
                    //group2付款方式和开票资料
                    payratio: '',
                    taxrate: '',
                    tradecurrency: '',
                    invoiceissuing: '',
                    dutyparagraph: '',
                    //group6人员信息
                },
                forminform: {
                    allpeople: '',
                    allmanagers: '',
                    alltechnical: '',
                    allquality: '',
                    allproduction: ''
                },
                option: {
                    menuBtn: false,
                    group: [
                        {
                            label: '分组1',
                            prop: 'group1',
                            icon: 'el-icon-collection-tag',
                            column: [{
                                label: '企业名称',
                                prop: 'enterprisename',
                                labelWidth: '80px',
                                span: 8,
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '法人代表',
                                prop: 'legalrepresent',
                                labelWidth: '80px',
                                span: 8,
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            },
                                {
                                    label: '经营地址',
                                    prop: 'runaddress',
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                },
                                {
                                    label: '企业成立时间',
                                    prop: 'date',
                                    type: "date",
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]

                                },
                                {
                                    label: '主联系人姓名',
                                    prop: 'primarycontactname',
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                },
                                {
                                    label: '联系人手机',
                                    prop: 'cellphone',
                                    type: 'phone',
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                },
                                {
                                    label: ' 企业电话',
                                    prop: 'enterprisephone',
                                    type: 'phone',
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                },
                                {
                                    label: ' 联系人邮箱',
                                    prop: 'contactemail',
                                    labelWidth: '80px',
                                    span: 8,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]

                                },
                                {
                                    label: ' 传真',
                                    prop: 'fax',
                                    labelWidth: '80px',
                                    span: 8,
                                },
                                {
                                    label: "企业性质",
                                    prop: "sex",
                                    labelWidth: '80px',
                                    span: 24,
                                    type: "radio",
                                    dicData: ENTERPRISE.NATURE,
                                    mock: {
                                        type: 'enterprise'
                                    },
                                    value: 0,
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                },]
                        }, {
                            // icon:'el-icon-info',
                            label: '付款方式和开票资料',
                            prop: 'group2',
                            icon: 'el-icon-collection-tag',
                            column: [{
                                label: '付款方式',
                                prop: 'type',
                                type: "select",
                                dicData: ENTERPRISE.PAY,
                                mock: {
                                    type: 'enterprise',
                                },
                                span: 6,
                                labelWidth: '80px',
                            }, {
                                label: '预付款比例',
                                prop: 'payratio',
                                span: 6,
                                labelWidth: '80px',
                            }, {
                                label: '税率',
                                prop: 'taxrate',
                                type: 'select',
                                dicData: ENTERPRISE.TAX,
                                mock: {
                                    type: 'enterprise',
                                },
                                span: 6,
                                labelWidth: '80px',
                            }, {
                                label: '交易币种',
                                prop: 'tradecurrency',
                                type: 'select',
                                dicData: ENTERPRISE.TRADECUR,
                                mock: {
                                    type: 'enterprise',
                                },
                                span: 6,
                                labelWidth: '80px',
                            }, {
                                label: '开票抬头',
                                prop: 'invoiceissuing',
                                span: 8,
                                labelWidth: '80px',
                            }, {
                                label: '税号',
                                prop: 'dutyparagraph',
                                span: 8,
                                labelWidth: '80px',
                            },]
                        }, {
                            icon: 'el-icon-collection-tag',
                            label: '近3年财务状况',
                            prop: 'group3',
                        }
                    ]
                },
                account: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '银行账号',
                            prop: 'group4',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                agreement: {
                    menuBtn: false,
                    group: [
                        {
                            label: '供应商协议',
                            prop: 'group5',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                uploaddoc: {
                    menuBtn: false,
                    labelWidth: 120,
                    column: [{
                        label: '*上传文件回执',
                        prop: 'imgUrl',
                        type: 'upload',
                        span: 24,
                        listType: 'picture-card',
                        // tip: '只能上传jpg/png文件，且不超过500kb',
                        propsHttp: {
                            res: 'data'
                        },
                        action: '/imgupload'
                    }]

                },
                certificate: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '资质证书',
                            prop: 'group6',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                informations: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '人员信息',
                            prop: 'group7',
                            icon: 'el-icon-collection-tag',
                            column: [{
                                label: '职工总人数',
                                prop: 'allpeople',
                                span: 6,
                                labelWidth: '120px',

                            }, {
                                label: '管理人员人数',
                                prop: 'allmanagers',
                                span: 6,
                                labelWidth: '120px',
                            }, {
                                label: '技术及研发人员人数',
                                prop: 'alltechnical',
                                span: 6,
                                labelWidth: '120px',
                            }, {
                                label: '质检人员人数',
                                prop: 'allquality',
                                span: 6,
                                labelWidth: '120px',

                            }, {
                                label: '生产人员人数',
                                prop: 'allproduction',
                                labelWidth: '120px',
                                span: 6,
                            }]

                        }]
                },
                customers: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '主要客户和市场',
                            prop: 'group6',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                mainproduct: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '主要产品',
                            prop: 'group7',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                senddata: {
                    menuBtn: false,
                    group: [
                        {
                            // icon:'el-icon-info',
                            label: '发生给供应商的资料',
                            prop: 'senddata',
                            icon: 'el-icon-collection-tag',

                        }]
                },
                senddatatable: {
                    page: false,
                    delBtn: false,
                    editBtn: false,
                    index:true,
                    indexLabel:'序号',
                    align: 'center',
                    menuAlign: 'center',
                    column: [
                        {
                            label: '发送日期',
                            prop: 'senddate'
                        }, {
                            label: "发送内容",
                            prop: "sendcontent",
                        }, {
                            label: "邮箱",
                            prop: "email",
                        }, {
                            label: "发送状态",
                            prop: "sendstate",
                        }, {
                            label: "供应商是否签收",
                            prop: "signsin",


                        },
                    ]
                },
                processrecord: {
                    menuBtn: false,
                    group: [
                        {
                            label: '供应商建档流程记录信息',
                            prop: 'record',
                            icon: 'el-icon-collection-tag',

                        }]
                },
            }
        },
        methods: {
            handleSubmit(form) {
                this.$message.success(JSON.stringify(this.form))
            },
            closeDrawer() {
                this.$emit('func', false)
            },
            cellStyle({row, column, rowIndex, columnIndex}){
                return 'text-align:center';
            },

            rowClass({row, rowIndex}){
                return 'text-align:center';
            }
        }
    }

    var ENTERPRISE = {
        NATURE: [{
            label: '代销商',
            value: 0
        }, {
            label: '国内独资',
            value: 1
        }, {
            label: '外资或中外合资',
            value: 2
        }, {
            label: '上市公司',
            value: 3
        }],
        PAY: [{
            label: '月结30天',
            value: '30',
        }, {
            label: '月结45天',
            value: '45'
        }, {
            label: '月结60天',
            value: '60'
        }, {
            label: '月结90天',
            value: '90'
        }, {
            label: '月结120天',
            value: '120'
        }],
        TAX: [{
            label: '0%',
            value: 1,
        }, {
            label: '3%',
            value: 2
        }, {
            label: '5%',
            value: 3
        }, {
            label: '6%',
            value: 4
        }, {
            label: '10%',
            value: 5
        }, {
            label: '13%',
            value: 6
        }, {
            label: '16%',
            value: 7
        }, {
            label: '17%',
            value: 8
        }],
        TRADECUR: [{
            label: '人民币',
            value: 1
        }, {
            label: '港元',
            value: 2
        }, {
            label: '欧元',
            value: 3
        }, {
            label: '台币',
            value: 4
        }, {
            label: '美元',
            value: 5
        }, {
            label: '澳币',
            value: 6
        },]
    }
</script>
<style>
  /*.el-table--border th{*/
  /*  border-top: 1px solid #EBEEF5;*/
  /*}*/

  #g5 a {
    text-decoration: underline;
    margin-right: 15px;
    color: #00a680;
  }
</style>
