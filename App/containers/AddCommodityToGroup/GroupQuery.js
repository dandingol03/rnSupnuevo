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
var Proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import _ from 'lodash';
import CodesModal from '../../components/modal/CodesModal';
import Modalbox from 'react-native-modalbox';
import GroupQueryInGroup from './GroupQueryInGroup';
import GroupQueryNotInGroup from './GroupQueryNotInGroup';


class GroupQuery extends Component{

    goBack(){
        const { navigator } = this.props;

        var groupArr=this.state.groupArr;
        var groupInfo=this.state.groupInfo;
        var query={};
        var code=null;

        //当前处于多个组的界面
        if(groupArr&&groupArr.array)
        {
            groupArr={};
            this.setState({query:query,groupArr:groupArr,code:code});
        }else if(groupInfo&&groupInfo.array){
            groupInfo=null;
            this.setState({query:query,groupInfo:groupInfo,code:code});
        }else{
            if(navigator) {
                navigator.pop();
            }
        }
    }

    reset()
    {
        this.setState({query: {},code:null});
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



                        <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}
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

    redirect2groupQueryNotInGroup(groupArr,code)
    {
        const { navigator } = this.props;
        if(navigator&&groupArr&&code) {
            navigator.push({
                name: 'groupQueryNotInGroup',
                component: GroupQueryNotInGroup,
                params: {
                    groupArr:groupArr,
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

        var body='';
        if(groupNum!==undefined&&groupNum!==null)
            body='groupNum='+groupNum+"&supnuevoMerchantId=" + merchantId;
        else
            body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;

        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetSupnuevoCommonCommodityGroupListByCodigoMobile.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                this.setState({query:{}});
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
                        this.setState({groupArr: data,query:{},code:null});
                    }else{
                        this.redirect2groupQueryNotInGroup(data,code);
                    }
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

    commodityGroupRemove(commodityId){

        var commodityIds=[commodityId];
        const {code}=this.state;
        const {groupInfo}=this.state;
        if(groupInfo&&groupInfo.groupId!==undefined&&groupInfo.groupId!==null)
        {
            Proxy.post({
                url:Config.server+"supnuevo/supnuevoRemoveSupnuevoCommodityFromGroupMobile.do",
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "commodityIds=" + commodityIds.toString() + "&groupId=" + groupInfo.groupId
            },(json)=> {
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
            }, (err) =>{
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

            Proxy.post({
                url:Config.server+"supnuevo/supnuevoAddSupnuevoCommodityIntoGroupMobile.do",
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "commodityId=" + code.commodityId + "&groupId=" + groupId+'&supnuevoMerchantId='+merchantId
            },(json)=> {
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
                                    var groupArr={};
                                    var code=null;
                                    this.setState({query:query,groupArr:groupArr,code:code});
                                }},
                            ]
                        );
                    }
                }
            }, (err) =>{
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


    commodityGroupAdd()
    {
        var groupName=this.state.groupName;
        const {merchantId}=this.props;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {
            Proxy.post({
                url:Config.server+'supnuevo/supnuevoSaveOrUpdateSupnuevoBuyerCommodityGroupMobile.do',
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "groupName=" + groupName + "&groupId=" + ''+'&supnuevoMerchantId='+merchantId
            },(json)=> {
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
            }, (err) =>{
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


    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groupArr:{},
            selectAll:false,
            codesModalVisible:false,
            groupAppendModalVisible:false,
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

        var groupArr=this.state.groupArr;
        var groupInfo=this.state.groupInfo;
        var listView=null;
        var queryBox=   (<View style={[styles.card,{marginTop:10,padding:8}]}>
            <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                {/* 条码 */}
                <View style={[styles.row,{borderBottomWidth:0}]}>
                    {/*<View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>*/}
                    {/*<Text style={{color:'#222'}}>条码</Text>*/}
                    {/*</View>*/}
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
                            placeholder='在此输入条码最后四位'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
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
                {/*<View style={[styles.row,{borderBottomWidth:0}]}>*/}

                    {/*<View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>*/}
                        {/*<TextInput*/}
                            {/*style={{height:40,width:width*2/4,backgroundColor:'#fff',paddingLeft:15,borderRadius:4,*/}
                                                {/*flexDirection:'row',alignItems:'center'}}*/}
                            {/*onChangeText={(groupName) => {*/}
                                            {/*if(groupName.toString().length==4)*/}
                                            {/*{*/}

                                                {/*this.state.query.groupName=groupName;*/}
                                                {/*this.setState({query:this.state.query});*/}
                                            {/*}else if(groupName.toString().length>4){*/}
                                                {/*this.state.query.groupName=groupName;*/}
                                                {/*this.setState({query:this.state.query});*/}
                                            {/*}*/}
                                            {/*else{*/}
                                                {/*this.state.query.groupName=groupName;*/}
                                                {/*this.setState({query:this.state.query});*/}
                                            {/*}*/}
                                        {/*}}*/}
                            {/*value={this.state.query.groupName}*/}
                            {/*placeholder='在此输入新增的组名'*/}
                            {/*placeholderTextColor="#aaa"*/}
                            {/*underlineColorAndroid="transparent"*/}
                        {/*/>*/}
                    {/*</View>*/}

                    {/*<TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5,padding:4}}*/}
                                      {/*onPress={()=>{*/}
                                          {/*this.commodityAddToNewGroup();*/}
                                                  {/*}}>*/}
                        {/*<View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>*/}
                            {/*<Text style={{color:'#fff',fontSize:14}}>添加到新建组</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}

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
                                <Text style={{color:'#222'}}>请选择要添加到的组名</Text>
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



        }else if(groupInfo&&groupInfo.array!==undefined&&groupInfo.array!==null&&Object.prototype.toString.call(groupInfo.array)=='[object Array]')
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


                            {/*<View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',*/}
                                        {/*borderColor:'#aaa',borderWidth:1,padding:8}}>*/}
                                {/*<Text style={{color:'#222'}}>删除</Text>*/}
                            {/*</View>*/}
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



            queryBox=(
                <View style={[styles.card,{marginTop:10,padding:8}]}>
                    <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                        {/* 条码 */}
                        <View style={[styles.row,{borderBottomWidth:0}]}>
                            {/*<View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>*/}
                            {/*<Text style={{color:'#222'}}>条码</Text>*/}
                            {/*</View>*/}
                            <View style={{flex:4,flexDirection:'row',alignItems:'center',padding:4}}>
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
                                    placeholder='在此输入条码最后四位'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5,padding:4}}
                                onPress={()=>{
                                    this.commodityGroupRemove(this.state.code.commodityId);
                                }}>
                                <View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                                    <Text style={{color:'#fff',fontSize:14}}>从组中移除</Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                        {/*组特征码*/}
                        <View style={[styles.row,{borderBottomWidth:0,marginBottom:8}]}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:0}}>
                                <Text style={{color:'#222'}}>组特征码</Text>
                            </View>
                            <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:9}}>
                                <Text style={{color:'#222'}}>
                                    {groupInfo.groupNum}
                                </Text>
                            </View>

                            <View style={{flex:1,flexDirection:'row',alignItems:'center',padding:4}}>
                            </View>
                        </View>

                        {/*商品组名*/}
                        <View style={[styles.row,{borderBottomWidth:0}]}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:0}}>
                                <Text style={{color:'#222'}}>商品组名</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:2}}>
                                <Text style={{color:'#222'}}>
                                    {groupInfo.groupName}
                                </Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',padding:4,borderRadius:8,height:30,
                                              paddingLeft:12,paddingRight:12,paddingTop:0,paddingBottom:0,justifyContent:'center'}}>
                            </View>
                        </View>

                    </View>
                </View>
            );


        }
        else{}


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
                            组商品信息
                        </Text>
                        <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}
                                          >
                        </TouchableOpacity>
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
        merchantId:state.user.supnuevoMerchantId
    })
)(GroupQuery);

