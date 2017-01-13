/**
 * Created by danding on 16/11/21.
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
var Proxy = require('../proxy/Proxy');
import Config from '../../config';
import CodesModal from '../components/modal/CodesModal';
import GoodUpdate from './GoodUpdate';


class Query extends Component{

    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data)});
            }
        }, (err) =>{
        });
    }


    closeCodesModal(val){
        this.setState({codesModalVisible:val})
    }

    onCodigoSelect(codigo)
    {
        const {merchantId}=this.props;
        Proxy.post({
            url:Config.server+"/supnuevo/supnuevoGetSupnuevoBuyerPriceFormByCodigoBs.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + codigo + "&merchantId=" + merchantId
        },(json)=> {
            var goodInfo = json.object;
            this.setState({selectedCodeInfo: goodInfo,codigo:codigo});

            if(this.state.selectedCodeInfo.setSizeValue!=undefined&&this.state.selectedCodeInfo.setSizeValue!=null
                &&this.state.selectedCodeInfo.sizeUnit!=undefined&&this.state.selectedCodeInfo.sizeUnit!=null)
            {
                this.state.selectedCodeInfo.goodName=this.state.selectedCodeInfo.nombre+','+
                    this.state.selectedCodeInfo.setSizeValue+','+this.state.selectedCodeInfo.sizeUnit;
            }
            else{
                this.state.selectedCodeInfo.goodName=this.state.selectedCodeInfo.nombre;
            }

        }, (err) =>{
            alert(err);
            this.setState({codigo:codigo});
        });


    }

    queryGoodsCode(codeNum){
        var code = parseInt(codeNum);
        const { merchantId } = this.props;
        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetQueryDataListByInputStringBs.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + code + "&merchantId=" + merchantId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                var codes=json.array;
                this.setState({codes: codes,codesModalVisible:true});
            }
        }, (err) =>{
            alert(err);
        });

    }

    navigateGoodUpdate(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'goodUpdate',
                component: GoodUpdate,
                params: {
                }
            })
        }
    }

    constructor(props)
    {
        super(props);
        this.state = {
            uploadModalVisible:false,
            goods:{},
            codesModalVisible:false,
            codigo:null,
            selectedCodeInfo:{}
        };
    }


    render(){

        var username = this.props.username;
        var codigo = this.state.selectedCodeInfo.codigo;
        var goodName = this.state.selectedCodeInfo.goodName;
        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1}}>

                        </View>
                        <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                            {username}
                        </Text>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        </View>
                    </View>


                    <View style={{padding:10}}>

                        {/*输入条码*/}
                        <View style={[styles.row,{borderBottomWidth:0}]}>

                            <View style={{flex:1,borderWidth:1,borderColor:'#ddd'}}>
                                <TextInput
                                    style={{height: 46,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6}}
                                    onChangeText={(codeNum) => {
                                    if(codeNum.toString().length==4)
                                    {
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                        this.queryGoodsCode(codeNum.toString().substring(0,4));
                                    }else if(codeNum.toString().length>4){}
                                    else{
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                    }
                                }}
                                    value={this.state.goods.codeNum}
                                    placeholder='请输入条码最后四位'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/* 价位横幅 */}
                        <View style={[styles.row,{borderBottomWidth:0,padding:18,backgroundColor:'#eee'}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>原价位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>建议改位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>固定改位</Text>
                            </View>
                        </View>

                        {/* 三个无意义的大方块 */}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5}}>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4}}>

                            </View>
                        </View>
                        {/*商品概要*/}

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:12,marginBottom:1}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品条码:</Text>
                            </View>
                            <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text>{codigo}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:12,marginBottom:1}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品名称:</Text>
                            </View>
                            <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text>{goodName}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text >更新改价:</Text>
                            </View>
                            <View style={{flex:5}}>
                                <TextInput
                                    style={{height: 40}}
                                    onChangeText={(priceShow) => {

                                        this.state.selectedCodeInfo.priceShow=priceShow;
                                        this.setState({selectedCodeInfo:this.state.selectedCodeInfo});

                                }}

                                    value={this.state.priceShow}
                                    placeholder='请输入您的价格'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>



                        <View style={[styles.row,{borderBottomWidth:0,padding:18,backgroundColor:'#eee',borderRadius:8,
                            marginTop:10,marginBottom:4}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>标签</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>大折扣</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>中折扣</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>小折扣</Text>
                            </View>
                        </View>

                        {/*包含8个按钮的按钮组*/}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+IVA</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+10%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+5%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>.00</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:4}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-IVA</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-10%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-5%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>0.50</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:12}]}>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                    marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:18}}>改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                <Text style={{color:'#fff',fontSize:18}}>组改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',backgroundColor:'#387ef5',
                                    marginRight:.5,alignItems:'center',justifyContent:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                <Text style={{color:'#fff',fontSize:18}}>添加</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                    borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:18}}>修改</Text>
                            </TouchableOpacity>
                        </View>

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
                            (codigo)=>{
                                this.onCodigoSelect(codigo);
                            }}
                            codes={this.state.codes}
                        />
                    </Modal>
                </ScrollView>
            </View>);
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
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }
});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username
    })
)(Query);

