import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    Navigator
} from 'react-native';


import { connect } from 'react-redux';




import Icon from 'react-native-vector-icons/FontAwesome';
import Login from '../containers/Login';


import FontAwesome from "react-native-vector-icons/FontAwesome";

import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';



const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            tab:'product',
            selectedTab:'product'
        }
    }


    render() {
        let auth=this.props.auth;
        if(auth==true)
        {
            return (
                <View>
                    <Text>we have pass,yet</Text>
                </View>);
        }
        else{
            return (<Login/>);
        }
    }
}

var styles = StyleSheet.create({
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    container:{
        flex: 1,
        alignItems:'center',
        marginTop:60
    },
    text: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:16,
        textAlign:'center'
    },
    wrapper:{

    },
    slide1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#9DD6EB'
    },
    slide2:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#97CAE5'
    },
    slide3:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#92BBD9'
    }
});



export default connect(
    (state) => ({
        auth: state.user.auth
    })
)(App);

