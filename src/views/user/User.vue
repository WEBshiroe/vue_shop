<template>
  <div>
    <!-- 面包屑导航 -->
    <breadCrumb :breadCrumbData="breadcrumd"></breadCrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加用户输入框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="userQueryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" v-slot:default="slotProps">
          <template>
            <el-switch @change="userStateChaneg(slotProps.row)" v-model="slotProps.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" v-slot:default="slotProps">
          <template>
            <!-- 修改用户按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditUserData(slotProps.row)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delUserData(slotProps.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userQueryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @closed="userDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="userRuleForm" :rules="userRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="userRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @closed="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="editForm"
        :rules="editRuleFormRules"
        ref="editRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from "../../components/Breadcrumb";
export default {
  data() {
    // 验证邮箱自定义规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号自定义规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 面包屑导航数据
      breadcrumd: ["用户管理", "用户列表"],
      // 用户列表数据参数对象初始化
      userQueryInfo: {
        query: "",
        // 单页页数
        pagenum: 1,
        // 当前页数中有几条数据
        pagesize: 2,
      },
      // 用户列表数据
      userList: [],
      //   数据总数
      total: 0,
      //  添加用户对话框状态
      dialogVisible: false,
      //   添加用户数据初始化
      userRuleForm: {
        username: "",
        password: 1234567,
        email: "",
        mobile: 13888888888,
      },
      //   添加表单的验证规则对象
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "用户名长度在 3 到 5 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 9,
            message: "密码长度在 6 到 9 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户对话框的显示和隐藏
      editDialogVisible: false,
      //修改用户的数据
      editForm: {},
      //  修改用户信息验证规则对象
      editRuleFormRules: {
          email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ]
      },
    };
  },
  components: {
    breadCrumb,
  },
  created() {
    this.getUserList();
  },
  methods: {
    //   获取用户列表数据
    async getUserList() {
      let { data: res } = await this.$axios.get("users", {
        params: this.userQueryInfo,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      // pagesize改变时，从新发起请求，得到数据
      this.userQueryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.userQueryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch
    async userStateChaneg(userInfo) {
      // 状态改变发起请求
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },
    // 对话框关闭时调用
    userDialogClosed() {
        //  重置表单
      this.$refs.ruleFormRef.resetFields();
    },
    // 添加表单预校验
    addUser() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请正确输入");
        const { data: res } = await this.$axios.post(
          "users",
          this.userRuleForm
        );
        // 添加失败
        if (res.meta.status != 201) {
          this.$message.error(res.meta.msg);
          this.$refs.ruleFormRef.resetFields();
          return;
        }
        // 添加成功
        this.$message.success(res.meta.msg);
        this.getUserList();
      });
      this.dialogVisible = false;
    },
    // 点击修改按钮时，显示对话框
    async showEditUserData(row) {
      console.log(row);
      const { data: res } = await this.$axios.put(
        `users/${row.id}/state/${row.my_state}`
      );    
      console.log(res.data);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听用户对话框的关闭事件
    editDialogClosed(){
        this.$refs.editRuleFormRef.resetFields()
    },
    // 点击确定按钮进行表单预验证
    editUserInfo(){
        this.$refs.editRuleFormRef.validate(async valid=>{
            console.log(valid)
            // 预验证失败
            if(!valid){
                return this.$message.error('请输入正确信息')
            }
            //  修改数据提交
            const {data: res} = await this.$axios.put('users/'+this.editForm.id,{email:this.editForm.email,
            mobile:this.editForm.mobile})
            // 修改失败
            if(res.meta.status != 200){
                return this.$message.error(res.meta.msg)
            }
            // 修改成功
            this.$message.success(res.meta.msg)
            // 对话框隐藏
            this.editDialogVisible=false
            // 从新渲染表格
            this.getUserList()
        })
        
    },
    // 删除用户
    async delUserData(id){
        
        const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => err);
        // 如果确认删除则会返回字符串confirm
        // 如果用户取消了删除会返回字符串cancel
        console.log(confirmResult)
        if(confirmResult != 'confirm'){
            return this.$message.info('已取消') 
        }
        const {data: res} = await this.$axios.delete('users/'+id,{})
        console.log(res)
        //  返回的status表示删除不成功
        if(res.meta.status != 200){
            return this.$message.error(res.meta.msg)
        }
        // 删除成功
        this.$message.success(res.meta.msg)
        this.getUserList()
    }
  },
};
</script>

<style lang="less" scoped>
</style>