<template lang="html">
    <section  style="overflow-y:auto;height:100%;">
        <div class="L-center-div">
            <!-- 表格 -->
            <div class="L-header-div">
                <el-col :span="24" class="toolbar">
                    <el-form :inline="true">
                        <el-form-item style="width:84px;">
                            <el-button type="primary" class="L-button-content L-bindmessage-button" @click.native="saveGateway">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </div>

            <!-- tabel表单 -->
            <div class="L-content-div">
                <el-table  :data="tableData"  border style="width: 100%" >
                    <el-table-column  prop="key" label="序号" width="80">
                    </el-table-column>
                    <el-table-column  prop="gatewayName" label="网关名称" style="width:10%;">
                    </el-table-column>
                    <el-table-column prop="ip" label="IP地址" style="width:10%;">
                    </el-table-column>
                    <el-table-column prop="port" label="端口号" style="width:10%;">
                    </el-table-column>
                    <el-table-column prop="version" label="版本号" style="width:10%;">
                    </el-table-column>
                    <el-table-column prop="address" label="操作">
                        <template scope="scope">
                            <el-button class="L-button" size="small" @click="viewGateway(scope.row.gatewayName,scope.row.sid)"><img src="../imgs/view.png"></el-button>
        					<el-button class="L-button" size="small" @click="updateGateway(scope.$index, scope.row)"><img src="../imgs/edit1.png"></el-button>
        			        <el-button class="L-button" size="small" @click="delGateway(scope.$index, scope.row)"><img src="../imgs/del.png"></el-button>
        				</template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <el-pagination class="L-pagination" layout="total, prev, pager, next" @current-change="currentChange"
            :current-page="this.page.currentPage" :total="this.page.total" :page-size="this.page.rows">
    		</el-pagination>
        </div>

        <!-- 新增网关 -->
        <el-dialog title="新增网关" v-model="newGatewayFormVisible" :close-on-click-modal="false" align="center" class="L-header">
            <el-form :model="newGatewayForm" label-width="80px" ref="newGatewayForm" :rules="gatewayRules" class="L-header-form">
                <el-form-item label="网关名称" prop="gatewayName">
                    <el-input v-model="newGatewayForm.gatewayName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                    <el-input v-model="newGatewayForm.ip" :span="24"></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input v-model="newGatewayForm.port" :span="24"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="newGatewayForm.version" :span="24"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="L-edit-button L-save-password-button" type="primary" @click.native="newGatewaySubmit" :loading="editLoading">保存</el-button>
            </div>
        </el-dialog>

        <!-- 编辑页面 -->
        <el-dialog title="网关编辑" v-model="updateGatewayFormVisible" :close-on-click-modal="false" align="center" class="L-header">
            <el-form :model="updateGatewayForm" label-width="80px" ref="updateGatewayForm" :rules="gatewayRules" class="L-header-form">
                <el-form-item label="网关名称" prop="gatewayName">
                    <el-input v-model="updateGatewayForm.gatewayName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                    <el-input v-model="updateGatewayForm.ip" :span="24"></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input v-model="updateGatewayForm.port" :span="24"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="updateGatewayForm.version" :span="24"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="L-edit-button" @click.native="updateGatewayFormVisible = false">取消</el-button>
                <el-button class="L-edit-button" type="primary" @click.native="updateGatewaySubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import { api } from '../js/api/api';
