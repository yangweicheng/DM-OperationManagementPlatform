<template>
    <div style="padding:10px 20px 0 20px;height:100%;overflow-y:auto;">
        <el-form :model="chanpinXQmain" label-position="center" label-width="8rem" style="width:40%;margin:0 auto;" :rules="rules" ref="roleForm">
            <el-form-item label="产品名称" prop="productName">
                <el-input v-model="chanpinXQmain.productName"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="productCategory">
                <!-- <el-input v-model="chanpinXQmain.productCategory"></el-input> -->
                <el-select v-model="chanpinXQmain.productCategory" placeholder="请选择" style="width:100%;" @change="typesC" @visible-change="qingK">
                    <el-option v-for="(item,key) in types" :value="item.categoryNo" :label="item.categoryName" :key="item.categoryName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="版本号">
                <el-input v-model="chanpinXQmain.productVersion"></el-input>
            </el-form-item>
            <el-form-item label="产品状态" prop="productStatus">
                <!-- <el-input v-model="chanpinXQmain.productStatus"></el-input> -->
                <el-select v-model="chanpinXQmain.productStatus" placeholder="请选择" style="width:100%;">
                    <el-option value="1" label="研发"></el-option>
                    <el-option value="2" label="试用"></el-option>
                    <el-option value="3" label="上线"></el-option>
                    <el-option value="4" label="下线"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上线时间" prop="onlineDate">
                <!-- <el-input v-model="chanpinXQmain.onlineDate" :disabled="true"></el-input> -->
                <el-date-picker v-model="chanpinXQmain.onlineDate" type="date" editable placeholder="选择日期" :editable="false" style="width:100%;" @change="dateC"></el-date-picker>
            </el-form-item>
            <el-form-item label="型号" prop="productGroup">
                <!-- <el-input v-model="chanpinXQmain.productGroup"></el-input> -->
                <el-select v-model="chanpinXQmain.productGroup" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(item,key) in productGroups" :value="item.categoryNo" :label="item.categoryName" :key="item.categoryName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="网关" prop="gateway">
                <!-- <el-input v-model="chanpinXQmain.gateway"></el-input> -->
                <el-select v-model="chanpinXQmain.gateway" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(item,key) in AllGateway" :value="item.sid+''" :label="item.gatewayName" :key="item.gatewayName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品描述" prop="productDescription">
                <el-input v-model="chanpinXQmain.productDescription"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="chanpinXQmain.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="shangchuanPE">
                    <input type="file" class="shangchuanP" style="display:none" ref="Pfile" @change="Pfile" accept="image/*">选择图片
                </el-button>
                <span>{{productPhotosName}}</span>
            </el-form-item>
            <el-form-item>
                <el-button @click="shangchuanFE">
                    <input type="file" class="shangchuanF" style="display:none" ref="Ffile" @change="Ffile">选择文件
                </el-button>
                <span>{{productFilesName}}</span>
            </el-form-item>
            <el-form-item style="text-align:right;">
                <el-button type="primary" @click="add('roleForm')" style="width:84px;">发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {api} from '../js/api/api.js'
