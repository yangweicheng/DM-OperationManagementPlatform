<template>
    <div style="width:100%;height:100%;" class="yfenp">
        <el-row :gutter="20">
            <el-col :span="24" class="yheader">
                <el-col :span="4"  class="yheader yheaderBiaoti">天创DM运营管理平台</el-col>
                <el-col :span="14" style="height: 6.667rem">
                    <el-menu mode="horizontal"  class="yheaderList" @select="select">
                        <el-menu-item class="yheaderLists" v-for="(item,key) in menu"  :index="item.menuUrl" :key="item.menuUrl" :class="{cc:active==item.menuUrl && show}" @click="List(item.menuUrl)">
                            <img class="yheaderListImg" :src="item.menuIcon"/>
                            <span class="yheaderListname">{{item.menuName}}</span>
                            <sup class="is-dot el-badge__content" v-if="item.menuName == '消息提醒' && boolen"></sup>
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="4" class="yuser" ref="sss">
                    <el-button class="L-edit-button-info ybox" type="primary" @click="ModifyPersonalInformation"><img :src="imgUrls" alt="" class="yuserImg"></el-button>
                    <div id="yusername" style="margin:0 10px;font-size:16px;line-height:2rem;width:60%;min-width:150px">欢迎您 : <label>{{userName}}</label></div>
                    <img src="../../imgs/tuichu.png" alt="" class="out" @click="getOut">
                </el-col>
            </el-col>
        </el-row>
        <el-row type="flex" class="yMain">
                <el-col :span="4" v-show="show" style="background-color:#797979;">
                    <el-menu :router=true style="text-align:center;background-color:rgb(121, 121, 121);width:70%;margin:0 auto;" @select="select1">
                        <el-menu-item v-for="(item,key) in menus" :index="item.menuUrl" :title="item.menuName" :key="item.menuName" :class="[{cclist:activeT==item.menuUrl},cclisthover]" @click="erjiList(item.menuUrl)" style="color:#fff">{{item.menuName}}</el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="span" style="background-color:#F2F2F2;height:100%;">
                    <router-view></router-view>
                </el-col>
        </el-row>
    </div>
</template>

<script>
    import {api} from '../../js/api/api.js'
    import {getCookie,delCookie} from '../../js/api/cookie.js'
    import Hub from '../../js/zhongzhuanzhan.js'
    export default ({
        data() {
            return {
                cclisthover:'cclisthover',
                userName:'',
                active:"",
                activeT:"",
                imgUrl:"./imgs/",
                imgUrls:"",
                allP:[],
                menu:[],
                menus:[],
                show:true,
                boolen:"",
                span:20
            }
        },
        created () {
            this.getAllPath();
        },
        mounted() {
            Hub.$on('select1', (aa) => { //Hub接收事件
                 this.activeT = aa;
                 sessionStorage.setItem("activeT",this.activeT);
            })
            this.$root.eventHub.$on('EVENT_CHANGE_NAME', (data)=>{
                this.userName = data;
            })
            this.$root.eventHub.$on('EVENT_CHANGE_PHOTO', (img)=>{
                this.imgUrls = img;
            })
            this.$root.eventHub.$on('EVENT_MESSAGE_NEW', (data)=>{
                this.boolen = data;
            })
            if(this.$route.path == "/ModPass"){
                this.span = 24;
                this.show = false
            }
            this.getAdmin();
            this.getUsers();
        },
        methods:{
            getAdmin: function(){
                this.$http.post( api.getUser).then((res) => {
                    this.userName = res.body.rtData.user.userName;
                    this.imgUrls = encodeURI(encodeURI(api.getAttach + "&attachPath=" + res.body.rtData.userPhotos[0].attachPath));
                })
            },
            ModifyPersonalInformation:function(){
                this.$router.push({ path: '/ModPass' });
                this.span = 24;
                this.show = false
            },
            getAllPath () {
                this.$http.post(api.allPath).then((response)=>{
                    this.menu=response.body.rtData
                    if(response.body.rtData){
                        if(sessionStorage.getItem('active') && sessionStorage.getItem('activeT')){
                        this.active=sessionStorage.getItem('active');
                        this.activeT=sessionStorage.getItem('activeT')
                        }else{
                            this.active=response.body.rtData[0].menuUrl
                            this.activeT=response.body.rtData[0].childMenu[0].menuUrl
                        }
                        this.$router.push(this.$route.path);
                        for (var i=0;i<response.body.rtData.length;i++){
                            if(response.body.rtData[i].menuUrl==this.active){
                                this.menus=response.body.rtData[i].childMenu
                                // console.log(this.menus)
                            }
                        }
                    }
                    // console.log(sessionStorage.getItem('active'))
                })

            },
            select (key, keyPath) {
                this.show = true;
                this.span = 20;
                 this.active=key;
                 sessionStorage.setItem("active",this.active)
                 for (var i=0;i<this.menu.length;i++){
                     if(this.menu[i].menuUrl==this.active){
                         this.menus=this.menu[i].childMenu
                         this.activeT=this.menu[i].childMenu[0].menuUrl;
                        sessionStorage.setItem("activeT",this.activeT);
                         this.$router.push(this.menu[i].childMenu[0].menuUrl);
                        //  console.log(this.active);
                        //  console.log(this.activeT)

                     }
                 }
            },
            select1 (key) {
                this.activeT=key
                sessionStorage.setItem("active",this.active);
                sessionStorage.setItem("activeT",this.activeT);
            },
            erjiList (val) {
                this.activeT=val
            },
            List (val){
                this.active=val
            },
            getOut () {
                this.$confirm('确认退出登录?', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                 this.$http.post(api.doLoginOut).then((response)=>{
                     if(response.body.rtState){
                         this.$message({
                             message:response.body.rtMsg,
                             type:"success"
                         })
                         this.$router.push("/login");
                         sessionStorage.clear("active");
                         sessionStorage.clear("activeT");
                         delCookie("token");
                     }
                 })
                }).catch(() => {

                });
            },
            getUsers:function(){
                if(getCookie("token")){
        			let para = {
        				rows: 10,
        				page: 1,
                        sort:"send_time",
        				order: "desc",
                        readStatus: 0
        			};
                    this.$http.post(api.NewMessage , para)
        			.then((res) => {
    					if(res.ok && res.body.rows.length != 0){
                            this.$root.eventHub.$emit("EVENT_MESSAGE_NEW", "ture")
    					}else{
                            this.$root.eventHub.$emit("EVENT_MESSAGE_NEW", "")
    					}
        			},(err) => {
    					console.log(err)
    				   }
                    )
                    setTimeout(() => {
                        this.getUsers()
                    }, 0.5 * 60 * 1000)
                }
    		}
        }
    })
