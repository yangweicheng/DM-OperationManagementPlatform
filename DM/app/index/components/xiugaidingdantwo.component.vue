<template>
    <div>
        <!-- <div>{{$route.params.id}}</div> -->
        <!-- <div>{{$route.params.states}}</div> -->
        <div class="ypaifa" style="margin-bottom:10px;">
            <div class="yTimeAbian">
                <div class="ypaifaM">{{keeper.createTime}}</div>
                <div class="ypaifaM">订单编号：{{keeper.orderNumber}}</div>
            </div>
            <div>
                <el-button type="primary" @click="edit" style="width:84px;">修改</el-button>
            </div>
        </div>
        <div class="ydingdanmain">
          <div style="border-bottom:1px solid #d1d1d1;">
              <div><b>收获地址：</b><span><el-input style="width:80%;" v-model="keeper.receiveUserAddress" :disabled="shouhuoxinxi"></el-input></span></div>
              <div class="yAddressee">
                  <div><b>收件人：</b><span><el-input style="width:30%;" v-model="keeper.receiveUserName" :disabled="shouhuoxinxi"></el-input></span></div>
                  <div><b>联系电话：</b><span><el-input style="width:30%;" v-model="keeper.receiveUserPhone" :disabled="shouhuoxinxi"></el-input></span></div>
              </div>
          </div>
          <div  style="border-bottom:1px solid #d1d1d1;" class="yAddressee">
              <div>
                  <b>仓库管理员：</b><span>{{keeper.libKeeperName}}</span>
              </div>
              <div>
                  <b>联系电话：</b>
                 <span>{{keeper.libKeeperPhone}}</span>
              </div>
          </div>
          <div  style="border-bottom:1px solid #d1d1d1;margin-bottom:10px;" class="yAddressee">
              <div>
                  <b>施工人员：</b>
                 <span v-for="(item,key) in keeper.implementUserList">{{item.userName}}&nbsp;</span>
              </div>
              <div>
                  <b>联系电话：</b>
                  <span v-for="(item,key) in keeper.implementUserList">{{item.userPhone}}&nbsp;</span>
              </div>
          </div>
          <div style="border:1px solid #d1d1d1;">
              <div class="yChanpin" v-for="(item,key) in keeper.orderItemList">
                  <div style="border-right:1px solid #d1d1d1;border-bottom:1px solid #d1d1d1;" class="ychanPinN">
                        <div class="ychanPinNAi">
                                <img :src="item.productPhotos[0].attachPath" alt="" style="width:3rem;height:3rem;display:block;">
                            <div>
                                <span>{{item.productName}}</span>
                            </div>
                        </div>
                        <div style="text-align:center;">
                            <span>{{item.productNums}}</span>
                        </div>
                  </div>
                  <div style="border-bottom:1px solid #d1d1d1;" class="ybj">
                        <div class="yshebeiSNeditT"><span v-for="(equipmentId,key) in item.equipmentInfoList" >{{equipmentId.equipmentId}}/</span></div>
                        <div>
                            <el-button class="L-button" size="small" @click="shebei(item.orderId,item.productId,item.productNums,item.equipmentInfoList)"  :disabled="shebeixinxi"><img src="../imgs/edit.png"></el-button>
                        </div>
                  </div>
              </div>
          </div>
        </div>
        <el-dialog title="设备信息" v-model="shebeiInfo">
            <form >
               <template v-for="(item,key) in formL">
                   <div>
                       <span>{{key+1}}</span>
                       <input v-model="item.equipmentId"  required class="yinp"   style="margin-bottom:10px;" ></input>&nbsp;<el-button class="L-button" size="small" @click="del(key)" v-if="aa"><img src="../imgs/del.png"></el-button>
                   </div>
               </template>
                  <div style="margin-top:10px;text-align:right;">
                      <el-button @click="shebeiInfo=!shebeiInfo" >取消</el-button>
                      <el-button @click="niceEditT()"   type="primary">提交</el-button>
                  </div>
           </form>
        </el-dialog>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {api} from '../js/api/api.js';
    import {getCheckdate,trasSecond} from '../js/api/getNowDate.js';
    export default ({
        data () {
            return {
                dingdanxinxi:true,
                shouhuoxinxi:true,
                shebeixinxi:true,
                shigongxinxi:true,
                value:"",
                value1:"",
                keeper:[],
                productNums:[],
                shebeiInfo:false,
                formL:[],
                productNumL:"",
                orderId:"",
                productId:"",
                aa:false
            }
        },
        mounted () {
            this.getInfo();
        },
        methods:{
            getInfo () {
                if(this.$route.params.button==1){
                    this.dingdanxinxi=false
                }else if(this.$route.params.button==2){
                    this.shouhuoxinxi=false
                }else if(this.$route.params.button==3){
                    this.shebeixinxi=false
                }else if(this.$route.params.button==4){
                    this.shigongxinxi=false
                }
                let id=this.$route.params.id
                this.$http.post(api.getCustomerOrderById,{"sid":id}).then((response)=>{
                    // console.log(response.body)
                    this.keeper=response.body.rtData
                    // this.keeper.createTime=trasSecond(this.keeper.createTime);
                    for(var i=0;i<this.keeper.orderItemList.length;i++){
                        this.keeper.orderItemList[i].productPhotos[0].attachPath=encodeURI(encodeURI(api.getAttach+"&attachPath="+this.keeper.orderItemList[i].productPhotos[0].attachPath+""));
                    }
                })
            },
            edit () {
                this.$confirm("确认修改信息？",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.$route.params.button==2){
                        let params={
                            sid:this.$route.params.id,
                            receiveUserAddress:this.keeper.receiveUserAddress,
                            receiveUserName:this.keeper.receiveUserName,
                            receiveUserPhone:this.keeper.receiveUserPhone
                        }
                        this.$http.post(api.updateCustomerOrder,params).then((response)=>{
                            // console.log(response.body);
                            this.$message({
                                message:response.body.rtMsg,
                                type:"success"
                            });
                            this.$router.push("/OrderManagement")
                        })
                    }
                    if(this.$route.params.button==3){
                        for(var i=0;i<$(".yshebeiSNeditT").length;i++){
                            if($(".yshebeiSNeditT").eq(i).text()==""){
                                this.$alert("SN号不能为空");
                                 return;
                            }
                        }
                        var aa=[]
                        for(var i=0;i<$(".yshebeiSNeditT").length;i++){
                            aa.push($(".yshebeiSNeditT").eq(i).text())
                        }
                        for(var i=0;i<aa.length;i++){
                            if(this.keeper.orderItemList[i].productNums != aa[i].split("/").length-1){
                                this.$alert("SN号数量与订单数量不符！！");
                                return;
                            }
                        }
                        this.$router.push("/OrderManagement")
                    }
                })

            },
            shebei (orderId,productId,productNums,equipmentInfoList) {

                this.productNumL=productNums
                this.orderId=orderId
                this.productId=productId
                this.formL=[];
                if(equipmentInfoList.length>=productNums){
                    for(var i=0;i<equipmentInfoList.length;i++){
                        var obj={};
                        var b="";
                        b=equipmentInfoList[i].equipmentId
                        obj.equipmentId=b
                        this.formL.push(obj)
                        // console.log(this.formL)
                    }
                }else{
                    for(var i=0;i<productNums;i++){
                        var obj={};
                        var b="";
                        if(equipmentInfoList[i]){
                            b=equipmentInfoList[i].equipmentId
                        }
                        obj.equipmentId=b
                        this.formL.push(obj)
                        // console.log(this.formL)
                    }
                }
                this.shebeiInfo=!this.shebeiInfo
            },
            niceEditT () {
                this.$confirm("确认修改信息？",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.productNumL == this.formL.length){
                        for (var i=0;i<$(".yinp").length;i++){
                            if(!$(".yinp").eq(i).val().trim()){
                                this.$alert("SN号不能为空");
                                return
                            }
                        }
                        var list=[];
                        for(var i=0;i<$(".yinp").length;i++){
                            var obj={};
                            obj.equipmentId=$(".yinp").eq(i).val();
                            list.push(obj)
                        }
                        // console.log(list);
                        let params={
                            orderId:this.orderId,
                            productId:this.productId,
                            equipmentIds:list
                        }
                        this.$http.post(api.saveEquipmentInfos,params).then((response)=>{
                            // console.log(response.body)
                            if(response.body.rtState){
                                this.$message({
                                    message:response.body.rtMsg,
                                    type:"success"
                                });
                                // this.getInfo();
                                for(var i=0;i<this.keeper.orderItemList.length;i++){
                                    if(this.keeper.orderItemList[i].productId==this.productId){
                                        this.keeper.orderItemList[i].equipmentInfoList=list
                                    }
                                }
                                this.shebeiInfo=!this.shebeiInfo
                            }
                        })
                    }else{
                        this.aa=true
                        // alert()
                    }
                })

            },
            del (aa) {
                if(this.productNumL == this.formL.length){
                    this.aa=false
                }else{
                    this.formL.splice(aa,1)
                }
            }
        }
    })
</script>
<style>
    /*.ychanPinNAi{
        padding-left: 10px;
        display: -webkit-box;
        -webkit-box-align:center;
        text-align: center;
    }
    .ychanPinNAi>div:last-child{
        -webkit-box-flex:1;
        width:0%;
    }*/
</style>
