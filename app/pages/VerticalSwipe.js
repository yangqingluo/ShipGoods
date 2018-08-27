import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Animated, View, PanResponder, Dimensions} from 'react-native';

const screen = Dimensions.get("window");

export default class VerticalSwipe extends Component {
    _panResponder = null;
    _movable = null;
    _initialPositionTop = null;
    _hasActivatedThreshold = false;
    _hasMoveAction = false;
    stylesheets = null;


    static propTypes: {
        // Amount of pixel the user can use to swipe the window in
        swipeOffset: PropTypes.number.isRequired,
        // Threshold after which window is considered opened when moving
        openSwipeThreshold: PropTypes.number.isRequired,
        // Threshold after which window is considered closed when moving
        closeSwipeThreshold: PropTypes.number.isRequired,
        // The offset to stop when opening
        offsetTop: PropTypes.number.isRequired,
        //内容布局偏移
        contentOffsetTop: PropTypes.number,
        //状态变化通知
        onChange: PropTypes.func,
        //禁止拖动超过初始化swipe content ui高度(跟contentOffsetTop,offsetTop有关)
        lockContentTopOffset: PropTypes.bool,
        //拖放阈值
        thresholdDrag: PropTypes.number,
        //Y轴变化通知
        onTopChange: PropTypes.func,
    };

    static defaultProps = {
        swipeOffset: 100,
        openSwipeThreshold: 100,
        closeSwipeThreshold: 50,
        offsetTop: 0,
        contentOffsetTop: 0,
        lockContentTopOffset: false,
        thresholdDrag: 8,


    };

    initialize = () => {
        this._initialPositionTop = Math.floor(screen.height - this.props.contentOffsetTop - this.props.swipeOffset);
        let positionTopAnimatedValue = new Animated.Value(this._initialPositionTop);
        positionTopAnimatedValue.addListener(({value}) => {
            this.props.onTopChange && this.props.onTopChange(value)
        });
        this.state = {
            isAnimating: false,
            isOpen: false,
            positionTop: positionTopAnimatedValue,
        };

        const styles = {
            container: {
                flex: 1,
            },
            swiper: {
                // We put a transparent background color as a hack because otherwise, moving doesn't work
                backgroundColor: "rgba(0, 0, 0, 0)",
                width: "100%",
                height: screen.height + 75 - this.props.offsetTop, // this.props.swipeOffset,
                position: "absolute",
                left: 0,
                top: this._initialPositionTop,
            },
            innerBottom: {
                marginTop: this.props.swipeOffset,
            },
        };

        this.stylesheets = StyleSheet.create(styles);
        this.stylesheets.content = this.props.style;
    };

    checkTopValue(top) {
        let result = top;
        if (this.props.lockContentTopOffset) {
            if (top < this.props.offsetTop) {
                result = this.props.offsetTop;
            }
            if (top > this.props.offsetTop && (top > (screen.height - this.props.contentOffsetTop - this.props.swipeOffset))) {
                result = this._initialPositionTop;
            }
        }
        return result;
    }


    onStartShouldSetPanResponder = (evt, gestureState) => {
        PublicLog('onStartShouldSetPanResponder', gestureState.dy);
        if (this.state.isOpen) {
            if ((evt.nativeEvent.pageY < (this.props.openSwipeThreshold + this.props.offsetTop) && evt.nativeEvent.pageY > this.props.offsetTop)) {
                return false;
            }
            return true;
        } else {

        }

        return true;
    };
    onStartShouldSetPanResponderCapture = (evt, gestureState) => {
        this._hasMoveAction = false;
        PublicLog('onStartShouldSetPanResponderCapture', gestureState.dy);
        if (this.state.isAnimating === true) {
            return false;
        }
        if (Math.abs(gestureState.dy) < 5) {
            PublicLog('onStartShouldSetPanResponder false');
            return false;
        } else {
            return true;
        }
        if (this.state.isOpen) {
            if ((evt.nativeEvent.pageY < (this.props.openSwipeThreshold + this.props.offsetTop) && evt.nativeEvent.pageY > this.props.offsetTop)) {
                return false;
            }
        }
        return true;
    };

