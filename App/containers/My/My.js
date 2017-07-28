
/**
 * Created by danding on 16/11/21.
 */
import React,{Component} from 'react';

import  {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import QrcodeModal from './QrcodeModal';
import Camera from 'react-native-camera';
var Proxy = require('../../proxy/Proxy');
import Config from '../../../config';

class My extends Component{

    closeCamera(){
        this.setState({cameraModalVisible:false});
    }

    setMerchantVisible(scan){
        var scanId = parseInt(scan)
        Proxy.postes({
            url:Config.server+'/func/merchant/setMerchantVisibleEachOtherMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                scanId:scanId,
            }
        }).then((json)=>{
            console.log('setMerchantVisible返回了');

            var errMessage=json.errMessage;
            if(errMessage !== null && errMessage !== undefined && errMessage !== ""){
                console.log(errMessage);

                setTimeout(()=>{
                    Alert.alert(
                        '信息',
                        errMessage,
                        [
                            {text: '确定', onPress: () => this.setState({barcodeFlag:true})},
                        ]
                    )
                },900)

            }else{
                console.log('已设置成功');

                setTimeout(()=>{
                    Alert.alert(
                        '信息',
                        '已设置成功',
                        [
                            {text: 'OK', onPress: () => this.setState({barcodeFlag:true})},
                        ]
                    )
                },900)


            }

        })


    }

    constructor(props)
    {
        super(props);
        this.state = {
            QrcodeModalVisible:false,
            cameraModalVisible:false,
            scanId:null,
            barcodeFlag:true,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
        }

    }

    render(){

        // if(this.state.scanId!==null&&this.state.scanId!==undefined&&this.state.barcodeFlag!==false){
        //     this.setMerchantVisible(this.state.scanId);
        // }

        return (
            <View style={{flex:1}}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <Text style={{fontSize:20,flex:3,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>
                </View>

                <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                    <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>

                    </View>
                   <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                       <Text>我的信息</Text>
                   </View>
                    <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center'}}
                    onPress={()=>{
                        this.setState({QrcodeModalVisible:true});

                    }}>
                        <Text>我的二维码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center'}}
                                      onPress={()=>{
                                                      this.setState({cameraModalVisible:true})
                                                      //this.setMerchantVisible('54');
                                                  }}>
                        <Text>扫一扫商家二维码</Text>
                    </TouchableOpacity>
                    <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>

                    </View>
                </View>

                {/*我的二维码*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.QrcodeModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <QrcodeModal
                        supnuevoMerchantId={this.props.supnuevoMerchantId}
                        username={this.props.username}
                        onClose={()=>{
                               this.setState({QrcodeModalVisible:false});
                            }}
                        onConfirm={(price)=>{

                            }}
                    />

                </Modal>

                {/*camera part*/}
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
                                    console.log('barcode data='+data+'barcode type='+type);

                                    this.state.scanId = data;
                                    if(this.state.barcodeFlag==true){
                                         this.setState({barcodeFlag:false});
                                         this.setMerchantVisible(this.state.scanId);

                                    }

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

    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
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
    box:{
        position: 'absolute',
        right: 1/2*width-100,
        top: 1/2*height-100,
        height:200,
        width:200,
        borderWidth:1,
        borderColor:'#387ef5',
        backgroundColor:'transparent'

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



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
        supnuevoMerchantId:state.user.supnuevoMerchantId
    })
)(My);

