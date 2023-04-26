<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.cusName"
            placeholder="客户名称"
            clearable
          ></el-input>
          <el-button
            @click="getCustomerList"
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
      <el-table :data="customerList" stripe style="width: 100%">
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNum - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="cusNum" label="客户编码" width="160">
        </el-table-column>
        <el-table-column prop="cusName" label="客户名称" width="160">
        </el-table-column>
        <el-table-column prop="cusPhone" label="客户联系电话" width="160">
        </el-table-column>
        <el-table-column prop="cusAdress" label="客户联系地址" >
        </el-table-column>
        <!-- 
        <el-table-column prop="createTime" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="160">
        </el-table-column> 
        -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="openSaveOrEditUI(scope.row.cusId)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
            ></el-button>
            <el-button
              @click="deleteCustomer(scope.row)"
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

    <!-- 客户信息编辑对话框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="customerForm" ref="customerFormRef" :rules="rules">
        <el-form-item
          label="客户编码"
          prop="cusNum"
          :label-width="formLabelWidth"
        >
          <el-input v-model="customerForm.cusNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="客户名称"
          prop="cusName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="customerForm.cusName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="客户联系电话"
          prop="cusPhone"
          :label-width="formLabelWidth"
        >
          <el-input v-model="customerForm.cusPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="客户联系地址"
          prop="cusPhone"
          :label-width="formLabelWidth"
        >
          <el-input v-model="customerForm.cusAdress" autocomplete="off"></el-input>
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
import customerApi from '@/api/customer';

export default {
  data() {
    return {
      formLabelWidth: "130px",
      customerForm: {},
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNum: 1,
        pageSize: 10,
      },
      customerList: [],
      rules: {
        cusName: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
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
    deleteCustomer(customer) {
      this.$confirm(`您确认删除客户 ${customer.cusName} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          customerApi.deleteCustomerById(customer.cusId).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getCustomerList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //新增或修改
    saveOrEdit() {
      // 触发表单验证
      this.$refs.customerFormRef.validate((valid) => {
        if (valid) {
          // 提交请求给后台
          customerApi.saveOrEditCustomer(this.customerForm).then((response) => {
            // 成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格
            this.getCustomerList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //清理弹出框表单
    clearForm() {
      this.customerForm = {};
      this.$refs.customerFormRef.clearValidate();
    },
    //打开弹出框
    openSaveOrEditUI(id) {
      if (id == null) {
        this.title = "新增客户";
      } else {
        this.title = "修改客户";
        // 根据id查询客户数据
        customerApi.getCustomerById(id).then((response) => {
          this.customerForm = response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getCustomerList();
    },
    handleCurrentChange(pageNum) {
      this.searchModel.pageNum = pageNum;
      this.getCustomerList();
    },
    getCustomerList() {
      customerApi.getCustomerList(this.searchModel).then((response) => {
        this.customerList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getCustomerList();
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