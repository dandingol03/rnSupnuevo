/**
 * Created by dingyiming on 2017/3/7.
 */
import React, {Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    ListView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');

import Config from '../../../config';
//import MultiPrices from './MultiPrices';
//import PriceCodes from './PriceCodes';
import Camera from 'react-native-camera';
import Iconsaoma from 'react-native-vector-icons/Entypo';

class Sale extends Component {
    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            cameraModalVisible: false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
        };
    }

    closeCamera(){
        this.setState({cameraModalVisible:false});
    }
    render() {
        //var username = this.props.username;
        //var listView=null;
        //const groupCodes=this.state.groupCodes;
        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flexDirection: 'row'
                }, styles.card]}>

                    <TouchableOpacity ref="menu" style={{
                        flex: 1,
                        marginRight: 2,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        Sale
                    </Text>

                    <View style={{flex: 1}}>

                    </View>
                </View>
                {/*添加扫码图标 */}
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button}
                                      onPress={()=>{
                                          this.setState({cameraModalVisible:true})
                                      }}>
                        <Text style={styles.buttonText}>扫码</Text>
                    </TouchableOpacity>
                    <View style={{flex: 6}}>
                    </View>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                        onBarCodeRead={(barcode)=>{
                            var{type,data,bounds}=barcode;
                            if(data!==undefined&&data!==null){
                                console.log('barcode data='+data);
                                this.state.goods.codeNum = data;
                                var goods =  this.state.goods;
                                goods.codeNum = data;
                                this.queryGoodsCode(data);
                                this.closeCamera();
                            }
                        }}
                    />
                    <View style={[styles.box]}>
                    </View>
                    <View style={{ position: 'absolute',right: 1/2*width-100,top: 1/2*height,
                        height:100,width:200,borderTopWidth:1,borderColor:'#e42112',backgroundColor:'transparent'}}>
                    </View>
                    <View style={[styles.overlay,styles.bottomOverlay]}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={()=>{this.closeCamera()}}
                        >
                            <Icon name="times-circle" size={50} color="#343434" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ccc',
        borderColor: '#333',
        borderWidth: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    popoverContent: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },

});

module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username
    })
)(Sale);

