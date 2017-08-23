/**
 * Created by danding on 16/11/13.
 */

import React from 'react';

var {
    Component
    } = React;

import {
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    Dimensions,
    Button,
    ScrollView,
    Alert,
    Modal,
    TouchableOpacity
    } from 'react-native';



import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import {BoxShadow} from 'react-native-shadow'


import {loginAction,setTimerAction} from '../action/actionCreator';

var Proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';

var  Login =React.createClass({

    onLoginPressed:function () {
        var user=this.state.user;
        var username=user.username;
        var password=user.password;
        if(username!==undefined&&username!==null&&username!='')
        {
            if(password!==undefined&&password!==null&&password!='')
            {
                this.setState({showProgress: true});
                const {dispatch} = this.props;
                this.timer= setInterval(

                    function () {

                        var loginDot=this.state.loginDot;
                        if(loginDot=='......')
                            loginDot='.';
                        else
                            loginDot+='.';

                        this.setState({loginDot:loginDot});

                    }.bind(this)
                    ,
                    600
                );
                dispatch(setTimerAction(this.timer));

                dispatch(loginAction(username,password, (errorMsg)=> {
                    this.setState({showProgress: false,user:{}});

                    var string = errorMsg
                    setTimeout(()=>{
                        Alert.alert(
                            '错误',
                            string,
                            [
                                {text: 'OK', onPress: () => {
                                }},
                            ]
                        );
                    },900)
                }));

            }else{
                Alert.alert(
                    '错误',
                    '请填写密码后再点击登录',
                    [
                        {text: 'OK', onPress: () => {
                        }},
                    ]
                );
            }
        }else{
            Alert.alert(
                '错误',
                '请填写用户名后再点击登录',
                [
                    {text: 'OK', onPress: () => {
                    }},
                ]
            );
        }
    },

    getInitialState:function(){
        return ({
            user:{},
            modalVisible:false,
            showProgress:false,
            loginDot:'.'
        });
    },


    render:function () {

        const shadowOpt = {
            width:width-20,
            height:200,
            color:"#000",
            border:2,
            radius:3,
            opacity:0.2,
            x:0,
            y:1.5,
            style:{marginVertical:5}
        }

        return (
            <View style={[styles.container]}>

                <View style={[{backgroundColor:'#387ef5',padding:10,justifyContent:'center',flexDirection:'row'}]}>
                    <Text style={{color:'#fff',fontSize:22}}>supnuevo</Text>
                </View>

                <View style={{justifyContent:'center',flexDirection:'row',padding:10,marginTop:10}}>
                    <BoxShadow setting={shadowOpt}>
                        <View style={{
                        position:"relative",
                        width: width-20,
                        height: 200,
                        backgroundColor: "#fff",
                        borderRadius:3,
                        justifyContent:'center',
                        flexDirection:'row',
                        padding:15,
                        overflow:"hidden"}}>
                            <Image style={styles.logo} source={require('../img/cart.png')} />
                        </View>
                    </BoxShadow>
                </View>

                <View style={{padding:10,paddingTop:2}}>
                    {/*输入用户名*/}
                    <View style={[styles.row,{borderBottomWidth:0}]}>

                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row'}}>

                            <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:16,
                                paddingLeft:20,paddingRight:15,marginLeft:10}}>
                                <Text style={{fontSize:16,color:'#444'}}>用户名</Text>
                            </View>


                            <View style={{flex:6,flexDirection:'row',alignItems:'center'}}>
                                <TextInput
                                    style={{height: 46,flex:1,paddingLeft:20,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16}}
                                    onChangeText={(username) => {

                                    this.state.user.username=username;
                                    this.setState({user:this.state.user});
                                }}
                                    value={this.state.user.username}
                                    placeholder='在此输入用户名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    />
                            </View>
                        </View>
                    </View>


                    {/*输入密码*/}
                    <View style={[styles.row,{borderBottomWidth:0,borderTopWidth:0}]}>

                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row'}}>

                            <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:16,
                                    paddingLeft:20,paddingRight:15,marginLeft:10}}>
                                <Text style={{fontSize:16,color:'#444'}}>密码</Text>
                            </View>


                            <View style={{flex:6,flexDirection:'row',alignItems:'center'}}>
                                <TextInput
                                    style={{height: 46,flex:1,paddingLeft:20,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16}}
                                    onChangeText={(password) => {
                                    this.state.user.password=password;
                                    this.setState({user:this.state.user});
                                }}
                                    secureTextEntry={true}
                                    value={this.state.user.password}
                                    placeholder='在此输入密码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    />
                            </View>
                        </View>
                    </View>

                    {/*登录*/}
                    <View style={[styles.row,{borderBottomWidth:0,marginTop:20}]}>

                        <TouchableOpacity style={{flex:1,backgroundColor:'#387ef5',padding:12,borderRadius:6,flexDirection:'row',
                                justifyContent:'center'}} onPress={()=>{
                                             this.onLoginPressed()
                                          }}>
                            <Text style={{color:'#fff',fontSize:18}}>登录</Text>
                        </TouchableOpacity>
                    </View>




                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.showProgress}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={[styles.modalContainer,styles.modalBackgroundStyle]}>
                            <ActivityIndicator
                                animating={true}
                                style={[styles.loader, {height: 80}]}
                                size="large"
                                color="#fff"
                                />
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{color:'#fff',fontSize:18,alignItems:'center'}}>
                                    登录中
                                </Text>
                                <Text style={{color:'#fff',fontSize:24,alignItems:'center'}}>
                                    {this.state.loginDot}
                                </Text>
                            </View>
                        </View>
                    </Modal>

                </View>

            </View>
        );

    },

    componentDidMount() {

        //fetch username and password
        var username=null;
        var password=null;
        PreferenceStore.get('username').then((val)=>{
            username=val;
            return PreferenceStore.get('password');
        }).then((val)=>{
            password=val;
            if(username!==undefined&&username!==null&&username!=''
                &&password!==undefined&&password!==null&&password!='')
            {
                //TODO:auto-login
                this.setState({user:{
                    username:username,
                    password:password
                }})

            }
        })


    },
});


export default connect(
    (state) => ({
        auth: state.user.auth
    })
)(Login);


var styles = StyleSheet.create({
    container: {
        flex:1
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    logo: {
        width: width/2,
        height: 170
    },
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    input: {
        width:240,
        justifyContent:'center',
        height: 42,
        marginTop: 10,
        padding: 4,
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#48bbec',
        color: '#48bbec',
        borderBottomWidth:0
    },
    title: {
        fontSize: 38,
        backgroundColor: 'transparent'
    },
    button: {
        marginRight: 10
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    loader: {
        marginTop: 10
    },
    error: {
        color: 'red',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }

});
