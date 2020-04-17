import axios from "axios";
import { Message } from 'iview'
import router from '@/router.js'
import sotre from '@/store/index.js'
import locale from "@/locale/index"

axios.defaults.baseURL = ''
axios.defaults.withCredentials = true
axios.interceptors.response.use(
    response => {
        // if (response.status === 200 && response.data.message) {
        //     return new Promise((resolve, reject) => {
        //         Message.error(response.data.message)
        //         reject()
        //     }).catch(() => { })
        //     return Promise.reject(response.data.message).then(() => {
        //         // 未被调用
        //     }, (message) => {
        //         // console.log(reason); // "Testing static reject"
        //         Message.error(message)
        //     });
        // }

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
                case 415:
                    Message.error("不支持的Content-Type")
                    break;
                case 500:
                    Message.error('Opps,服务器出了点小差')
                    break;
                case 400:
                    Message.error(error.response.data.message)
                    break;
                case 401:
                    Message.error({
                        content: locale.t('user.token_expired'), onClose: function () {
                            // window.location.href = '/login'
                            sotre.commit('user/clear')
                            router.push({ name: "login" })
                        }
                    })
                    break;
            }
            // return new Promise(() => { })
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
        // return new Promise(() => { });
        return Promise.reject(error);
    }
)
function has(browser) {
    const ua = navigator.userAgent;
    if (browser === 'ie') {
        const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
        if (isIE) {
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(ua);
            return parseFloat(RegExp['$1']);
        } else {
            return false;
        }
    } else {
        return ua.indexOf(browser) > -1;
    }
}

function _isIE11() {
    let iev = 0;
    const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
        iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
        iev = 10;
    }
    if (trident && rv !== -1) {
        iev = 11;
    }

    return iev === 11;
}

function _isEdge() {
    return /Edge/.test(navigator.userAgent);
}

function _getDownloadUrl(data) {
    if (window.Blob && window.URL && window.URL.createObjectURL) {
        return URL.createObjectURL(new Blob([data]));
    } else {
        return 'data:attachment,' + encodeURIComponent(data);
    }
}
class HttpBuilder {
    static filterEmptyStringUrlParams(params) {
        if (!params)
            return {}
        else {
            const newParams = {}
            for (var k in params) {
                let v = params[k]
                if (typeof v == 'string' && v === "") {
                    continue
                } else {
                    newParams[k] = v
                }
            }
            return newParams
        }
    }
    static header(headers) {
        // this.options.headers = headers
        return new Http({ headers: headers })
    }
    static form(params) {
        if (params) {
            var p = new URLSearchParams();
            for (const key in params) {
                p.append(key, params[key]);
            }
            // this.options.form = p
            return new Http({ form: p })
        }
        return new Http({})
    }
    static param(params) {
        let p = HttpBuilder.filterEmptyStringUrlParams(params)
        // this.options.urlParams = p
        return new Http({ urlParams: p })
    }
    static body(params) {
        // this.options.body = params
        return new Http({ body: params })
    }
    static get(url) {
        return new Http({ url: url, method: 'get' }).send()
    }
    static delete(url) {
        return new Http({ url: url, method: 'delete' }).send()
    }
    static post(url) {
        return new Http({ url: url, method: 'post' }).send()
    }
    static put(url) {
        return new Http({ url: url, method: 'put' }).send()
    }
}
class Http {
    constructor(options) {
        this.options = options
        this.options.responseType = 'json'
    }
    form(params) {
        if (params) {
            var p = new URLSearchParams();
            for (const key in params) {
                p.append(key, params[key]);
            }
            this.options.form = p
        }
        return this
    }
    body(params) {
        this.options.body = params
        return this
    }
    put(url) {
        this.options.url = url
        this.options.method = 'put'
        return this.send()
    }
    get(url) {
        this.options.url = url
        this.options.method = 'get'
        return this.send()
    }
    post(url) {
        this.options.url = url
        this.options.method = 'post'
        return this.send()
    }
    delete(url) {
        this.options.url = url
        this.options.method = 'delete'
        return this.send()
    }
    download(url, filename, httpMethod = 'post') {
        if (httpMethod === 'get' || httpMethod === 'delete')
            return
        this.options.method = httpMethod
        this.options.url = url
        this.options.responseType = 'blob'
        this.send().then((resp) => {
            if (has('ie') && has('ie') < 10) {
                const oWin = window.top.open('about:blank', '_blank');
                oWin.document.charset = 'utf-8';
                oWin.document.write(resp.data);
                oWin.document.close();
                oWin.document.execCommand('SaveAs', filename);
                oWin.close();
            } else if (has('ie') === 10 || _isIE11() || _isEdge()) {
                const csvData = new Blob([resp.data]);
                navigator.msSaveBlob(csvData, filename);
            } else {
                const link = document.createElement('a');
                link.download = filename;
                link.href = _getDownloadUrl(resp.data);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }).catch(() => { })
    }
    send() {
        // $ajax.get('').success(()=>{}).failed(()=>{}).finally(()=>{})
        //1.如果成功，success内的回调会被调用，finally内的回调也会被调用
        //2.如果失败，failed内的回调会被调用，finally内的回调也会被调用
        return new Promise((resolve, reject) => {
            axios({
                method: this.options.method,
                url: this.options.url,
                params: this.options.urlParams,
                responseType: this.options.responseType,
                data: this.options.form ? this.options.form : this.options.body
            }).then((resp) => {
                if ((resp.status === 200 && !resp.data.message) || resp.status === 204)
                    resolve(resp)
                else {
                    if (resp.data.message)
                        Message.error(resp.data.message)
                    reject()
                }
            }).catch(() => {
                reject()
            })
        })
    }
}
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
    postForm(url, data, isBlod, resourceName = '') {
        var params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }
        let optoins;
        if (isBlod)
            optoins = { responseType: "blob" }
        else optoins = {}
        return new Promise((resolve, reject) => {
            axios.post(url, params, optoins).then(response => {
                if (isBlod) {
                    resolve(response)
                }
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
    post(url, params, isBlod, resourceName = '') {
        let optoins;
        if (isBlod)
            optoins = { responseType: "blob" }
        else optoins = {}
        return new Promise((resolve, reject) => {
            axios.post(url, params, optoins).then(response => {
                if (isBlod)
                    resolve(response)
                if (response.status === 204) {
                    Message.success(`创建${resourceName}成功`)
                    resolve(response)
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
            }).catch(() => {
                reject()
            })
        })
    }
}

export default {
    install(Vue) {
        Vue.prototype.$http = new HttpRequest()
        Vue.prototype.$ajax = HttpBuilder
    }
}