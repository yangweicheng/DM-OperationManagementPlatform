<template>
	<div style="height:100%;overflow: auto;background:#f2f2f2;padding:20px 20px 0;">
		<el-col :span="24" style="height:30px;line-height:30px;border-bottom:2px solid #DFE6EC;margin-bottom:10px;">
			<el-breadcrumb separator=">">
				<el-breadcrumb-item :to="{ path: '/ServiceManagement' }" class="w-breadcrumb">服务列表</el-breadcrumb-item>
				<el-breadcrumb-item>服务详情</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		<el-col :span="24" style="margin-bottom:15px;padding-left:20px;">
			<span>{{row.createTime}}</span>
			<span style="margin-left:40px;">订单编号:{{row.orderNumber}}</span>
		</el-col>

		<!--渲染列表-->
		<table  class="w-table1" cellspaning="0" cellpadding="0" border>
			<thead>
				<tr>
					<th class="w-xh">序号</th>
					<th class="w-name">设备名称</th>
					<th class="w-id">设备ID</th>
					<th class="w-server">服务项</th>
					<th class="w-nr">服务内容</th>
				</tr>
			</thead>
		</table>
		<table  class="w-table2" border cellspaning="0" cellpadding="0" width="100%;" style="border-top:0;background:#fff;"> 
			<tbody>
				<tr v-for="(item,index) in tableData">
					<td class="w-xh borderBB" style="border-top:0;">{{index+1}}</td>
					<td class="w-name borderBB" style="border-top:0;">{{item.equipmentName}}</td>
					<td class="w-id borderBB" style="border-top:0;">{{item.sn}}</td>
					<td class="w-ww" style="width:50%; border-top:0;">
						<table  class="w-table3"   cellspaning="0" cellpadding="0" width="100%;" border="1">
							<tr style="width:100%;border-bottom:1px solid #DFE6EC;" v-for="itemList in item.serviceList" >
								<td class="borderRight" style="width:50%;border-left:0;border-top:0;">{{itemList.serviceItemName}}</td>
								<td style="width:50%;border-top:0;">{{itemList.oldServiceContent}}</td>
							</tr>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="isShow" class="isShow">
			暂无数据
		</div>
		<el-col :span="24" class="w-toolbar"  style="height:5rem;">
             <el-pagination  style="text-align:right;"  :current-page="currentPage" :page-size="pageSize"   layout= " total ,prev, pager, next" :total="total"  @current-change="currentChange"></el-pagination>
        </el-col>
	</div>
</template>
<script>
import { api } from "../../js/api/api.js";
import  { getCheckdate } from '../../js/api/getNowDate.js';
import { getCookie } from "../../js/api/cookie.js";
	export default{
		data(){
			return{
				//分页内容
                currentPage:1,//当前页数
                total:0,  //总条数
                pageSize:10, //每页显示的条数
				tableData:[],
				row:[],
				isShow:false
			}
		},
		created:function(){
			this.handleList();
		},
		methods :{
			currentChange:function(val){
                this.currentPage=val;
            },
			handleList:function(){
				var row =this.$route.params.lookrow;
				var auditStatus=this.$route.params.auditStatus;
				// var auditStatus =Number( getCookie("auditStatus"));
				var value = JSON.parse(row);
				this.row=value;
				var para ={
					"orderId":value.orderId,
					"rows":this.pageSize,
					"page":this.currentPage,
					"auditStatus":Number(auditStatus)
				}
				// console.log(para);
				this.$http.post(api.handleService,para).then((res)=>{
					var json = res.data;
					this.total = json.total;
					// console.log(json)
					this.tableData=json.rows;
					// console.log(json);
					if(this.tableData.length==0){
						this.isShow=true;
					}else{
						this.isShow=false;
					}
				})
			}
		}
	};
</script>
<style>
	.w-table1{
		border:1px solid #DFE6EC;
		width:100%;
		height:4rem;
		line-height: 4rem;
		background:#EEF1F6;
	}
	.w-table2{
		border:0;
	}
	.w-table2 td{
		border: 1px solid #DFE6EC;
	}
	.w-table3{
		border:0;	
	}
	.w-table3 td{
		border-right:0px solid #DFE6EC;
		
	}
	.w-table1 th{
		text-align: center;
	}
	.w-xh{
		width:5.1%;
	}
	.w-name{
		width:25.1%;
	}
	.w-id{
		width:15%;
	}
	.w-server{
		width:25%;
	}
	.w-nr{
		width:24.915%;
	}
	.borderBB{
		border-bottom:2px solid #DFE6EC !important;
	}
	.isShow{
		height:4rem;
		width:99.8%;
		line-height: 4rem;
		text-align: center;
		background:#fff;
		border:1px solid #DFE6EC;
		border-top:0;
	}
	.w-toolbar .el-pagination{
        padding:0;
    }
	.w-breadcrumb .el-breadcrumb__item__inner{
		color:#28A9FF !important;
	}
</style>