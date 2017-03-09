/**
 * Created by dingyiming on 2017/3/7.
 */
import React,{Component} from 'react';

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

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import MultiPrices from './MultiPrices'


class PriceSurvey extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigateMultiPrices(o,count){
        const { navigator } = this.props;

        if(navigator) {
            navigator.push({
                name: 'multiPrices',
                component: MultiPrices,
                params: {
                    surveyDetail:o,
                    priceCount:count,
                }
            })
        }
    }

    onCodigoSelect(code,count)
    {
        const merchantId=this.props.merchantId;
        var codigo=code;

        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetAreaGroupPriceByCommodityIdMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "commodityId=" + codigo + "&merchantId=" + merchantId
        },(json)=> {
            var o = json;
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{

                this.navigateMultiPrices(o,count);

            }

;
        }, (err) =>{
            alert(err);
            this.setState({codigo:codigo});
        });
    }

    queryGoodsCode(codeNum){
        var code = parseInt(codeNum);
        const { merchantId } = this.props;

        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetGroupCommodityCodigoListByLastCodigoMobile.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + code + "&merchantId=" + merchantId
        },(json)=> {
            var o = json;
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                if(json.array!==undefined&&json.array!==null&&json.array.length>0)
                {
                    var codes=json.array;
                    this.setState({codes:codes});
                }
                else{
                    this.navigateMultiPrices(o);
                }
            }
        }, (err) =>{
            alert(err);
        });
    }

    renderRow(rowData){

        var colorText = null;
        switch(rowData.count){
            case 0:
                colorText=<Text style={{fontSize:20,color:'#fff'}}>{rowData.codigo}</Text>;
                break;
            case 1:
                colorText=<Text style={{fontSize:20,color:'#32b968'}}>{rowData.codigo}</Text>;
                break;
            case 2:
                colorText=<Text style={{fontSize:20,color:'#fd871a'}}>{rowData.codigo}</Text>;
                break;
            case 3:
                colorText=<Text style={{fontSize:20,color:'#ec0909'}}>{rowData.codigo}</Text>;
                break;
            default:
                break;
        }

        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        this.onCodigoSelect(rowData.commodityId,rowData.count);
                    }.bind(this)}>

                    <View style={{flex:1,flexDirection:'row',padding:13,borderBottomWidth:1,borderColor:'#ddd',
                    justifyContent:'flex-start',backgroundColor:'#ddd'}}>
                        {colorText}
                    </View>
                </TouchableOpacity>

            </View>;

        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            codes:null,
            goods:{},
        };
    }


    render(){

        var username = this.props.username;
        var listView=null;
        const codes=this.state.codes;
        if(codes!==undefined&&codes!==null&&Object.prototype.toString.call(codes)=='[object Array]')
        {
            var data=codes;
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

        }


        return (
            <View style={{flex:1}}>

                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',padding:8,justifyContent: 'center',alignItems: 'flex-end',flexDirection:'row'},styles.card]}>

                    <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'flex-end'}}
                                      onPress={()=>{
                                              this.goBack();
                                          }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize:22,flex:3,textAlign:'center',color:'#fff'}}>
                        {username}
                    </Text>

                    <View style={{flex:1}}>

                    </View>
                </View>


                <View style={{padding:10}}>

                    {/*输入条码*/}
                    <View style={[styles.row,{borderBottomWidth:0}]}>

                            <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <TextInput
                                    style={{flex:8,height: 50,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6}}
                                    onChangeText={(codeNum) => {
                                    if(codeNum.toString().length==13)
                                    {
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                        this.queryGoodsCode(codeNum.toString());
                                    }
                                    else{
                                      this.state.goods.codeNum=codeNum;
                                      this.setState({goods:this.state.goods});

                                    }

                                }}
                                    value={this.state.goods.codeNum}
                                    placeholder='请输入条码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />

                                <TouchableOpacity style={{flex:2,height: 40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                                  onPress={()=>{

                                                       var codeNum = this.state.goods.codeNum;
                                                      if(codeNum.toString().length>=4&&codeNum.toString().length<=13){
                                                        this.queryGoodsCode(this.state.goods.codeNum.toString());
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

                            </View>
                        </View>

                    {/* 彩色横幅 */}
                    <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:12,marginBottom:5}]}>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',justifyContent:'center', marginRight:.5,
                            alignItems:'center',borderWidth:1,borderTopLeftRadius:4,borderBottomLeftRadius:4,borderColor:'#ddd'}}>

                            </View>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:'#32b968',justifyContent:'center', marginRight:.5,
                            alignItems:'center', borderWidth:1,borderRightWidth:0,borderLeftWidth:0,borderColor:'#ddd'}}>

                            </View>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:'#fd871a',justifyContent:'center',marginRight:.5,
                            alignItems:'center', borderWidth:1,borderRightWidth:0,borderLeftWidth:0,borderColor:'#ddd'}}>

                            </View>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:'#ec0909',justifyContent:'center',marginRight:.5,
                            alignItems:'center', borderWidth:1,borderTopRightRadius:4,borderBottomRightRadius:4,borderColor:'#ddd'}}>

                            </View>
                        </View>

                </View>

                {/* 商品条码列表 */}
                <View>
                    <ScrollView>
                        <View style={{flex:1}}>
                            {listView}
                        </View>

                    </ScrollView>
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
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },

});

module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username
    })
)(PriceSurvey);

