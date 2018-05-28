import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class PublicImageShowVC extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            // headerLeft: null,
            header: null,
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            images: this.props.navigation.state.params.images,
            imageIndex: this.props.navigation.state.params.index,
        };
    }

    render() {
        // let des = ["我是一致小小鸟1", "我是一致小小鸟2", "我是一致小小鸟3"];
        return (
            <View style={appStyles.container}>
                <ImageViewer
                    imageUrls={this.state.images} // 照片路径
                    enableImageZoom={true} // 是否开启手势缩放
                    index={this.state.imageIndex} // 初始显示第几张
                    // failImageSource={{url: '../images/icon_zanwu.png'}} // 加载失败图片
                    onChange={(index) => {}} // 图片切换时触发
                    onClick={() => { // 图片单击事件
                        this.props.navigation.goBack();
                    }}
                    // renderFooter={(currentIndex) => {
                    //     return (
                    //         <ScrollView style={{ height: 70, marginTop: -70 }}>
                    //             <Text style={{ color: '#fff', paddingLeft: 10, paddingRight: 10 }}>{des[currentIndex]}</Text>
                    //         </ScrollView>
                    //     );
                    // }}
                />
            </View>
        );
    }
}