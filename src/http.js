import axios from "axios";
import { Message } from 'iview'
import router from '@/route.js'

axios.defaults.baseURL = ''
axios.defaults.withCredentials = true
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            //401,未登陆，session在服务端过期，页面跳转到登录页面
            //403，没有权限，弹框提示，中断操作。
            //404.资源没有，弹框提示
            //
            const status = error.response.status
            switch (status) {
                case 403:
                    Message.error('没有访问权限')
                    break;
                case 404:
                    Message.error("访问的资源不存在")
                    break;
                case 500:
                    Message.error('Opps,服务器出了点小差')
                    break;
                case 400:
                    Message.error(error.response.data.message)
                    break;
                case 401:
                    Message.error({
                        content: '用户登录凭证已失效，请重新登录', onClose: function () {
                            // window.location.href = '/login'
                            router.push({ name: "login" })
                        }
                    })
                    break;
            }
            // if (status === 401)
            // window.location.href = '/login'
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
        }
        // console.log(error.config);

        return Promise.reject(error);
    }
)

//axios config
//params 为url中的参数
//data 为request body中的参数，PUT、POST、PATCH
class HttpRequest {
    urlParamParse(params) {
        if (params) {
            const p = {}
            for (var k in params) {
                let v = params[k]
                if (typeof v == 'string' && v === "") {
                    continue
                } else {
                    p[k] = v
                }
            }
            return p
        }
        return {}
    }
    get(url, option) {
        if (option && option.params) {
            option.params = this.urlParamParse(option.params)
        }

        return axios.get(url, option)
    }
    fullPost(url, option) {
        return axios.post(url, option)
    }
    postForm(url, data, resourceName = '') {
        var params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }
        return new Promise((resolve, reject) => {
            axios.post(url, params).then(response => {
                if (response.status === 204) {
                    Message.success(`创建${resourceName}成功`)
                    resolve()
                }
                else {
                    Message.error(`创建${resourceName}失败，${response.data.message}`)
                    reject(response.data)
                }
            })
        })
    }
    post(url, params, resourceName = '') {
        // var success;
        return new Promise((resolve, reject) => {
            axios.post(url, params).then(response => {
                if (response.status === 204) {
                    Message.success(`创建${resourceName}成功`)
                    resolve()
                }
                else {
                    // if (response.data) {
                    // Message.error(`创建${resourceName}失败\n${response.data.message}`)
                    // }
                    // Message.error(`创建${resourceName}失败`)
                    Message.error(`编辑${resourceName}失败，${response.data.message}`)
                    reject(response.data)
                }
            }).catch(error => {
                reject(error)
            })
        })

        // return success;
    }
    delete(url, params, resourceName = '') {
        const option = { params: this.urlParamParse(params) }
        return new Promise((resolve, reject) => {
            axios.delete(url, option).then(response => {
                if (response.status == 204 || (response.status === 200 && !response.data)) {
                    Message.success(`删除${resourceName}成功`)
                    resolve()
                }
                else {
                    Message.error({ content: `删除${resourceName}失败，${response.data.message}`, duration: 3 })
                    reject()
                }
            })
        })
    }
    // deleteForm(url, data, resourceName = '') {
    //     var params = new URLSearchParams();
    //     for (const key in data) {
    //         params.append(key, data[key]);
    //     }
    //     return new Promise((resolve, reject) => {
    //         axios.delete(url, params).then(response => {
    //             if (response.status == 204 || (response.status === 200 && !response.data)) {
    //                 Message.success(`删除${resourceName}成功`)
    //                 resolve()
    //             }
    //             else {
    //                 Message.error({ content: `删除${resourceName}失败，${response.data.message}`, duration: 3 })
    //                 reject()
    //             }
    //         })
    //     })
    // }
    fullPut(url, option) {
        return axios.put(url, option)
    }
    put(url, resourceName = '') {
        axios.put(url).then(response => {
            if (response.status === 204)
                Message.success(`编辑${resourceName}成功`)
            else Message.error(`编辑${resourceName}失败`)
        })
    }
    putForm(url, data, resourceName = '') {
        var params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }
        return new Promise((resolve, reject) => {
            axios.put(url, params).then(response => {
                if (response.status === 204) {
                    Message.success(`编辑${resourceName}成功`)
                    resolve()
                }
                else {
                    Message.error(`编辑${resourceName}失败，${response.data.message}`)
                    reject(response.data)
                }
            })
        })
    }
    putBody(url, data, resourceName = '') {
        return new Promise((resolve, reject) => {
            axios.put(url, data, {
                header: { "content-type": "application/json" }
            }).then(response => {
                if (response.status === 204) {
                    Message.success(`编辑${resourceName}成功`)
                    resolve()
                }
                else {
                    Message.error(`编辑${resourceName}失败，${response.data.message}`)
                    reject(response.data)
                }
            }).catch(()=>{
                reject()
            })
        })
    }
}

export default {
    install(Vue) {
        Vue.prototype.$http = new HttpRequest()
    }
}