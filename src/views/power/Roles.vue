<template>
  <div>
    <!-- 面包屑导航 -->
    <breadCrumb :breadCrumbData="breadcrumd"></breadCrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="tableDataList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="slotProps">
            <el-row
              :class="['vcenter','bdbottom',index1 === 0 ? 'bdtop':'']"
              v-for="(item1,index1) in slotProps.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(slotProps.row, item1.id)"
                  closable
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <!--  二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '':'bdtop', 'vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightById(slotProps.row, item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(slotProps.row, item3.id)"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> {{slotProps.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="warning" icon="el-icon-delete">删除</el-button>
            <el-button
              @click="showSetRightDialog(slotProps.row)"
              size="mini"
              type="danger"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog @close='setRightDialogClosed' title="分配权限" :visible.sync="setRightdialogVisible" width="50%">
      <!-- 权限树形结构 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        show-checkbox
        :data="rightsList"
        node-key="id"
        :props="treeProps"
        ref='treeRef'
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from "../../components/Breadcrumb";
export default {
  data() {
    return {
      // 面包屑导航数据
      breadcrumd: ["权限管理", "角色列表"],
      //    角色列表数据
      tableDataList: [],
      //   控制分配权限对话框
      setRightdialogVisible: false,
      // 权限树形数据
      rightsList: [],
      //   树形控件属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //  默认被选中的权限
      defKeys: [],
    //   即将分配权限的ID
    roleId:''
    };
  },
  components: {
    breadCrumb,
  },
  created() {
    this.getTabDataList();
  },
  methods: {
    //   表格数据
    async getTabDataList() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.tableDataList = res.data;
    },
    // 点击移除角色权限
    async removeRightById(rol, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果确认删除则会返回字符串confirm
      // 如果用户取消了删除会返回字符串cancel
      if (confirmResult != "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res } = await this.$axios.delete(
        `roles/${rol.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.status);
      }
      this.$message.success(res.meta.msg);
      rol.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$axios.get("rights/tree")
      if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data;
    //   调用函数，获取权限
      this.getLeafKeys(role, this.defKeys)
      this.setRightdialogVisible = true
    },
    // 获取所有角色三级权限id，保存到defKeys
    getLeafKeys(node, arr){
        if(!node.children){
           return arr.push(node.id)
        }
        node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
        })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
        this.defKeys = []
    },
    // 点击对角色分配权限
    async allotRights(){
        const keys =[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data: res} = await this.$axios.post(`roles/${this.roleId}/rights`,{
            rids: idStr
        })
        if(res.meta.status != 200){
            return this.$message.error(res.mata.msg)
        }
        this.$message.success(res.meta.msg)
        this.getTabDataList()
        this.setRightdialogVisible = false
    }
  },
};
</script>

<style lang="less" scoped>
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>