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


class GoodsInGroup extends Component{

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

        var chebx=null;
        if(rowData.checked==true)
        {
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var groupInfoArray=_.cloneDeep(this.state.groupInfoArray);
                      groupInfoArray.map(function(good,i) {
                        if(good.commodityId==rowData.commodityId){
                            good.checked=false;
                            console.log(good.commodity+"*****1********"+rowData.commodity);
                        }

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
                        if(good.commodityId==rowData.commodityId){
                            good.checked=true;
                            console.log(good.commodity+"*****2********"+rowData.commodity);
                        }


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

    commodityGroupRemove(groupInfoArray){

        var commodityIds=[];
        var sessionId=this.props.sessionId;
        groupInfoArray.map(function(good,i) {
            if(good.checked==true)
                commodityIds.push(good.commodityId)
        });

        const {groupInfo}=this.state;
        if(groupInfo&&groupInfo.groupId!==undefined&&groupInfo.groupId!==null)
        {
            this.setState({wait:true,bgColor:"#D4D4D4"});
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
                this.setState({wait:false,bgColor:"#3536ff"});
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
            wait:false,
            bgColor:"#3536ff",
            merchantId:props.merchantId,
            query:{},
            groupInfo:props.groupInfo,
            groupInfoArray:props.groupInfo.array,
            selectAll:false,
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
        var groupInfoArray = this.state.groupInfoArray;
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
                                    {groupInfo.groupNum}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/*商品组名*/}
                    <View style={[styles.row,{borderBottomWidth:0}]}>

                        <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#222'}}>商品组名:</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{color:'#222'}}>
                                    {groupInfo.groupName}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={{borderBottomWidth:0,flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',marginLeft:5,padding:4}}
                                      disabled={this.state.wait}
                                      onPress={()=>{
                                    this.commodityGroupRemove(this.state.groupInfoArray);
                                }}>
                        <View style={{backgroundColor:this.state.bgColor,padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                            <Text style={{color:'#fff',fontSize:14}}>从组中移除</Text>
                        </View>

                    </TouchableOpacity>


                </View>
            </View>
        );

        if(groupInfo&&groupInfoArray!==undefined&&groupInfoArray!==null&&Object.prototype.toString.call(groupInfoArray)=='[object Array]')
        {
            var data=groupInfoArray;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=(
                <View style={{padding:10}}>
                    <View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                            <View style={{flex:10,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,padding:8}}>
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

                        <TouchableOpacity style={{flex:1,paddingTop:10,paddingBottom:5,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'center'}}
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
)(GoodsInGroup);

