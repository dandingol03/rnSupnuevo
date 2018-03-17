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


class GroupQueryInGroup extends Component{

    goBack(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.pop();
            if(this.props.reset)
                this.props.reset();
        }

    }

    renderCommodityRow(rowData,sectionId,rowId)
    {
        var lineStyle=null;
        if(parseInt(rowId)%2==0)
        {
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#C4D9FF'};
        }else{
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#fff'}
        }

        if(rowData.codigo==this.state.code.codigo)
            lineStyle=Object.assign(lineStyle,{borderColor:'#284bff',borderWidth:2,borderBottomWidth:2,borderLeftWidth:2,borderRightWidth:2});

        var chebx=null;
        if(rowData.checked==true)
        {
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var groupInfoArray=_.cloneDeep(this.state.groupInfoArray);
                      groupInfoArray.map(function(good,i) {
                        if(good.commodity==rowData.commodity)
                            good.checked=false;
                      });
                       this.setState({groupInfoArray: groupInfoArray,dataSource:this.state.dataSource.cloneWithRows(groupInfoArray)});
                }}
                isChecked={true}
                leftText={null}
            />;
        }else{
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var groupInfoArray=_.cloneDeep(this.state.groupInfoArray);
                      groupInfoArray.map(function(good,i) {
                        if(good.commodity==rowData.commodity)
                            good.checked=true;
                      });
                       this.setState({groupInfoArray: groupInfoArray,dataSource:this.state.dataSource.cloneWithRows(groupInfoArray)});

                }}
                isChecked={false}
                leftText={null}
            />;
        }

        var row=
            <View>
                <View>
                    <View style={lineStyle}>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            {chebx}
                        </View>

                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#000',fontWeight:'bold',fontSize:17}}>{rowData.codigo+'\n'+rowData.goodName}</Text>
                        </View>
                    </View>
                </View>

            </View>;

        return row;
    }

    onCodigoSelect(code,groupNum)
    {
        const {merchantId}=this.props;
        var query=this.state.query;
        var codigo=code.codigo;
        query.codeNum=codigo;
        var sessionId=this.props.sessionId;
        var body='';
        if(groupNum!==undefined&&groupNum!==null)
            //body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;
            body={
                groupNum:groupNum,
                supnuevoMerchantId:merchantId
            }
        else
           // body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;
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
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.state.query.codeNum=null;
                this.setState({query:this.state.query});
            }else{
                var data=json;
                if(json.groupNum!==undefined&&json.groupNum!==null)
                {
                    //单个组

                    json.array.map(function (commodity,i) {

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
                    this.setState({groupInfo:json,query:query,code:code});

                }else{
                    //多个组的信息
                    this.setState({groupArr: data,query:query,code:code});
                }
            }
        }).catch((err) =>{
            alert(err);
            this.setState({query:query});
        });

    }


    commodityGroupRemove(groupInfoArray){

        var commodityIds=[];
        groupInfoArray.map(function(good,i) {
            if(good.checked==true)
                commodityIds.push(good.commodityId)
        });
        var sessionId=this.props.sessionId;
        const {groupInfo}=this.state;
        if(groupInfo&&groupInfo.groupId!==undefined&&groupInfo.groupId!==null)
        {
            proxy.postes({
                url:Config.server+"/func/commodity/removeSupnuevoCommodityFromGroupMobile",
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId,
                },
                //body: "commodityIds=" + commodityIds.toString() + "&groupId=" + groupInfo.groupId
                body:{
                    commodityIds:commodityIds.toString(),
                    groupId:groupInfo.groupId
                }
            }).then((json)=> {
                var errorMsg=json.errorMsg;
                if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                    alert(errorMsg);
                }else{
                    //TODO:return to previous page

                    Alert.alert(
                        '信息',
                        '商品删除成功',
                        [
                            {text: 'OK', onPress: () => {
                                var code={};
                                this.setState({groupInfo:{},code:code});
                                this.goBack();
                            }},
                        ]
                    );

                }
            }).catch((err) =>{
                alert(err);

            });
        }else{
            Alert.alert(
                '错误',
                '商品组信息缺失',
                [
                    {text: 'OK', onPress: () => console.log('...')},
                ]
            );
        }

    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groupInfo:props.groupInfo,
            selectAll:false,
            codesModalVisible:false,
            groupAppendModalVisible:false,
            code:props.code,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            })
        };
    }


    render(){

        var groupInfo=this.state.groupInfo;
        var listView=null;
        var code=this.state.code;
        var queryBox=(
            <View style={[styles.card,{marginTop:10,padding:8}]}>
                <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                    {/* 条码 */}
                    <View style={[styles.row,{borderBottomWidth:0}]}>
                        <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                            <View style={{flex:2}}>
                                <Text style={{color:'#222'}}>条码</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{color:'#222'}}>{code.codigo}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5,padding:4}}
                                          onPress={()=>{
                                    this.commodityGroupRemove(this.state.code.commodityId);
                                }}>
                            <View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                                <Text style={{color:'#fff',fontSize:14}}>移除</Text>
                            </View>
                        </TouchableOpacity>

                    </View>


                    {/*组特征码*/}
                    <View style={[styles.row,{borderBottomWidth:0,marginBottom:8}]}>
                        <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                            <View style={{flex:2}}>
                                <Text style={{color:'#222'}}>组特征码</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{color:'#222'}}>
                                    {groupInfo.groupNum}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex:3,flexDirection:'row',alignItems:'center',marginLeft:5,padding:4}}>
                        </View>
                    </View>

                    {/*商品组名*/}
                    <View style={[styles.row,{borderBottomWidth:0}]}>

                        <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                            <View style={{flex:2}}>
                                <Text style={{color:'#222'}}>商品组名</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{color:'#222'}}>
                                    {groupInfo.groupName}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex:3,flexDirection:'row',alignItems:'center',marginLeft:5,padding:4}}>
                        </View>

                    </View>

                </View>
            </View>
        );

        if(groupInfo&&groupInfo.array!==undefined&&groupInfo.array!==null&&Object.prototype.toString.call(groupInfo.array)=='[object Array]')
        {
            var data=groupInfo.array;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=(
                <View style={{padding:10}}>
                    <View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                            <View style={{flex:10,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                <Text style={{color:'#222'}}>
                                    商品信息
                                </Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(data)}
                            renderRow={this.renderCommodityRow.bind(this)}
                        />
                    </ScrollView>
                </View>
            );

        }
        else{}


        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding:8,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>

                        <TouchableOpacity style={{flex:1,paddingTop:20,paddingBottom:5,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'center'}}
                                          onPress={()=>{
                                              this.goBack();
                                          }}>
                            <Icon name="angle-left" color="#fff" size={35}></Icon>
                        </TouchableOpacity>

                        <Text style={{fontSize:17,flex:3,paddingTop:10,textAlign:'center',color:'#fff'}}>
                            组商品信息
                        </Text>

                        <View style={{flex:1}}>

                        </View>
                    </View>

                    {queryBox}

                    {listView}

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
    }
});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
    sessionId:state.user.sessionId,
    })
)(GroupQueryInGroup);

