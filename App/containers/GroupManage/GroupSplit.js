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
import CodesModal from '../../components/modal/CodesModal';
import GroupInfoManage from '../GroupInfoManage';
import Modalbox from 'react-native-modalbox';

class GroupSplit extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    splitCb()
    {
        if(this.props.splitCb)
            this.props.splitCb();
    }


    navigateToGroupInfoManage(groupInfo,code,containedInGroup){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupInfoManage',
                component: GroupInfoManage,
                params: {
                    groupInfo:groupInfo,
                    code:code,
                    containedInGroup:containedInGroup
                }
            })
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

        var row=
            <View>
                <View>
                    <View style={lineStyle}>

                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.codigo}</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>{rowData.goodName}</Text>
                        </View>



                        {/*<TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}*/}
                        {/*onPress={()=>{*/}
                        {/*console.log('...');*/}
                        {/*}}>*/}
                        {/*<Icon name='remove' color="#ef473a" size={30}></Icon>*/}
                        {/*</TouchableOpacity>*/}

                    </View>
                </View>

            </View>;

        return row;
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
            chebx=  <CheckBox
                style={{flex: 1, padding: 2,flexDirection:'row',justifyContent:'center'}}
                onClick={()=>{

                    var productArr=_.cloneDeep(this.state.productArr);
                    productArr.map(function(commodity,i) {
                    if(commodity.commodityId==rowData.commodityId)
                        commodity.checked=false;
                    });
                   this.setState({productArr: productArr,dataSource:this.state.dataSource.cloneWithRows(productArr)});
                                }}
                isChecked={true}
                leftText={null}
            />;
        }else{
            chebx=  <CheckBox
                style={{flex: 1, padding: 2,flexDirection:'row',justifyContent:'center'}}
                onClick={()=>{
                    var productArr=_.cloneDeep(this.state.productArr);
                    productArr.map(function(product,i) {
                    if(product.commodityId==rowData.commodityId)
                        product.checked=true;
                    });
                   this.setState({productArr: productArr,dataSource:this.state.dataSource.cloneWithRows(productArr)});
                                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row=
            <View>
                <View>
                    <View style={lineStyle}>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            {chebx}
                        </View>

                        <View style={{flex:6,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#111',fontSize:17,fontWeight:'bold'}}>{rowData.codigo+'\n'+rowData.goodName}</Text>
                        </View>

                    </View>
                </View>

            </View>;

        return row;
    }

    closeCodesModal(val){
        this.setState({codesModalVisible:val});
    }

    closeGroupAppendModal(val)
    {
        this.setState({groupAppendModalVisible:val});
    }

    queryCommodityListByGroupId(groupId,groupNum,groupName,code)
    {

        const groupInfo=this.state.groupInfo;

        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityListOfGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: 'groupId='+groupId
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
                    this.navigateToGroupInfoManage(info,code,false);
                }else{}
            }
        }).catch((err) =>{
            alert(err);
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
           // body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;
            body={
                groupNum:groupNum,
                supnuevoMerchantId:merchantId
            }
        else
            //body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;
            body={
                codigo:codigo,
                supnuevoMerchantId:merchantId
            }
        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityGroupListByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
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
                    //this.navigateToGroupInfoManage(groupInfo,code,true);
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


    //按商品组特征码搜索
    queryGroupsByGroupNum(groupNum)
    {

        const { merchantId } = this.props;
        proxy.postes({
            url:Config.server+'/func/commodity/getSupnuevoCommonCommodityGroupListByGroupNumMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: "groupNum=" + groupNum
            body:{
                groupNum:groupNum
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var groups=json;
                groups.array.map(function (group,i) {
                    group.checked=false;
                })
                this.setState({groups: groups});
            }
        }).catch((err) =>{
            alert(err);
        });
    }

    commodityGroupRemove(commodityId){

        var commodityIds=[commodityId];
        const {code}=this.state;
        const {groupInfo}=this.state;
        if(groupInfo&&groupInfo.groupId!==undefined&&groupInfo.groupId!==null)
        {
            proxy.postes({
                url:Config.server+"/func/commodity/removeSupnuevoCommodityFromGroupMobile",
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json'
                },
               // body: "commodityIds=" + commodityIds.toString() + "&groupId=" + groupInfo.groupId
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
                    if(json.groupNum!==undefined&&json.groupNum!==null)
                    {
                        Alert.alert(
                            '信息',
                            '商品删除成功',
                            [
                                {text: 'OK', onPress: () => {
                                    this.onCodigoSelect(code);
                                }},
                            ]
                        );
                    }
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


    //添加商品到已有组
    commodityAddToGroup(groupId)
    {

        const {merchantId}=this.props;

        var code=this.state.code;
        if(code&&code.codigo)
        {

            proxy.postes({
                url:Config.server+"/func/commodity/addSupnuevoCommodityIntoGroupMobile",
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json'
                },
                //body: "commodityId=" + code.commodityId + "&groupId=" + groupId+'&supnuevoMerchantId='+merchantId
                body:{
                    commodityId:code.commodityId,
                    groupId:groupId,
                    supnuevoMerchantId:merchantId
                }
            }).then((json)=> {
                var errorMsg=json.errorMsg;
                if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                    alert(errorMsg);
                }else{
                    //TODO:return to previous page
                    if(json.groupNum!==undefined&&json.groupNum!==null)
                    {
                        Alert.alert(
                            '信息',
                            '添加到商品组成功',
                            [
                                {text: 'OK', onPress: () =>  {
                                    this.onCodigoSelect(code);
                                }},
                            ]
                        );
                    }
                }
            }).catch((err) =>{
                alert(err);

            });
        }else{
            Alert.alert(
                '错误',
                '请先输入条码',
                [
                    {text: 'OK',onPress: () =>  this.refs.modal3.close()}
                ]
            );
        }

    }

    //合并成为新组
    splitToNewGroup()
    {

        const {merchantId}=this.props;
        const {groupInfo}=this.props;
        var groupId=groupInfo.groupId;
        var groupName=this.state.query.groupName;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {


            if(this.state.productArr&&this.state.productArr!==undefined&&this.state.productArr!==null
                &&Object.prototype.toString.call(this.state.productArr)=='[object Array]')
            {

                var commodityIds=[];
                this.state.productArr.map(function (commodity, i) {
                    if(commodity.checked==true)
                    {
                        commodityIds.push(commodity.commodityId);
                    }
                });

                if(commodityIds.length>=1)
                {

                    proxy.postes({
                        url:Config.server+"/func/commodity/breakSupnuevoCommodityGroupMobile",
                        headers: {
                            //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                            'Content-Type': 'application/json'
                        },
                        //body: "commodityIds=" + commodityIds.toString() + "&groupName=" + groupName+'&groupId='+groupId+'&supnuevoMerchantId='+merchantId
                        body:{
                            commodityIds:commodityIds.toString(),
                            groupName:groupName,
                            groupId:groupId,
                            supnuevoMerchantId:merchantId
                        }
                    }).then((json)=> {
                        var errorMsg=json.errorMsg;
                        if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                            alert(errorMsg);
                        }else{
                            //TODO:return to previous page

                            Alert.alert(
                                '信息',
                                '拆分新组成功',
                                [
                                    {text: 'OK', onPress: () =>  {
                                            this.splitCb();
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
                        '请先勾选商品组再点击合并',
                        [
                            {text: 'OK',onPress: () =>  console.log('...')}
                        ]
                    );
                }
            }else{
                Alert.alert(
                    '错误',
                    '您所选的组名无效',
                    [
                        {text: 'OK',onPress: () =>  console.log('...')}
                    ]
                );
            }
        }else{
            Alert.alert(
                '错误',
                '请先输入合并后的组名再点击合并',
                [
                    {text: 'OK',onPress: () =>  console.log('...')}
                ]
            );
        }

    }


    fetchCommodityListByGroupId()
    {
        var {groupInfo}=this.props;
        var groupId=groupInfo.groupId;
        const {merchantId}=this.props;

        proxy.postes({
            url:Config.server+'/func/commodity/getSupnuevoCommonCommodityListOfGroupMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body: "&groupId=" + groupId+'&supnuevoMerchantId='+merchantId
            body:{
                groupId:groupId,
                supnuevoMerchantId:merchantId
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                if(json.array!==undefined&&json.array!==null&&Object.prototype.toString.call(json.array)=='[object Array]')
                {

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

                    var productArr=json.array;
                    this.setState({productArr:productArr,dataSource:this.state.dataSource.cloneWithRows(productArr)});

                }else{
                    Alert.alert(
                        '信息',
                        '商品组列表为空',
                        [
                            {text: 'OK'}
                        ]
                    );
                }
            }
        }).catch((err) =>{
            alert(err);
        });

    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groupInfo:props.groupInfo,
            productArr:null,
            splitCb:props.splitCb,
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
        var groupInfo=this.state.groupInfo;
        var listView=null;
        var productArr=this.state.productArr;

        //拉取商品组列表
        if(productArr==undefined||productArr==null)
        {
            this.fetchCommodityListByGroupId();
        }

        var queryBox=   (<View style={[styles.card,{marginTop:10,padding:8}]}>
            <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                {/*组添加*/}
                <View style={[styles.row,{borderBottomWidth:0}]}>

                    <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                        <TextInput
                            style={{flex:8,height:40,backgroundColor:'#fff',paddingLeft:10,paddingRight:10,borderRadius:4,
                                                flexDirection:'row',alignItems:'center',fontSize:13}}
                                onChangeText={(groupName) => {
                                            if(groupName.toString().length==4)
                                            {
                                                this.state.query.groupName=groupName;
                                                this.setState({query:this.state.query});
                                            }else if(groupName.toString().length>4){
                                                this.state.query.groupName=groupName;
                                                this.setState({query:this.state.query});
                                            }
                                            else{
                                                this.state.query.groupName=groupName;
                                                this.setState({query:this.state.query});
                                            }
                                        }}
                            value={this.state.query.groupName}
                            placeholder='在此输入拆分的商品组名'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5}}
                                      onPress={()=>{
                                          this.splitToNewGroup();
                                                  }}>
                        <View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                            <Text style={{color:'#fff',fontSize:14}}>拆分到新组</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/*商品组名*/}
                <View style={[styles.row,{borderBottomWidth:0}]}>
                    <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:0}}>
                        <Text style={{color:'#222'}}>商品组名</Text>
                    </View>
                    <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:7}}>
                        <Text style={{color:'#222'}}>
                            {groupInfo.groupName}
                        </Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',padding:4,borderRadius:8,height:30,
                                              paddingLeft:12,paddingRight:12,paddingTop:0,paddingBottom:0,justifyContent:'center'}}>
                    </View>
                </View>

            </View>
        </View>);


        if(productArr!==undefined&&productArr!==null&&Object.prototype.toString.call(productArr)=='[object Array]')
        {

            var data=productArr;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


            listView=(
                <View style={{padding:10}}>
                    <View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>

                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                <Text style={{color:'#222'}}>
                                    选中
                                </Text>
                            </View>

                            <View style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,padding:8}}>
                                <Text style={{color:'#222'}}>商品信息</Text>
                            </View>

                        </View>
                    </View>

                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(data)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>
                </View>);



        }else{}


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
                            商品组维护
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
        merchantId:state.user.supnuevoMerchantId
    })
)(GroupSplit);

