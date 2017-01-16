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
var Proxy = require('../proxy/Proxy');
import Config from '../../config';
import _ from 'lodash';


class Group extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    toggleAll(){
        if(this.state.relatedGoods!==undefined&&this.state.relatedGoods!==null)
        {
            var relatedGoods=_.cloneDeep(this.state.relatedGoods);
            if(this.state.selectAll!=true)
            {
                relatedGoods.map(function (good, i){
                    good.checked=true;
                });
            }else{
                relatedGoods.map(function (good, i){
                    good.checked=false;
                });
            }
            var dataSource = this.state.dataSource.cloneWithRows(relatedGoods);
            this.setState({
                relatedGoods: relatedGoods,
                selectAll:!this.state.selectAll,
                dataSource:dataSource
            });
        }
    }

    getCommoditiesByPriceId(priceId){

        var merchantId=this.props.merchantId;
        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetSupnuevoBuyerCommodityPriceFormListOfGroupMobile.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "priceId=" + priceId + "&merchantId=" + merchantId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                var relatedGoods=json.array;
                relatedGoods.map(function(good,i) {
                    if (good.priceId == priceId) {
                        good.checked = true;
                    }else{
                        good.checked=false;
                    }
                    if(good.sizeValue!=undefined&&good.sizeValue!=null
                        &&good.sizeUnit!=undefined&&good.sizeUnit!=null)
                    {
                        good.goodName=good.nombre+','+
                            good.sizeValue+','+good.sizeUnit;
                    }else{
                        good.goodName=good.nombre;
                    }
                });

                //TDOO:set state relatedGoods
                this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});
            }
        }, (err) =>{
            alert(err);
        });



    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;
        if(parseInt(rowId)%2==0)
        {
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#C4D9FF'};
        }else{
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#fff'}
        }

        var chebx=null;
        if(rowData.checked==true)
        {
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var relatedGoods=_.cloneDeep(this.state.relatedGoods);
                      relatedGoods.map(function(good,i) {
                        if(good.priceId==rowData.priceId)
                            good.checked=false;
                      });
                       this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});
                }}
                isChecked={true}
                leftText={null}
            />;
        }else{
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var relatedGoods=_.cloneDeep(this.state.relatedGoods);
                      relatedGoods.map(function(good,i) {
                        if(good.priceId==rowData.priceId)
                            good.checked=true;
                      });
                       this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});

                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        //TODO:
                    }.bind(this)}>
                    <View style={lineStyle}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            {chebx}
                        </View>

                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.codigo}</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.goodName}</Text>
                        </View>

                    </View>
                </TouchableOpacity>

            </View>;

        return row;
    }

    changePriceRelated()
    {
        var selectedRelativePriceIds=[];
        var relatedGoods=this.state.relatedGoods;
        relatedGoods.map(function(good,i) {
            if(good.checked==true){
                selectedRelativePriceIds.push(good.priceId);
            }
        });
        const {goodInfo}=this.props;
        const {merchantId}=this.props;
        //TODO:make a fetch

        Proxy.post({
            url:Config.server+'supnuevo/supnuevoUpdateSupnuevoBuyerCommodityPriceGroupMobile.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "priceIds=" + selectedRelativePriceIds.toString() +
            "&merchantId=" + merchantId+
            '&priceShow='+goodInfo.priceShow+
            '&printType='+goodInfo.printType+
            '&price='+goodInfo.price
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                Alert.alert(
                    'Alert Title',
                    '组改价成功',
                    [
                        {text: 'OK', onPress: () => this.goBack()},
                    ]
                );
            }
        }, (err) =>{
            alert(err);
        });


    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            goodInfo:props.goodInfo,
            relatedGoods:null,
            selectAll:false,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                        console.log("不相等=");
                        console.log(r1);
                    } else {
                        console.log("相等=");
                        console.log(r1);
                        console.log(r2);
                    }
                    return r1 !== r2;
                }
            })
        };
    }


    render(){

        const {username} = this.props;
        const {goodInfo}=this.props;



        var relatedGoods=[];
        if(this.state.relatedGoods!==undefined&&this.state.relatedGoods!==null)
        {
            relatedGoods=this.state.relatedGoods;
        }else{
            this.getCommoditiesByPriceId(goodInfo.priceId);
        }


        var listView=null;
        if(relatedGoods.length>0) {

            listView=
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />;

        }else{
        }


        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'rgba(240,240,240,0.8)',padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <TouchableOpacity style={{flex:1}}
                                          onPress={
                                                  function() {
                                                      this.goBack();
                                                  }.bind(this)}>
                            <Icon name='chevron-left' size={24} color="#444"></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize:21,flex:3,textAlign:'center',color:'#444',fontWeight:'bold'}}>
                            {username}
                        </Text>
                        <TouchableOpacity style={{flex:1,marginRight:0,flexDirection:'row',justifyContent:'flex-end',backgroundColor:"#3b5998",
                                    alignItems:'center',paddingLeft:20,paddingRight:4,paddingTop:4,paddingBottom:4,borderRadius:6}}
                                          onPress={function() {
                                              this.changePriceRelated();
                                          }.bind(this)}>
                            <Text style={{color:'#fff',fontWeight:'bold',fontSize:17}}>改价</Text>
                            <Icon name="check" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>




                    {/*显示组改价名称*/}
                    <View style={[styles.card,{padding:8,borderWidth:0}]}>
                        <View>
                            <Text style={{color:'#222',fontSize:20}}>
                                改动的价格:  &nbsp;&nbsp;&nbsp;
                                <Text style={{fontSize:22,fontWeight:'bold'}}>
                                    {goodInfo.priceShow}
                                </Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={{color:'#222',fontSize:20}}>
                                商品组名: &nbsp;&nbsp;&nbsp;<Text style={{color:'#222',fontSize:18,fontWeight:'bold'}}>{goodInfo.groupName}</Text>
                            </Text>
                        </View>
                    </View>


                    <View style={{padding:10,paddingLeft:0,paddingRight:0}}>

                        {/*显示组内商品列表*/}
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                            <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            backgroundColor:'#90B4FF',borderBottomWidth:1,borderColor:'#aaa',padding:8}}
                                              onPress={
                                                  function() {
                                                      this.toggleAll();
                                                  }.bind(this)}>

                                <Text style={{color:'#fff',fontWeight:'bold'}}>
                                    { this.state.selectAll!=true?'全选':'全不选'}&nbsp;
                                </Text>
                                <Icon name='hand-pointer-o' size={20} color="#fff"></Icon>
                            </TouchableOpacity>


                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                <Text>条码</Text>
                            </View>

                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            borderColor:'#aaa',borderWidth:1,padding:8}}>
                                <Text>名称</Text>
                            </View>

                        </View>
                        <ScrollView>
                            {listView}
                        </ScrollView>
                        <View style={{height:50,width:width}}></View>


                    </View>
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
        borderBottomWidth: 0,
        shadowColor: '#eee',
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
)(Group);

