<template>
	<div style="height:100%;overflow: auto;background:#f2f2f2;padding:20px;">
		<el-col :span="24" style="height:30px;line-height:30px;border-bottom:2px solid #DFE6EC;" >
			<el-breadcrumb separator=">">
				<el-breadcrumb-item :to="{ path: '/CustomersView' }" class="w-breadcrumb">客户查看</el-breadcrumb-item>
				<el-breadcrumb-item>查看订单</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		<el-col :span="24" style="height:60px;line-height: 60px;" >
			<el-form :inline="true">
				<el-input icon="search" style="width:50%;margin-right:5%;" :span="8" v-model="text" placeholder="请输入订单编号/产品名称/收货人" type="text" class="tablesearch_box" :maxlength="30"></el-input>
				<el-date-picker v-model="startTime" type="date" :editable="false"  placeholder="选择日期"></el-date-picker>
				-
				<el-date-picker v-model="endTime" type="date" :editable="false" placeholder="选择日期"></el-date-picker>
				<el-button type="primary" class="w-search-button" style="margin-left:2%;width:84px;" @click="handleSearch">搜索</el-button>
			</el-form>
		</el-col>
		<table border="0" cellpadding="0" cellspaning="0" width="100%;" >
			<thead class="w-thead">
				<th  style="width:30%;border-top:1px solid #DFE6EC;border-left:1px solid #DFE6EC">产品</th>
				<th  style="width:10%;border-top:1px solid #DFE6EC">数量</th>
				<th  style="width:10%;border-top:1px solid #DFE6EC">总计数量</th>
				<th  style="width:10%;border-top:1px solid #DFE6EC">收货人</th>
				<th  style="width:10%;border-top:1px solid #DFE6EC;border-right:1px solid #DFE6EC">状态</th>
			</thead>
		</table>

		<table v-for="(item,index) in tableData" class="w-table"  cellspaning="0" cellpadding="0" style="width:100%;margin-bottom:5px;background:#fff;border-color:#DFE6EC;">
				<thead style="width:100%;">
					<tr class="w-theader" style="border-bottom:1px solid #DFE6EC;">
						<td colspan="4" style="text-align: left; ">
							<!--<el-checkbox class="w-checkbox"  :value="item.sid" v-model="allCheckbox" @change="handleCheckbox"  style="margin-left:10px;"  >{{item.createTime}} </el-checkbox>-->
							 <input type="checkbox" :value="item.sid" v-model="allCheckbox" @change="handleCheckbox(item.sid)" :id="'index'+item.sid" style="display:none;margin-left:10px;" class="wChecked"><label :for="'index'+item.sid" class="wCheck"></label>
							 <span style="font-size:13px;">{{item.createTime}}</span>
							<el-button type="text"  style="margin-left:15px;" @click="handleDetails(item,index)">订单编号:{{item.orderNumber}}</el-button>
						</td>
					</tr>
				</thead>
				<tbody style="width:100%;">
				<tr>
					<td style="width:40%;">
						<table style="width:100%;border-color:#DFE6EC;">
							<tr v-for="itemList in item.orderItemList" style="border-bottom:1px solid #DFE6EC;" class="borderNone">
								<td style="width:30%;" class="tdLeft">
								<img class="tdImg" :src="encodeURI(encodeURI(api+itemList.productPhotos[0].attachPath))" />
								{{itemList.productName}}</td>
								<td style="width:10%;">{{itemList.productNums}}</td>
							</tr>
						</table>
					</td>
					<td style="width:10%;" class="border-left">{{item.equipmentNums}}</td>
					<td style="width:10%;" class="border-left">{{item.receiveUserName}}</td>
					<td style="width:10%;" class="border-left">{{item.orderStatus}}</td>
				</tr>
			</tbody>
		</table>
		<div v-if="isShow" class="lookisShow">
			暂无数据
		</div>
		<!--分页-->
		<el-col :span="24" class="w-toolbar" style="height:5rem;">
            <el-pagination  style="text-align:right;"  :current-page="currentPage" :page-size="pageSize"   layout= " total ,prev, pager, next" :total="total"  @current-change="currentChange"></el-pagination>
        </el-col>
	</div>

</template>
<script>
import  { getCheckdate } from '../../js/api/getNowDate.js';
import { api } from "../../js/api/api.js";
import { getCookie } from "../../js/api/cookie.js";
	export default{

		data () {
			return  {
				api:api.getAttach+"&attachPath=",
				baseUrl:'assets/',
				imgpng:"del.png",
				//查询内容
				text:"",
				//日期
				startTime:'',
				endTime:"",
				num: "",
				checklist:[],
				//分页内容
                currentPage:1,//当前页数
                total:0,  //总条数
                pageSize:10, //每页显示的条数10
				list:[],
				tableData: [],
				isShow:false,
				customerSid:"",
				allCheckbox:[]
			}
		},
		
		created:function(){

			this.handleList();
		},
		methods: {
			//点击搜索函数
			handleSearch:function(){
				this.handleList();
			},
			//分页获取当前页码函数
			currentChange (val) {
                this.currentPage=val;
                this.handleList();
            },
			handleDetails:function(row,index){	
				// if(event.target.checked){
				// 	// console.log(row)
					this.$router.push({
						name:'dingdaninfo',
						params:{
							"id":row.sid,
							"states":row.orderStatus
						}
					})				
				// }
			},
			//渲染列表
			handleList:function(){
				this.customerSid = this.$route.params.sid;
				// console.log(customerSid);
				var para={
					"sort":"sid",
					"rows":this.pageSize,
					"page":this.currentPage,
					"order":"desc",
					"queryStr":this.text,
					"startTime":getCheckdate(this.startTime),
					"endTime":getCheckdate(this.endTime),
					"orderStatus":"",
					"customerId":this.customerSid
				}
				this.$http.post(api.customerOrderList,para).then((res)=>{
					
					if(res.ok){
						var json = res.data;
						this.tableData =json.rows;
						//  console.log(json.rows)
						this.total = json.total;
						if(this.tableData.length==0){
							this.isShow=true;
						}else{
							this.isShow=false;
						}
					}
				})
			},
			//复选框跨页选择
			handleCheckbox:function(sid){
				// console.log(sid)
			}
		}
	};

</script>
<style>
    .w-thead>th{
		text-align: center;
		height:4rem;
		line-height: 4rem;
		background:#EEF1F6;
	}
	.w-table{
		border:1px solid #DFE6EC;
	}
	.border-left{
		border-left:1px solid #DFE6EC;
		border-bottom:2px solid #DFE6EC;
	}
	.w-theader{
		background:#C4E4F4;
		height:4rem;
		line-height: 4rem;
		width:100%;
	}
	td{
		text-align: center;
		height:4rem;
		line-height: 4rem;
	}
	.tdImg{
		width:4rem;
		height:2.5rem;
		vertical-align:middle;
		margin-right:20px;
		border:2px solid #DFE6EC;
	}
	.tdLeft{
		text-align: left;
		padding-left:10%;
	}
	.lookisShow{
		height:4rem;
		width:100%;
		line-height: 4rem;
		text-align: center;
		background:#fff;
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
	.w-breadcrumb .el-breadcrumb__item__inner{
		color:#28A9FF !important;
	}
</style>