import request from '@/utils/request'

export default {
  //根据客户名称分页获取用户信息
  getCustomerList(searchModel){
    return({
      url: '/customer/list',
      method: 'get',
      data: {
        pageNum: searchModel.pageNum,
        pageSize: searchModel.pageSize,
        cusName: searchModel.cusName
      }
    });
  },
  //添加客户
  addUser(customer){
    return request({
      url: '/customer',
      method: 'post',
      data: customer
    });
  },
  //修改客户
  updateUser(customer){
    return request({
      url: '/customer',
      method: 'put',
      data: customer
    });
  },
  //保存或修改客户
  saveOrEditCustomer(customer){
    if(customer.id == null && customer.id == undefined){
      return this.addUser(customer);
    }
    return this.updateUser(customer);
  },
  //根据id删除客户
  deleteUserById(id){
    return request({
      url: `/customer/${id}`,
      method: 'delete'
    });
  },
  //根据id获取客户信息
  getUserById(id){
    return request({
      //url: '/user/' + id,
      url: `/customer/${id}`,
      method: 'get'
    });
  }
}