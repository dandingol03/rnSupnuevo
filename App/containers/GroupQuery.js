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
import CodesModal from '../components/modal/CodesModal';
import GroupInfoManage from './GroupInfoManage';

class GroupQuery extends Component{

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

    navigateToGroupInfoManage(groupInfo,code){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupInfoManage',
                component: GroupInfoManage,
                params: {
                    groupInfo:groupInfo,
                    code:code
                }
            })
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



        var row=
            <View>
                <TouchableOpacity
                   onPress={()=>{
                    this.queryCommodityListByGroupId(rowData.groupId);
                   }}>
                    <View style={lineStyle}>

                        <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.groupId}</Text>
                        </View>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.groupNum}</Text>
                        </View>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.groupName}</Text>
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

    closeCodesModal(val){
        this.setState({codesModalVisible:val});
    }

    queryCommodityListByGroupId(groupId)
    {

        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetSupnuevoCommonCommodityListOfGroupMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'groupId='+groupId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.state.query.codeNum=null;
                this.setState({query:this.state.query});
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
                    this.navigateToGroupInfoManage(groupInfo,code);
                }else{
                    //多个组的信息
                    this.setState({groupInfo: groupInfo,query:query,code:code});
                }
            }
        }, (err) =>{
            alert(err);
            this.setState({query:query});
        });
    }

    onCodigoSelect(code,groupNum)
    {


        const {merchantId}=this.props;
        var query=this.state.query;
        var codigo=code.codigo;
        query.codeNum=codigo;

        var body='';
        if(groupNum!==undefined&&groupNum!==null)
            body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;
        else
            body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;

        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetSupnuevoCommonCommodityGroupListByCodigoGroupNumMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.state.query.codeNum=null;
                this.setState({query:this.state.query});
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
                    this.navigateToGroupInfoManage(groupInfo,code);
                }else{
                    //多个组的信息
                    this.setState({groupInfo: groupInfo,query:query,code:code});
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
            query:{},
            groupInfo:{},
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
            })
        };
    }


    render(){

        var groupInfo=this.state.groupInfo;

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
                            商品组管理
                        </Text>
                        <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}
                                          >
                        </TouchableOpacity>
                    </View>

                    {/*搜索框*/}
                    <View style={[styles.card,{marginTop:10,padding:8}]}>
                        <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                            {/* 条码 */}
                            <View style={[styles.row,{borderBottomWidth:0}]}>
                                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                                    <Text style={{color:'#222'}}>条码</Text>
                                </View>
                                <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                                    <TextInput
                                        style={{height:40,width:width*2/4,backgroundColor:'#fff',paddingLeft:15,borderRadius:4,
                                                flexDirection:'row',alignItems:'center'}}
                                        onChangeText={(codeNum) => {
                                            if(codeNum.toString().length==4)
                                            {
                                                this.state.query.codeNum=codeNum;
                                                this.setState({query:this.state.query});
                                                this.queryGoodsCode(codeNum.toString().substring(0,4));
                                            }else if(codeNum.toString().length>4){
                                                this.state.query.codeNum=codeNum;
                                                this.setState({query:this.state.query});
                                            }
                                            else{
                                                this.state.query.codeNum=codeNum;
                                                this.setState({query:this.state.query});
                                            }
                                        }}
                                        value={this.state.query.codeNum}
                                        placeholder='请输入条码最后四位'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={{padding:10}}>
                        <View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                                <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                    <Text style={{color:'#222'}}>
                                        商品组id
                                    </Text>
                                </View>

                                <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                    <Text style={{color:'#222'}}>组特征码</Text>
                                </View>

                                <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                    borderColor:'#aaa',borderWidth:1,padding:8}}>
                                    <Text style={{color:'#222'}}>商品组名</Text>
                                </View>
                            </View>
                        </View>


                        {listView}
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
)(GroupQuery);

