import vue from "vue"
import i18n from 'vue-i18n'

import iviewZhCnLocale from 'iview/src/locale/lang/zh-CN'
import iviewEnUsLocale from 'iview/src/locale/lang/en-US'
import iviewZhTwLocale from 'iview/src/locale/lang/zh-TW'

import enUSLocale from './lang/en-US'
import zhCNLocale from './lang/zh-CN'
import zhTWLocale from './lang/zh-TW'
import jaLocale from './lang/ja'
import koLocale from "./lang/ko"

vue.use(i18n)

const defaultLang = navigator.language
// console.log(defaultLang)
//zh中文
//zh-CN中文简体
//zh-TW中文繁体
//zh-HK中文香港
//en英语
//en-US英语（美国）
export default new i18n({
    locale: defaultLang,
    fallbackLocale: "zh-CN",
    messages: {
        "zh-CN": Object.assign(zhCNLocale, iviewZhCnLocale),
        "zh-TW": Object.assign(zhTWLocale, iviewZhTwLocale),
        "en": Object.assign(enUSLocale, iviewEnUsLocale),
        "en-US": Object.assign(enUSLocale, iviewEnUsLocale),
        "ja": jaLocale,
        "ko": koLocale
    }
})