
import zhuyeComponent from '../components/zhuye.component.vue';
import Login from '../components/w-login';
/*
 *客户管理列表
 *
 *kehuxinxiComponent 客户信息内容
 *fuwuguanliComponent  服务管理内容
 *dingdanguanliComponent 订单管理内容
 *CustomersView 客户查看
 */

import kehuxinxiComponent from '../components/allComponents/kehuxinxi.component.vue';
import CustomersView from "../components/allComponents/CustomersView.vue"
// import kehuxinxiComponent from '../components/list.vue';
import fuwuguanliComponent from '../components/allComponents/fuwuguanli.component.vue';
import dingdanguanliComponent from '../components/allComponents/dingdanguanli.component.vue';
// import dingdanguanlitwoComponent from '../components/allComponents/dingdanguanlitwo.component.vue';
// import dingdanguanlithreeComponent from '../components/allComponents/dingdanguanlithree.component.vue';

import dingdanpaifaComponent from '../components/allComponents/dingdanpaifa.component.vue'
// import dingdanpaifathreeComponent from '../components/allComponents/dingdanpaifathree.component.vue'
// import dingdanpaifatwoComponent from '../components/allComponents/dingdanpaifatwo.component.vue'
import toExamineComponent from '../components/toExamine.component.vue';
import dingdaninfoComponent from '../components/dingdaninfo.component.vue';
import editdingdaninfoComponent from '../components/editdingdaninfo.component.vue'

import lookOrder from '../components/allComponents/lookOrder.vue';
import OrderView from "../components/allComponents/OrderView.vue";

import serviceDetails from "../components/allComponents/serviceDetails.vue";
import serviceHandle from "../components/allComponents/serviceHandle.vue";
/*
*系统设置
 *二级菜单列表
 *yonghuguanliComponent  用户管理
 *jueseguanliComponent 角色管理
 *caidanguanliComponent  菜单管理
 */

import yonghuguanliComponent from '../components/User.vue'
import jueseguanliComponent from '../components/jueseguanli.component.vue'
import caidanguanliComponent from '../components/caidanguanli.component.vue'
import xitongrizhiComponent from '../components/xitongrizhi.component.vue'
/*
*消息提醒
 *二级菜单列表
 *New  新消息
 *History 历史消息
 */

import New from '../components/New.vue'
import History from '../components/History.vue'
/*
 *产品管理
 *
 *chanpinweihuComponent    产品维护
 *chanpinshangxianComponent   产品上线
 *liuchangguifanComponent    流程规范
 */

import chanpinweihuComponent from '../components/chanpinweihu.component.vue'
import chanpinshangxianComponent from '../components/chanpinshangxian.component.vue'
import liuchangguifanComponent from '../components/liuchangguifan.component.vue'
import productView from '../components/chanpinchakan.component.vue'
import SpecificationView from '../components/guifanchakan.component.vue'
import productDetails from '../components/chanpininfo.component.vue'
/*
 *密码修改
 *ModPass 密码修改
 */
import ModPass from '../components/ModPass.vue'
/*
 *设备中心
 *setNetwork 网关设定
 *bindMessage 绑定信息
 *setWarning 预警设置
 *setInstruction 指令设置
 */
import setNetwork from '../components/setNetwork.vue'
import bindMessage from '../components/bindMessage.vue'
import bindDetails from '../components/bindDetails.vue'
import setWarning from '../components/setWarning.vue'
import setInstruction from '../components/setInstruction.vue'
import setInstructionList from '../components/setInstructionList.vue'
import setInstructionDetails from '../components/setInstructionDetails.vue'
import detailwarning from '../components/detailwarning.vue'
import viewGateway from '../components/viewGateway.vue';



