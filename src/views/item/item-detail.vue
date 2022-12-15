<template>
  <el-drawer
      title="编辑物料信息"
      :visible.sync="tabledrawer"
      direction="rtl"
      size="70%"
      @close="closeEdit">
    <div style="width: 100%;height: 100%;overflow: hidden;overflow: scroll">
      <!--    基本信息-->
      <!--      子件BOM-->
      <avue-form :option="baseInformation" v-model="form" @submit="handleSubmit">
        <template slot="bom" slot-scope="scope">
          <span><a style="text-decoration: underline;color: blue;cursor: pointer"
                   @click="dialogTableVisible = true">查看</a></span>
        </template>
        <!--        母件BOM-->
        <template slot="mumbom" slot-scope="scope">
          <span><a style="text-decoration: underline;color: blue;cursor: pointer"
                   @click="dialogTableVisible_mum = true">查看</a></span>
        </template>
        <template slot="downloaddraw" slot-scope="scope">
          <span><a style="color: blue;cursor: pointer">下载图纸</a></span>
        </template>
        <template slot="downloaddoc" slot-scope="scope">
          <span><a style="color: blue;cursor: pointer">下载图纸</a></span>
        </template>
      </avue-form>
      <!--      供应商-->
      <el-table
          :data="tableData"
          border
          style="width: 98%;margin: 15px auto"
          align="center"
          :cell-style='cellStyle'
          :header-cell-style='rowClass'>
        <el-table-column
            prop="num"
            label="编号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="suppliercode"
            label="供应商编码"
            width="180">
        </el-table-column>
        <el-table-column
            prop="suppliername"
            label="供应商名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="lastprice"
            label="上次采购价格"
            width="180">
        </el-table-column>
        <el-table-column
            prop="lasttime"
            label="上次采购时间">
        </el-table-column>
        <el-table-column
            prop="allpurchtimes"
            label="总采购次数">
        </el-table-column>
        <el-table-column
            prop="addupmoney"
            label="累计采购金额">
        </el-table-column>
        <el-table-column
            prop="lastbuyer"
            label="上次负责采购员">
        </el-table-column>
      </el-table>
    </div>
    <!--    查看子件BOM-->
    <el-dialog title="子件BOM"
               :visible.sync="dialogTableVisible"
               :modal-append-to-body="false"
               :append-to-body="true"
               width="60%">
      <avue-crud :option="subBom" :data="data">
      </avue-crud>
    </el-dialog>
    <!--    查看母件BOM-->
    <el-dialog title="母件BOM"
               :visible.sync="dialogTableVisible_mum"
               :modal-append-to-body="false"
               :append-to-body="true"
               width="60%">
      <avue-crud :option="subBom_mum" :data="data_mum">
      </avue-crud>
    </el-dialog>

  </el-drawer>
</template>

