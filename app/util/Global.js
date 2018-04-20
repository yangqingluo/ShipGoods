import React, {Component} from 'react';
import {
    AsyncStorage,
    Alert,
} from 'react-native';
import Storage from 'react-native-storage';
import {NavigationActions} from "react-navigation";


const KEY_USERDATA = 'ships_goods_user_data';
const UI_STANDARD = 375;
class Constant {
    static colorDefault = '#FFFFFF'; // 颜色
    static sizeMarginDefault = 10;  // 尺寸
    // 自适应屏幕（以iOS为模板）
    static scale(width) {
        return Dimensions.get('window').width / UI_STANDARD * width;
    }
}


const Log = (...params) => { // 全局Log
    if (GLOBAL.__DEV__) {
        console.log(params);
    }
}

const GlobalAlert = (params) => { // 全局Log
    Alert.alert(params);
}

const resetAction = (routeName) => NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: routeName})
    ]
});

var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // sync: require('./sync') // 这个sync文件是要你自己写的
})

// 最好在全局范围内创建一个（且只有一个）storage实例，方便直接调用

// 对于web
// window.storage = storage;

// 对于react native
// global.storage = storage;

// 这样，在此**之后**的任意位置即可以直接调用storage
// 注意：全局变量一定是先声明，后使用
// 如果你在某处调用storage报错未定义
// 请检查global.storage = storage语句是否确实已经执行过了

//导出为全局变量
global.storage = storage;


let userData;
//用户登录数据
global.userData = userData;
//刷新的时候重新获得用户数据
storage.load({
    key: 'userData',
}).then(ret => {
    global.userData = ret;
}).catch(err => {
    global.userData = null;
})

global.PublicLog = Log;
global.PublicAlert = GlobalAlert;
global.PublicResetAction = resetAction;