<template lang="html" style="overflow:auto">
    <section class="L-background"  style="overflow-y:auto;">
        <div class="L-center-div">
            <!-- 顶部 -->
            <el-col :span="24" class="toolbar L-warn-head">
                <el-form :inline="true">
                    <el-breadcrumb separator=">">
                        <el-breadcrumb-item :to="{ path: '/setWarning' }" class="L-bind-color">预警列表</el-breadcrumb-item>
                        <el-breadcrumb-item>预警详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-form>
            </el-col>

            <!-- 编辑按钮 -->
            <div class="L-warn-button">
                <el-col :span="24">
                    <el-form :inline="true">
                        <el-form-item style="width:84px;float:right">
                            <el-button type="primary" class="L-button-content L-bindmessage-button" @click.native="editor" ref="State" v-if="this.$route.params.state == 2">{{ editorState== false ?  "保存" : "编辑"}}</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </div>

            <!-- 表格 -->
            <table class="L-warn-table">
                <thead class="L-thead" >
                    <td v-for="(item,index) in menu" :width="item.width">{{ item.name }}</td>
                </thead>
                <tbody style="background:#fff;" v-if="showTable">
                    <tr>
                        <td :rowspan="this.rowLength">{{ this.name }}</td>
                        <td :rowspan="this.rowLength">{{ this.id }}</td>
                    </tr>
                    <tr v-for="(item,index) in list">
                        <td :label = "item.paramCode">{{ item.paramName }}({{item.paramUnit}})</td>
                        <td>
                            <div class="L-last-input active2 active1">
                                <input type="text" name="" v-model="item.minValue" style="width:100%;" :disabled="editorState">
                            </div>
                            <div class="L-last-input active2">
                                <input type="text" name="" v-model="item.maxValue" style=" width:100%;" :disabled="editorState">
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody style="background:#fff;" v-else="showTable">
                    <tr  style="width100%;text-align:center">
                        <td :colspan="4">
                            暂无数据
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import { api } from '../js/api/api';
export default {
    mounted(){
        this.getWarningSettingBySn()
    },
    methods:{
        editor:function(){
            this.editorState = !this.editorState;
            if(this.editorState){
                let para = {
                    equipmentSid : this.$route.params.id,
                    warningSettings :this.list
                }
                this.$http.post( api.saveWarningSetting, para).then((res) => {
                    this.$message({
                        type: 'success',
                        message: res.body.rtMsg
                    })
                    this.getWarningSettingBySn()
                },
                (err) => {
                    console.log(err)
                })
            }
        },
        getWarningSettingBySn:function(){
            this.$http.post( api.getWarningSettingBySn, {equipmentSid:this.$route.params.id}).then((res) => {
                if(res.body.rtData.warningSettings && res.body.rtData.warningSettings.length != 0){
                    this.showTable = true;
                    this.id = res.body.rtData.equipmentInfo.equipmentId;
                    this.name = res.body.rtData.equipmentInfo.equipmentName;
                    this.list = res.body.rtData.warningSettings;
                    this.rowLength = this.list.length + 1;
                }else{
                    this.showTable = false;
                }
            })
        }
    },
    watch:{
        '$route':'id'
    },
    data(){
        return{
            warnStyle:[],
            menu:[
                {  name:"设备名称",width:"10%" },
                {  name:"设备ID",width:"10%"  },
                {  name:"预警类型",width:"10%"},
                {  name:"预警值",width:"10%"}
            ],
            rowLength:0,
            list:[],
            name:"",
            id:"",
            editorState:true,
            showTable:''
        }
    }
}
</script>

<style lang="css">
    .L-bind-color .el-breadcrumb__item__inner{
        color: #28A9FF !important;
    }
    .L-warn-head{
        height: 3rem;
    }
    .L-center-div .el-breadcrumb{
        line-height: 3 !important;
    }
    .L-warn-table{
        width: 100%;
    }
    .L-warn-table .L-setIns-table{
        width: 100%;
    }
    .L-warn-table .L-thead, .L-setIns-table .L-thead{
        width: 100%;
        background: #EEF1F6
    }
    .L-warn-table-div{
        height: 10px;
    }
    .L-warn-table td, .L-setIns-table td{
        border: 1px solid #DFE6EC;
    }
    .L-warn-table td input ,.L-setIns-table td input{
        text-align: center;
        display:block;
        height:100%;
        border: 0 !important;
    }
    .LFloatLeft{
        float: left;
    }
    .L-warn-button .el-form-item{
        margin-bottom: 1rem;
    }
    .L-warn-button .el-form-item__content{
        width: 100%;
        float: right;
    }
    .active2{
        float: left;
        width: 49.6%;
    }
    .active1{
        border-right:1px solid #DFE6EC;
    }
    input:disabled{
        background: #fff;
    }
    .L-first-input{
        height:100%;
    }
    .L-last-input{
        height: 100%;
    }
    .L-warn-table input{
        text-align: center;
    }
</style>
