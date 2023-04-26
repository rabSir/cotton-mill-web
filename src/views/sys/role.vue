<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.roleName"
            placeholder="角色名称"
            clearable
          ></el-input>
          <el-button
            @click="getRoleList"
            type="primary"
            round
            icon="el-icon-search"
            >查询</el-button
          >
        </el-col>
        <el-col :span="4" align="right">
          <el-button
            @click="openSaveOrEditUI(null)"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNum - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="roleId" label="角色ID" width="200">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="260">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="openSaveOrEditUI(scope.row.roleId)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
            ></el-button>
            <el-button
              @click="deleteRole(scope.row)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 角色信息编辑对话框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item
          label="角色名称"
          prop="roleName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="权限设置"
          prop="menuIdList"
          :label-width="formLabelWidth"
        >
          <el-tree :data="menuList" :props="menuProps" show-checkbox
           default-expand-all
           node-key="menuId"
           ref="menuRef"
           style="width:85%"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/role";
import menuApi from "@/api/menu";
export default {
  data() {
    return {
      menuList: [],
      menuProps: {
        children: "children",
        label: "title",
      },
      formLabelWidth: "130px",
      roleForm: {},
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNum: 1,
        pageSize: 10,
      },
      roleList: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ]
      },
    };
  },
  methods: {
    getAllMenu() {
      menuApi.getAllMenu().then((response) => {
        this.menuList = response.data;
      });
    },
    deleteRole(role) {
      this.$confirm(`您确认删除角色 ${role.roleName} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roleApi.deleteRoleById(role.roleId).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveOrEdit() {
      // 触发表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          //获取复选框选择id
          let checkedKeys = this.$refs.menuRef.getCheckedKeys();
          let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys	();
          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys);
          // 提交请求给后台
          roleApi.saveOrEditRole(this.roleForm).then((response) => {
            // 成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格
            this.getRoleList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
      this.roleForm = {};
      this.$refs.roleFormRef.clearValidate();
      //清楚复选框选择
      this.$refs.menuRef.setCheckedKeys([]);
    },
    openSaveOrEditUI(id) {
      if (id == null) {
        this.title = "新增角色";
      } else {
        this.title = "修改角色";
        // 根据id查询角色数据
        roleApi.getRoleById(id).then((response) => {
          this.roleForm = response.data;
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList);
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNum) {
      this.searchModel.pageNum = pageNum;
      this.getRoleList();
    },
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then((response) => {
        this.roleList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getRoleList();
    this.getAllMenu();
  },
};
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-input {
  width: 85%;
}
</style>