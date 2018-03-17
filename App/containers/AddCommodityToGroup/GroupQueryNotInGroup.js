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
import Modalbox from 'react-native-modalbox';



class GroupQueryNotInGroup extends Component{

    goBack(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.pop();
            if(this.props.reset)
                this.props.reset();
        }
    }

    reset()
    {
        this.setState({query: {},code:null});
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
                            <Text style={{color:'#000',fontWeight:'bold',fontSize:24}}>{rowData.codigo+'\n'+rowData.goodName}</Text>
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



        var row=
            <View>
                <View>
                    <View style={lineStyle}>



                        <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#222',fontWeight:'bold',fontSize:17}}>{rowData.groupName}</Text>
                        </View>

                        <TouchableOpacity style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={()=>{
                                          this.commodityAddToGroup(rowData.groupId);
                                                  }}>
                            <Text style={{color:'#222',fontWeight:'bold',fontSize:24}}>{rowData.groupName}</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>;

        return row;
    }


    closeCodesModal(val){
        this.setState({codesModalVisible:val});
    }

    //跳转匹配组界面
    redirect2groupQueryInGroup(groupInfo,code)
    {
        const { navigator } = this.props;
        if(navigator&&groupInfo&&code) {
            navigator.push({
                name: 'groupQueryInGroup',
                component: GroupQueryInGroup,
                params: {
                    groupInfo:groupInfo,
                    code:code,
                    reset:this.reset.bind(this)
                }
            })
        }
    }



    onCodigoSelect(code,groupNum)
    {


        const {merchantId}=this.props;
        var query=this.state.query;
        var codigo=code.codigo;
        query.codeNum=codigo;
        var sessionId=this.props.sessionId;
        var body='';
        if(groupNum!==undefined&&groupNum!==null){
            body={
                groupNum:groupNum,
                    supnuevoMerchantId:merchantId
            }
        }
           // body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;

        else{
            body={
                codigo:codigo,
                    supnuevoMerchantId:merchantId
            }
        }
            //body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;


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

                    //this.setState({groupInfo:json,query:query,code:code});
                    this.redirect2groupQueryInGroup(json,code);
                }else{
                    //多个组的信息
                    if(data.array.length==0)
                    {
                        Alert.alert(
                            '错误',
                            '该商品没有匹配的组信息',
                            [
                                {text: 'OK', onPress: () => {

                                }},
                            ]
                        );
                        this.setState({groupArr: data,query:query,code:code});
                    }else{
                        this.setState({groupArr: data,query:query,code:code});
                    }
                }
            }
        }).catch((err) =>{
            alert(err);
            this.setState({query:query});
        });


    }


    queryGoodsCode(codeNum)
    {
        var code = parseInt(codeNum);
        const { merchantId } = this.props;
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+'/func/commodity/getSupnuevoCommonCommodityListByLastFourCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId
            },
           // body: "codigo=" + code + "&merchantId=" + merchantId
            body:{
                codigo:code,
                merchantId:merchantId
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var codes=json.array;
                this.setState({codes: codes,codesModalVisible:true});
            }
        }).catch((err) =>{
            alert(err);
        });
    }

    commodityGroupRemove(commodityId){

        var commodityIds=[commodityId];
        const {code}=this.state;
        const {groupInfo}=this.state;
        var sessionId=this.props.sessionId;
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
                                var query={};
                                var groupInfo=null;
                                var code=null;
                                this.setState({query:query,groupInfo:groupInfo,code:code});
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


    //添加商品到已有组
    commodityAddToGroup(groupId)
    {

        const {merchantId}=this.props;
        var sessionId=this.props.sessionId;
        var code=this.state.code;
        if(code&&code.codigo)
        {

            proxy.postes({
                url:Config.server+"/func/commodity/addSupnuevoCommodityIntoGroupMobile",
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId
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

                                    var query={};
                                    var code={};
                                    this.setState({groupArr:{},code:code,query:query});
                                    this.goBack();
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


    //添加到新建组
    commodityAddToNewGroup()
    {
        var groupName=this.state.query.groupName;
        const {merchantId}=this.props;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {
            var code=this.state.code;
            var sessionId=this.props.sessionId;
            if(code&&code.codigo)
            {
                var codigo=code.codigo;
                proxy.postes({
                    url:Config.server+"/func/commodity/addSupnuevoBuyerCommodityGroupMobile",
                    headers: {
                        //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                        'Content-Type': 'application/json',
                        //'Cookie':sessionId
                    },
                    //body: "codigo=" + codigo + "&groupName=" + groupName+'&supnuevoMerchantId='+merchantId
                    body:{
                        codigo:codigo,
                        groupName:groupName,
                        supnuevoMerchantId:merchantId
                    }
                }).then((json)=> {
                    var errorMsg=json.errorMsg;
                    if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                        alert(errorMsg);
                    }else{
                        //TODO:return to previous page
                        if(json.groupId!==undefined&&json.groupId!==null)
                        {
                            Alert.alert(
                                '信息',
                                '添加到新建组成功',
                                [
                                    {text: 'OK', onPress: () =>  {

                                        var query={};
                                        var code={};
                                        this.setState({groupArr:{},code:code,query:query});
                                        this.goBack();
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
        }else{
            Alert.alert(
                '错误',
                '请先填入新建的组名再点击添加',
                [
                    {text: 'OK',onPress: () =>  this.refs.modal3.close()}
                ]
            );
        }
    }

    commodityGroupAdd()
    {
        var groupName=this.state.groupName;
        var sessionId=this.props.sessionId;
        const {merchantId}=this.props;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {
            var sessionId=this.props.sessionId;
            proxy.postes({
                url:Config.server+'/func/commodity/saveOrUpdateSupnuevoBuyerCommodityGroupMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId

                },
                //body: "groupName=" + groupName + "&groupId=" + ''+'&supnuevoMerchantId='+merchantId
                body:{
                    groupName:groupName,
                    groupId:'',
                    supnuevoMerchantId:merchantId
                }
            }).then((json)=> {
                var errorMsg=json.errorMsg;
                if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                    alert(errorMsg);
                }else{
                    Alert.alert(
                        '信息',
                        '组添加成功',
                        [
                            {text: 'OK',onPress: () =>  this.refs.modal3.close()}
                        ]
                    );
                }
            }).catch((err) =>{
                alert(err);
            });
        }else {
            Alert.alert(
                '错误',
                '请填写完组名再点击确认',
                [
                    {text: 'OK'}
                ]
            );
        }
    }


    openGroupAppendModal()
    {
        this.setState({groupAppendModalVisible:!this.state.groupAppendModalVisible});
    }

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groupArr:props.groupArr,
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

        var groupArr=this.state.groupArr;
        var code=this.state.code;
        var listView=null;
        var queryBox=   (<View style={[styles.card,{marginTop:10,padding:5}]}>
            <View style={{flex:1,padding:5,backgroundColor:'#eee',borderRadius:8}}>

                {/* 条码 */}
                <View style={[styles.row,{borderBottomWidth:0,marginBottom:10}]}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                        <Text style={{color:'#222',fontSize:18,fontWeight:'bold'}}>条码</Text>
                    </View>
                    <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                       <Text style={{color:'#222',fontSize:18,fontWeight:'bold'}}>{code.codigo}</Text>
                    </View>

                    {/*<TouchableOpacity style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5,padding:4}}*/}
                    {/*onPress={()=>{*/}
                    {/*this.refs.modal3.open();*/}
                    {/*}}>*/}
                    {/*<View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>*/}
                    {/*<Text style={{color:'#fff',fontSize:14}}>新增组</Text>*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                </View>

                {/*组添加*/}
                <View style={[styles.row,{borderBottomWidth:0}]}>

                    <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                        <TextInput
                            style={{height:40,flex:5,backgroundColor:'#fff',paddingLeft:5,borderRadius:4,
                                    fontSize:15,flexDirection:'row',alignItems:'center'}}
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
                            placeholder='在此输入新增的组名'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <TouchableOpacity style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:2}}
                                      onPress={()=>{
                                          this.commodityAddToNewGroup();
                                                  }}>
                        <View style={{backgroundColor:'#387ef5',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                            <Text style={{color:'#fff',fontSize:12}}>添加到新建组</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </View>);


        if(groupArr.array!==undefined&&groupArr.array!==null&&Object.prototype.toString.call(groupArr.array)=='[object Array]'
            &&groupArr.array.length>0)
        {

            var data=groupArr.array;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


            listView=(
                <View style={{padding:10}}>
                    <View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>


                            <View style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,padding:8}}>
                                <Text style={{color:'#222'}}>选择要添加到的组名</Text>
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

                <Modalbox
                    style={[ styles.modal3,{borderRadius:12,padding:4,paddingLeft:12,paddingRight:12}]} position={"center"} ref={"modal3"}
                    animationType={"slide"}>


                    <View style={[styles.row,{borderWidth:0,borderBottomWidth:1,borderBottomColor:'#ddd'}]}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>
                            <Text style={{color:'#222'}}>组名</Text>
                        </View>
                        <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                            <TextInput
                                style={{height:40,width:width*2/4,backgroundColor:'#fff',paddingLeft:15,borderRadius:4,
                                                flexDirection:'row',alignItems:'center'}}
                                onChangeText={(groupName) => {
                                            this.state.groupName=groupName;
                                            this.setState({groupName:this.state.groupName});
                                        }}
                                value={this.state.groupName}
                                placeholder='在此输入新增的组名'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    <View style={[styles.row,{borderBottomWidth:0,marginTop:10,justifyContent:'center'}]}>
                        <TouchableOpacity style={{backgroundColor:'#00f',borderRadius:8,padding:8,paddingLeft:20,paddingRight:20}}
                                          onPress={()=>{
                               this.commodityGroupAdd();
                            }}>
                            <Text style={{color:'#fff',fontSize:16}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                </Modalbox>

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
)(GroupQueryNotInGroup);