</script>
<style>
    .yheader {
        height: 6.667rem;
        background: RGB(40, 169, 255);
        line-height: 6.667rem;
    }

    .yheaderBiaoti {
        font-size: 1.6rem;
        text-align: center;
        color: RGB(255, 255, 255);
    }
    .yheaderList{
        background-color:RGB(40, 169, 255) !important;
    }
    .yheaderListImg{
        width:2.2rem;
        height:2.2rem;
        display: block;
        margin:0 auto;
    }
    .yheaderListname{
        display: block;
        line-height: 3.5rem;
        color:#fff;
    }
    .yheaderLists{
        position: relative;
        border:0 !important;
        height:6.667rem !important;
        display: -webkit-box ;
        display: -ms-flexbox;
        display: -moz-box;
        -webkit-box-orient:vertical ;
        -webkit-box-pack:center ;
    }
    .yheaderLists .is-dot{
        position: absolute;
        right: 20px !important;
        top: 12px;
    }
    .yheaderLists:hover{
        background-color:RGB(3,84,173) !important;
        height:6.667rem !important;
        border:0 !important;
    }
    .yuserImg,.out{
        display: block;
    }
    .yuserImg{
        width: 2.8rem;
        height:2.8rem;
        border-radius: 2.8rem;
        overflow: hidden;
    }
    .out{
        width:1.5rem;
        height:1.5rem;
    }
    .yuser{
        height:6.667rem;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -moz-box;
        -webkit-box-pack:justify;
        -ms-flex-pack: justify;
        -webkit-box-align:center;
    }
    #yusername{
        color:#fff;
        font-size: 1rem;
    }
    .yMain{
    position:absolute !important;
    left:0;
    bottom:0;
    right:0;
    top:6.667rem;
    }
    .cc{
        background-color: RGB(3,84,173) !important;
        color:#fff !important;
    }
    .cclist{
        background-color: #959595 !important;
        border-radius: 8px !important;
        height: 56px !important;
        margin:0 auto;
    }
    .cclisthover:hover{
        background-color: #959595 !important;
        border-radius: 8px !important;
        height: 56px !important;
        margin:0 auto;
    }
    .cclisthover:first-child,.cclisthover:last-child{
        margin:0 auto !important;
    }
    .ybox{
        display: block !important;
    }
     /*.el-menu-item.is-active {
        color: #48576a !important;
    }*/
</style>
