package com.xinfu.shipowner.version;

import com.xinfu.shipowner.MainActivity;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R.integer;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;


public class UpdateManager {
    public static String serverFilePath = "https://shiphire.com.cn/Download/app-release.apk";
    private static UpdateManager manager = null;
    private UpdateManager(){}
    public static UpdateManager getInstance(){
        manager = new UpdateManager();
        return manager;
    }

    //获取版本号
    public int getVersion(Context context){
        int version = 0;
        try {
            version = context.getPackageManager().getPackageInfo(
                    "com.xinfu.shipowner", 0).versionCode;
        } catch (Exception e) {
            System.out.println("获取版本号异常！");
        }
        return version;
    }

    //获取版本名
    public String getVersionName(Context context){
        String versionName = null;
        try {
            versionName = context.getPackageManager().getPackageInfo(
                    "com.xinfu.shipowner", 0).versionName;
        } catch (Exception e) {
            System.out.println("获取版本名异常！");
        }
        return versionName;
    }

    //获取服务器版本号
    public String getServerVersion() {
        String serverJson = null;
        byte[] buffer = new byte[1024 * 10];

        try {
            URL serverURL = new URL("http://shiphire.com.cn/index.php/Mobile/Version/update_version/");
            HttpURLConnection connect = (HttpURLConnection) serverURL.openConnection();
            BufferedInputStream bis = new BufferedInputStream(connect.getInputStream());
            int n = 0;
            while((n = bis.read(buffer))!= -1){
                serverJson = new String(buffer);
            }
        } catch (Exception e) {
            System.out.println("获取服务器版本号异常！"+e);
        }

        return serverJson;
    }

    //比较服务器版本与本地版本弹出对话框
    public boolean compareVersion(Context context){

        final Context contextTemp = context;

        new Thread(){
            public void run() {
                Looper.prepare();
                String serverJson = manager.getServerVersion();
                //解析Json数据
                try {
                    JSONObject result = new JSONObject(serverJson);
                    int code = result.getInt("code");
                    if (code == 0) {
                        JSONObject data = result.getJSONObject("data");

                        String getServerVersion = data.getString("version_code");
                        String getServerVersionName = data.getString("version_num");

                        MainActivity.serverVersion = Integer.parseInt(getServerVersion);
                        MainActivity.serverVersionName = getServerVersionName;

                        if(MainActivity.version < MainActivity.serverVersion){
                            String install_link = data.getString("install_link");
                            if (install_link != null && install_link.length() > 0) {
                                serverFilePath = install_link;
                            }
                            //弹出一个对话框
                            AlertDialog.Builder builder  = new Builder(contextTemp);
                            builder.setTitle("版本更新" ) ;
                            builder.setMessage("当前版本：" + MainActivity.versionName
                                    + "\n" + "最新版本：" + MainActivity.serverVersionName
                                    + "\n" + "最新版本时间：" + data.getString("add_timetext")
                                    + "\n" + "更新说明：" + data.getString("content")) ;
                            builder.setPositiveButton("立即更新",new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int arg1) {
                                    //开启线程下载apk
                                    new Thread(){
                                        public void run() {
                                            Looper.prepare();
                                            downloadApkFile(contextTemp);
                                            Looper.loop();
                                        };
                                    }.start();
                                }
                            });
                            builder.setNegativeButton("下次再说", null);
                            builder.show();
                        }
                        else {
                            System.out.println("已经是最新版本");
                        }
                    }
                    else {
                        String message = result.getString("message");
                        if (message == null) {
                            message = "获取服务器版本出错";
                        }
                        System.out.println(message);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println("获取服务器版本线程异常！"+e);
                }

                Looper.loop();
            };

        }.start();

        return false;
    }


    //下载apk文件
    public void downloadApkFile(Context context){
        String savePath = Environment.getExternalStorageDirectory()+"/ShipGoods.apk";
        try {
            if(Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())){
                URL serverURL = new URL(serverFilePath);
                HttpURLConnection connect = (HttpURLConnection) serverURL.openConnection();
                BufferedInputStream bis = new BufferedInputStream(connect.getInputStream());
                File apkfile = new File(savePath);
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(apkfile));

                int fileLength = connect.getContentLength();
                int downLength = 0;
                int progress = 0;
                int n;
                byte[] buffer = new byte[1024 * 1024 * 100];
                while((n=bis.read(buffer, 0, buffer.length))!=-1){
                    bos.write(buffer, 0, n);
                    downLength +=n;
                    progress = (int) (((float) downLength / fileLength) * 100);
                    Message msg = new Message();
                    msg.arg1 = progress;
                    MainActivity.handler.sendMessage(msg);
                }
                bis.close();
                bos.close();
                connect.disconnect();
            }

        } catch (Exception e) {
            System.out.println("下载出错！"+e);
        }

//		AlertDialog.Builder builder  = new Builder(context);
//        builder.setTitle("下载apk" ) ;
//        builder.setMessage("正在下载" ) ;
//        builder.setPositiveButton("确定", null);
//        builder.show();
    }
}