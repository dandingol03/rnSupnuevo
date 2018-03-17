/**
 * Created by danding on 17/1/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');

import Config from '../../../config';
import _ from 'lodash';
import CodesModal from '../../components/modal/CodesModal';
import Modalbox from 'react-native-modalbox';
import GroupQueryInGroup from './GroupQueryInGroup';
import GroupQueryNotInGroup from './GroupQueryNotInGroup';
import GoodsInGroup from './GoodsInGroup';
import Camera from 'react-native-camera';

class GroupQuery extends Component{

    goBack(){
        const { navigator } = this.props;

        var groupArr=this.state.groupArr;
        var groupInfo=this.state.groupInfo;
        var query={};
        var code=null;

        //当前处于多个组的界面
        if(groupArr&&groupArr.array)
        {
            groupArr={};
            this.setState({query:query,groupArr:groupArr,code:code});
        }else if(groupInfo&&groupInfo.array){
            groupInfo=null;
            this.setState({query:query,groupInfo:groupInfo,code:code});
        }else{
            if(navigator) {
                navigator.pop();
            }
        }
    }

    reset()
    {
        this.setState({query: {},code:null});
    }

    closeCodesModal(val){
        this.setState({codesModalVisible:val});
    }

    //跳转匹配组界面
    redirect2groupQueryInGroup(groupInfo,code)
    {
        const { navigator } = this.props;
        if(navigator&&groupInfo&&code) {
            navigator.push({
                name: 'groupQueryInGroup',
                component: GroupQueryInGroup,
                params: {
                    groupInfo:groupInfo,
                    code:code,
                    reset:this.reset.bind(this)
                }
            })
        }
    }

    redirect2groupQueryNotInGroup(groupArr,code)
    {
        const { navigator } = this.props;
        if(navigator&&groupArr&&code) {
            navigator.push({
                name: 'groupQueryNotInGroup',
                component: GroupQueryNotInGroup,
                params: {
                    groupArr:groupArr,
                    code:code,
                    reset:this.reset.bind(this)
                }
            })
        }
    }

    redirect2goodsInGroup(groupInfo)
    {
        const { navigator } = this.props;
        if(navigator&&groupInfo) {
            navigator.push({
                name: 'goodsInGroup',
                component: GoodsInGroup,
                params: {
                    groupInfo:groupInfo,
                    reset:this.reset.bind(this)
                }
            })
        }
    }

    onCodigoSelect(code,groupNum)
    {
        const {merchantId}=this.props;
        var sessionId=this.props.sessionId;
        var query=this.state.query;
        if(code!==undefined&&code!==null){
            var codigo=code.codigo;
            query.codeNum=codigo;
        }

        var body='';
        if(groupNum!==undefined&&groupNum!==null)
            //body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;
            body={
                groupNum:groupNum,
                supnuevoMerchantId:merchantId
            }
        else
            //body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;
            body={
                codigo:codigo,
                supnuevoMerchantId:merchantId
            }

        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityGroupListByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            body: body
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                this.setState({query: {}});
            }
            else {
                var data = json;
                if (json.groupNum !== undefined && json.groupNum !== null) {
                    //单个组
                    json.array.map(function (commodity, i) {

                        if (commodity.commodityId == code.commodityId) {
                            commodity.checked = true;
                        }

                        if (commodity.setSizeValue != undefined && commodity.setSizeValue != null
                            && commodity.sizeUnit != undefined && commodity.sizeUnit != null) {
                            commodity.goodName = commodity.nombre + ',' +
                                commodity.setSizeValue + ',' + commodity.sizeUnit;
                        }
                        else {
                            commodity.goodName = commodity.nombre;
                        }
                    });

                    this.setState({groupInfo: json, query: query, code: code});
                    this.redirect2groupQueryInGroup(json, code)
                } else {
                    //多个组的信息
                    this.redirect2groupQueryNotInGroup(data, code);
                }
            }
        }).catch((err) =>{
            alert(err);
            this.setState({query:query});
        });

    }

    queryGoodsCode(codeNum)
    {
        //var code = parseInt(codeNum);
        const { merchantId } = this.props;
       // var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+'/func/commodity/getSupnuevoCommonCommodityListByLastFourCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
               // 'Cookie':sessionId,
            },
          // body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body:{
                codigo:codeNum,
                merchantId:merchantId
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var codes=json.array;
                if(codes.length==1){
                    var code = codes[0];
                    this.onCodigoSelect(code);
                }
                else{
                    this.setState({codes: codes,codesModalVisible:true});
                }
            }
        }).catch((err) =>{
            alert(err);
        });
    }

//同个组的所有商品信息
    queryCommodityListByGroupId(groupId,groupNum,groupName)
    {
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityListOfGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId
            },
            //body: 'groupId='+groupId
            body:{
                groupId:groupId
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var info=json;
                if(info.array!==undefined&&info.array!==null)
                {
                    //同个组的所有商品信息
                    info.array.map(function (commodity,i) {
                        commodity.checked=false;
                        if(commodity.setSizeValue!=undefined&&commodity.setSizeValue!=null
                            &&commodity.sizeUnit!=undefined&&commodity.sizeUnit!=null)
                        {
                            commodity.goodName=commodity.nombre+','+
                                commodity.setSizeValue+','+commodity.sizeUnit;
                        }
                        else{
                            commodity.goodName=commodity.nombre;
                        }
                    });
                    info.groupId=groupId;
                    info.groupNum=groupNum;
                    info.groupName=groupName;
                    this.redirect2goodsInGroup(info);
                }else{}
            }
        }).catch((err) =>{
            alert(err);
        });
    }

    fetchData(){
        const merchantId=this.props.merchantId;
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityGroupListByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body:"merchantId=" + merchantId
            body:{
                merchantId:merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var groupCodes = json.array;
                this.state.groupCodes = groupCodes;
                this.setState({groupCodes:groupCodes});
            }

        }).catch((err)=>{
            alert(err);
        });
    }

    renderRow(rowData){
        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        this.queryCommodityListByGroupId(rowData.groupId,rowData.groupNum,rowData.groupName);
                    }.bind(this)}>

                    <View style={{flex:1,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                        <Text style={{flex:1,fontSize:15,color:'#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex:2,fontSize:15,color:'#343434'}}>{rowData.groupName}</Text>
                    </View>

                </TouchableOpacity>

            </View>;

        return row;
    }

    closeCamera(query){

        if(query!==undefined&&query!==null){
            this.setState({cameraModalVisible:false,query:query});
        }else{
            this.setState({cameraModalVisible:false});
        }

    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groupArr:{},
            groupCodes:null,
            selectAll:false,
            codesModalVisible:false,
            code:null,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
            cameraModalVisible:false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            barcodeX:null,
            barcodeY:null,
            barcodeWidth:null,
            barcodeHeight:null,
        };
    }


    render(){

        var groupArr=this.state.groupArr;
        var groupInfo=this.state.groupInfo;
        var queryBox=(<View style={[styles.card,{marginTop:10,padding:8}]}>
            <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>
                {/* 条码 */}
                <View style={[styles.row,{borderBottomWidth:0}]}>
                    <View style={{flex:1,borderWidth:1,backgroundColor:'#fff',borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={{flex:8,height: 50,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6,backgroundColor:'#fff',}}
                            onChangeText={(codeNum) => {
                                if(codeNum.toString().length==13)
                                    {
                                        this.state.query.codeNum=codeNum;
                                        this.setState({query:this.state.query});

                                        this.queryGoodsCode(codeNum.toString());
                                    }
                                    else{
                                          if(codeNum!==undefined&&codeNum!==null){
                                               this.state.query.codeNum=codeNum;
                                                this.setState({query:this.state.query});
                                          }
                                    }

                                }}

                            value={this.state.query.codeNum}

                            placeholder='请输入商品条码尾数'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />

                        <TouchableOpacity style={{flex:2,height:40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                          onPress={()=>{
                                                  if(this.state.query.codeNum!==undefined&&this.state.query.codeNum!==null){
                                                      var codeNum = this.state.query.codeNum;
                                                      if(codeNum.toString().length>=4&&codeNum.toString().length<=13){
                                                        this.queryGoodsCode(this.state.query.codeNum.toString());
                                                        }
                                                      else{
                                                         Alert.alert(
                                                            '提示信息',
                                                            '请输入4-13位的商品条码进行查询',
                                                                [
                                                                {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                                ]
                                                            )
                                                          }
                                                  }
                                                  else{
                                                     Alert.alert(
                                                        '提示信息',
                                                        '请输入4-13位的商品条码进行查询',
                                                            [
                                                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                            ]
                                                        )
                                                      }
                                                  }}>
                            <View>
                                <Text style={{color:'#fff',fontSize:12}}>查询</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:2,height: 40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                          onPress={()=>{
                                                      this.setState({cameraModalVisible:true})
                                                  }}>

                            <View>
                                <Text style={{color:'#fff',fontSize:12}}>扫码</Text>
                            </View>
                        </TouchableOpacity>


                    </View>
                </View>

            </View>
        </View>);

        var listView=null;
        const groupCodes=this.state.groupCodes;
        if(groupCodes!==undefined&&groupCodes!==null&&Object.prototype.toString.call(groupCodes)=='[object Array]'
            &&groupCodes.length>0)
        {
            var data=groupCodes;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                    />
                </ScrollView>;
        }else{

            this.fetchData();
        }

        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding:8,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>

                        <TouchableOpacity style={{flex:1,paddingTop:10,paddingBottom:5,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'center'}}
                                          onPress={()=>{
                                              this.goBack();
                                          }}>
                            <Icon name="angle-left" color="#fff" size={35}></Icon>
                        </TouchableOpacity>

                        <Text style={{fontSize:17,flex:3,paddingTop:10,textAlign:'center',color:'#fff'}}>
                            组商品管理
                        </Text>

                        <View style={{flex:1}}>

                        </View>
                    </View>

                    {queryBox}

                    {/* 组列表 */}
                    <View>
                        <ScrollView>
                            <View style={{height:40,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',borderWidth:1,
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                                <Text style={{flex:1,fontSize:15,color:'#343434'}}>组编号</Text>
                                <Text style={{flex:2,fontSize:15,color:'#343434'}}>组名称</Text>
                            </View>
                            <View style={{flex:1}}>
                                {listView}
                            </View>
                        </ScrollView>
                    </View>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.codesModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}>

                        <CodesModal
                            onClose={()=>{
                            this.closeCodesModal(!this.state.codesModalVisible)
                        }}
                            onCodigoSelect={
                            (code)=>{
                                this.onCodigoSelect(code);
                            }}
                            codes={this.state.codes}
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
                                  console.log('barcode data='+data);
                                   this.state.query.codeNum=data;
                                   var query =  this.state.query;
                                   query.codeNum = data;
                                   this.queryGoodsCode(data.toString());
                                   this.closeCamera(query);


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


                </ScrollView>

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
        paddingTop: 1,
        paddingBottom: 1,
        shadowColor: ' rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    modal3: {
        height: 120,
        width: 300
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
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
    sessionId:state.user.sessionId,
    })
)(GroupQuery);

