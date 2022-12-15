<template>
  <div>
    <div>
      <h3>表格权限控制</h3>
      <avue-crud ref="crud"
                 :permission="permission"
                 :option="option"
                 :data="data">
        <template slot="expand"
                  slot-scope="scope">
          {{scope}}
        </template>
      </avue-crud>
    </div>
    <div>
      权限开关
      <el-switch :active-value="false"
                 :inactive-value="true"
                 v-model="text"
                 active-color="#13ce66"
                 inactive-color="#ff4949">
      </el-switch>
      <p> 具体参考<a
        href="https://avuex.avue.top/#/doc/crud-permission">https://avuex.avue.top/#/doc/crud-permission</a>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: false,
        permission: {},
        option: {
          expand: true,
          column: [
            {
              label: "姓名",
              prop: "name"
            },
            {
              label: "年龄",
              prop: "sex"
            }
          ]
        },
        data: [
          {
            id: 1,
            name: "张三",
            sex: 12
          },
          {
            id: 2,
            name: "李四",
            sex: 20
          }
        ]
      };
    },
    watch: {
      text() {
        if (this.text === true) {
          this.permission = {
            delBtn: false,
            addBtn: false
          };
        } else {
          this.permission = {
            delBtn: true,
            addBtn: true
          };
        }
      }
    }
  };
</script>

<style>
</style>
