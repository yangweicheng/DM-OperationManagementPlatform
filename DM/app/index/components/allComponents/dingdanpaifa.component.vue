<template>
    <div class="yDingdanPad" style="padding:10px 20px 0 20px;height:100%;overflow:auto;box-sizing:border-box">
        <div style="margin-bottom:10px;">
            <el-input placeholder="订单编号/产品名称/收货人" icon="search" class="yDingdansou" style="width:50%;" v-model="input"></el-input>
            <el-button type="primary" @click="sousou" style="width:84px;">搜索</el-button>
        </div>
        <div class="yDingDanBT" style="line-height:40px;">
            <div class="ychanPinN">
                <div>产品</div>
                <div>数量</div>
            </div>
            <div>总计数量</div>
            <div>收货人</div>
            <div>状态</div>
            <div>操作</div>
        </div>
        <div  v-if="zanwu">
            <div v-for="(item,key) in tableData" class="yDingDanMain" style="margin-bottom10px;">
                <div class="yDingDanTimeAndBH"  style="line-height:40px;">
                    <div>
                        <input type="checkbox" :value="item.sid" v-model="checkedSid" @change="getSid(item.sid)" :id="'index'+item.sid" style="display:none" class="yChecked"><label :for="'index'+item.sid" class="yCheck"></label>
                    </div>
                    <div>时间：{{item.createTime}}</div>
                    <div @click="info(item.sid,item.orderStatus)" style="cursor:pointer;color:#20a0ff">订单编号：{{item.orderNumber}}</div>
                </div>
                <div class="yDingDanInfo">
                    <div>
                        <!-- <div v-for="name in item.orderItemList" class="ychanPinN">
                            <div  class="yBorder">{{name.productName}}</div>
                            <div  class="yBorder">{{name.productNums}}</div>
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
                    <div  class="yCenter">
                            <div v-if="item.orderStatus==state1">
                                <div v-if="roide==3">
                                    <el-button @click="shenhedingdan(item.sid,item.orderStatus)" style="width:84px;">派发</el-button>
                                </div>

                            </div>
                            <div v-else-if="item.orderStatus==state2">
                                <div v-if="roide==4">
                                    <el-button @click="shenhedingdan(item.sid,item.orderStatus)" style="width:84px;">派发</el-button>
                                </div>

                            </div>
                            <div v-else-if="item.orderStatus==state3">
                                <div v-if="roide==5">
                                    <el-button @click="shenhedingdan(item.sid,item.orderStatus)" style="width:84px;">派发</el-button>
                                </div>

                            </div>
                            <div v-else-if="item.orderStatus==state4">
                                <div v-if="roide==5">
                                    <el-button @click="shenhedingdan(item.sid,item.orderStatus)" style="width:84px;">派发</el-button>
                                </div>

                            </div>
                            <div v-else></div>
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
         @current-change="currentChange">
       </el-pagination>
    </div>
</template>
<script>
    import {api} from '../../js/api/api.js'
    import {getCheckdate,trasSecond} from '../../js/api/getNowDate.js'
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
                state4:"安装中",
                selectTab:"first",
                selectTabInfoNum:"3",
                value6:"",
                sids:[],
                tableData: [],
                currentPage:1,
                total:6,
                pageSize:10,
                checkedSid:[],
                zanwu:false
            }
        },
        mounted () {
            this.getList();
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
                            // this.tableData[i].createTime=trasSecond(this.tableData[i].createTime);
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
            sousou () {
                let params={
                    "rows":this.pageSize,
                	"page":this.currentPage,
                	"sort":"sid",
                	"order":"desc",
                    "queryStr":this.input
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
            shenhedingdan (sid,state){
                this.$router.push({
                    name:"toExamine",
                    params:{
                        id:sid,
                        states:state
                    }
                })
            }
        }
    }
</script>
<style>
    .el-pagination{
        padding:0 !important;
    }
    /*.yDingDanMain{
        margin-bottom: 2px;
    }
    .yDingDanBT,.yDingDanTimeAndBH,.yDingDanInfo,.ychanPinN{
        display: -webkit-box;
    }
    .yDingDanBT{
        background-color: #eef1f6;
        text-align: center;
        margin-bottom: 2px;
    }
    .yDingDanBT>div,.yDingDanInfo>div{
        width:0%;
        -webkit-box-flex:1;
        border-bottom: 1px solid #000;
        line-height: 40px;
    }
    .yDingDanInfo>div:first-child,.yDingDanBT>div:first-child{
        -webkit-box-flex:2;
    }
    .yDingDanInfo{
        text-align: center;
    }
    .yDingDanTimeAndBH{
        background-color:#c4e4f4;
        line-height: 40px;
    }
    .yDingDanTimeAndBH>div{
        margin-left: 10px;
    }
    .ychanPinN>div{
        width: 0%;
        -webkit-box-flex:1;
    }
    .ychanPinN>div:first-child{
        -webkit-box-flex:3;
    }
    .yCenter{
        display: -webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:center;
    }
    .yMidd{
        display: -webkit-box;
        -webkit-box-orient:vertical;
        -webkit-box-align:center;
    }
    .yDingdansou{
        width: 30% !important;
    }*/
</style>
