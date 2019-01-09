export const confirmPasswordValidator = (rule, value, callback,source) => {
    if (value) {
        //无法优雅的解决穿值进来进行比对
        // console.log(rule)
        // console.log(callback)
        // console.log(source)
        // console.log(options)
        // console.log(this)
        // console.log(rule.target.$data.userForm.)
        // if (rule.target != value)
            // callback(new Error(rule.message))
    }
    callback();
}