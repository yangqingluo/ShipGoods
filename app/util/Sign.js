/**
 * Created by gyg on 2017/4/24.
 */
'use strict'
import React,{Component} from 'react';
import {
    NativeModules,
} from 'react-native';
var EncryptionModule=NativeModules.EncryptionModule
export default class Sign extends Component{
    
    static async createSign(map,timestamp){
        if(map==null) map=new Map();
        map.set('uid','867909021770429');
        var user = global.userData;
        map.set('token',user.token == null ? '' : user.token);
        map.set('timestamp',timestamp);
        var keys=Array.from(map.keys()).sort();
        var sb='';
        for(let key of keys){
            sb+=key+"="+map.get(key)+"&"
        }
        sb = sb.substring(0,sb.length-1);
        var sign = sb;
        // var sign = await EncryptionModule.MD5ByPromise(sb);//md5加密
        return sign;
    }

}