import { getdate , getCheckdate } from '../js/api/getNowDate.js';
import {getCookie} from '../js/api/cookie.js'
import $ from 'jquery'
import Hub from '../js/zhongzhuanzhan.js'

    export default ({
        data () {
            // var gateway = (rule, value, callback) => {
            //    if (!value) {
            //      return callback(new Error('网关不能为空'));
            //    }
            //    setTimeout(() => {
            //      if (!Number.isInteger(value)) {
            //        callback(new Error('请输入数字值'));
            //      }
            //    }, 1000);
            //  };

             var productStatus = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('状态不能为空'));
                }
                setTimeout(() => {
                  if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                  }
                }, 1000);
              };
            return {
                head:{
                    Token:getCookie('token')
                },
                sid:{
                    sid:""
                },
                dialogs:false,
                action:api.chanpinupload,
                productCategoryMR:"",
                chanpinXQmain:{
                    productName:"",
                    productCategory:"",
                    productGroup:"",
                    gateway:"",
                    onlineDate: getdate(),
                    productVersion:"",
                    productStatus:"",
                    productDescription:"",
                    remark:"",
                    productFiles:"",
                    productPhotos:""
                },
                productPhotosName:"只能选择.jpg,.png格式的图片",
                productFilesName:"只能选择.pdf,.doc,.docx格式的文件",
                types:[],
                AllGateway:[],
                productGroups:[],
                input2:"",
                rules:{
                    productName:[
                        { required: true, message: '请输入产品名称', trigger: 'blur' }
                    ],
                    productCategory:[
                        { required: true, message: '请选择类别', trigger: 'change' }
                    ],
                    gateway: [
                        { required: true, message: '网关不能为空', trigger: 'change' }
                    ],
                    productGroup:[
                        { required: true, message: '请选择型号', trigger: 'change' }
                    ],
                    onlineDate:[
                        {required: true, message: '请选择上线时间', trigger: 'change' }
                    ],
                    productDescription:[
                        { required: true, message: '请输入产品描述', trigger: 'blur' }
                    ],
                    productStatus:[
                        { required: true, message: '请选择产品状态', trigger: 'change' }
                    ]
                }
            }
        },
        mounted () {
            this.getSelect();
        },
        methods:{
            shangchuanPE () {
                this.$refs.Pfile.click()
            },
            shangchuanFE () {
                this.$refs.Ffile.click()
            },
            Pfile () {
                if(!$(".shangchuanP").prop('files')[0]){
                    this.productPhotosName="只能选择.jpg,.png格式的图片"
                }else{
                    this.productPhotosName=$(".shangchuanP").prop('files')[0].name
                }
            },
            Ffile () {
                if(!$(".shangchuanF").prop('files')[0]){
                    this.productFilesName="只能选择.pdf,.doc,.docx格式的文件"
                }else{
                    this.productFilesName=$(".shangchuanF").prop('files')[0].name
                }

            },
            add (roleForm) {
                this.$confirm("确认发布产品？",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(!$(".shangchuanP").prop('files')[0]){
                        this.$alert("图片不能为空");
                        return;
                    }
                    if(!$(".shangchuanF").prop('files')[0]){
                        this.$alert("文件不能为空");
                        return;
                    }
                    let fileType=$(".shangchuanF").prop('files')[0].name.split(".");
                    if(fileType[fileType.length-1] != "pdf" && fileType[fileType.length-1] != "docx" && fileType[fileType.length-1] != "doc"){
                        this.$alert("只能选取.pdf,.docx,.doc格式的文件");
                        return;
                    }
                    let that=this
                    let fromData= new FormData();
                    if(typeof(that.chanpinXQmain.onlineDate) == "object"){
                        that.chanpinXQmain.onlineDate=getCheckdate(that.chanpinXQmain.onlineDate)
                    }else{
                        that.chanpinXQmain.onlineDate=that.chanpinXQmain.onlineDate
                    }
                    // console.log(typeof(that.chanpinXQmain.onlineDate))
                    fromData.append("productName",that.chanpinXQmain.productName);
                    fromData.append("productCategory",that.chanpinXQmain.productCategory);
                    fromData.append("productGroup",that.chanpinXQmain.productGroup);
                    fromData.append("gateway",that.chanpinXQmain.gateway);
                    fromData.append("onlineDate",that.chanpinXQmain.onlineDate);
                    fromData.append("productVersion",that.chanpinXQmain.productVersion);
                    fromData.append("productStatus",that.chanpinXQmain.productStatus);
                    fromData.append("productDescription",that.chanpinXQmain.productDescription);
                    fromData.append("remark",that.chanpinXQmain.remark);
                    fromData.append("productPhotos",$(".shangchuanP").prop('files')[0]);
                    fromData.append("productFiles",$(".shangchuanF").prop('files')[0]);
                    // console.log($(".shangchuanF").prop('files')[0])
                    this.$refs[roleForm].validate((valid)=>{
                        if(valid){
                            this.$http.post(api.saveProduct,fromData).then((response)=>{
                                // console.log(response.body)
                                if(response.body.rtState)
                                this.$message({
                                    message:response.body.rtMsg,
                                    type:"success"
                                });
                                this.$router.push("/ProductMaintenance");
                                Hub.$emit('select1','/ProductMaintenance');
                            })
                        }
                    })
                })

            },
            dateC (val) {
                // console.log(val)
                this.chanpinXQmain.onlineDate=val
            },
            getSelect () {
                this.$http.post(api.getChildCategoryListByParentNo+"&categoryNo=PRODUCT_TYPE").then((response)=>{
                    this.types=response.body.rtData
                })
                this.$http.post(api.getAllGateway).then((response)=>{
                    this.AllGateway=response.body.rtData
                })
            },
            typesC (val) {
                // console.log(val);
                this.$http.post(api.getChildCategoryListByParentNo+"&categoryNo=MODEL_"+val).then((response)=>{
                    this.productGroups=response.body.rtData
                })
            },
            qingK (val) {

                if(!val){
                    // console.log(this.productCategoryMR)
                    // console.log(this.chanpinXQmain.productCategory)
                    if(this.productCategoryMR!=this.chanpinXQmain.productCategory){
                        this.chanpinXQmain.productGroup=null;
                    }
                }else{
                    this.productCategoryMR=this.chanpinXQmain.productCategory
                }
            }
        }
    })
</script>
<style>
    .yInputW{
        width: 30%;
    }
    .el-select .el-input {
         width: 100% !important;;
    }
</style>
