<template>
  <div>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @filter-change="filterChange"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   v-if="permission.customer_add"
                   icon="el-icon-plus"
                   @click="isCustomerAddVisible = true">新 增
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="permission.customer_export"
                   icon="el-icon-upload2"
                   @click="handleExcel">导 出
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.customer_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot="customerName" slot-scope="scope">
        <el-link type="primary" @click="showDetail(scope.row.id)">{{scope.row.customerName}}</el-link>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-chat-line-round" size="mini"
                   @click="handleFollowUp(scope.row,scope.index)">跟进
        </el-button>
        <el-button type="text" icon="el-icon-thumb" size="mini"
                   @click="handleAssign(scope.row,scope.index)">指派
        </el-button>
        <el-button type="text" icon="el-icon-user" size="mini"
                   @click="handleContact(scope.row,scope.index)">联系人
        </el-button>
        <el-button type="text" icon="el-icon-edit" size="mini"
                   @click="handleEdit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" icon="el-icon-upload2" size="mini"
                   @click="handleTopping(scope.row,scope.index)">置顶
        </el-button>
        <!--        <el-button type="text" icon="el-icon-delete" size="mini"-->
        <!--                   @click="handleDel(scope.row,scope.index)">删除-->
        <!--        </el-button>-->
      </template>
      <template slot="searchMenu">
        <el-button size="mini" @click="showFilterDialog">高级搜索</el-button>
      </template>
    </avue-crud>

    <el-drawer title="新增客户" size="800px" :visible.sync="isCustomerAddVisible">
      <div class="drawer-wrap">
        <avue-form ref="addForm" v-model="addFormData" :option="addFormOption"></avue-form>
      </div>
    </el-drawer>

    <el-drawer title="新增跟进" size="600px" :visible.sync="isFollowUpVisible">
      <div class="drawer-wrap">
        <avue-form ref="appointForm" v-model="followUpFormData" :option="followUpFormOption">
        </avue-form>
      </div>
    </el-drawer>

    <el-drawer title="指派给" size="600px" :visible.sync="isAssignVisible">
      <div class="drawer-wrap">
        <avue-form ref="assignForm" v-model="assignFormData" :option="assignFormOption">
        </avue-form>
      </div>
    </el-drawer>
    <el-drawer title="联系人" size="1000px" :visible.sync="isContactVisible">
      <div>
        <avue-form siez="mini" ref="contactForm" v-model="contactFormData" :option="contactFormOption">
        </avue-form>
      </div>
    </el-drawer>

    <el-drawer title="客户信息" size="1200px" :visible.sync="isDetailVisible">
      <div class="drawer-wrap">
        <div class="detail-wrap">
          <el-card class="detail-header box-card">
            <div class="header-title">
              <span style="margin-right: 10px">苏州睿途网络科技有限公司</span> <i class="iconfont iconicon_safety"></i>
              <el-dropdown>
                <span class="el-dropdown-link">客户网络资讯<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>百度客户名称</el-dropdown-item>
                  <el-dropdown-item>百度手机号码</el-dropdown-item>
                  <el-dropdown-item>360客户名称</el-dropdown-item>
                  <el-dropdown-item>360手机号码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="header-subtitle">
              <div class="label-box"><label class="lable">客户归属：</label><span class="lable-value">赵小刚</span></div>
              <div class="label-box"><label class="lable">首联系人：</label><span class="lable-value">李小红</span></div>
              <div class="label-box"><label class="lable">下次跟进：</label><span class="lable-value">2019-10-25 16:37</span></div>
            </div>

            <div class="header-btns">
              <el-dropdown>
                <el-button icon="el-icon-plus" size="small">新增<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>联系人</el-dropdown-item>
                  <el-dropdown-item>商机</el-dropdown-item>
                  <el-dropdown-item>订单</el-dropdown-item>
                  <el-dropdown-item>工单</el-dropdown-item>
                  <el-dropdown-item>费用</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button icon="el-icon-chat-line-round" size="small" style="margin-left: 10px">写新跟进</el-button>
              <el-button icon="iconfont iconicon_exchange" size="small">转移客户</el-button>
              <el-button icon="el-icon-s-custom" size="small">移入公海</el-button>
              <el-button icon="iconfont iconicon_message" size="small">发送短信</el-button>
              <el-button icon="el-icon-star-off" size="small">重点关注</el-button>
              <el-button icon="el-icon-edit-outline" size="small">编辑客户</el-button>
              <el-button icon="el-icon-delete" size="small">删除客户</el-button>
            </div>
          </el-card>

          <el-card class="detail-body box-card">
            <el-tabs class="tab-wrap">
              <el-tab-pane label="概况信息">
                <!--基本信息-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>基本信息</span>
                    <el-button class="show-detail" type="text">查看详情 <i class="el-icon-arrow-right"></i></el-button>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">客户名称：</td>
                        <td class="display-table-value">深圳市亿恩科技有限公司</td>
                        <td class="display-table-latbel">系统编号：</td>
                        <td class="display-table-value">KH20190324010001</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户类型：</td>
                        <td class="display-table-value">企业</td>
                        <td class="display-table-latbel">所属行业：</td>
                        <td class="display-table-value">电子商务</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户星级：</td>
                        <td class="display-table-value">
                          <el-rate disabled value="3"></el-rate>
                        </td>
                        <td class="display-table-latbel">客户来源：</td>
                        <td class="display-table-value">电话营销</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户状态：</td>
                        <td class="display-table-value">正在跟进</td>
                        <td class="display-table-latbel">客户归属：</td>
                        <td class="display-table-value">赵小刚 (已锁定，保护到期时间10/30)</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
                <!--首联系人-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>首联系人</span>
                    <el-button class="show-detail" type="text">查看详情 <i class="el-icon-arrow-right"></i></el-button>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">联系人姓名：</td>
                        <td class="display-table-value">李小红 编辑 详情</td>
                        <td class="display-table-latbel">手机号码：</td>
                        <td class="display-table-value">18888888888 拨打 短信</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">角色：</td>
                        <td class="display-table-value">决策人</td>
                        <td class="display-table-latbel">部门职务：</td>
                        <td class="display-table-value">部门经理</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">生日：</td>
                        <td class="display-table-value">1984-06-22</td>
                        <td class="display-table-latbel">电子邮箱：</td>
                        <td class="display-table-value">windir@xx.com</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">固定电话：</td>
                        <td class="display-table-value">0755-88888888 拨打</td>
                        <td class="display-table-latbel">传真号码：</td>
                        <td class="display-table-value">0755-88888888</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
                <!--相关数据-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>相关数据</span>
                  </div>
                  <div>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">联系人</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">跟进记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">电话记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">短信记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">任务记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">工单记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">退款记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">商机记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">订单记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">发票记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>

                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">费用记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>

                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">相关附件</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">归属记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="grid-content">
                          <div class="grid-label">操作记录</div>
                          <el-button type="text"> 10条</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>

                <!--客户动态-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>客户动态</span>
                    <div class="show-detail">
                      <el-checkbox v-model="checked">只看跟进</el-checkbox>
                      <el-button type="primary" size="mini" icon="el-icon-chat-line-round"> 写进度</el-button>
                    </div>
                  </div>
                  <action-list></action-list>
                </el-card>

              </el-tab-pane>
              <el-tab-pane label="资料详情">
                <!--基本信息-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>基本信息</span>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">客户名称：</td>
                        <td class="display-table-value">深圳市亿恩科技有限公司</td>
                        <td class="display-table-latbel">系统编号：</td>
                        <td class="display-table-value">KH20190324010001</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户类型：</td>
                        <td class="display-table-value">企业</td>
                        <td class="display-table-latbel">所属行业：</td>
                        <td class="display-table-value">电子商务</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户星级：</td>
                        <td class="display-table-value">
                          <el-rate disabled value="3"></el-rate>
                        </td>
                        <td class="display-table-latbel">客户来源：</td>
                        <td class="display-table-value">电话营销</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">客户状态：</td>
                        <td class="display-table-value">正在跟进</td>
                        <td class="display-table-latbel">客户归属：</td>
                        <td class="display-table-value">赵小刚 (已锁定，保护到期时间10/30)</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
                <!--附加信息-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>附加信息</span>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">所在地区：</td>
                        <td class="display-table-value">广东省深圳市</td>
                        <td class="display-table-latbel">详细地址：</td>
                        <td class="display-table-value">罗湖区泥岗东路</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">企业规模：</td>
                        <td class="display-table-value">10-20人</td>
                        <td class="display-table-latbel">备注信息：</td>
                        <td class="display-table-value">-</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
                <!--财务信息-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>财务信息</span>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">已成交金额：</td>
                        <td class="display-table-value"> ¥ 10,000.00</td>
                        <td class="display-table-latbel">已回款金额：</td>
                        <td class="display-table-value"> ¥ 10,000.00</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">已开票金额：</td>
                        <td class="display-table-value"> ¥ 10,000.00</td>
                        <td class="display-table-latbel">未开票金额：</td>
                        <td class="display-table-value">¥ 10,000.00</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">潜在交易金额：</td>
                        <td class="display-table-value"> ¥ 10,000.00</td>
                        <td class="display-table-latbel">费用总金额：</td>
                        <td class="display-table-value">¥ 10,000.00</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
                <!--系统信息-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>系统信息</span>
                  </div>
                  <div>
                    <table class="display-table">
                      <tr>
                        <td class="display-table-latbel">系统编号：</td>
                        <td class="display-table-value"> KH20190324010001</td>
                        <td class="display-table-latbel">协作人员：</td>
                        <td class="display-table-value"> 李小明、陈小红、曾小芳</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">所属部门：</td>
                        <td class="display-table-value"> 销售一部</td>
                        <td class="display-table-latbel"> 创建人员：</td>
                        <td class="display-table-value">赵小刚</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">前归属人：</td>
                        <td class="display-table-value"> 赵小刚</td>
                        <td class="display-table-latbel">前所属部门：</td>
                        <td class="display-table-value">销售一部</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">创建时间：</td>
                        <td class="display-table-value"> 2019-03-15 17:27</td>
                        <td class="display-table-latbel">更新时间：</td>
                        <td class="display-table-value"> 2019-03-15 17:27</td>
                      </tr>
                      <tr>
                        <td class="display-table-latbel">最后跟进：</td>
                        <td class="display-table-value"> 2019-03-15 17:27</td>
                        <td class="display-table-latbel">下次跟进：</td>
                        <td class="display-table-value"> 2019-03-15 17:27</td>
                      </tr>
                    </table>
                  </div>
                </el-card>


              </el-tab-pane>
              <el-tab-pane label="联系人">
                <contact-list></contact-list>
              </el-tab-pane>

              <el-tab-pane label="跟进记录">
                <!--跟进记录-->
                <el-card class=" box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-collection-tag"></i>跟进记录</span>
                    <div class="float-right btn-group">
                      <el-date-picker
                          size="mini"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                      </el-date-picker>
                      <el-input v-model="input" size="mini" placeholder="关键字" style="margin-left:8px; width: 128px;"></el-input>
                      <el-button type="primary" size="mini" icon="el-icon-upload2" style="margin-left:8px">导出</el-button>
                    </div>
                  </div>
                  <action-list></action-list>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="工单记录">
                <workorder-list></workorder-list>
              </el-tab-pane>
              <el-tab-pane label="商机记录">商机记录</el-tab-pane>
              <el-tab-pane label="订单记录">订单记录</el-tab-pane>
              <el-tab-pane label="发票记录">发票记录</el-tab-pane>
              <el-tab-pane label="退款记录">退款记录</el-tab-pane>
              <el-tab-pane label="费用记录">费用记录</el-tab-pane>
              <el-tab-pane label="相关附件">相关附件</el-tab-pane>
              <el-tab-pane label="归属记录">归属记录</el-tab-pane>
              <el-tab-pane label="操作日志">操作日志</el-tab-pane>
            </el-tabs>
          </el-card>
        </div>

      </div>
    </el-drawer>

  </div>
