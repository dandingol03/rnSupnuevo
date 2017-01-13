/**
 * Created by danding on 16/12/6.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    ScrollView,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var Proxy = require('../proxy/Proxy');
import { connect } from 'react-redux';
import Config from '../../config';
var {height, width} = Dimensions.get('window');
import { AppRegistry, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';



class UpdateCarInfo extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }

    }

    uploadLicenseCard(val){
        this.setState({uploadModalVisible:val})
    }

    appendCarNumPrefixByCity(val){
        this.setState({modalVisible:val})
    }





    cityConfirm(city){
        //TODO:filter the city prefix
        var prefix=this.getCarNumPrefixByCity(city);
        this.setState({modalVisible: false,city:city,carNum:prefix});
    }

    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data)});
            }
        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            city:this.props.city!==undefined&&this.props.city!==null?this.props.city:null,
            carNum:this.props.carNum!==undefined&&this.props.carNum!==null?this.props.carNum:null,
            modalVisible:false,
            issueDate:null,
            factoryNum:null,
            engineNum:null,
            frameNum:null,
            uploadModalVisible:false
        };
    }


    render(){

        return (
            <View style={{flex:1}}>

                <View style={[{backgroundColor:'#444',padding: 4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                        this.goBack();
                            }}>
                            <Icon name='chevron-left' size={30} color="#444"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#444'}}>
                        创建新车
                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                <View style={{padding:10}}>
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:20}}>
                            <Icon name="map-marker" size={20}/>
                        </View>
                        <View style={{flex:4,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':13}}>用车城市:</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',alignItems:'center'}}>
                            <Text>{this.state.city}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.appendCarNumPrefixByCity(!this.state.modalVisible)
                                    }}>
                                <Icon name="chevron-right" size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row]}>
                        <View style={{flex:1,marginRight:20,justifyContent:'center'}}>
                            <Icon name="car" size={18}/>
                        </View>
                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':13}}>车牌:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(carNum) => this.setState({carNum})}
                                value={this.state.carNum}
                                placeholder='请输入您的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{flex:1,marginRight:20,justifyContent:'center'}}>
                            <Icon name="id-card" size={20}/>
                        </View>
                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':13}}>姓名:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(ownerName) => this.setState({ownerName})}
                                value={this.state.ownerName}
                                placeholder='请输入姓名'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={[styles.row,{alignItems:'center',padding:4,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:20,justifyContent:'center'}}>
                            <Icon name="calendar" size={20}/>
                        </View>
                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':13}}>注册日期:</Text>
                        </View>

                        <View style={{flex:6,flexDirection:'row',justifyContent:'center'}}>
                            <DatePicker
                                style={{width:200}}
                                date={this.state.issueDate}
                                mode="datetime"
                                placeholder="placeholder"
                                format="YYYY-MM-DD"
                                minDate="2016-05-01"
                                maxDate="2016-12-30"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../img/google_calendar.png')}
                                onDateChange={(date) => {this.setState({issueDate: date});}}
                            />
                        </View>

                    </View>

                    <View style={[styles.row,{alignItems:'center',padding:4,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:20,justifyContent:'center'}}>
                            <Icon name="info" size={20}/>
                        </View>
                        <View style={{flex:8}}>
                            <Text style={{'fontSize':13}}>是一年内过户的二手车吗:</Text>
                        </View>
                        <View style={{flex:1,marginRight:20}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.setState({carTransferred:!this.state.carTransferred});
                                    }}>
                                {
                                    this.state.carTransferred==true?
                                        <Icon name="check-circle" size={30}/>:<Icon name="circle-o" size={30}/>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:1}}>
                        <ScrollableTabView
                            style={{marginTop: 20,minHeight:200 }}
                            initialPage={0}
                            renderTabBar={() => <ScrollableTabBar />}
                        >
                            <View tabLabel='填写信息'>

                                <View style={[styles.row]}>
                                    <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{'fontSize':13}}>厂牌型号:</Text>
                                    </View>
                                    <View style={{flex:6}}>
                                        <TextInput
                                            style={{height: 40,borderWidth:0}}
                                            onChangeText={(factoryNum) => this.setState({factoryNum})}
                                            value={this.state.factoryNum}
                                            placeholder='请输入厂牌型号'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>


                                <View style={[styles.row]}>
                                    <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{'fontSize':13}}>发动机号:</Text>
                                    </View>
                                    <View style={{flex:6}}>
                                        <TextInput
                                            style={{height: 40}}
                                            onChangeText={(engineNum) => this.setState({engineNum})}
                                            value={this.state.engineNum}
                                            placeholder='请输入发动机号'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>


                                <View style={[styles.row]}>
                                    <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{'fontSize':13}}>车架号:</Text>
                                    </View>
                                    <View style={{flex:6}}>
                                        <TextInput
                                            style={{height: 40}}
                                            onChangeText={(frameNum) => this.setState({frameNum})}
                                            value={this.state.frameNum}
                                            placeholder='请输入车架号'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>

                            </View>
                            <View tabLabel='上传行驶证'>
                                <View style={{padding:10,width:width/2,marginLeft:width/4,flexDirection:'row',justifyContent:'center'}}>
                                    <Icon.Button name="hand-o-up" backgroundColor="#3b5998" onPress={
                                            ()=>{
                                               this.uploadLicenseCard(!this.state.uploadModalVisible);
                                            }
                                        }>
                                        <Text style={{fontFamily: 'Arial', fontSize: 15,textAlign:'center',color:'#fff'}}>
                                            上传行驶证
                                        </Text>
                                    </Icon.Button>
                                </View>
                            </View>
                        </ScrollableTabView>
                    </View>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <AppendCarNumPrefixModal
                            onClose={()=>{
                            this.appendCarNumPrefixByCity(!this.state.modalVisible)
                        }}
                            onConfirm={(city)=>{
                            this.cityConfirm(city);
                        }}
                        />
                    </Modal>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.uploadModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <UploadLicenseCardModal
                            onClose={()=>{
                            this.uploadLicenseCard(!this.state.uploadModalVisible)
                        }}

                        />
                    </Modal>

                </View>


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
        borderTopWidth:0,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
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
        accessToken:state.user.accessToken
    })
)(UpdateCarInfo);