<script>
    export default {
        name: "item-detail.vue",
        props: ['tabledrawer'],
        data() {
            return {
                dialogTableVisible: false,
                dialogTableVisible_mum:false,
                tableData: [{
                    num: '1',
                    suppliercode: '',
                    suppliername: '',
                    lastprice: '',
                    lasttime: '',
                    allpurchtimes: '',
                    addupmoney: '',
                    lastbuyer: ''
                }, {
                    num: '2',
                    suppliercode: '',
                    suppliername: '',
                    lastprice: '',
                    lasttime: '',
                    allpurchtimes: '',
                    addupmoney: '',
                    lastbuyer: ''
                }, {
                    num: '3',
                    suppliercode: '',
                    suppliername: '',
                    lastprice: '',
                    lasttime: '',
                    allpurchtimes: '',
                    addupmoney: '',
                    lastbuyer: ''
                }, {
                    num: '4',
                    suppliercode: '',
                    suppliername: '',
                    lastprice: '',
                    lasttime: '',
                    allpurchtimes: '',
                    addupmoney: '',
                    lastbuyer: ''
                }, {
                    num: '5',
                    suppliercode: '',
                    suppliername: '',
                    lastprice: '',
                    lasttime: '',
                    allpurchtimes: '',
                    addupmoney: '',
                    lastbuyer: ''
                }],
                form: {
                    //group1
                    materialnum: '',
                    materialname: '',
                    tradingunit: '',
                    mainclasscode: '',
                    mainclassname: '',
                    materialprop: '',
                    material: '',
                    valuationunit: '',
                    buyer: '',
                    //group2
                    brand: '',
                    PLMdesigner: '',
                    PLMdesigndate: '',
                    stock: '',
                    locationnum: '',
                    //group3
                    purchaseforward: '',
                    handleforward: '',
                    afterpurchase: '',
                    safestock: '',
                    priceattribute: '',
                    purchasetimes: '',
                    minorder: '',
                    limitstock: '',
                    orderratio: '',
                    businessweight: '',
                    priceweight: '',
                    technicalweight: '',
                    giveratio: '',
                    serialize: ''
                },
                data: [
                    {
                        id: 0,
                        event: '事件1',
                        timeLine: 50,
                        icon: 'el-icon-time',
                        comment: '无'
                    },
                    {
                        id: 1,
                        event: '事件1',
                        icon: 'el-icon-bell',
                        timeLine: 100,
                        comment: '无',
                        children: [
                            {
                                id: 2,
                                event: '事件2',
                                icon: 'el-icon-star-on',
                                timeLine: 10,
                                comment: '无'
                            },
                            {
                                id: 3,
                                event: '事件3',
                                timeLine: 90,
                                comment: '无',
                                children: [
                                    {
                                        id: 4,
                                        event: '事件4',
                                        timeLine: 5,
                                        comment: '无'
                                    },
                                    {
                                        id: 5,
                                        event: '事件5',
                                        timeLine: 10,
                                        comment: '无'
                                    },
                                    {
                                        id: 6,
                                        event: '事件6',
                                        timeLine: 75,
                                        comment: '无',
                                        children: [
                                            {
                                                id: 7,
                                                event: '事件7',
                                                timeLine: 50,
                                                comment: '无',
                                                children: [
                                                    {
                                                        id: 71,
                                                        event: '事件71',
                                                        timeLine: 25,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 72,
                                                        event: '事件72',
                                                        timeLine: 5,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 73,
                                                        event: '事件73',
                                                        timeLine: 20,
                                                        comment: 'xx'
                                                    }
                                                ]
                                            },
                                            {
                                                id: 8,
                                                event: '事件8',
                                                timeLine: 25,
                                                comment: '无'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                data_mum: [
                    {
                        id: 0,
                        event: '事件1',
                        timeLine: 50,
                        icon: 'el-icon-time',
                        comment: '无'
                    },
                    {
                        id: 1,
                        event: '事件1',
                        icon: 'el-icon-bell',
                        timeLine: 100,
                        comment: '无',
                        children: [
                            {
                                id: 2,
                                event: '事件2',
                                icon: 'el-icon-star-on',
                                timeLine: 10,
                                comment: '无'
                            },
                            {
                                id: 3,
                                event: '事件3',
                                timeLine: 90,
                                comment: '无',
                                children: [
                                    {
                                        id: 4,
                                        event: '事件4',
                                        timeLine: 5,
                                        comment: '无'
                                    },
                                    {
                                        id: 5,
                                        event: '事件5',
                                        timeLine: 10,
                                        comment: '无'
                                    },
                                    {
                                        id: 6,
                                        event: '事件6',
                                        timeLine: 75,
                                        comment: '无',
                                        children: [
                                            {
                                                id: 7,
                                                event: '事件7',
                                                timeLine: 50,
                                                comment: '无',
                                                children: [
                                                    {
                                                        id: 71,
                                                        event: '事件71',
                                                        timeLine: 25,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 72,
                                                        event: '事件72',
                                                        timeLine: 5,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 73,
                                                        event: '事件73',
                                                        timeLine: 20,
                                                        comment: 'xx'
                                                    }
                                                ]
                                            },
                                            {
                                                id: 8,
                                                event: '事件8',
                                                timeLine: 25,
                                                comment: '无'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                baseInformation: {
                    menuBtn: false,
                    group: [
                        {
                            icon: 'el-icon-collection-tag',
                            label: '基本信息',
                            prop: 'group1',
                            column: [{
                                label: '物料编码',
                                prop: 'materialnum',
                                span: 8,
                                labelWidth: '120px',
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '物料名称',
                                prop: 'materialname',
                                span: 8,
                                labelWidth: '120px',
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '交易单位',
                                prop: 'tradingunit',
                                span: 8,
                                labelWidth: '120px',
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '主分类编码',
                                prop: 'mainclasscode',
                                span: 8,
                                labelWidth: '120px',
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '主分类名称',
                                prop: 'mainclassname',
                                span: 8,
                                labelWidth: '120px',
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '料品形态属性',
                                prop: 'materialprop',
                                type: "select",
                                dicData: DIC.PROPS,
                                span: 8,
                                labelWidth: '120px',
                                mock: {
                                    type: 'dic',
                                },
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '材质',
                                prop: 'material',
                                type: "select",
                                dicData: DIC.MATER,
                                span: 8,
                                labelWidth: '120px',
                                mock: {
                                    type: 'dic',
                                },
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '计价单位',
                                prop: 'valuationunit',
                                type: "select",
                                dicData: DIC.UNIT,
                                span: 8,
                                labelWidth: '120px',
                                mock: {
                                    type: 'dic',
                                },
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }, {
                                label: '采购员',
                                prop: 'buyer',
                                type: "select",
                                dicData: DIC.BUYER,
                                span: 8,
                                labelWidth: '120px',
                                mock: {
                                    type: 'dic',
                                },
                                rules: [{
                                    required: true,
                                    trigger: "blur"
                                }]
                            }]
                        }, {
                            icon: 'el-icon-collection-tag',
                            label: '物料说明',
                            prop: 'group2',
                            column: [{
                                label: '品牌',
                                prop: 'brand',
                                labelWidth: '120px',
                                span: 8,
                            }, {
                                label: 'PLM设计者',
                                prop: 'PLMdesigner',
                                labelWidth: '120px',
                                span: 8,
                            }, {
                                label: 'PLM设计日期',
                                prop: 'PLMdesigndate',
                                type: "date",
                                labelWidth: '120px',
                                span: 8,
                            }, {
                                label: '库存',
                                prop: 'stock',
                                type: "input",
                                labelWidth: '120px',
                                span: 12,
                            },
                                {
                                    label: '库位号',
                                    prop: 'locationnum',
                                    type: "input",
                                    labelWidth: '120px',
                                    span: 12,
                                },
                                {
                                    label: '图纸',
                                    prop: 'drawingornot',
                                    type: "radio",
                                    labelWidth: '50px',
                                    span: 7,
                                    value:'true',
                                    dicData: DIC.DRAWORNOT,
                                    mock: {
                                        type: 'dic'
                                    },
                                },  {
                                    prop: 'downloaddraw',
                                    labelWidth: '120px',
                                    span: 3,
                                    formslot: true,

                                }, {
                                    label: '上道工序图纸',
                                    prop: 'drawing',
                                    type: "radio",
                                    labelWidth: '120px',
                                    span: 7,
                                    value: 'false',
                                    dicData: DIC.DRAWING,
                                    mock: {
                                        type: 'dic'
                                    },
                                }, {
                                    label: '工艺路线',
                                    prop: 'router',
                                    type: "radio",
                                    labelWidth: '120px',
                                    span: 7,
                                    value: 'false',
                                    dicData: DIC.ROUTER,
                                    mock: {
                                        type: 'dic'
                                    },
                                }, {
                                    label: '检验标准文件',
                                    prop: 'checkdoc',
                                    type: "radio",
                                    labelWidth: '120px',
                                    span: 7,
                                    value:'true',
                                    dicData: DIC.CHECKDOC,
                                    mock: {
                                        type: 'dic'
                                    }
                                },{
                                    prop: 'downloaddoc',
                                    labelWidth: '120px',
                                    span: 3,
                                    formslot: true,

                                },
                                {
                                    prop: 'bom',
                                    label: '子件BOM',
                                    labelWidth: '120px',
                                    span: 7,
                                    formslot: true,

                                },
                                {
                                    prop: 'mumbom',
                                    label: '母件BOM',
                                    labelWidth: '120px',
                                    span: 7,
                                    formslot: true,

                                },
                            ]
                        }, {
                            icon: 'el-icon-collection-tag',
                            label: '采购属性',
                            prop: 'group3',
                            column: [
                                {
                                    label: '采购预提前期',
                                    prop: 'purchaseforward',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '采购处理提前期',
                                    prop: 'handleforward',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '采购后提前期',
                                    prop: 'afterpurchase',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '安全库存',
                                    prop: 'safestock',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '价格属性',
                                    prop: 'priceattribute',
                                    type: "select",
                                    dicData: DIC.ATTR,
                                    span: 8,
                                    labelWidth: '120px',
                                    mock: {
                                        type: 'dic',
                                    },
                                    rules: [{
                                        required: true,
                                        trigger: "blur"
                                    }]
                                }, {
                                    label: '采购倍数',
                                    prop: 'purchasetimes',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '最小起订量',
                                    prop: 'minorder',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '库存上限',
                                    prop: 'limitstock',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '供应商订单分配比例',
                                    prop: 'orderratio',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '商务权重',
                                    prop: 'businessweight',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '价格权重',
                                    prop: 'priceweight',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '技术权重',
                                    prop: 'technicalweight',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '期货让步比例',
                                    prop: 'giveratio',
                                    labelWidth: '150px',
                                    span: 8,
                                }, {
                                    label: '是否系列化',
                                    prop: 'serialize',
                                    labelWidth: '150px',
                                    span: 8,
                                }]
                        }, {
                            icon: 'el-icon-collection-tag',
                            label: '供应商',
                            prop: 'group4',
                        }
                    ]
                },
                subBom: {
                    headerAlign: 'center',
                    align: 'center',
                    border: true,
                    index: true,
                    defaultExpandAll: true,
                    menu:false,
                    column: [
                        {
                            label: 'BOM',
                            prop: 'event',
                            align: 'left',
                            width: 200
                        },
                        {
                            label: '--',
                            prop: 'id',
                            dicData: [{
                                label: '零',
                                value: 0
                            }, {
                                label: '一',
                                value: 1
                            }, {
                                label: '二',
                                value: 2,
                            }]
                        },
                        {
                            label: '--',
                            prop: 'timeLine'
                        },
                        {
                            label: '--',
                            prop: 'icon',
                            slot: true,
                        },
                        {
                            label: '--',
                            prop: 'comment'
                        }
                    ],
                },
                subBom_mum: {
                    headerAlign: 'center',
                    align: 'center',
                    border: true,
                    index: true,
                    defaultExpandAll: true,
                    menu:false,
                    column: [
                        {
                            label: 'BOM',
                            prop: 'event',
                            align: 'left',
                            width: 200
                        },
                        {
                            label: '--',
                            prop: 'id',
                            dicData: [{
                                label: '零',
                                value: 0
                            }, {
                                label: '一',
                                value: 1
                            }, {
                                label: '二',
                                value: 2,
                            }]
                        },
                        {
                            label: '--',
                            prop: 'timeLine'
                        },
                        {
                            label: '--',
                            prop: 'icon',
                            slot: true,
                        },
                        {
                            label: '--',
                            prop: 'comment'
                        }
                    ],
                },
            }
        },
        methods: {
            closeEdit() {
                this.$emit('closefunc', false)
            },
            cellStyle({row, column, rowIndex, columnIndex}) {
                return 'text-align:center';
            },

            rowClass({row, rowIndex}) {
                return 'text-align:center';
            },
        },
    }
    var DIC = {
        PROPS: [{
            label: '采购件',
            value: 1
        }, {
            label: '委外加工件',
            value: 2
        }, {
            label: '制造件',
            value: 3
        }, {
            label: '服务件',
            value: 4
        }, {
            label: '费用性料品',
            value: 5
        }, {
            label: '资产类',
            value: 6
        },],
        MATER: [{
            label: '304',
            value: 1
        }, {
            label: '307',
            value: 2
        }],
        UNIT: [{
            label: 'KG',
            value: 1
        }],
        BUYER: [{
            label: '夏艳娟',
            value: 1
        }, {
            label: '杨丹',
            value: 2
        }],
        DRAWORNOT: [{
            label: '有',
            value: 'true'
        }, {
            label: '无',
            value: 'false'
        }],
        DRAWING: [{
            label: '有',
            value: 'true'
        }, {
            label: '无',
            value: 'false'
        }],
        ROUTER: [{
            label: '有',
            value: 'true'
        }, {
            label: '无',
            value: 'false'
        }],
        CHECKDOC: [{
            label: '有',
            value: 'true'
        }, {
            label: '无',
            value: 'false'
        }],
        ATTR: [{
            label: '数学模型',
            value: 1
        }, {
            label: '框架协议',
            value: 2
        }, {
            label: '白名单',
            value: 3
        }]
    }

</script>

<style scoped>

</style>
