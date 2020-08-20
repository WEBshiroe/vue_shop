<template>
  <div>
    <!-- 面包屑导航 -->
    <breadCrumb :breadCrumbData="breadcrumd"></breadCrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 表格 -->
      <el-table :data="tableDataList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
            <template v-slot:default='slotProps'>
                <el-tag v-if="slotProps.row.level=='0'">一级</el-tag>
                <el-tag type="success" v-else-if="slotProps.row.level=='1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "../../components/Breadcrumb";
export default {
  name: "Rights",
  data() {
    return {
      // 面包屑导航数据
      breadcrumd: ["权限管理", "权限列表"],
    //  表格数据
    tableDataList:[]
    };
  },
  components: {
    breadCrumb,
  },
  created(){
      this.getTabDataList()
  },
  methods:{
    async getTabDataList(){
        const {data: res} = await this.$axios.get('rights/list')
        console.log(res)
        if(res.meta.status != 200){
            return this.$message.error(res.meta.msg)
        }
        this.tableDataList = res.data
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
</style>