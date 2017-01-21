import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    Navigator,
    BackAndroid,
    Platform,
    ToastAndroid
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome.js';

import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabNavigator from 'react-native-tab-navigator';

import Login from '../containers/Login';
import Query from '../containers/Query';

import Group from '../containers/Group';


const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            tab:'query',
            selectedTab:'query'
        }
    }
    _createNavigatorItem(route,icon,title)
    {

        var component=Query;
        switch (route) {
            case 'query':
                component=Query;
                break;
            case 'group':
                component=Group;
                break;
            default:
                break;
        }

        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === route}
                title={title!==undefined&&title!==null?title:route}
                renderIcon={() => <Icon name={icon} size={25}/>}
                renderSelectedIcon={() => <Icon name={icon} size={25} color='#00f' />}
                onPress={() => this.setState({ selectedTab: route })}>
                <Navigator
                    initialRoute={{ name: route, component:component }}
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                      }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        this.navigator=navigator;
                        return <Component {...route.params} navigator={navigator} />
                      }} />
            </TabNavigator.Item>
        );
    }

    render() {
        let auth=this.props.auth;
        if(auth==true)
        {

            return(
                <TabNavigator>
                    {this._createNavigatorItem('query','home','改价')}
                </TabNavigator>
            );
        }
        else{
            return (<Login/>);
        }
    }

    componentWillMount()
    {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }

    onBackAndroid = () => {
        const nav = this.navigator;
        const routers = nav.getCurrentRoutes();
        var route=routers[routers.length-1];
        if (routers.length ==1) {
            if(this.lastBackPressed&&this.lastBackPressed+4000>=Date.now())
            {
                //BackAndroid.exitApp();
                return false;
            }else{
                this.lastBackPressed = Date.now();
                ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
                return true;
            }
        }else{
            //执行浏览历史的回退
            if(route.params.reset)
                route.params.reset();
            nav.pop();
            return true;
        }

    };

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

