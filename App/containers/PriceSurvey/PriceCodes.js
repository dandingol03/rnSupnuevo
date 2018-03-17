/**
 * Created by dingyiming on 2017/3/10.
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
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import MultiPrices from './MultiPrices';


class PriceCodes extends Component{

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
                    goBack:this.goBack.bind(this),
                }
            })
        }
    }

    onCodigoSelect(code,count)
    {
        const merchantId=this.props.merchantId;
        var commodityId=code.commodityId;
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/getAreaGroupPriceByCommodityIdMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
           // body: "commodityId=" + commodityId + "&merchantId=" + merchantId
            body:{
                commodityId:commodityId,
                merchantId:merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                this.navigateMultiPrices(o,count);
            }

        }).catch((err) =>{
            alert(err);
            this.setState({codigo:codigo});
        });
    }

    renderRow(rowData){
        var count = this.props.count;
        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        this.onCodigoSelect(rowData,count);
                    }.bind(this)}>

                    <View style={{flex:1,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                        <Text style={{flex:1,fontSize:15,color:'#343434'}}>{rowData.codigo}</Text>
                        <Text style={{flex:2,fontSize:15,color:'#343434',marginLeft:20}}>{rowData.nombre}</Text>
                    </View>

                </TouchableOpacity>

            </View>;

        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {

        };
    }


    render(){

        var username = this.props.username;
        var listView=null;
        const codes=this.props.codes;
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
                </ScrollView>
        }else{

            this.fetchData();
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

                {/* 商品条码列表 */}
                <View>
                    <ScrollView>
                        <View style={{height:40,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',borderWidth:1,
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                            <Text style={{flex:2,fontSize:15,color:'#343434'}}>编号</Text>
                            <Text style={{flex:3,fontSize:15,color:'#343434'}}>名称</Text>
                        </View>
                        <View style={{flex:1}}>
                            {listView}
                        </View>
                    </ScrollView>
                </View>

            </View>)
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
        username:state.user.username,
    sessionId:state.user.sessionId,
    })
)(PriceCodes);

