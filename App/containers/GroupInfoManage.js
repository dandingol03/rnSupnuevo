/**
 * Created by danding on 17/1/15.
 */
/**
 * Created by danding on 17/1/15.
 */
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


class GroupInfoManage extends Component{

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
                        if(good.codigo==rowData.codigo)
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
                       if(good.codigo==rowData.codigo)
                            good.checked=false;
                      });
                       this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});

                }}
                isChecked={rowData.codigo==this.state.code.codigo?true:false}
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


    addCommodity(){

        const {groupInfo}=this.props;
        const {code}=this.props;

        Proxy.post({
            url:Config.server+"supnuevo/supnuevoAddSupnuevoCommodityIntoGroupMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "commodityId=" + code.commodityId + "&groupId=" + groupInfo.groupId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.setState({query:query});
            }else{
               //TODO:
            }
        }, (err) =>{
            alert(err);
            this.setState({query:query});
        });

    }

    onCodigoSelect(codigo)
    {


        const {merchantId}=this.props;
        var query=this.state.query;
        query.codeNum=codigo;


        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetSupnuevoCommonCommodityGroupListByCodigoGroupNumMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + codigo + "&supnuevoMerchantId=" + merchantId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.setState({query:query});
            }else{
                var groupInfo=json;
                if(json.groupNum!==undefined&&json.groupNum!==null)
                {
                    //同个组的所有商品管理
                    groupInfo.array.map(function (commodity,i) {

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
                    this.navigateToGroupInfoManage(groupInfo,codigo);
                }else{
                    //多个组的信息
                    this.setState({groupInfo: groupInfo,query:query});
                }
            }
        }, (err) =>{
            alert(err);
            this.setState({query:query});
        });


    }


    queryGoodsCode(codeNum)
    {
        var code = parseInt(codeNum);
        const { merchantId } = this.props;
        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetSupnuevoCommonCommodityListByLastFourCodigoMobile.do',
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
            merchantId:props.merchantId,
            groupInfo:props.groupInfo,
            code:props.code,
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
        const {code}=this.props;
        var codigo=code.codigo;

        var listView=null;
        if(groupInfo.array!==undefined&&groupInfo.array!==null&&Object.prototype.toString.call(groupInfo.array)=='[object Array]')
        {

            var data=groupInfo.array;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{}


        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding: 8,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <TouchableOpacity style={{flex:1}}
                              onPress={()=>{
                                    this.goBack();
                              }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize:22,flex:3,textAlign:'center',color:'#fff'}}>
                            商品管理
                        </Text>
                        <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}
                        >
                        </TouchableOpacity>
                    </View>

                    {/*搜索框*/}
                    <View style={[styles.card,{marginTop:10,padding:8}]}>
                        <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                            {/* 条码 */}
                            <View style={[styles.row,{borderBottomWidth:0,marginBottom:8}]}>
                                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>条码</Text>
                                </View>
                                <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
                                    <Text style={{color:'#222'}}>
                                        {codigo} &nbsp;&nbsp;&nbsp;
                                    </Text>

                                </View>
                                <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',padding:4,borderRadius:8,
                                paddingLeft:18,paddingRight:18,paddingTop:4,paddingBottom:4,justifyContent:'center',backgroundColor:'rgb(79,204,0)'}}
                                                  onPress={()=>{
                                                    this.addCommodity();
                                                  }}>
                                    <Text style={{fontSize:16,color:'#fff',fontWeight:'bold'}}>添加</Text>
                                </TouchableOpacity>
                            </View>

                            {/*组特征码*/}
                            <View style={[styles.row,{borderBottomWidth:0,marginBottom:8}]}>
                                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>组特征码</Text>
                                </View>
                                <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>
                                        {groupInfo.groupNum}
                                    </Text>
                                </View>
                            </View>

                            {/*商品组名*/}
                            <View style={[styles.row,{borderBottomWidth:0}]}>
                                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>商品组名</Text>
                                </View>
                                <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>
                                        {groupInfo.groupName}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={{padding:10}}>
                        <View>
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
                        </View>


                        {listView}
                    </View>

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
    }
});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId
    })
)(GroupInfoManage);

