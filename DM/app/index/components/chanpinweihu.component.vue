<template>
    <div style="padding:10px 20px 0 20px;height:100%;overflow:auto;box-sizing:border-box">
        <!-- 产品列表 -->
        <div v-if="!this.chanpinXQ">
            <div style="margin-bottom:10px;">
                <el-input placeholder="产品名称/类别/型号" icon="search" v-model="input2" style="width:50%;"></el-input>
                <el-button type="primary" @click="sousuo" style="width:84px;">搜索</el-button>
            </div>
            <div style="border:1px solid #838383;height:0;margin-bottom:15px;"></div>
            <div style="">
                <el-table :data="tableData" border style="width: 100%" stripe   @selection-change="selected2" row-key="sid">
                    <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                    <el-table-column prop="key" label="序号" width="80"></el-table-column>
                    <el-table-column prop="productName" label="产品名称">
                        <template scope="props">
                            <!-- <div style="cursor:pointer:color:#20a0ff;" @click="info(props.row)"></div> -->
                            <el-button type="text" size="small" @click="info(props.row)">{{props.row.productName}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="product_group" label="组别"></el-table-column> -->
                    <el-table-column prop="productCategory" label="类别"></el-table-column>
                    <el-table-column prop="productGroup" label="型号"></el-table-column>
                    <el-table-column prop="productVersion" label="版本号"></el-table-column>
                    <el-table-column prop="productStatus" label="产品状态" sortable></el-table-column>
                    <el-table-column prop="onlineDate" label="上线时间" sortable></el-table-column>
                    <el-table-column label="宣传文档" inline-template>
                        <template>
                            <div>

                                <el-button type="text" size="small" ><a :href="row.attachPath" style="color:#20a0ff;text-decoration:none">下载</a></el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" inline-template>
                        <template>
                                <el-button class="L-button" size="small" @click="handleEdit(row)"><img src="../imgs/edit1.png"></el-button>
                                <el-button class="L-button" size="small" @click="del(row)"><img src="../imgs/del.png"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <el-pagination
            style="text-align:right;"
            :current-page="currentPage"
            layout="total,prev, pager, next"
            :total="total"
            :page-size="pageSize"
             @current-change="currentChange">
           </el-pagination>
        </div>
        <!-- 弹窗-修改 -->
        <el-dialog title="修改" v-model="dialogs">
            <el-form :model="dialogForm" label-position="left" label-width="8rem" :rules="rules" ref="roleForm">
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="dialogForm.productName" :disabled="disabledEdit"></el-input>
                </el-form-item>
                <el-form-item label="类别"  prop="productCategory">
                    <!-- <el-input v-model="dialogForm.productCategory"></el-input> -->
                    <el-select v-model="dialogForm.productCategory" placeholder="请选择" style="width:100%;" @change="typesC" @visible-change="qingK"  :disabled="disabledEdit">
                        <el-option v-for="(item,key) in types" :value="item.categoryNo" :label="item.categoryName" :key="item.categoryName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="型号"   prop="productGroup">
                    <!-- <el-input v-model="dialogForm.productGroup"></el-input> -->
                    <el-select v-model="dialogForm.productGroup" placeholder="请选择" style="width:100%;"  :disabled="disabledEdit">
                        <el-option v-for="(item,key) in productGroups" :value="item.categoryNo" :label="item.categoryName" :key="item.categoryName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号">
                    <el-input v-model="dialogForm.productVersion" :disabled="disabledEdit"></el-input>
                </el-form-item>
                <el-form-item label="产品状态"  prop="productStatus">
                    <!-- <el-input v-model="dialogForm.productStatus"></el-input> -->
                    <el-select v-model="dialogForm.productStatus" placeholder="请选择" style="width:100%;">
                        <el-option value="1" label="研发"></el-option>
                        <el-option value="2" label="试用"></el-option>
                        <el-option value="3" label="上线"></el-option>
                        <el-option value="4" label="下线"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style=" word-wrap:break-word; word-break:normal; ">
                    <el-button @click="shangchuanPE"  :disabled="disabledEdit">
                        <input type="file" class="shangchuanPx" style="display:none" ref="Pfile" @change="Pfile" accept="image/*" >选择图片
                    </el-button>
                    <span>{{productPhotosName}}</span>
                </el-form-item>
                <el-form-item style=" word-wrap:break-word; word-break:normal; ">
                    <el-button @click="shangchuanFE" :disabled="disabledEdit">
                        <input type="file" class="shangchuanFx" style="display:none" ref="Ffile" @change="Ffile">选择文件
                    </el-button>
                    <span>{{productFilesName}}</span>
                </el-form-item>
                <el-form-item style="text-align:right;">
                    <el-button @click="Closes">取消</el-button>
                    <el-button type="primary" @click="SaveOk('roleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {api} from '../js/api/api.js'
    import $ from 'jquery'

    export default ({
        data () {
            return {
                sid:{
                    sid:""
                },
                types:[],
                productGroups:[],
                dialogs:false,
                dialogss:false,
                dialogForm:{},
                currentPage:1,
                total:6,
                pageSize:10,
                chanpinXQ:false,
                chanpinXQmain:{},
                input2:"",
                tableData:[],
                photos:"",
                files:"",
                productPhotos:[],
                productFiles:[],
                dlo:"",
                productPhotosName:"",
                productFilesName:"",
                disabledEdit:false,
                rules:{
                    productName:[
                        { required: true, message: '请输入产品名称', trigger: 'blur' }
                    ],
                    productCategory:[
                        { required: true, message: '请选择类别', trigger: 'change' }
                    ],
                    productGroup:[
                        { required: true, message: '请选择型号', trigger: 'change' }
                    ],
                    productStatus:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            }
        },
        mounted () {
            this.getProductList();
            this.getSelect();
        },
        methods:{
            selected2 (selection) {
                // console.log(selection)
            },
            shangchuanPE () {
                this.$refs.Pfile.click()
            },
            shangchuanFE () {
                this.$refs.Ffile.click()
            },
            Pfile () {
                this.productPhotosName=$(".shangchuanPx").prop('files')[0].name
            },
            Ffile () {
                this.productFilesName=$(".shangchuanFx").prop('files')[0].name
            },
            getProductList () {
                let param={
                    rows:this.pageSize,
                    page:this.currentPage,
                    "sort":"sid",
                	"order":"desc"
                }
                this.$http.post(api.productList,param).then((response)=>{
                    //  console.log(response)
                    this.total=response.body.total;
                    this.tableData=response.body.rows;
                    // this.tableData.productFiles
                    // this.dlo=((api.downloadT+"&attachPath="+row.productFiles[0].attachPath+""));
                    for(var i=0;i<this.tableData.length;i++){
                        if(this.tableData[i].productStatus==1){
                            this.tableData[i].productStatus="研发"
                        }else if(this.tableData[i].productStatus==2){
                            this.tableData[i].productStatus="试用"
                        }else if(this.tableData[i].productStatus==3){
                            this.tableData[i].productStatus="上线"
                        }else if(this.tableData[i].productStatus==4){
                            this.tableData[i].productStatus="下线"
                        }
                    }
                    for( var indexs in this.tableData){
                        this.tableData[indexs].key=(this.currentPage-1)*10+(indexs*1+1)
                    }

                })
            },
            getSelect () {
                this.$http.post(api.getChildCategoryListByParentNo+"&categoryNo=PRODUCT_TYPE").then((response)=>{
                    // console.log(response.body)
                    this.types=response.body.rtData
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
                    // console.log(this.dialogForm.productCategory)
                    // console.log(this.productCategoryMR)
                    if(this.productCategoryMR!=this.dialogForm.productCategory){
                        this.dialogForm.productGroup=null;
                    }
                }


            },
            sousuo () {
                let param={
                    rows:this.pageSize,
                    page:this.currentPage,
                    "sort":"sid",
                	"order":"desc",
                    queryStr:this.input2
                }

                this.$http.post(api.productList,param).then((response)=>{
                    // console.log(response)
                    this.total=response.body.total;
                    this.tableData=response.body.rows;
                    for(var i=0;i<this.tableData.length;i++){
                        if(this.tableData[i].productStatus==1){
                            this.tableData[i].productStatus="研发"
                        }else if(this.tableData[i].productStatus==2){
                            this.tableData[i].productStatus="试用"
                        }else if(this.tableData[i].productStatus==3){
                            this.tableData[i].productStatus="上线"
                        }else if(this.tableData[i].productStatus==4){
                            this.tableData[i].productStatus="下线"
                        }
                    }
                    for( var indexs in this.tableData){
                        this.tableData[indexs].key=(this.currentPage-1)*10+(indexs*1+1)
                    }

                })
            },
            info (row){
                this.$router.push({
                    name:"productDetails",
                    params:{
                        id:row.sid
                    }
                })
            },
            handleEdit (row) {
                // console.log(row);
                this.dialogs=!this.dialogs;
                this.sid.sid=row.sid;
                this.$http.post(api.productInfo,{sid:row.sid}).then((response)=>{
                    // console.log(response.body.rtData)
                    if(response.body.rtData.order){
                        this.disabledEdit=response.body.rtData.order
                    }
                    if(response.body.rtData.product.productStatus==1){
                        response.body.rtData.product.productStatus="研发"
                    }else if(response.body.rtData.product.productStatus==2){
                        response.body.rtData.product.productStatus="试用"
                    }else if(response.body.rtData.product.productStatus==3){
                        response.body.rtData.product.productStatus="上线"
                    }else if(response.body.rtData.product.productStatus==4){
                        response.body.rtData.product.productStatus="下线"
                    }
                    // console.log(response.body.rtData.productPhotos)
                    if(!response.body.rtData.productPhotos.length){
                        this.productPhotosName=""
                    }else{
                        this.productPhotosName=response.body.rtData.productPhotos[0].attachName;
                    }
                    if(!response.body.rtData.productFiles.length){
                        this.productFilesName=""
                    }else{
                        this.productFilesName=response.body.rtData.productFiles[0].attachName
                    }
                    //  console.log(response.body.rtData)

                    this.dialogForm=response.body.rtData.product
                    this.productCategoryMR=response.body.rtData.product.productCategory
                })
            },
            SaveOk (roleForm) {
                this.$confirm("确认修改信息？",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let formData=new FormData();
                    formData.append("productName",this.dialogForm.productName);
                    formData.append("productCategory",this.dialogForm.productCategory);
                    formData.append("productGroup",this.dialogForm.productGroup);
                    formData.append("productVersion",this.dialogForm.productVersion);


                    formData.append("gateway",this.dialogForm.gateway);
                    formData.append("onlineDate",this.dialogForm.onlineDate);


                    formData.append("productDescription",this.dialogForm.productDescription);
                    formData.append("remark",this.dialogForm.remark);

                    formData.append("sid",this.dialogForm.sid);
                    // console.log(this.dialogForm.productStatus)
                    if(this.dialogForm.productStatus=="研发"){
                        formData.append("productStatus",1);
                    }else if(this.dialogForm.productStatus=="试用"){
                        formData.append("productStatus",2);
                    }else if(this.dialogForm.productStatus=="上线"){
                        formData.append("productStatus",3);
                    }else if(this.dialogForm.productStatus=="下线"){
                        formData.append("productStatus",4);
                    }else{
                        formData.append("productStatus",this.dialogForm.productStatus);
                    }

                    // console.log(this.dialogForm.productStatus)
                    // formData.append("productStatus",statu);
                    // console.log($(".shangchuanPx").val())

                    let shangchuanFx="",
                    shangchuanPx="";
                    if(!$(".shangchuanPx").val()){
                        $(".shangchuanPx").prop("files")[0]=null
                    }
                    if(!$(".shangchuanFx").val()){
                        $(".shangchuanFx").prop("files")[0]=null
                    }else{
                        let fileType=$(".shangchuanFx").prop('files')[0].name.split(".");
                        if(fileType[fileType.length-1] != "pdf" && fileType[fileType.length-1] != "docx" && fileType[fileType.length-1] != "doc"){
                            this.$alert("只能选取.pdf,.docx,.doc格式的文件");
                            return;
                        }
                    }
                    formData.append("productPhotos",$(".shangchuanPx").prop("files")[0]);
                    formData.append("productFiles",$(".shangchuanFx").prop("files")[0]);

                    this.$refs[roleForm].validate((valid)=>{
                        if(valid){
                            this.$http.post(api.updatePub,formData).then((response)=>{
                                // console.log(response)
                                this.dialogs=!this.dialogs;
                                if(response.body.rtState)
                                this.$message({
                                    message:response.body.rtMsg,
                                    type:"success"
                                });
                                this.getProductList();

                            })
                        }
                    })
                })

            },
            err () {},
            succ (res) {
                // console.log(res);
                this.$message({
                    message:"修改图片成功",
                    type:"success"
                });
            },
            succs () {
                this.$message({
                    message:"修改文件成功",
                    type:"success"
                });
                this.dialogss=!this.dialogss;

                this.getProductList();
            },
            close () {

                this.getProductList();
            },
            Closes () {
                this.dialogs=!this.dialogs;
            },
            del (row) {
                this.$confirm("确认删除该记录？",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{

                    this.$http.post(api.delProduct,{"sid":row.sid}).then((response)=>{
                        // console.log(response)
                        if(response.body.rtState){
                            this.$message({
                                message:response.body.rtMsg,
                                type:"success"
                            })
                            this.getProductList();
                        }else{
                            this.$message({
                                message:response.body.rtMsg,
                                type:"success"
                            })
                            this.getProductList();
                        }

                    })
                })
            },
            fanhui () {
                this.chanpinXQ=!this.chanpinXQ
            },
            currentChange (val) {
                this.currentPage=val;

                this.getProductList();
            }
        }
    })
</script>
<style>
    .ycptf{
        display: -webkit-box;
    }
    .ycptf>div{
        margin-right: 20px;
        text-align: center;
        width: 0%;
        -webkit-box-flex:1;
    }
</style>
 