export default {
    data(){
        let port = (rule, value, callback) => {
            if(value == null){
                callback(new Error('请输入端口号'));
            }else if(!/^\d+(\.\d+)?$/.test(value)) {
                callback(new Error('端口号是数字'));
            }else{
                 callback();
            }
        }
        return{
            addLoading:false,
            newGatewayFormVisible:false,
            updateGatewayFormVisible :false,
            editLoading:false,
            newGatewayForm:{
                gatewayName:'',
                ip:'',
                port:'',
                version:'',
                sid:''
            },
            page:{
                currentChange:1,
                total:0,
                rows:15
            },
            updateGatewayForm:{
                gatewayName:'',
                ip:'',
                port:'',
                version:'',
                sid:''
            },
            gateway:false,
            tableData:[],
            gatewayRules:{
                gatewayName : [
                    { required : true , message: "请输入网关名称", trigger:"blur" }
                ],
                ip: [
                    { required : true , message: "请输入IP", trigger:"blur" }
                ],
                port:[
                    { required : true , message: "请输入端口号"},
                    { validator: port, trigger: 'blur' }
                ],
                version:[
                    { required : true , message: "请输入版本号", trigger:"blur" }
                ]
            }
        }
    },
    mounted(){
        this.getGatewayList()
    },
    methods:{
        getGatewayList: function(){
            let para = {
                rows: this.page.rows,
                page: this.page.currentChange,
                sort:  "sid",
                order: "desc"
            }
            this.$http.post( api.getGatewayList ,para).then((res) => {
                this.tableData = res.body.rows;
                this.page.total = res.body.total
                for(var key in this.tableData){
                    this.tableData[key].key = ((this.page.currentChange - 1) * 15) + (key * 1 + 1);
                }
            })
        },
        delGateway:function (index,row) {
            this.$confirm('确认删除该记录？', '提示', {
				type: 'warning'
			}).then(() => {
                this.$http.post( api.delGateway + "&sid="+ row.sid ).then((res) => {
                    this.$message({
						title: '成功',
						message: res.body.rtMsg
						// type: 'success'
					});
                    this.getGatewayList()
                })
            })
        },
        viewGateway:function(gatewayName,sid){
            this.$router.push({
                name:"viewGateway",
                params: {
                    gatewayName : gatewayName,
                    id : sid
                }
            })
        },
        updateGateway:function(index ,row){
            this.updateGatewayFormVisible = true
            this.updateGatewayForm = Object.assign({}, row);
        },
        updateGatewaySubmit : function(){
            this.$refs.updateGatewayForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交信息？', '提示', {})
					.then(() => {
                        let para = {
                            gatewayName:this.updateGatewayForm.gatewayName,
                            ip:this.updateGatewayForm.ip,
                            port:this.updateGatewayForm.port,
                            version:this.updateGatewayForm.version,
                            sid:this.updateGatewayForm.sid
                        }
						this.$http.post( api.updateGateway , para)
						.then((res) => {
                            console.log(res)
							this.$message({
								// type: 'su',
								message: res.body.rtMsg
							})
							this.$refs['updateGatewayForm'].resetFields();
							this.updateGatewayFormVisible = false;
							this.getGatewayList();
						})
					})
				}
			});
        },
        saveGateway:function(){
            this.newGatewayFormVisible = true;
            this.newGatewayForm = {
                gatewayName:'',
                ip:'',
                port:'',
                sid:'',
                version:''
            }
        },
        //新增网关
        newGatewaySubmit:function(){
            this.$refs.newGatewayForm.validate((valid) => {
                if(valid){
                    this.$confirm('确认提交信息？', '提示', {})
                    .then(() => {
                        let para = Object.assign({},this.newGatewayForm);
                        this.$http.post(api.saveGateway,para).then((res) => {
                            this.$message({
            					type: 'success',
            					message: res.body.rtMsg
          					})
                            this.$refs['newGatewayForm'].resetFields();
							this.newGatewayFormVisible = false;
							this.getGatewayList();
                        })
                    })
                }
            })
        },
        currentChange:function(val){
            this.page.currentChange = val;
            this.getGatewayList();
        }
    }
}
</script>

<style lang="css">
    .L-center-div{
        width: 95%;
        margin:0 auto;
    }
    .L-right-button{
        width: 12%;
        margin: 0.8rem 0 !important;
        float:right;
    }
    .L-header-div{
        height: 5rem;
    }
    .L-header-div .el-form{
        text-align: right;
    }
    .L-center-div .el-form-item{
        margin-bottom: 20px !important;
    }
</style>
