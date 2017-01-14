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
    TouchableOpacity,
    Button
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import ActionSheet from 'react-native-actionsheet';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../proxy/Proxy');
import Config from '../../config';


class GoodUpdate extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    confirm(){

    }

    cancel(){

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


    constructor(props)
    {
        super(props);
        this.state = {
            commodity:{}
        };
    }


    render(){


        return (
            <View style={{flex:1}}>

                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>

                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        添加或修改商品
                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                {/* body */}
                <View style={{padding:10}}>


                    {/*表单*/}
                    <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text >商品内码:</Text>
                        </View>
                        <View style={{flex:5,padding:5}}>
                            <TextInput
                                style={{height: 40,backgroundColor:'#eee'}}
                                onChangeText={() => {

                                }}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text >商品条码:</Text>
                        </View>
                        <View style={{flex:5,padding:5}}>
                            <TextInput
                                style={{height: 40,backgroundColor:'#eee'}}
                                onChangeText={(codigo) => {
                                    var commodity=this.state.commodity;
                                    this.setState({commodity:Object.assign(this.state.commodity,{codigo:codigo})});
                                }}
                                value={this.state.commodity.codigo}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text >商品名称:</Text>
                        </View>
                        <View style={{flex:5,padding:5}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(nombre) => {
                                    var commodity=this.state.commodity;
                                    this.setState({commodity:Object.assign(this.state.commodity,{nombre:nombre})});
                                }}
                                value={this.state.commodity.nombre}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text >商品含量:</Text>
                        </View>
                        <View style={{flex:5,padding:5}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(sizeValue) => {
                                    var commodity=this.state.commodity;
                                    this.setState({commodity:Object.assign(this.state.commodity,{sizeValue:sizeValue})});
                                }}
                                value={this.state.commodity.sizeValue}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    <View style={{flexDirection: 'row', justifyContent: 'center',marginTop:10}}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#11c1f3',
                                    borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center',padding:8,borderRadius:4}}
                                          onPress={
                                            ()=>{
                                                this.confirm();
                                            }}>
                            <Text style={{color:'#fff',fontSize:18}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center',marginTop:10}}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#ef473a',
                                    borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center',padding:8,borderRadius:4}}
                                          onPress={
                                            ()=>{
                                                this.cancel();
                                            }}>
                            <Text style={{color:'#fff',fontSize:18}}>取消</Text>
                        </TouchableOpacity>
                    </View>


                </View>

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
        merchantId:state.user.supnuevoMerchantId
    })
)(GoodUpdate);