import Token from "../components/allComponents/token.vue";
export const routes = [
    {
        path: '/login',    //登录页面
        component: Login
    },
    {
        path: '/token',    //登录页面
        component: Token
    },
    {
        path: "/main",
        components: {
            default: zhuyeComponent
        },
        children:[
            {
                path:"/ServiceManagement",
                name:"服务管理",
                component:fuwuguanliComponent
            },
            {
                path:"/serviceDetails/:lookrow/:auditStatus",
                name:"serviceDetails",
                component:serviceDetails
            },
            {
                path:"/serviceHandle/:row/:auditStatus",
                name:"serviceHandle",
                component:serviceHandle
            },
            {
                path:"/CustomerInformation",
                name:"客户信息",
                component:kehuxinxiComponent
            },
            {
                path:"/CustomersView",
                name:"客户查看",
                component:CustomersView
            },
            {
                path:"/lookOrder/:sid",
                name:"lookOrder",
                component:lookOrder
            },
            {
                path:"/OrderView/:sid",
                name:"OrderView",
                component:OrderView
            },
            {
                path:"/OrderManagement",
                name:"dingdanguanli",
                component:dingdanguanliComponent
            },
            {
                path:"/OrderDistribution",
                name:"dingdanpaifa",
                component:dingdanpaifaComponent
            },
            {
                path:"/userManagement",
                name:"用户管理",
                component:yonghuguanliComponent
            },
            {
                path:"/RoleManagement",
                name:"角色管理",
                component:jueseguanliComponent
            },
            {
                path:"/MenuManagement",
                name:"菜单管理",
                component:caidanguanliComponent
            },
            {
                path:"/systemLog",
                name:"系统日志",
                component:xitongrizhiComponent
            },
            {
                path:"/NewMsg",
                component:New
            },
            {
                path:"/HistoryMsg",
                component: History
            },
            {
                path:"/ProductMaintenance",
                component:chanpinweihuComponent
            },
            {
                path:"/productView",
                component:productView
            },
            {
                path:"/ProductLine",
                component:chanpinshangxianComponent
            },
            {
                path:"/ProcessSpecification",
                component:liuchangguifanComponent
            },
            {
                path:"/SpecificationView",
                component:SpecificationView
            },
            {
                path:"/productDetails/:id",
                name:"productDetails",
                component:productDetails
            },
            {
                path:"/setNetwork",
                component:setNetwork
            },
            {
                path:"/bindMessage",
                component:bindMessage
            },
            {
                path:"/setWarning",
                component:setWarning
            },
            {
                path:"/setInstruction/:name/:sn/:id",
                name:"setInstruction",
                component:setInstruction
            },
            {
                path:"/setInstructionDetails/:id",
                name:"setInstructionDetails",
                component:setInstructionDetails
            },
            {
                path:"/ModPass",
                component:ModPass

            },
            {
                path:"/toExamine/:id/:states",
                name:"toExamine",
                component:toExamineComponent
            },
            {
                path:"/OrderDetails/:id/:states",
                name:"dingdaninfo",
                component:dingdaninfoComponent
            },
            {
                path:"/ModifyOrder/:id/:states/:button",
                name:"editdingdaninfo",
                component:editdingdaninfoComponent
            },
            {
                path:"/setNetwork",
                component:setNetwork
            },
            {
                path:"/bindMessage",
                component:bindMessage
            },
            {
                path:"/bindDetails/:id",
                name:"bindDetails",
                component:bindDetails
            },
            {
                path:"/setWarning",
                component:setWarning
            },
            {
                path:"/setInstructionList",
                component:setInstructionList
            },
            {
                path:"/ModPass",
                component:ModPass
            },
            // {
            //     path:"/toExamine",
            //     component:toExamineComponent
            // },
            {
                path:"/detailwarning/:id/:state",
                name:"detailwarning",
                component:detailwarning
            },
            {
                path:"/viewGateway/:gatewayName/:id",
                name:"viewGateway",
                component:viewGateway
            }
        ]
    },
    {
        path: "/",
        redirect:"/login"
    }
]
