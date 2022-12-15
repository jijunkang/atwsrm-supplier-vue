<template>
  <div id="sumColumnList">
    <div class="sum" v-for="item in sumColumn">
      <span><u>{{item.sumName}}</u>合计:</span>
      <span>{{$moneyUtils.negativeMoney(item.sumPrice)}}</span>
    </div>
  </div>
</template>

<script>
    export default {
        name :"sumColumnList",
        props:['sumColumn']
    }
</script>

<style scoped lang="scss">
  #sumColumnList{
    text-align: right;
    position: relative;
    top: -90px;

    .sum{
      display: inline-block;

      span{
        font-size: 14px;
        margin-right: 15px;

        &:first-child{
          font-weight: bold;
        }
      }
    }

  }
</style>