    onPanResponderMove = (evt, gestureState) => {
        PublicLog('onPanResponderMove', evt.nativeEvent.pageY, gestureState.dy);
        if (this.state.isAnimating === true) {
            return;
        }
        if(!this._hasMoveAction){
            this._hasMoveAction = true;
            return ;
        }

        PublicLog(gestureState);
        let top;
        if (this.state.isOpen === false) {
            if (gestureState.dy < -(this.props.openSwipeThreshold) && this._hasActivatedThreshold === false) {

                this._hasActivatedThreshold = true;
            } else if (gestureState.dy >= -(this.props.openSwipeThreshold) && this._hasActivatedThreshold === true) {
                this._hasActivatedThreshold = false;
            }
            //增加禁止拖动超过初始化swipe content ui高度
            top = screen.height - this.props.contentOffsetTop - this.props.swipeOffset + gestureState.dy;
            PublicLog('close state _hasActivatedThreshold',this._hasActivatedThreshold,gestureState.dy,top)
            top = this.checkTopValue(top);
            this._movable.setNativeProps({
                style: [this.stylesheets.swiper, {
                    top: top
                }]
            });
        } else {

            if (gestureState.dy > this.props.closeSwipeThreshold && this._hasActivatedThreshold === false) {
                this._hasActivatedThreshold = true;
            } else if (gestureState.dy <= this.props.closeSwipeThreshold && this._hasActivatedThreshold === true) {
                this._hasActivatedThreshold = false;
            }
            top = -this.props.swipeOffset + this.props.offsetTop + gestureState.dy;
            PublicLog('open state _hasActivatedThreshold',this._hasActivatedThreshold,gestureState.dy,top);
            top = this.checkTopValue(top);
            //增加禁止拖动超过初始化swipe content ui高度
            this._movable.setNativeProps({
                style: [this.stylesheets.swiper, {
                    top: top
                }]
            });
        }

        this.props.onTopChange && this.props.onTopChange(top)
    };

    onPanResponderRelease = (evt, gestureState) => {
        PublicLog('onPanResponderRelease', gestureState.dy,this._hasMoveAction,this.state.isOpen)
        if (this._hasMoveAction) {
            if (this._hasActivatedThreshold) {
                if (this.state.isOpen === false) {
                    let top = screen.height - this.props.contentOffsetTop - this.props.swipeOffset + gestureState.dy;
                    top = this.checkTopValue(top);
                    this.state.positionTop.setValue(top);
                    this.open();
                } else {
                    let top = -this.props.swipeOffset + this.props.offsetTop + gestureState.dy;
                    top = this.checkTopValue(top);
                    this.state.positionTop.setValue(top);
                    this.close();
                }
            } else {
                let newTop=0;
                if (this.state.isOpen === false) {
                    newTop=this._initialPositionTop;
                    this._movable.setNativeProps({
                        style: [this.stylesheets.swiper, {
                            top: newTop,
                        }]
                    });
                } else {
                    newTop= -this.props.swipeOffset + this.props.offsetTop;
                    this._movable.setNativeProps({
                        style: [this.stylesheets.swiper, {
                            top: newTop,
                        }]
                    });

                }
                this.props.onTopChange && this.props.onTopChange(newTop)
            }
        }
        this._hasMoveAction = false;
    };

    open = () => {
        if (this.state.isAnimating) {
            return;
        }

        this.setState({isAnimating: true, isOpen: true});
        Animated.timing(
            this.state.positionTop, {
                toValue: -this.props.swipeOffset + this.props.offsetTop,
                duration: 300,
            }
        ).start(() => {
            if (this.props.onChange) {
                this.props.onChange(this.state.isOpen)
            }
            this.setState({isAnimating: false});
        })
    };

    close = () => {
        if (this.state.isAnimating) {
            return;
        }

        this.setState({isAnimating: true, isOpen: false});
        Animated.timing(
            this.state.positionTop, {
                toValue: this._initialPositionTop,
                duration: 300,
            }
        ).start(() => {
            if (this.props.onChange) {
                this.props.onChange(this.state.isOpen)
            }
            this.setState({isAnimating: false});
        })
    };

    getMovableStyle = () => {
        return [this.stylesheets.swiper, {
            top: this.state.positionTop,
        }]
    };

    constructor(props) {
        super(props);
        this.initialize();
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: this.onStartShouldSetPanResponderCapture,
            onMoveShouldSetPanResponder: this.onStartShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this.onStartShouldSetPanResponder,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: this.onPanResponderRelease

        })
    }

    render() {
        return (
            <View style={this.stylesheets.container}>
                <View style={this.stylesheets.content}>
                    {this.props.children}
                </View>
                <Animated.View
                    style={this.getMovableStyle()}
                    ref={(ref) => this._movable = ref}
                    {...this._panResponder.panHandlers}>
                    <View style={this.stylesheets.innerBottom}>
                        {this.props.content}
                    </View>
                </Animated.View>
            </View>
        );
    }
}