</template>

<script>
    import {getList, getDetail, add, update, remove} from "@/api/customer/customer";
    import {mapGetters}                              from "vuex";
    import contactList                               from "./contact-list";
    import actionList                                from "./action-list";
    import workorderList                             from "../workorder/workorder";

    export default {
        components:{
            contactList,
            actionList,
            workorderList
        },
        data(){
            return {
                isCustomerAddVisible:false,
                isFollowUpVisible   :false, // 跟进
                isAssignVisible     :false,    //指派
                isContactVisible    :false,   //联系人
                isDetailVisible     :false,   //详细信息
                form                :{},
                query               :{},
                loading             :true,
                page                :{
                    pageSize   :10,
                    currentPage:1,
                    total      :0
                },
                selectionList       :[],
                option              :{
                    height         :'auto',
                    calcHeight     :350,
                    tip            :true,
                    border         :true,
                    index          :false,
                    selection      :true,
                    searchBtn      :false,
                    excelBtn       :false,
                    addBtn         :false,
                    viewBtn        :false,
                    editBtn        :false,
                    delBtn         :false,
                    dialogType     :"drawer",
                    dialogWidth    :'800px',
                    menuWidth      :'320px',
                    size           :'mini',
                    column         :[
                        {
                            "type"      :"input",
                            "label"     :"客户名称",
                            "align"     :"center",
                            "span"      :12,
                            "display"   :true,
                            "overHidden":true,
                            "filter"    :true,
                            "search"    :true,
                            "prop"      :"customerName",
                            "required"  :true,
                            searchSpan  :4,
                            slot        :true,
                            "rules"     :[
                                {
                                    "required":true,
                                    "message" :"客户名称必须填写"
                                }
                            ]
                        },
                        {
                            "type"      :"input",
                            "label"     :"首联系人",
                            "align"     :"center",
                            "span"      :12,
                            "display"   :true,
                            "overHidden":true,
                            "filter"    :true,
                            "search"    :false,
                            "prop"      :"contact",
                            "rules"     :[]
                        },
                        {
                            "type"   :"select",
                            "label"  :"所属行业",
                            "prop"   :"industry",
                            "align"  :"center",
                            "hide"   :"true",
                            "dicData":[
                                {"label":"机构组织", "value":'机构组织'},
                                {"label":"农林牧渔", "value":'农林牧渔'},
                                {"label":"医药卫生", "value":'医药卫生'},
                                {"label":"建筑建材", "value":'建筑建材'},
                                {"label":"冶金矿产", "value":'冶金矿产'},
                                {"label":"石油化工", "value":'石油化工'},
                                {"label":"水利水电", "value":'水利水电'},
                                {"label":"交通运输", "value":'交通运输'},
                                {"label":"信息产业", "value":'信息产业'},
                                {"label":"机械机电", "value":'机械机电'},
                                {"label":"轻工食品", "value":'轻工食品'},
                                {"label":"服装纺织", "value":'服装纺织'},
                                {"label":"安全防护", "value":'安全防护'},
                                {"label":"环保绿化", "value":'环保绿化'},
                                {"label":"旅游休闲", "value":'旅游休闲'},
                                {"label":"办公文教", "value":'办公文教'},
                                {"label":"电子电工", "value":'电子电工'},
                                {"label":"玩具礼品", "value":'玩具礼品'},
                                {"label":"家居用品", "value":'家居用品'},
                                {"label":"其他", "value":'其他'},
                            ],
                            "span"   :12,
                            "display":true,
                        },
                        {
                            "type"    :"select",
                            "label"   :"角色",
                            "hide"    :"true",
                            "dicData" :[
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                                {"label":"普通人", "value":'普通人'},
                            ],
                            "span"    :12,
                            "display" :true,
                            "search"  :true,
                            searchSpan:4,
                            "prop"    :"role"
                        },
                        {
                            "type"    :"radio",
                            "label"   :"客户类型",
                            "prop"    :"customerType",
                            "filter"  :true,
                            "search"  :true,
                            searchSpan:4,
                            "align"   :"center",
                            "dicData" :[
                                {
                                    "label":"企业客户",
                                    "value":'企业客户'
                                },
                                {
                                    "label":"个人客户",
                                    "value":'个人客户'
                                }
                            ],
                            "span"    :12,
                            "display" :true,
                        },
                        {
                            "type"       :"datetime",
                            "label"      :"生日",
                            "align"      :"center",
                            "hide"       :"true",
                            "span"       :12,
                            "display"    :true,
                            "format"     :"yyyy-MM-dd HH:mm:ss",
                            "valueFormat":"yyyy-MM-dd HH:mm:ss",
                            "prop"       :"1571223576134_37620"
                        },
                        {
                            "type"      :"select",
                            "label"     :"客户状态",
                            "prop"      :"customerStatus",
                            "overHidden":true,
                            "filter"    :true,
                            "search"    :true,
                            searchSpan  :4,
                            "align"     :"center",
                            "dicData"   :[
                                {"label":"了解产品", "value":'了解产品'},
                                {"label":"正在跟进", "value":'正在跟进'},
                                {"label":"正在试用", "value":'正在试用'},
                                {"label":"准备购买", "value":"准备购买"},
                                {"label":"准备付款", "value":"准备付款"},
                                {"label":"已经购买", "value":"已经购买"},
                                {"label":"暂时搁置", "value":"暂时搁置"},
                            ],
                            "span"      :12,
                            "display"   :true,

                        },
                        {
                            "type"   :"input",
                            "label"  :"部门职务",
                            "align"  :"center",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571223771955_48222"
                        },
                        {
                            "type"      :"rate",
                            "label"     :"客户星级",
                            "prop"      :"customerLevel",
                            "overHidden":true,
                            "filter"    :true,
                            "search"    :false,
                            "align"     :"center",
                            "span"      :12,
                            "display"   :true,
                            "max"       :5,
                            "value"     :0,
                            "texts"     :[1, 2, 3, 4, 5],
                            "colors"    :["#99A9BF", "#F7BA2A", "#FF9900"],
                        },
                        {
                            "type"   :"input",
                            "label"  :"手机号码",
                            "align"  :"center",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571223825605_21234"
                        },
                        {
                            "type"   :"select",
                            "label"  :"客户来源",
                            "prop"   :"customerSource",
                            "align"  :"center",
                            "dicData":[
                                {"label":"电话营销", "value":'电话营销'},
                                {"label":"主动来电", "value":'主动来电'},
                                {"label":"客户介绍", "value":'客户介绍'},
                                {"label":"朋友介绍", "value":'朋友介绍'},
                                {"label":"独立开发", "value":'独立开发'},
                                {"label":"网络搜索", "value":'网络搜索'},
                                {"label":"广告杂志", "value":'广告杂志'},
                                {"label":"展会促销", "value":'展会促销'},
                                {"label":"其他途径", "value":'其他途径'}
                            ],
                            "span"   :12,
                            "display":true,

                        },
                        {
                            "type"   :"input",
                            "label"  :"固定电话",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571223950193_40834"
                        },
                        {
                            "type"      :"select",
                            "label"     :"归属人员",
                            "overHidden":true,
                            "filter"    :true,
                            "search"    :false,
                            "align"     :"center",
                            "dicData"   :[
                                {
                                    "label":"选项一",
                                    "value":0
                                },
                                {
                                    "label":"选项二",
                                    "value":1
                                },
                                {
                                    "label":"选项三",
                                    "value":2
                                }
                            ],
                            "span"      :12,
                            "display"   :true,
                            "prop"      :"1571223971865_2326"
                        },
                        {
                            "type"   :"input",
                            "label"  :"传真号码",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224052076_89234"
                        },
                        {
                            "type"         :"cascader",
                            "label"        :"所在地区",
                            "hide"         :"true",
                            "span"         :12,
                            "display"      :true,
                            "dicData"      :[
                                {
                                    "label"   :"选项一",
                                    "value"   :0,
                                    "children":[
                                        {
                                            "label":"选项1-1",
                                            "value":11
                                        },
                                        {
                                            "label":"选项1-2",
                                            "value":12
                                        }
                                    ]
                                },
                                {
                                    "label":"选项二",
                                    "value":1
                                },
                                {
                                    "label":"选项三",
                                    "value":2
                                }
                            ],
                            "showAllLevels":true,
                            "separator"    :"/",
                            "prop"         :"1571224213164_60907"
                        },
                        {
                            "type"     :"input",
                            "label"    :"电子邮箱",
                            "hide"     :"true",
                            "span"     :12,
                            "display"  :true,
                            "prop"     :"1571224121547_15259",
                            "maxlength":0
                        },
                        {
                            "type"   :"input",
                            "label"  :"详细地址",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224240656_95181"
                        },
                        {
                            "type"   :"input",
                            "label"  :"微信号码",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224277297_96873"
                        },
                        {
                            "type"   :"select",
                            "label"  :"企业规模",
                            "hide"   :"true",
                            "dicData":[
                                {
                                    "label":"10人以内",
                                    "value":0
                                },
                                {
                                    "label":"10-20人",
                                    "value":1
                                },
                                {
                                    "label":"21-50人",
                                    "value":2
                                },
                                {
                                    "label":"51-200人",
                                    "value":"col_98246"
                                },
                                {
                                    "label":"201-500人",
                                    "value":"col_88993"
                                },
                                {
                                    "label":"500人以上",
                                    "value":"col_21961"
                                }
                            ],
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224303149_56583"
                        },
                        {
                            "type"   :"input",
                            "label"  :"QQ号码",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224374107_66894"
                        },
                        {
                            "type"         :"cascader",
                            "label"        :"所在地区",
                            "hide"         :"true",
                            "span"         :12,
                            "display"      :true,
                            "dicData"      :[
                                {
                                    "label"   :"选项一",
                                    "value"   :0,
                                    "children":[
                                        {
                                            "label":"选项1-1",
                                            "value":11
                                        },
                                        {
                                            "label":"选项1-2",
                                            "value":12
                                        }
                                    ]
                                },
                                {
                                    "label":"选项二",
                                    "value":1
                                },
                                {
                                    "label":"选项三",
                                    "value":2
                                }
                            ],
                            "showAllLevels":true,
                            "separator"    :"/",
                            "prop"         :"1571224506667_47990"
                        },
                        {
                            "type"   :"input",
                            "label"  :"详细地址",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224520109_23446"
                        },
                        {
                            "type"   :"textarea",
                            "label"  :"备注信息",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224561450_26302"
                        },
                        {
                            "type"   :"textarea",
                            "label"  :"备注信息",
                            "hide"   :"true",
                            "span"   :12,
                            "display":true,
                            "prop"   :"1571224547184_86037"
                        },

                        {
                            "label"      :"由谁创建",
                            "align"      :"center",
                            "prop"       :"createBy",
                            "type"       :"input",
                            "overHidden" :true,
                            "filter"     :true,
                            "search"     :false,
                            "addDisplay" :false,
                            "editDisplay":false
                        },
                        {
                            "label"      :"创建日期",
                            "align"      :"center",
                            "prop"       :"createTime",
                            "type"       :"date",
                            "addDisplay" :false,
                            "editDisplay":false,
                            format       :'yyyy-mm-dd',
                        },
                        {
                            "label"      :"最后跟进日期",
                            "align"      :"center",
                            "prop"       :"followTime",
                            "type"       :"date",
                            "addDisplay" :false,
                            "editDisplay":false
                        },
                        {
                            "label"      :"距离进入公海天数",
                            "align"      :"center",
                            "prop"       :"notFollowDays",
                            "type"       :"date",
                            width        :'120px',
                            "addDisplay" :false,
                            "editDisplay":false
                        }
                    ],
                    "menuBtn"      :true,
                    "menuPostion"  :"left",
                    "submitBtn"    :true,
                    "submitSize"   :"small",
                    "emptyBtn"     :true,
                    "labelPosition":"right"
                },
                data                :[],

                addFormData       :{},
                addFormOption     :{
                    labelWidth:100,
                    saveBtn   :true,
                    emptyBtn  :true,
                    size      :'mini',
                    card      :true,
                    group     :[
                        {
                            label :'客户信息',
                            prop  :'customer',
                            column:[
                                {
                                    "type"      :"input",
                                    "label"     :"客户名称",
                                    "span"      :12,
                                    "display"   :true,
                                    "overHidden":true,
                                    "filter"    :true,
                                    "search"    :true,
                                    "prop"      :"customerName",
                                    "required"  :true,
                                    "rules"     :[
                                        {
                                            "required":true,
                                            "message" :"客户名称必须填写"
                                        }
                                    ]
                                },
                                {
                                    "type"   :"select",
                                    "label"  :"所属行业",
                                    "prop"   :"industry",
                                    "dicData":[
                                        {"label":"机构组织", "value":'机构组织'},
                                        {"label":"农林牧渔", "value":'农林牧渔'},
                                        {"label":"医药卫生", "value":'医药卫生'},
                                        {"label":"建筑建材", "value":'建筑建材'},
                                        {"label":"冶金矿产", "value":'冶金矿产'},
                                        {"label":"石油化工", "value":'石油化工'},
                                        {"label":"水利水电", "value":'水利水电'},
                                        {"label":"交通运输", "value":'交通运输'},
                                        {"label":"信息产业", "value":'信息产业'},
                                        {"label":"机械机电", "value":'机械机电'},
                                        {"label":"轻工食品", "value":'轻工食品'},
                                        {"label":"服装纺织", "value":'服装纺织'},
                                        {"label":"安全防护", "value":'安全防护'},
                                        {"label":"环保绿化", "value":'环保绿化'},
                                        {"label":"旅游休闲", "value":'旅游休闲'},
                                        {"label":"办公文教", "value":'办公文教'},
                                        {"label":"电子电工", "value":'电子电工'},
                                        {"label":"玩具礼品", "value":'玩具礼品'},
                                        {"label":"家居用品", "value":'家居用品'},
                                        {"label":"其他", "value":'其他'},
                                    ],
                                    "span"   :12,
                                },
                                {
                                    "type"    :"radio",
                                    "label"   :"客户类型",
                                    "prop"    :"customerType",
                                    "filter"  :true,
                                    "search"  :true,
                                    searchSpan:4,
                                    "align"   :"center",
                                    dicUrl    :"/api/blade-system/dict/dictionary?code=客户类型",
                                    props     :{
                                        label:"dictValue",
                                        value:"dictKey"
                                    },
                                    "span"    :12,
                                    "display" :true,
                                },
                                {
                                    "type"      :"select",
                                    "label"     :"客户状态",
                                    "prop"      :"customerStatus",
                                    "overHidden":true,
                                    "filter"    :true,
                                    "search"    :true,
                                    searchSpan  :4,
                                    "align"     :"center",
                                    "dicData"   :[
                                        {"label":"了解产品", "value":'了解产品'},
                                        {"label":"正在跟进", "value":'正在跟进'},
                                        {"label":"正在试用", "value":'正在试用'},
                                        {"label":"准备购买", "value":"准备购买"},
                                        {"label":"准备付款", "value":"准备付款"},
                                        {"label":"已经购买", "value":"已经购买"},
                                        {"label":"暂时搁置", "value":"暂时搁置"},
                                    ],
                                    "span"      :12,
                                    "display"   :true,

                                },
                                {
                                    "type"      :"rate",
                                    "label"     :"客户星级",
                                    "prop"      :"customerLevel",
                                    "overHidden":true,
                                    "filter"    :true,
                                    "search"    :true,
                                    "align"     :"center",
                                    "span"      :12,
                                    "display"   :true,
                                    "max"       :5,
                                    "value"     :0,
                                    "texts"     :[1, 2, 3, 4, 5],
                                    "colors"    :["#99A9BF", "#F7BA2A", "#FF9900"],
                                },
                                {
                                    "type"   :"select",
                                    "label"  :"客户来源",
                                    "prop"   :"customerSource",
                                    "align"  :"center",
                                    "dicData":[
                                        {"label":"电话营销", "value":'电话营销'},
                                        {"label":"主动来电", "value":'主动来电'},
                                        {"label":"客户介绍", "value":'客户介绍'},
                                        {"label":"朋友介绍", "value":'朋友介绍'},
                                        {"label":"独立开发", "value":'独立开发'},
                                        {"label":"网络搜索", "value":'网络搜索'},
                                        {"label":"广告杂志", "value":'广告杂志'},
                                        {"label":"展会促销", "value":'展会促销'},
                                        {"label":"其他途径", "value":'其他途径'}
                                    ],
                                    "span"   :12,
                                    "display":true,

                                },
                                {
                                    "type"      :"select",
                                    "label"     :"归属人员",
                                    "overHidden":true,
                                    "filter"    :true,
                                    "search"    :true,
                                    "align"     :"center",
                                    dicUrl      :'/customer/contact/pairs',
                                    "span"      :12,
                                    "display"   :true,
                                    "prop"      :"1571223971865_2326"
                                },
                                {
                                    "label"  :"所在地区",
                                    "prop"   :"area",
                                    "type"   :"cascader",
                                    "span"   :12,
                                    "display":true,

                                    "dicUrl"   :'//todo',
                                    "separator":"/",

                                },
                                {
                                    "label"  :"详细地址",
                                    "prop"   :"address",
                                    "type"   :"input",
                                    "span"   :12,
                                    "display":true,
                                },
                                {
                                    "type"   :"select",
                                    "label"  :"企业规模",
                                    "hide"   :"true",
                                    "dicData":[
                                        {
                                            "label":"10人以内",
                                            "value":0
                                        },
                                        {
                                            "label":"10-20人",
                                            "value":1
                                        },
                                        {
                                            "label":"21-50人",
                                            "value":2
                                        },
                                        {
                                            "label":"51-200人",
                                            "value":"col_98246"
                                        },
                                        {
                                            "label":"201-500人",
                                            "value":"col_88993"
                                        },
                                        {
                                            "label":"500人以上",
                                            "value":"col_21961"
                                        }
                                    ],
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571224303149_56583"
                                },
                                {
                                    "type"   :"textarea",
                                    "label"  :"备注信息",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"remark"
                                },
                            ],
                            icon  :''
                        },
                        {
                            label :'首联系人',
                            prop  :'contact',
                            icon  :'',
                            column:[
                                {
                                    "type"      :"input",
                                    "label"     :"首联系人",
                                    "align"     :"center",
                                    "span"      :12,
                                    "display"   :true,
                                    "overHidden":true,
                                    "filter"    :true,
                                    "search"    :true,
                                    "prop"      :"contact",
                                    "rules"     :[]
                                },
                                {
                                    "type"   :"select",
                                    "label"  :"角色",
                                    "hide"   :"true",
                                    "dicData":[
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                        {"label":"普通人", "value":'普通人'},
                                    ],
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"role"
                                },
                                {
                                    "type"       :"datetime",
                                    "label"      :"生日",
                                    "align"      :"center",
                                    "hide"       :"true",
                                    "span"       :12,
                                    "display"    :true,
                                    "format"     :"yyyy-MM-dd HH:mm:ss",
                                    "valueFormat":"yyyy-MM-dd HH:mm:ss",
                                    "prop"       :"1571223576134_37620"
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"部门职务",
                                    "align"  :"center",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571223771955_48222"
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"手机号码",
                                    "align"  :"center",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571223825605_21234"
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"固定电话",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571223950193_40834"
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"传真号码",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571224052076_89234"
                                },
                                {
                                    "type"     :"input",
                                    "label"    :"电子邮箱",
                                    "hide"     :"true",
                                    "span"     :12,
                                    "display"  :true,
                                    "prop"     :"1571224121547_15259",
                                    "maxlength":0
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"微信号码",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571224277297_96873"
                                },
                                {
                                    "type"   :"input",
                                    "label"  :"QQ号码",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                    "prop"   :"1571224374107_66894"
                                },
                                {
                                    "label"    :"所在地区",
                                    "prop"     :"area",
                                    "type"     :"cascader",
                                    "span"     :12,
                                    "display"  :true,
                                    "dicUrl"   :'//todo',
                                    "separator":"/",

                                },
                                {
                                    "label"  :"详细地址",
                                    "prop"   :"address",
                                    "type"   :"input",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,

                                },
                                {
                                    "label"  :"备注信息",
                                    "prop"   :"remark",
                                    "type"   :"textarea",
                                    "hide"   :"true",
                                    "span"   :12,
                                    "display":true,
                                },
                            ]
                        }
                    ],
                },
                contactFormData   :{
                    dynamic:[
                        {
                            input :1,
                            select:1,
                            radio :1,
                        }, {
                            input :2,
                            select:2,
                            radio :1,
                        }
                    ]
                },
                contactFormOption :{
                    labelWidth :0,
                    card       :false,
                    "saveBtn"  :true,
                    "cancelBtn":true,
                    "menu"     :true,
                    "editBtn"  :true,
                    column     :[
                        {
                            label:'',
                            prop :'dynamic',
                            type :'dynamic',

                            span    :24,
                            children:{
                                align      :'center',
                                headerAlign:'center',
                                column     :[
                                    {
                                        label:'真实姓名',
                                        prop :"input",
                                        width:'160px'
                                    }, {
                                        label:'部门',
                                        prop :"select",
                                        type :'input',
                                        width:'160px'
                                    }, {
                                        label:'职位',
                                        prop :"checkbox",
                                        type :'input',
                                        width:'160px'
                                    }, {
                                        label:'邮箱',
                                        prop :"switch",
                                        type :'input',
                                        width:'160px'
                                    }, {
                                        label:'电话',
                                        prop :"number",
                                        type :'input',
                                        width:'160px'
                                    },
                                    {
                                        label:'QQ',
                                        prop :"number",
                                        type :'input',
                                        width:'160px'
                                    },
                                    {
                                        label:'微信号',
                                        prop :"number",
                                        type :'input',
                                        width:'160px'
                                    },
                                    {
                                        label:'微博',
                                        prop :"number",
                                        type :'input',
                                        width:'160px'
                                    }
                                ],

                            },
                            rules   :[
                                {
                                    required:true,
                                    message :'必填项测试',
                                    trigger :'blur'
                                }
                            ]
                        },

                    ]
                },
                assignFormData    :{},
                assignFormOption  :{
                    card           :true,
                    "labelPosition":"right",
                    "labelWidth"   :120,
                    "gutter"       :0,
                    "submitBtn"    :true,
                    "emptyBtn"     :true,
                    size           :'mini',
                    group          :[
                        {
                            label   :'指派给谁',
                            prop    :'base',
                            "column":[
                                {
                                    "type"   :"select",
                                    "label"  :"指派给",
                                    "dicData":[
                                        {
                                            "label":"选项一",
                                            "value":0
                                        },
                                        {
                                            "label":"选项二",
                                            "value":1
                                        },
                                        {
                                            "label":"选项三",
                                            "value":2
                                        }
                                    ],
                                    "span"   :24,
                                    "display":true,
                                    "prop"   :"1571965938589_14240"
                                },
                                {
                                    "type"   :"textarea",
                                    "label"  :"备注",
                                    "span"   :24,
                                    "display":true,
                                    "prop"   :"1571966890431_68817"
                                }
                            ]
                        }
                    ]
                },
                followUpFormData  :{},
                followUpFormOption:{
                    card           :true,
                    "labelPosition":"right",
                    "labelWidth"   :120,
                    "gutter"       :0,
                    "submitBtn"    :true,
                    "emptyBtn"     :true,
                    size           :'mini',
                    group          :[
                        {
                            label :'本次跟进',
                            prop  :'base',
                            column:[
                                {
                                    "label"   :"客户名称",
                                    "type"    :"input",
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571216030821_71061",
                                    "readonly":true
                                },
                                {
                                    "label"   :"跟进类型",
                                    "type"    :"select",
                                    "dicData" :[
                                        {
                                            "label":"到访",
                                            "value":0
                                        },
                                        {
                                            "label":"客户到访",
                                            "value":1
                                        },
                                        {
                                            "label":"电话",
                                            "value":2
                                        },
                                        {
                                            "label":"微信",
                                            "value":"3"
                                        },
                                        {
                                            "label":"短信",
                                            "value":"4"
                                        },
                                        {
                                            "label":"邮件",
                                            "value":"5"
                                        },
                                        {
                                            "label":"QQ",
                                            "value":"6"
                                        }
                                    ],
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571215626643_59415",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"请选择跟进类型"
                                        }
                                    ]
                                },
                                {
                                    "label"      :"时间",
                                    "type"       :"datetime",
                                    "span"       :24,
                                    "display"    :true,
                                    "format"     :"yyyy-MM-dd HH:mm:ss",
                                    "valueFormat":"yyyy-MM-dd HH:mm:ss",
                                    "prop"       :"1571215976213_83777",
                                    "required"   :true,
                                    "rules"      :[
                                        {
                                            "required":true,
                                            "message" :"时间必须填写"
                                        }
                                    ]
                                },
                                {
                                    "label"   :"联系人",
                                    "type"    :"input",
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571216357618_82360",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"联系人必须填写"
                                        }
                                    ]
                                },
                                {
                                    "label"   :"沟通内容",
                                    "type"    :"textarea",
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571215999212_69749",
                                    "maxRows" :8,
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"沟通内容必须填写"
                                        }
                                    ]
                                },
                                {
                                    "label"    :"提醒谁看",
                                    "type"     :"select",
                                    "dicData"  :[
                                        {
                                            "label":"选项一",
                                            "value":0
                                        },
                                        {
                                            "label":"选项二",
                                            "value":1
                                        },
                                        {
                                            "label":"选项三",
                                            "value":2
                                        }
                                    ],
                                    "span"     :24,
                                    "display"  :true,
                                    "prop"     :"1571216469056_73353",
                                    "multiple" :true,
                                    "clearable":true,
                                    "required" :true,
                                    "rules"    :[
                                        {
                                            "required":true,
                                            "message" :"请选择提醒谁看："
                                        }
                                    ]
                                },
                            ],
                        },
                        {
                            label :'创建下次跟进任务',
                            prop  :'next',
                            column:[
                                {
                                    "label"   :"跟进人员",
                                    "type"    :"select",
                                    "dicData" :[
                                        {
                                            "label":"选项一",
                                            "value":0
                                        },
                                        {
                                            "label":"选项二",
                                            "value":1
                                        },
                                        {
                                            "label":"选项三",
                                            "value":2
                                        }
                                    ],
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571217617590_69756",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"请选择跟进人员"
                                        }
                                    ]
                                },
                                {
                                    "label"      :"跟进时间",
                                    "type"       :"datetime",
                                    "span"       :24,
                                    "display"    :true,
                                    "format"     :"yyyy-MM-dd HH:mm:ss",
                                    "valueFormat":"yyyy-MM-dd HH:mm:ss",
                                    "prop"       :"1571217478919_44335",
                                    "required"   :true,
                                    "rules"      :[
                                        {
                                            "required":true,
                                            "message" :"跟进时间必须填写"
                                        }
                                    ]
                                },
                                {
                                    "label"   :"跟进内容",
                                    "type"    :"textarea",
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571217534277_97392",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"跟进内容必须填写"
                                        }
                                    ]
                                },
                                {
                                    "label"   :"跟进提醒",
                                    "type"    :"select",
                                    "dicData" :[
                                        {
                                            "label":"提前5分钟",
                                            "value":0
                                        },
                                        {
                                            "label":"提前15分钟",
                                            "value":1
                                        },
                                        {
                                            "label":"提前30分钟",
                                            "value":2
                                        },
                                        {
                                            "label":"提前1小时",
                                            "value":"3"
                                        },
                                        {
                                            "label":"提前2消失",
                                            "value":"4"
                                        }
                                    ],
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571217111056_42040",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"请选择跟进提醒"
                                        }
                                    ]
                                },
                                {
                                    "label"   :"提醒方式",
                                    "type"    :"checkbox",
                                    "dicData" :[
                                        {
                                            "label":"系统消息",
                                            "value":0
                                        },
                                        {
                                            "label":"邮件通知",
                                            "value":1
                                        },
                                        {
                                            "label":"短信通知",
                                            "value":2
                                        }
                                    ],
                                    "span"    :24,
                                    "display" :true,
                                    "prop"    :"1571217186862_9981",
                                    "required":true,
                                    "rules"   :[
                                        {
                                            "required":true,
                                            "message" :"请选择提醒方式"
                                        }
                                    ]
                                }
                            ],
                        }
                    ],

                }
            };
        },
        computed  :{
            ...mapGetters(["permission"]),
            permissionList(){
                return {};
            },
            ids(){
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods   :{
            refreshChange(){
                this.onLoad(this.page);
            },

            handleExcel(){
                this.$refs.crud.rowExcel();
            },
            handleView(row, index){
                //todo
                this.isFollowUpVisible = true;
            },
            handleFollowUp(row, index){
                //todo
                this.isFollowUpVisible = true;
            },
            handleAssign(row, index){
                //todo
                this.isAssignVisible = true;
            },
            handleContact(row, index){
                //todo
                this.isContactVisible = true;
            },
            handleEdit(row, index){
                //todo
                this.$refs.crud.rowEdit(row, index);
            },
            handleTopping(row, index){
                //todo
            },
            handleDel(row, index){
                this.$confirm(`确定将选择数据[第${index}行]删除? `, {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(row.id);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                  });
            },
            rowSave(row, loading, done){
                add(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowUpdate(row, index, loading, done){
                update(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type   :"success",
                        message:"操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowDel(row){
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(row.id);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                  });
            },
            handleDelete(){
                if(this.selectionList.length === 0){
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText:"确定",
                    cancelButtonText :"取消",
                    type             :"warning"
                })
                  .then(() => {
                      return remove(this.ids);
                  })
                  .then(() => {
                      this.onLoad(this.page);
                      this.$message({
                          type   :"success",
                          message:"操作成功!"
                      });
                      this.$refs.crud.toggleSelection();
                  });
            },
            beforeOpen(done, type){
                if(["edit", "view"].includes(type)){
                    getDetail(this.form.id).then(res => {
                        this.form = res.data.data;
                    });
                }
                done();
            },
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                this.query            = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params, done);
            },
            selectionChange(list){
                this.selectionList = list;
            },
            selectionClear(){
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            onLoad(page, params = {}, done = () => {}){
                this.loading = true;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();
                    done();
                });
            },
            showFilterDialog(){
                this.$refs.crud.$refs.dialogFilter.box = true
            },
            filterChange(params){
                //TODO
                console.log('过滤器参数：', params);
            },
            showDetail(id){
                this.isDetailVisible = true;
                console.log('showProfile id=', id);
            }
        }
    };
