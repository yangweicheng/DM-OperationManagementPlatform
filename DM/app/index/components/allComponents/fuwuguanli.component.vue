<template>
    <div style="height:100%;overflow: auto;background:#F2f2f2;padding:10px 20px 0 20px;">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="w-tabBottom">
            <el-tab-pane  name="-1" >
                <span slot="label"> 全部列表</span>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label" > 已批准</span>
            </el-tab-pane>
            <el-tab-pane name="0">
                <span slot="label" > 未处理</span>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label">已驳回</span>
            </el-tab-pane>
        </el-tabs>
        <el-col :span="24" style="height:60px;line-height: 60px;" >
			<el-form :inline="true">
				<el-input icon="search" style="width:50%;margin-right:5%;" :span="8" v-model="text" placeholder="请输入订单编号/产品名称/收货人" type="text" class="tablesearch_box" :maxlength="30"></el-input>
				<el-date-picker v-model="startTime" type="date" :editable="false" placeholder="选择日期"></el-date-picker>
				-
				<el-date-picker v-model="endTime" type="date" :editable="false" placeholder="选择日期"></el-date-picker>
				<el-button type="primary" class="w-search-button" style="margin-left:2%;width:84px;" @click="handleSearch">搜索</el-button>
			</el-form>
		</el-col>
        <!--渲染列表-->
        <!--表头-->
        <table border="0" cellspaning="0" cellpadding="0" style="width:100%; ">
            <thead style="width:100%;height:4rem;line-height: 4rem;" class="tThead">
                 <th style="width:30%;border-top:1px solid #DFE6EC;border-left:1px solid #DFE6EC">用户</th>
                 <th style="width:10%;border-top:1px solid #DFE6EC;">设备数量</th>
                 <th style="width:10%;border-top:1px solid #DFE6EC;">服务申请</th>
                 <th style="width:10%;border-top:1px solid #DFE6EC;">状态</th>
                 <th style="width:20%;border-top:1px solid #DFE6EC;border-right:1px solid #DFE6EC">操作</th>
            </thead>
        </table>
        <table border="0" cellpadding="0" cellspaning="0" v-show="isShow" style="width:100%;background:#fff;">
			<tr style="width:100%;height:4rem;inline-height:4rem;border:1px solid #DFE6EC;">
				<td style="width:100%;text-align:center;border:1px solid #DFE6EC;">暂无数据</td>
			</tr>
		</table>
        <!--渲染列表内容-->
        <table border="1"  v-for="row in dataTable" cellspaning="0" cellpadding="0" style="width:100%;background:#fff;border:1px solid #DFE6EC;">
            <thead>
                 <tr style="background:#C4E4F4;">
                    <td colspan="6" style="text-align: left;padding-left:0;">
                        <!--<el-checkbox style="margin-left:5px;">用户账号:{{row.customerAccount}} &nbsp;&nbsp;&nbsp;&nbsp;姓名:{{row.customerName}}</el-checkbox>-->
                        <input type="checkbox" :value="row.sid" v-model="allCheckbox" @change="handleCheckbox(row.sid)" :id="'index'+row.sid" style="display:none;margin-left:10px;" class="wChecked"><label :for="'index'+row.sid" class="wCheck"></label>
                        <span style="font-size:13px;">用户账号:{{row.customerAccount}} &nbsp;&nbsp;&nbsp;&nbsp;姓名:{{row.customerName}}</span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in row.orderList" style="width:100%;">
                    <td style="width:30%;" class="w-ttd" >{{index+1}}&nbsp;&nbsp;&nbsp;订单编号:&nbsp;&nbsp;{{item.orderNumber}} <span style="margin-left:3rem;">{{item.createTime}}</span></td>
                    <td style="width:10%;">{{item.equipmentNum}}</td>
                    <td style="width:10%;">{{item.serviceNum}}</td>
                    <td style="width:10%;">{{item.statusDesc}}</td>
                    <td style="width:20%;">
                        <el-button type="text" size="small" @click="handleLook(item, index)">查看</el-button>
                        <el-button type="text" size="small" v-if="item.statusDesc=='未处理'"  @click="handleManage(item, index)" >处理</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!--分页-->
		<el-col :span="24" class="w-toolbar" style="height:5rem;">
             <el-pagination  style="text-align:right;"  :current-page="currentPage" :page-size="pageSize"  layout= " total ,prev, pager, next" :total="total"  @current-change="currentChange"></el-pagination>
        </el-col>
    </div>
</template>
<script>
import { api } from "../../js/api/api.js";
import  { getCheckdate } from '../../js/api/getNowDate.js';
import { setCookie } from "../../js/api/cookie.js";
    export default{
        data(){
            return {
                activeName: '-1',
                //查询内容
				text:"",
				//日期
				startTime:'',
				endTime:"",

				//分页内容
                currentPage:1,//当前页数
                total:0,  //总条数
                pageSize:10, //每页显示的条数

                //模拟数据
                dataTable:[],
                endDate:"",
                stratDate:"",
                isShow:false,
                checkedSid:[],
                allCheckbox:[]
            }
        },
        created:function(){
            this.handleList();
        },
        methods:{
            //tab切换函数
            handleClick() {
               this.handleList();
            },
            //搜索函数
            handleSearch:function(){
                this.handleList();
            },

            //渲染列表
            handleList:function(){
                
                var para={
                    "rows":this.pageSize,
                    "page":this.currentPage,
                    "auditStatus":Number(this.activeName),
                    "queryStr":this.text,
                    "startDate":getCheckdate(this.startTime),
                    "endDate":getCheckdate(this.endTime),
                    "sort":"sid",
                    "order":"desc"
                }
                //  console.log(para);
                this.$http.post(api.serviceList,para).then((res)=>{
                    // console.log(para)
                    var json =res.body;
                    this.total=json.total;
                    this.dataTable=json.rows;
                    //  console.log(json);
                    if(this.dataTable.length==0){
                        this.isShow=true;
                    }else{
                        this.isShow=false;
                    }
                })
            },
            //分页函数
            currentChange:function(val){
                this.currentPage=val;
                this.handleList();
            },
            //点击查看函数
            handleLook:function(row,index){
                var  str = JSON.stringify(row);
                this.$router.push({
                    name:"serviceDetails",
                    params:{
                        "lookrow":str,
                        "auditStatus":this.activeName
                    }
                });
            },
            //点击处理函数
            handleManage:function(row,index){
              var  str = JSON.stringify(row);
            //   console.log(str);
                this.$router.push({
                    name:"serviceHandle",
                    params:{
                        "row":str,
                        "auditStatus":this.activeName
                    }
                })
            },
            //复选框跨页选择
            handleCheckbox:function(sid){

            }
            
        }
    };
</script>
<style>
    .w-tabBottom .el-tabs__header{
        margin-bottom:0;
    }
    .tThead th{
        text-align: center;
        background:#EEF1F6;
    }
    .w-ttd{
        text-align: left;
        padding-left:40px;
    }
    .w-toolbar .el-pagination{
        padding:0;
    }
    .wCheck{
        display:inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        position: relative;
        top:4px;
		margin:0 10px;
        background-color: #fff;
		
    }
    .wCheck:hover{
        border-color:#20a0ff;
    }
    .wChecked:checked+.wCheck{
        background:#20a0ff;
        border-color: #20a0ff;
    }
    .wChecked:checked+.wCheck::after{
        content:"\2714";
        color:#fff;
        position:absolute;
        text-align: center;
        width: 100%;
        line-height: 20px;
        top:-2px;
    }

</style>
