
/**
 * Created by danding on 16/11/21.
 */
import React,{Component} from 'react';

import  {
    NetInfo,
    ListView,
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
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import CommodityClass from './CommodityClass';
import Camera from 'react-native-camera';


class Sale extends Component{


    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <Text>
                    {row}
                </Text>
            </View>
        );
        return row;
    }

    navigateCommodityClass(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CommodityClass',
                component: CommodityClass,
                params: {

                }
            })
        }
    }

    constructor(props)
    {
        super(props);
        this.state = {
            goodsCount:1,
            codeNum:null,
            commodityList:[],
            cameraModalVisible:false,
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

        var commodityListView=null;
        var commodityList=this.state.commodityList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (commodityList !== undefined && commodityList !== null && commodityList.length > 0) {

            commodityListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(commodityList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View style={{flex:1}}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <Text style={{fontSize:20,flex:3,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>
                </View>

                {/* body */}
                <View style={{flex:1}}>

                    <View style={{flexDirection:'row',flex:1,}}>

                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>作废</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{flex:3,marginLeft:5,marginRight:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{flex:3,color:'#343434',fontSize:15,}}>CANTIDAD:</Text>
                                <View style={{flex:2,justifyContent:'center',alignItems:'center',margin:6,marginBottom:10,borderWidth:1,borderColor:'#343434'}}>
                                    <TextInput
                                        style={{flex:1,height:20,marginLeft:10,paddingTop:2,paddingBottom:2,fontSize:16,}}
                                        onChangeText={(goodsCount) => {
                                            this.setState({goodsCount:goodsCount});
                                }}
                                        value={this.state.goodsCount}
                                        placeholder="1"
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                                <View style={{flex:1}}>

                                </View>
                            </View>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',}}
                                              onPress={()=>{
                                                      this.navigateCommodityClass();
                                                  }}>

                                <Icon name="chevron-circle-right" color="#343434" size={30}></Icon>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/* ListView */}
                    <View style={{flexDirection:'row',flex:5,}}>
                        {commodityListView}
                    </View>

                    <View style={{flexDirection:'row',flex:1,}}>

                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>结账</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}
                                              onPress={()=>{
                                                      this.setState({cameraModalVisible:true})
                                                  }}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{flex:2,flexDirection:'row',marginLeft:15,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{flex:1,color:'#343434',fontSize:15,}}>TOTAL:</Text>
                                <Text style={{flex:1,margin:15,justifyContent:'center',alignItems:'center'}}>
                                    3435.5
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

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
                                  console.log('barcode data='+data);

                                this.state.codeNum = data;

                                var str = this.state.codeNum.substr(0, 3);
                                if(str!==200&&str!==210&&str!==220&&str!==230)
                                {

                                }
                                else{

                                }
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

    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },

});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
        commodityClassList:state.sale.commodityClassList,
        weightService:state.sale.weightService
    })
)(Sale);
