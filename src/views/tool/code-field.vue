<template>
  <div style="height:100%">
    <avue-form ref="form" v-model="tableData" :option="option" @reset-change="emptytChange" @submit="submit" style="height:100%;overflow-x:scroll;">
    </avue-form>
  </div>
</template>

<script>
  import {saveFields} from "@/api/tool/code";

  export default {
    name: 'code-field',
    props:['tableData'],
    data(){
      return {

        option: {
          labelWidth: 0,
          "column": [
            {
              "type": "dynamic",
              "label": "",
              "span": 24,
              "display": true,
              "children": {
                "align": "center",
                "headerAlign": "center",
                "column": [
                  {
                    "type": "input",
                    "label": "字段名称",
                    "span": 24,
                    "display": true,
                    "prop": "fieldName",
                    "width": 200,
                    "required": true,
                    "rules": [
                      {
                        "required": true,
                        "message": "字段名称必须填写"
                      }
                    ],
                    "placeholder": "如：昵称"
                  },
                  {
                    "type": "input",
                    "label": "备注",
                    "span": 24,
                    "display": true,
                    "prop": "remark",
                    "rules": [],
                    "placeholder": "如：用户昵称，对外展示"
                  },
                  {
                    "type": "input",
                    "label": "字段key",
                    "span": 24,
                    "display": true,
                    "prop": "fieldKey",
                    "width": 200,
                    "rules": [
                      {
                        "required": true,
                        "message": "字段key必须填写"
                      }
                    ],
                    "required": true,
                    "placeholder": "如：nickname"
                  },
                  {
                    "type": "select",
                    "label": "类型",
                    "span": 24,
                    "display": true,
                    "prop": "type",
                    "width": 200,
                    "rules": [
                      {
                        "required": true,
                        "message": "字段key必须填写"
                      }
                    ],
                    "required": true,
                    "dicData": [
                      {
                        "label": "int",
                        "value": "int"
                      },
                      {
                        "label": "bigint",
                        "value": "bigint"
                      },
                      {
                        "label": "varchar",
                        "value": "varchar"
                      },
                      {
                        "label": "datetime",
                        "value": "datetime"
                      },
                      {
                        "label": "decimal",
                        "value": "decimal"
                      }
                    ]
                  },
                  {
                    "type": "number",
                    "label": "长度",
                    "span": 24,
                    "display": true,
                    "prop": "length",
                    "width": 150,
                    "rules": [
                      {
                        "required": true,
                        "message": "字段key必须填写"
                      }
                    ],
                    "required": true,
                    "placeholder": "16"
                  },
                  {
                    "type": "switch",
                    "label": "不能为Null",
                    "span": 24,
                    "display": true,
                    "prop": "isNotNull",
                    "width": 100,
                    "rules": [
                      {
                        "required": true,
                        "message": "字段key必须填写"
                      }
                    ],
                    "required": true,
                    "value": 0,
                    "dicData": [
                      {
                        "label": '',
                        "value": 0
                      },
                      {
                        "label": '',
                        "value": 1
                      }
                    ],
                    "min": 0,
                    "max": 10
                  }
                ]
              },
              "prop": "fields"
            },
            {
              "type": "textarea",
              "label": "SQL",
              "span": 24,
              "display": true,
              "prop": "createSql",
              "readonly": true,
              "placeholder": "保存可见"
            }
          ],
          "menuBtn": true,
          "submitBtn": true,
          "emptyBtn": true
        }
      };
    },
    created(){

    },
    updated(){

    },
    methods: {
      emptytChange(){
        this.$message.success('清空方法回调');
      },
      submit(form, done){
        debugger
        if(!this.tableData.fields || this.tableData.fields.length === 0){
          this.$message.error('请添加字段');
          done()
          return false;
        }
        let reqData = {
          id: this.tableData.id,
          tableName: this.tableData.tableName,
          fields: [],
        };
        this.tableData.fields.forEach((v)=>{
          reqData.fields.push({
            'fieldKey':v.fieldKey||'',
            'fieldName':v.fieldName,
            'remark':v.remark,
            'type':v.type,
            'length':v.length,
            'isNotNull':v.isNotNull||0,
          });
        });
        saveFields(reqData).then(({data}) => {
          console.log(data);
          this.tableData.createSql = data.data.createSql;
        }).finally(() => {
          done()
        });
      }
    }
  };
</script>

<style>
</style>

