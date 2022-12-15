<template>
    <basic-container>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="data"
                   :page="page"
                   v-model="form"
                   ref="crud"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   @on-load="onLoad"
                   v-loading.fullscreen.lock="fullscreenLoading">
            <template slot="menuLeft">
                <el-button type="primary"
                           size="mini"
                           @click="conFirmSignFor">确认签收
                </el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
    import {getList,signFor}                               from "@/api/receive/receive";

    export default {
        data(){
            return {
                form              :{},
                loading           :true,
                fullscreenLoading :false,//页面整加载
                page              :{
                    pageSize   :20,
                    currentPage:1,
                    total      :0
                },
                selectionList     :[],
                option            :{
                    height:630,
                    tip: true,
                    border: true,
                    index: false,
                    addBtn: false,
                    editBtn: false,
                    viewBtn: false,
                    delBtn: false,
                    selection: true, //行可勾选
                    size: 'mini',
                    menu:false,
                    searchMenuSpan:6,
                    column        :[
                        {
                            label   :"采购单号",
                            prop    :"poCode",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            search    :true,
                            searchSpan:8,
                            width:200
                        },
                        {
                            label     :"请购单号",
                            prop      :"prCode",
                            align     :'left',
                            sortable  :true,
                            type      :"input",
                            search    :true,
                            searchSpan:8,
                            width:200
                        },
                        {
                            label   :"物料编号",
                            prop    :"itemCode",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            search    :true,
                            searchSpan:8,
                            width:250
                        },
                        {
                            label   :"物料描述",
                            prop    :"itemName",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            search    :true,
                            searchSpan:8,
                            width:350
                        },
                        {
                            label   :"收货数量",
                            prop    :"poQty",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            width:200
                        },
                        {
                            label   :"供应商编号",
                            prop    :"supCode",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            hide    : true,
                            width:80
                        },
                        {
                            label   :"供应商名称",
                            prop    :"supName",
                            align   :'left',
                            sortable:true,
                            type    :"input",
                            hide    : true,
                            width:80
                        },
                        {
                            label   :"签收状态",
                            prop    :"status",
                            align   :'left',
                            sortable:true,
                            type: "select",
                            search    :true,
                            searchSpan:8,
                            dicUrl: '/api/blade-system/dict-biz/dictionary?code=receive_status',
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            }
                        }
                    ]
                },
            };
        },
        methods   :{
            searchReset(){
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done){
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, this.query);
                done();
            },
            selectionChange(list){
                this.selectionList = list;
                this.itemCode      = []
                this.selectionList.forEach(item => {
                    this.itemCode.push(item.itemCode)
                })
            },
            selectionClear(){
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
                // 解决表头错位问题
                this.$refs.crud.refreshTable();
            },
            currentChange(currentPage){
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize;
            },
            refreshChange(){
                this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}){
                this.loading = true;
                params.ascs  = 'status'
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data      = res.data.data;
                    data.records.forEach(item => {
                        if(item.status < 0) {
                            item.status = "未签收";
                        } else {
                            item.status = "已签收";
                        }
                    })
                    this.page.total = data.total;
                    this.data       = data.records;
                    this.loading    = false;
                    this.selectionClear();

                });
            },
            //批量 确认签收
            conFirmSignFor(){
                if (this.selectionList.length === 0) {
                    this.$message.warning("请至少选择一条数据");
                    return;
                }
                let selData = JSON.parse(JSON.stringify(this.selectionList))
                let poSignForEntities = []
                for (let rowData of selData) {
                    poSignForEntities.push({
                        "poCode": rowData.poCode,
                        "prCode": rowData.prCode,
                        "itemCode": rowData.itemCode,
                        "itemName": rowData.itemName,
                        "supCode": rowData.supCode,
                        "supName": rowData.supName,
                        "poQty" : rowData.poQty,
                    })
                }
                let req = {
                    "poSignForEntities": poSignForEntities
                }
                this.fullscreenLoading = true
                signFor(req).then(() => {
                    this.$message.success("签收成功!");
                }).finally(() => {
                    this.refreshChange()
                    this.fullscreenLoading = false
                })
            },
        },
    };
</script>

