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
    TabBarIOS
} from 'react-native';

import { connect } from 'react-redux';
var t=require('tcomb-form-native');
var Form = t.form.Form;

var Person = t.struct({
    'username': t.String,              // a required string
    'password': t.String,  // an optional string
    rememberMe: t.Boolean        // a boolean
});

var options = {};

import {loginAction} from '../action/actionCreator';
var Proxy = require('../proxy/Proxy');


var  Login =React.createClass({
    onLoginPressed:function () {
        console.log('attempting to log in with username: ' + this.state.username);
        this.setState({showProgress: true});
        const {dispatch} = this.props;

        dispatch(loginAction(this.state.username,this.state.password));
    },
    onPress:function () {
        var form = this.refs.form.getValue();
        console.log('struct=\r\n'+form);
        this.setState({showProgress: true});
        const {dispatch} = this.props;
        dispatch(loginAction(form.username,form.password));
    },
    getInitialState:function(){
        return ({showPregress: true});
    },
    render:function () {
        var t1=
            <View style={styles.container}>
                <Text style={styles.heading}>
                    Github Browser
                </Text>
                <Image style={styles.logo} source={require('../img/Octocat.png')} />

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TextInput
                        onChangeText={(text) => this.setState({username: text})}
                        style={styles.input}
                        placeholder='请输入用户名'
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                    />
                </View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TextInput
                        onChangeText={(text) => this.setState({password: text})}
                        style={styles.input}
                        placeholder="input password"
                        secureTextEntry={true} />
                </View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TouchableHighlight
                        onPress={this.onLoginPressed}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                            登录
                        </Text>
                    </TouchableHighlight>
                </View>

                <ActivityIndicator
                    animating={this.state.showProgress}
                    style={[styles.loader, {height: 80}]}
                    size="large"
                />
            </View>;
        return (
            <View style={styles.container}>
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                />
                <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        );

    }
});


export default connect(
)(Login);




var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    logo: {
        width: 160,
        height: 200
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
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
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
    }
});
