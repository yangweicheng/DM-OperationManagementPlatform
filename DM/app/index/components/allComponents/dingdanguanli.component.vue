<template>
    <div class="yDingdanPad" style="padding:10px 20px 0 20px;height:100%;overflow:auto;box-sizing:border-box">
        <div>
            <el-tabs v-model="selectTab" @tab-click="tabClick">
                <el-tab-pane name="first" label="">
                    <span slot="label">全部列表</span>
                </el-tab-pane>
                <el-tab-pane label="审核中">
                    <span slot="label">审核中<b>{{shenheNum}}</b></span>
                </el-tab-pane>
                <el-tab-pane  label="待发货">
                    <span slot="label">待发货<b>{{daiNum}}</b></span>
                </el-tab-pane>
                <el-tab-pane  label="已发货">
                    <span slot="label">已发货<b>{{yiNum}}</b></span>
                </el-tab-pane>
                <el-tab-pane  label="安装中">
                    <span slot="label">安装中<b>{{zhongNum}}</b></span>
                </el-tab-pane>
                <el-tab-pane  label="已完成">
                    <span slot="label">已完成<b>{{wanNum}}</b></span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-col :span="24">
        <div style="margin-bottom:10px;">

                <el-input placeholder="订单编号/产品名称/收货人" icon="search" :span="8" class="yDingdansou tablesearch_box" style="width:50%;margin-right:5%;"  v-model="input"></el-input>
                <el-date-picker v-model="startTime" type="date" editable placeholder="选择日期" :editable="false"></el-date-picker>
                -
                <el-date-picker v-model="endTime" type="date" editable placeholder="选择日期" :editable="false"></el-date-picker>
                <el-button type="primary" @click="sousou" style="margin-left:2%;">搜索</el-button>

        </div>
        </el-col>
        <div class="yDingDanBT"  style="line-height:40px;">
            <div class="ychanPinN">
                <div>产品</div>
                <div>数量</div>
            </div>
            <div>总计数量</div>
            <div>收货人</div>
            <div>状态</div>
            <div>操作</div>
        </div>
        <div v-if="zanwu">
            <div v-for="(item,key) in tableData" class="yDingDanMain" style="margin-bottom10px;">
                <div class="yDingDanTimeAndBH" >
                    <div>
                        <!-- <el-checkbox  :value="item.sid" v-model="checkedSid"></el-checkbox> -->
                        <input type="checkbox" :value="item.sid" v-model="checkedSid" @change="getSid(item.sid)" :id="'index'+item.sid" style="display:none" class="yChecked"><label :for="'index'+item.sid" class="yCheck"></label>
                    </div>
                    <div style="line-height:40px;">时间：{{item.createTime}}</div>
                    <div @click="info(item.sid,item.orderStatus)" style="cursor:pointer;color:#20a0ff;line-height:40px;">订单编号：{{item.orderNumber}}</div>
                </div>
                <div class="yDingDanInfo">
                    <div>
                        <!-- <div v-for="name in item.orderItemList" class="ychanPinN">
                            <div class="yBorder">{{name.productName}}</div>
                            <div class="yBorder">{{name.productNums}}</div>
                        </div> -->
                        <div class="yChanpin" v-for="(item,key) in item.orderItemList">
                            <div style="border-right:1px solid #d1d1d1;border-bottom:1px solid #d1d1d1;"  class="ychanPinN">
                                  <div class="ychanPinNAi">
                                          <img :src="item.productPhotos[0].attachPath" alt="" style="width:4rem;height:2.5rem;display:block;">
                                      <div>
                                          <span>{{item.productName}}</span>
                                      </div>
                                  </div>
                                  <div>{{item.productNums}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="yCenter yBorder">
                        <div>{{item.equipmentNums}}</div>
                    </div>
                    <div class="yCenter yBorder">
                        <div>{{item.receiveUserName}}</div>
                    </div>
                    <div class="yCenter yBorder">
                        <div>{{item.orderStatus}}</div>
                    </div>

                            <div v-if="item.orderStatus==state1" class="yMidd">
                                <div v-if="roide==3">
                                    <div style="margin-bottom:5px;">
                                        <el-button @click="shenhedingdan(item.sid,1,item.orderStatus)">修改订单信息</el-button>
                                    </div>
                                    <div>
                                        <el-button @click="shenhedingdan(item.sid,2,item.orderStatus)">修改收货信息</el-button>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="item.orderStatus==state2" class="yMidd">
                                <div v-if="roide==4">
                                    <div style="margin-bottom:5px;">
                                        <el-button @click="shenhedingdan(item.sid,2,item.orderStatus)">修改收货信息</el-button>
                                    </div>
                                    <div>
                                        <el-button @click="shenhedingdan(item.sid,3,item.orderStatus)">修改设备信息</el-button>
                                    </div>
                                </div>

                            </div>
                            <div v-else-if="item.orderStatus==state3" class="yMidd">
                                <div v-if="roide==5">
                                    <div style="margin-bottom:5px;">
                                        <el-button @click="shenhedingdan(item.sid,3,item.orderStatus)">修改设备信息</el-button>
                                    </div>
                                    <div>
                                        <el-button @click="shenhedingdan(item.sid,4,item.orderStatus)">修改施工信息</el-button>
                                    </div>
                                </div>

                            </div>
                            <div v-else>

                            </div>

                </div>
            </div>
        </div>
        <div v-else style="height:4rem;background-color:#fff;text-align:center;line-height:4rem;">暂无数据</div>

        <!-- 分页 -->
        <el-pagination
        style="text-align:right;margin-bottom:20px;margin-top:-4px;"
         :current-page="currentPage"
         layout="total,prev, pager, next"
         :total="total"
         :page-size="pageSize"
         @current-change="currentChange" >
       </el-pagination>
    </div>
</template>
<script>
    import {api} from '../../js/api/api.js'
    import {getCheckdate,trasSecond} from '../../js/api/getNowDate.js';
    import { getCookie } from '../../js/api/cookie.js';
    export default {
        data() {
            return {
                roide:getCookie('roleId'),
                shenheNum:"",
                daiNum:"",
                yiNum:"",
                zhongNum:"",
                wanNum:"",
                input:"",
                state1:"审核中",
                state2:"待发货",
                state3:"已发货",
                startTime:"",
                endTime:"",
                selectTab:"first",
                selectTabInfoNum:"3",
                value6:"",
                sids:[],
                tableData: [],
                currentPage:1,
                total:6,
                pageSize:10,
                tabSelected:"",
                checkedSid:[],
                zanwu:false
            }
        },
        mounted () {
            this.getList();
            this.getNum();
        },
        methods:{
            getList () {
                let params={
                    "rows":this.pageSize,
                	"page":this.currentPage,
                	"sort":"sid",
                	"order":"desc"
                }
                this.$http.post(api.getCustomerOrderDatagrid,params).then((response)=>{
                    // console.log(response.body)
                    if(response.body.rows){
                        this.total=response.body.total
                        this.tableData=response.body.rows
                        for(var i=0;i<this.tableData.length;i++){
                            for(var j=0;j<this.tableData[i].orderItemList.length;j++){
                                // console.log(this.tableData[i].orderItemList[j])
                                this.tableData[i].orderItemList[j].productPhotos[0].attachPath=encodeURI(encodeURI(api.getAttach+"&attachPath="+this.tableData[i].orderItemList[j].productPhotos[0].attachPath+""));
                            }
                        }
                        this.zanwu=!this.zanwu
                    }else{
                        this.zanwu=!this.zanwu
                    }

                })
            },
            getNum () {
                this.$http.post(api.getCustomerOrderCount+"&orderStatus=审核中").then((response)=>{
                    // console.log(response)
                    this.shenheNum=response.body.rtData
                })
                this.$http.post(api.getCustomerOrderCount+"&orderStatus=待发货").then((response)=>{
                    // console.log(response)
                    this.daiNum=response.body.rtData
                })
                this.$http.post(api.getCustomerOrderCount+"&orderStatus=已发货").then((response)=>{
                    // console.log(response)
                    this.yiNum=response.body.rtData
                })
                this.$http.post(api.getCustomerOrderCount+"&orderStatus=安装中").then((response)=>{
                    // console.log(response)
                    this.zhongNum=response.body.rtData
                })
                this.$http.post(api.getCustomerOrderCount+"&orderStatus=已完成").then((response)=>{
                    // console.log(response)
                    this.wanNum=response.body.rtData
                })
            },
            sousou () {
                let params={
                    "rows":this.pageSize,
                	"page":this.currentPage,
                	"sort":"sid",
                	"order":"desc",
                    "startTime":getCheckdate(this.startTime),
                    "endTime":getCheckdate(this.endTime),
                    "queryStr":this.input,
                    "orderStatus":this.tabSelected
                }
                this.$http.post(api.getCustomerOrderDatagrid,params).then((response)=>{
                    // console.log(response.body)
                    this.total=response.body.total
                    this.tableData=response.body.rows
                    for(var i=0;i<this.tableData.length;i++){
                        // this.tableData[i].createTime=trasSecond(this.tableData[i].createTime);
                        for(var j=0;j<this.tableData[i].orderItemList.length;j++){
                            // console.log(this.tableData[i].orderItemList[j])
                            this.tableData[i].orderItemList[j].productPhotos[0].attachPath=encodeURI(encodeURI(api.getAttach+"&attachPath="+this.tableData[i].orderItemList[j].productPhotos[0].attachPath+""));
                        }
                    }

                })
            },
            currentChange (val) {
                this.currentPage=val;
                this.getList();
            },
            getSid (row,key) {
                // console.log(this.checkedSid)
            },
            tabClick (tab) {
                // console.log(tab);
                this.tabSelected=tab.label;
                let params={
                    "rows":this.pageSize,
                	"page":this.currentPage,
                	"sort":"sid",
                	"order":"desc",
                    "orderStatus":tab.label
                }
                this.$http.post(api.getCustomerOrderDatagrid,params).then((response)=>{
                    // console.log(response.body);
                    this.total=response.body.total
                    this.tableData=response.body.rows
                    for(var i=0;i<this.tableData.length;i++){
                        // this.tableData[i].createTime=trasSecond(this.tableData[i].createTime);
                        for(var j=0;j<this.tableData[i].orderItemList.length;j++){
                            // console.log(this.tableData[i].orderItemList[j])
                            this.tableData[i].orderItemList[j].productPhotos[0].attachPath=encodeURI(encodeURI(api.getAttach+"&attachPath="+this.tableData[i].orderItemList[j].productPhotos[0].attachPath+""));
                        }
                    }
                })
            },
            info (sid,state) {
                // console.log(sid)
                this.$router.push({
                    name:"dingdaninfo",
                    params:{
                        id:sid,
                        states:state
                    }
                })
            },
            shenhedingdan (sid,buttonId,state){
                this.$router.push({
                    name:"editdingdaninfo",
                    params:{
                        id:sid,
                        button:buttonId,
                        states:state
                    }
                })
            }
        }
    }
</script>
<style>
    .yDingDanMain{
        margin-bottom: 4px !important;
    }
    .yDingDanBT,.yDingDanTimeAndBH,.yDingDanInfo,.ychanPinN{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        color:#1F2D3D;
    }
    .ychanPinN{
        -webkit-box-flex:1;
        -moz-box-flex: 1;
        -ms-flex: 1;
    }
    .yDingDanBT{
        background-color: #eef1f6;
        text-align: center;
        margin-bottom: 4px !important;
        border-top: 1px solid #DFE6EC;
        border-left: 1px solid #DFE6EC;
        border-right: 1px solid #DFE6EC;
    }
    .yDingDanBT>div,.yDingDanInfo>div{
        width:0%;
        -webkit-box-flex:1;
        -moz-box-flex: 1;
        -ms-flex: 1;
        border-bottom: 1px solid #DFE6EC !important;
    }
    .yDingDanInfo>div:first-child,.yDingDanBT>div:first-child{
        -webkit-box-flex:2;
        -moz-box-flex: 2;
        -ms-flex: 2;
    }
    .yDingDanInfo>div:first-child{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        -webkit-box-orient:vertical;
        -moz-box-orient: vertical;
        -ms-flex-direction: column;
    }
    .yChanpin{
        -webkit-box-flex:1;
        -moz-box-flex: 1;
        -ms-flex: 1;
    }
    .yDingDanInfo{
        text-align: center;
        background-color:#fff;
    }
    .yDingDanInfo>div:first-child>div:last-child>div{
        border-bottom: 0 !important;
    }
    .yDingDanTimeAndBH{
        background-color:#C4E4F4 !important;
        /*line-height: 40px;*/
        border-bottom:1px solid #DFE6EC;
    }
    .yDingDanTimeAndBH>div{
        margin-left: 10px;
    }
    .ychanPinN>div{
        width: 0%;
        -webkit-box-flex:1;
        -moz-box-flex: 1;
        -ms-flex: 1;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        -webkit-box-align:center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-box-pack:center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
    }
    .ychanPinN>div:first-child{
        -webkit-box-flex:3;
        -moz-box-flex: 3;
        -ms-flex: 3;
    }

    .yCenter{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        -webkit-box-align:center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-box-pack:center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
    }
    .yMidd{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        -webkit-box-align:center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-box-pack:center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
        -webkit-box-orient:vertical;
        -moz-box-orient: vertical;
        -ms-flex-direction: column;
    }
    .yDingdansou{
        width: 50% !important;
    }
    .yBorder{
        border-right:1px solid #DFE6EC !important;
        border-bottom:1px solid #DFE6EC !important;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        -webkit-box-align:center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-box-pack:center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
        padding: 10px 0;
    }
    .yDingDanMain{
        margin-bottom: 2px;
        border-left:1px solid #DFE6EC !important;
        border-right:1px solid #DFE6EC !important;
        border-top:1px solid #DFE6EC !important;
    }
    .yCheck{
        display:block;
        width: 16px;
        height: 16px;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        position: relative;
        top:12px;
        background-color: #fff;
    }
    .yCheck:hover{
        border-color:#20a0ff;
    }
    .yChecked:checked+.yCheck{
        background:#20a0ff;
        border-color: #20a0ff;
    }
    .yChecked:checked+.yCheck::after{
        content:"\2714";
        color:#fff;
        position:absolute;
        text-align: center;
        width: 100%;
        line-height: 20px;
        top:-2px;
    }
</style>
 
