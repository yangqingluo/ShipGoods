package com.xinfu.shipowner;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import com.xinfu.shipowner.invokenative.DplusReactPackage;
import com.xinfu.shipowner.invokenative.RNUMConfigure;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new RNDeviceInfo(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
              new DplusReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //初始化组件化基础库, 统计SDK/推送SDK/分享SDK都必须调用此初始化接口
    RNUMConfigure.init(this, "58a27bbfe88bad78d500033d", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
            "669c30a9584623e70e8cd01b0381dcb4");
  }

  {

    PlatformConfig.setWeixin("wx76a7d279c788d379", "90e1346e7c70ff2e513c1f2ac8cff9a0");
    PlatformConfig.setQQZone("1105761007", "G0DCVOX7XYB0gY24");

  }
}
