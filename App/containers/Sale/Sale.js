
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
var Proxy = require('../../proxy/Proxy');
import Config from '../../../config';

class Sale extends Component{


    codeQuery(codeNum){

        Proxy.postes({
            url:Config.server+'/func/sale/gerCommodityInfoByCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                codigo:codeNum,
            }
        }).then((json)=>{
            console.log('扫码返回成功');
            var errMessage=json.errMessage;
            if(errMessage !== null && errMessage !== undefined && errMessage !== ""){
                alert(errMessage);
            }else{
                var commodity = {codigo:json.codigo,nombre:json.nombre,price:json.price};
                var commodityList = this.state.commodityList;
                commodity.goodsCount = this.state.goodsCount;
                commodity.sum =  this.state.goodsCount*json.price;
                commodityList.push(commodity);
                var sum = 0;
                commodityList.map((commodity)=>{
                    sum = sum+commodity.price*commodity.goodsCount;
                });
                this.setState({commodityList:commodityList,total:sum});
            }
        }).catch((err) =>{
            alert(err);
        });

    }

    codeMatch(codeNum){
        var weightService = this.props.weightService;

        var str = codeNum.substr(0, 3);

        var price = parseInt(codeNum.substring(6, 12))/100;
        var commodity = {codigo:codeNum,nombre:weightService[str],price:price};
        var commodityList = this.state.commodityList;
        commodity.goodsCount = 1;
        commodity.sum =  this.state.goodsCount*price;
        commodityList.push(commodity);
        var sum = 0;
        commodityList.map((commodity)=>{
            sum = sum+commodity.price*commodity.goodsCount;
        });

        this.setState({commodityList:commodityList,total:sum});
    }

    codeClass(commodity){

        var commodityList = this.state.commodityList;
        commodity.goodsCount = 1;
        commodity.sum =  this.state.goodsCount*commodity.price;
        commodityList.push(commodity);
        var sum = 0;
        commodityList.map((commodity)=>{
            sum = sum+commodity.price*commodity.goodsCount;
        });

        this.setState({commodityList:commodityList,total:sum});

    }

    navigateCommodityClass(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CommodityClass',
                component: CommodityClass,
                params: {
                    codeClass:this.codeClass.bind(this)
                }
            })
        }
    }

    closeCamera(){
        this.setState({cameraModalVisible:false});
    }

    checkOut() {

        Proxy.postes({
            url: Config.server + '/func/sale/saveCommoditySaleMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                commodityList: this.state.commodityList,
            }
        }).then((json) => {
            var errMessage=json.errMessage;
            if(errMessage !== null && errMessage !== undefined && errMessage !== ""){
                alert(errMessage);

            }else{
                var commodityList = [];
                this.setState({commodityList:commodityList,total:0});
            }
        }).catch((err) =>{
            alert(err);
        });
    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,borderBottomWidth:1,borderColor:'#eee',padding:5}}>

                <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flexDirection:'row',flex:1}}>
                        <Text>{this.state.goodsCount}*</Text>
                        <Text>{rowData.price}</Text>
                    </View>
                    <View style={{flex:3}}>
                        <Text>{rowData.codigo}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flex:3}}>
                        <Text>{rowData.nombre}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text>{rowData.sum}</Text>
                    </View>
                </View>
            </View>
        );
        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            goodsCount:1,
            total:0,
            codeNum:null,
            commodityList:[],
            commodity:null,
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

                    <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start',}}>

                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}
                                              onPress={()=>{
                                  var commodityList = []
                                  this.setState({commodityList:commodityList});

                        }}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>作废</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{flex:3,marginLeft:5,marginRight:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Text style={{flex:3,color:'#343434',fontSize:15,}}>CANTIDAD:</Text>
                                <View style={{flex:2,justifyContent:'center',alignItems:'center',marginLeft:6,margin:16,marginBottom:10,borderWidth:1,borderColor:'#343434'}}>
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
                    <View style={{flexDirection:'row',flex:8,padding:5}}>
                        {commodityListView}
                    </View>

                    <View style={{flexDirection:'row',flex:1,position:'absolute',bottom:13}}>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}
                                              onPress={()=>{
                                                  this.checkOut();
                            }}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>结账</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',margin:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#CAE1FF'}}
                                              onPress={()=>{
                                                      this.setState({cameraModalVisible:true})
                                                      //this.codeQuery('2100010132257 ');
                                                      //this.codeMatch('2100010132257 ');
                                                  }}>
                                <View style={{padding:10}}>
                                    <Text style={{color:'#343434',fontSize:15}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{flex:2,flexDirection:'row',marginLeft:15,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{flex:1,color:'#343434',fontSize:15,}}>TOTAL:</Text>
                                <Text style={{flex:1,margin:15,justifyContent:'center',alignItems:'center'}}>
                                    {this.state.total}
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

                                    var str = this.state.codeNum.substring(0, 3);
                                     if(str!==200&&str!==210&&str!==220&&str!==230)
                                     {
                                        this.codeQuery(this.state.codeNum);
                                     }
                                    else{
                                        this.codeMatch(this.state.codeNum);
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

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
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
        commodityClassList:state.sale.commodityClassList,
        weightService:state.sale.weightService
    })
)(Sale);