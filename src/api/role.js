import request from '@/utils/request'

export default{
  getRoleList(searchModel){
    return request({
      url: '/role/list',
      method: 'get',
      params:{
        pageNum: searchModel.pageNum,
        pageSize: searchModel.pageSize,
        roleName: searchModel.roleName
      }
    });
  },
  addRole(role){
    return request({
      url: '/role/add',
      method: 'post',
      data: role
    });
  },
  updateRole(role){
    return request({
      url: '/role',
      method: 'put',
      data: role
    });
  },
  saveOrEditRole(role){
    if(role.roleId == null && role.roleId == undefined){
      return this.addRole(role);
    }
    return this.updateRole(role);
  },
  getRoleById(id){
    return request({
      url: `/role/${id}`,
      method: 'get'
    });
  },
  deleteRoleById(id){
    return request({
      url: `/role/${id}`,
      method: 'delete'
    });
  },
  getAllRoleList(){
    return request({
      url: '/role/all',
      method: 'get'
    });
  },
}