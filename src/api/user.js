import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export default{
  getUserList(searchModel){
    return request({
      url: '/user/list',
      method: 'get',
      params:{
        pageNum: searchModel.pageNum,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    });
  },
  addUser(user){
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    });
  },
  updateUser(user){
    return request({
      url: '/user',
      method: 'put',
      data: user
    });
  },
  saveOrEditUser(user){
    if(user.id == null && user.id == undefined){
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  deleteUserById(id){
    return request({
      url: `/user/${id}`,
      method: 'delete'
    });
  },
  getUserById(id){
    return request({
      //url: '/user/' + id,
      url: `/user/${id}`,
      method: 'get'
    });
  }
}
