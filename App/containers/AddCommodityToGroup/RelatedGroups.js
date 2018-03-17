/**
 * Created by dingyiming on 2017/3/18.
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
import CheckBox from 'react-native-check-box';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import _ from 'lodash';
import GoodsInGroup from './GoodsInGroup';


class RelatedGroups extends Component{

    goBack(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.pop();
            if(this.props.reset)
                this.props.reset();
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
                    //reset:this.reset.bind(this)
                }
            })
        }
    }

    //同个组的所有商品信息
    queryCommodityListByGroupId(groupId,groupNum,groupName,code)
    {
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityListOfGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
           // body: 'groupId='+groupId
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

                        commodity.checked = true;
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
                    this.redirect2goodsInGroup(info,false);
                }else{}
            }
        }).catch((err) =>{
            alert(err);
        });
    }




    renderGroupRow(rowData,sectionId,rowId)
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

        if(rowData.groupId==this.props.groupId)
            lineStyle=Object.assign(lineStyle,{borderColor:'#284bff',borderWidth:2,borderBottomWidth:2,borderLeftWidth:2,borderRightWidth:2});

        var row=
            <View>
                <View>
                    <View style={lineStyle}>

                        <TouchableOpacity style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}
                                          onPress={ function() {
                                this.queryCommodityListByGroupId(rowData.groupId,rowData.groupNum,rowData.groupName)
                        }.bind(this)}>
                            <Text style={{color:'#000',fontWeight:'bold',fontSize:17}}>{rowData.groupNum+'\n'+rowData.groupName}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>;

        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            groups:props.groups,
            groupId:props.groupId,
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

        var groups=this.state.groups;
        var groupNum=this.props.groupNum;
        var groupName=this.props.groupName;

        var listView=null;
        var queryBox=(
            <View style={[styles.card,{marginTop:10,padding:8}]}>
                <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>
                    {/*组特征码*/}
                    <View style={[styles.row,{borderBottomWidth:0,marginBottom:8}]}>
                        <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#222'}}>组特征码:</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{color:'#222'}}>
                                    {groupNum}
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        );

        if(groups!==undefined&&groups!==null&&Object.prototype.toString.call(groups)=='[object Array]')
        {
            var data=groups;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=(
                <View style={{padding:10}}>
                    <View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                            <View style={{flex:10,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                <Text style={{color:'#222'}}>
                                    组信息
                                </Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(data)}
                            renderRow={this.renderGroupRow.bind(this)}
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
                            商品组信息
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
    sessionId:state.user.sessionId
    })
)(RelatedGroups);

