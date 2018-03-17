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
import CheckBox from 'react-native-check-box';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import _ from 'lodash';
import CodesModal from '../../components/modal/CodesModal';
import Modalbox from 'react-native-modalbox';
import GroupSplit from './GroupSplit';
import GroupMaintain from './GroupMaintain';


class GroupManage extends Component{

    goBack(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.pop();
        }

    }


    reset()
    {
        this.setState({query: {},code:null});
    }

    handleBack()
    {
        console.log('it is groupMaintain');
    }


    splitCb()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
        var groups=null;
        var groupInfo=null;
        var query={};
        this.setState({query: query, groups: groups, groupInfo: groupInfo});
    }

    navigateToGroupSplit(groupInfo){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupSplit',
                component: GroupSplit,
                params: {
                    groupInfo:groupInfo,
                    finishCb:this.finishCb,
                    splitCb:this.splitCb.bind(this)
                }
            })
        }
    }

    navigateToGroupMaintain(groups,groupNum)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupMaintain',
                component: GroupMaintain,
                params: {
                    groups:groups,
                    groupNum:groupNum,
                    reset:this.reset.bind(this)
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

    fetchData(){
        const merchantId=this.props.merchantId;
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/getSupnuevoCommonCommodityGroupListByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
               // 'Cookie':sessionId
            },
            //body:"merchantId=" + merchantId
            body:{
                merchantId:merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var groupCodes = json.array;
                this.state.groupCodes = groupCodes;
                this.setState({groupCodes:groupCodes});
            }

        }).catch((err) =>{
            alert(err);
        });
    }


    renderRow(rowData){
        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                         this.queryGroupsByGroupNum(rowData.groupNum);
                    }.bind(this)}>

                    <View style={{flex:1,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                        <Text style={{flex:1,fontSize:15,color:'#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex:2,fontSize:15,color:'#343434'}}>{rowData.groupName}</Text>
                    </View>

                </TouchableOpacity>

            </View>;

        return row;
    }

    closeCodesModal(val){
        this.setState({codesModalVisible:val});
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
            //body="codigo=" + codigo + "&supnuevoMerchantId=" + merchantId;
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
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+'/func/commodity/getSupnuevoCommonCommodityGroupListByGroupNumMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "groupNum=" + groupNum
            body:{
                groupNum:groupNum
            }
        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                this.setState({query:{}});
                alert(errorMsg);
            }else{
                var groups=json;
                groups.array.map(function (group,i) {
                    group.checked=false;
                })

                this.navigateToGroupMaintain(groups,groupNum);
                //this.setState({groups: groups});
            }
        }).catch((err) =>{
            alert(err);
        });
    }


    //合并成为新组
    mergeToNewGroup()
    {

        const {merchantId}=this.props;
        var sessionId=this.props.sessionId;
        var groupName=this.state.query.groupName;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {


            if(this.state.groups&&this.state.groups.array!==undefined&&this.state.groups.array!==null
                &&Object.prototype.toString.call(this.state.groups.array)=='[object Array]')
            {

                var groupIds=[];
                this.state.groups.array.map(function (group, i) {
                    if(group.checked==true)
                    {
                        groupIds.push(group.groupId);
                    }
                });

                if(groupIds.length>1)
                {

                    proxy.postes({
                        url:Config.server+"/func/commodity/mergeSupnuevoCommodityGroupMobile",
                        headers: {
                            //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                            'Content-Type': 'application/json',
                           // 'Cookie':sessionId,
                        },
                        //body: "groupIds=" + groupIds.toString() + "&groupName=" + groupName+'&supnuevoMerchantId='+merchantId
                        body:{
                            groupIds:groupIds.toString(),
                            groupName:groupName,
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
                                '合并到新组成功',
                                [
                                    {text: 'OK', onPress: () =>  {
                                        this.state.query.groupNum=null;
                                        this.setState({groups: null,query:this.state.query});
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

    //删除组
    removeCommodityGroup(groupId)
    {

        var groupNum=this.state.query.groupNum;
        var sessionId=this.props.sessionId;
        proxy.postes({
            url:Config.server+"/func/commodity/deleteSupnuevoBuyerCommodityGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "groupId=" +groupId
            body:{
                groupId:groupId
            }

        }).then((json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{

                Alert.alert(
                    '信息',
                    '商品组删除成功',
                    [
                        {text: 'OK', onPress: () =>  {
                            this.queryGroupsByGroupNum(groupNum.toString().substring(0,7));
                        }},
                    ]
                );

            }
        }).catch((err) =>{
            alert(err);

        });

    }

    commodityGroupAdd()
    {
        var groupName=this.state.groupName;
        const {merchantId}=this.props;
        var sessionId=this.props.sessionId;
        if(groupName!==undefined&&groupName!==null&&groupName!='')
        {
            proxy.postes({
                url:Config.server+'/func/commodity/saveOrUpdateSupnuevoBuyerCommodityGroupMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId,
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

    constructor(props)
    {
        super(props);
        this.state = {
            merchantId:props.merchantId,
            query:{},
            groups:null,
            groupArr:{},
            groupCodes:null,
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

    static defaultProps = {
        handleBack:this.handleBack
    }

    static propTypes = {
        handleBack: React.PropTypes.func
    }

    render(){

        var groups=this.state.groups;
        var groupInfo=this.state.groupInfo;

        var listView=null;
        const groupCodes=this.state.groupCodes;
        if(groupCodes!==undefined&&groupCodes!==null&&Object.prototype.toString.call(groupCodes)=='[object Array]')
        {
            var data=groupCodes;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                    />
                </ScrollView>;
        }else{

            this.fetchData();
        }

        var queryBox=(<View style={[styles.card,{marginTop:10,padding:8}]}>
            <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                {/* 商品特征码 */}
                <View style={[styles.row,{borderBottomWidth:0}]}>
                    <View style={{flex:1,borderWidth:1,backgroundColor:'#fff',borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={{flex:8,height: 50,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6,backgroundColor:'#fff',}}
                            onChangeText={(groupNum) => {
                                            if(groupNum.toString().length==7)
                                            {
                                                this.state.query.groupNum=groupNum;
                                                this.setState({query:this.state.query});
                                                this.queryGroupsByGroupNum(groupNum.toString().substring(0,7));
                                            }else if(groupNum.toString().length>7){}
                                            else{
                                                this.state.query.groupNum=groupNum;
                                                this.setState({query:this.state.query});
                                            }
                                        }}
                            value={this.state.query.groupNum}
                            placeholder='在此输入商品特征码'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />

                        <TouchableOpacity style={{flex:2,height:40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                          onPress={()=>{
                                                  if(this.state.query.groupNum!==undefined&&this.state.query.groupNum!==null){
                                                      var groupNum = this.state.query.groupNum;
                                                      if(groupNum.toString().length>=1&&groupNum.toString().length<=7){
                                                        this.queryGroupsByGroupNum(groupNum.toString());
                                                        }
                                                      else{
                                                         Alert.alert(
                                                            '提示信息',
                                                            '请输入4-7位的商品特征码进行查询',
                                                                [
                                                                {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                                ]
                                                            )
                                                          }
                                                  }
                                                  else{
                                                     Alert.alert(
                                                        '提示信息',
                                                        '请输入4-7位的商品特征码进行查询',
                                                            [
                                                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                            ]
                                                        )
                                                      }
                                                  }}>
                            <View>
                                <Text style={{color:'#fff',fontSize:12}}>查询</Text>
                            </View>
                        </TouchableOpacity>


                    </View>


                </View>

            </View>
        </View>);


        if(groups&&groups.array!==undefined&&groups.array!==null&&Object.prototype.toString.call(groups.array)=='[object Array]')
        {

            queryBox=   (<View style={[styles.card,{marginTop:10,padding:8}]}>
                <View style={{flex:1,padding:8,paddingLeft:10,paddingRight:10,backgroundColor:'#eee',borderRadius:8}}>

                    {/* 商品特征码 */}
                    <View style={[styles.row,{borderBottomWidth:0}]}>
                        {/*<View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:4,marginLeft:5}}>*/}
                        {/*<Text style={{color:'#222'}}>条码</Text>*/}
                        {/*</View>*/}
                        <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                            <TextInput
                                style={{height:40,width:width*2/4,backgroundColor:'#fff',paddingLeft:15,borderRadius:4,
                                                flexDirection:'row',alignItems:'center'}}
                                onChangeText={(groupNum) => {
                                            if(groupNum.toString().length==7)
                                            {
                                                this.state.query.groupNum=groupNum;
                                                this.setState({query:this.state.query});
                                                this.queryGroupsByGroupNum(groupNum.toString().substring(0,7));
                                            }else if(groupNum.toString().length>7){}
                                            else{
                                                this.state.query.groupNum=groupNum;
                                                this.setState({query:this.state.query});
                                            }
                                        }}
                                value={this.state.query.groupNum}
                                placeholder='在此输入商品特征码'
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
                    <View style={[styles.row,{borderBottomWidth:0}]}>

                        <View style={{flex:5,flexDirection:'row',alignItems:'center',padding:4}}>
                            <TextInput
                                style={{height:40,width:width*2/4,backgroundColor:'#fff',paddingLeft:15,borderRadius:4,
                                                flexDirection:'row',alignItems:'center'}}
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
                                placeholder='在此输入合并的商品组名'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:5,padding:4}}
                                          onPress={()=>{
                                          this.mergeToNewGroup();
                                                  }}>
                            <View style={{backgroundColor:'#00f',padding:8,paddingLeft:12,paddingRight:12,borderRadius:8}}>
                                <Text style={{color:'#fff',fontSize:14}}>合并到新组</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>);




            var data=groups.array;
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

                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,padding:8}}>
                                <Text style={{color:'#222'}}>商品组名</Text>
                            </View>

                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        borderColor:'#aaa',borderWidth:1,padding:8,paddingLeft:12,paddingRight:12}}>
                                <Text style={{color:'#222'}}>操作</Text>
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

                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,borderRightWidth:0,padding:8}}>
                                <Text style={{color:'#222'}}>
                                    条码
                                </Text>
                            </View>

                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                            borderColor:'#aaa',borderWidth:1,padding:8}}>
                                <Text style={{color:'#222'}}>名称</Text>
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
                            商品组维护
                        </Text>

                        <View style={{flex:1}}>

                        </View>
                    </View>


                    {queryBox}

                    {/* 商品条码列表 */}
                    <View>
                        <ScrollView>
                            <View style={{height:40,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',borderWidth:1,
                    justifyContent:'flex-start',backgroundColor:'#fff'}}>
                                <Text style={{flex:1,fontSize:15,color:'#343434'}}>组编号</Text>
                                <Text style={{flex:2,fontSize:15,color:'#343434'}}>组名称</Text>
                            </View>
                            <View style={{flex:1}}>
                                {listView}
                            </View>
                        </ScrollView>
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
)(GroupManage);