</script>

//重写样式
<style>

</style>

<style lang="scss">
  .drawer-wrap{
    position: relative;
    height: 100%;
    overflow-y: scroll;
    padding: 3px 0 0;
  }

  $margin-dist: 10px;
  $border-color: #f5f5f5;
  .detail-wrap{
    height: 100%;
    width: 100%;
    background-color: #f0f2f5;
    box-sizing: border-box;
    padding: $margin-dist;

    .detail-header{
      .el-dropdown-link{
        color: #666666;
        font-size: small;
      }

      .header-subtitle{
        .label-box{
          display: inline-block;
          margin-right: 20px;
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: small;
        }
      }
    }

    .detail-body{
      margin-top: $margin-dist;
      font-size: small;

      .tab-wrap{
        .el-tabs__item{
          padding: 0 10px;
        }
      }

      .show-detail{
        float: right;
      }

      .grid-content{
        box-sizing: border-box;
        padding-top: 20px;
        text-align: center;
        border: 1px solid $border-color;
        height: 100px;

        .grid-label{
        }
      }
    }

    .display-table{
      width: 100%;

      tr{
        border: 1px solid #e9e9e9;
      }

      td{
        display: inline-block;
        line-height: 32px;
        box-sizing: border-box;
      }

      .display-table-latbel{
        width: 120px;
        background-color: #f5f5f5;
        text-align: right;
      }

      .display-table-value{
        width: calc(50% - 122px);
        text-align: left;
      }
    }

    .float-right{
      float: right;
    }

    .timeline-item-box{
      box-sizing: border-box;
      padding: 8px 10px;
      border: solid 1px #D8E8F2;
      background-color: #F7FBFE;

      .header{
        span{
          line-height: 50px;
        }

        .title{
          vertical-align: bottom;
        }
      }

      .body{
        color: 666;
      }

      .footer{
        line-height: 30px;
        height: 30px;
      }

      .comment-list{
        .comment-item{
          margin-bottom: 8px;
          padding: 8px 10px;
          background-color: white;
          border: solid 1px #D8E8F2;

          .title{
            line-height: 50px;

            *{
              vertical-align: bottom;

            }

            .body{

            }
          }

        }
      }
    }
  }
</style>
