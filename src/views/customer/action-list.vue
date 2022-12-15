<template>
  <div>
    <el-timeline>
      <el-timeline-item timestamp="" placement="top">
        <div class="timeline-item-box">
          <div class="header">
            <el-avatar :size="50" src=""></el-avatar>
            <span class="title"> 赵小刚  跟进(到访)</span>
            <span class="float-right">
                                 <el-button type="text" icon="el-icon-close"></el-button> <i class="el-icon-time" style="margin-left:10px"></i> 2019-03-23 22:31
                            </span>
          </div>
          <div class="body">
            上门拜访了客户，客户对产品意向很高，但是希望价格能有优惠。
          </div>
          <div class="footer">
            <span class="label-name">来自客户：</span> <span class="label-value">深圳市亿恩科技有限公司</span>
            <div class="float-right">
              <el-button size="mini" icon="el-icon-info">详情</el-button>
              <el-button size="mini" icon="el-icon-s-comment">评论</el-button>
            </div>
          </div>
        </div>

      </el-timeline-item>

      <el-timeline-item timestamp="" placement="top">
        <div class="timeline-item-box">
          <div class="header">
            <el-avatar :size="50" src=""></el-avatar>
            <span class="title"> 赵小刚  跟进(到访)</span>
            <span class="float-right">
                              <i class="el-icon-time" style="margin-left:10px"></i> 2019-03-23 22:31
                            </span>
          </div>
          <div class="body">
            将客户状态由 正在跟进 变改成 准备购买。
          </div>
          <div class="footer">
            <span class="label-name">来自客户：</span> <span class="label-value">深圳市亿恩科技有限公司</span>
            <div class="float-right">
            </div>
          </div>

          <div class="comment-list">
            <div class="comment-item">
              <div class="title">
                <el-avatar :size="50" src=""></el-avatar>
                <span>赵小刚</span>
                <span class="time"> 2019-03-23 22:31</span>
              </div>
              <div class="body">
                将客户状态由 正在跟进 变改成 准备购买。
              </div>

            </div>
            <div class="comment-item">
              <div class="title">
                <el-avatar :size="50" src=""></el-avatar>
                <span>赵小刚</span>
                <span class="time"> 2019-03-23 22:31</span>
              </div>
              <div class="body">
                将客户状态由 正在跟进 变改成 准备购买。
              </div>

            </div>
          </div>
          <div>
            <el-input placeholder="请输入评论内容">
              <template slot="append">评论</template>
            </el-input>
          </div>
        </div>

      </el-timeline-item>

      <el-timeline-item></el-timeline-item>
    </el-timeline>
    <!-- 分页 -->
    <el-pagination
        class="float-right"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev,pager,next,sizes"
        :total="400">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    props: [],
    data(){
      return {};
    },
    computed: {},
    methods: {}
  };
</script>

<style>
</style>
