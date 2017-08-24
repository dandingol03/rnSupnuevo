import React from 'react';
import {
    AppState,
    Modal,
    NetInfo,
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
import Announcement from '../containers/Announcement';
import Advertisement from '../containers/Advertisement';

import Sale from '../containers/Sale/Sale';
import Stock from './Stock/Stock';
import My from './My/My';

import { setNetInfo } from '../action/actionCreator';

const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色

class App extends React.Component {

    constructor(props) {
        super(props);
        const {dispatch} = this.props;
        this.state={
            tab:'公告',
            selectedTab:'公告',
            isConnected: null,
        }
    }

    _createNavigatorItem(route,icon)
    {
        var component=Announcement;
        switch (route) {
            case '公告':
                component=Announcement
                break;
            case '改价':
                component=Query;
                break;
            case '收银':
                component=Sale;
                break;
            case '进货':
                component=Stock;
                break;
            case '我的':
                component=My;
                break;
            case '广告':
                component=Advertisement;
                break;
            default:
                break;
        }

        return (

            <TabNavigator.Item
                selected={this.state.selectedTab === route}
                title={route}
                titleStyle={{color:'#C6C5CA',fontSize:13}}
                renderIcon={() => <Icon name={icon} size={25}/>}
                renderSelectedIcon={() => <Icon name={icon} size={25} color='#387ef5' />}
                onPress={() => {
                    this.setState({ selectedTab: route });
                }}
                tabStyle={{backgroundColor:'transparent',}}
                onSelectedStyle={{backgroundColor:'#eeecf3',}}
                >
                <View style={{flex:1,}}>
                    <Navigator
                        initialRoute={{ name: route, component:component }}
                        configureScene={(route) => {
                            return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                          }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            //this.props.dispatch(updateNavigator({route:route.name,navigator:navigator}))
                            return (<Component {...route.params} navigator={navigator} />);
                          }}

                    />


                </View>
            </TabNavigator.Item>
        );
    }

    render() {
        let auth=this.props.auth;
        if(auth==true)
        {

            var defaultStyle={
                backgroundColor:'#eeecf3',
                paddingBottom:5,
                paddingTop:5,
                height:60
            }

            var defaultSceneStyle={
            }

            // if(tab.hidden==true)
            // {
            //     defaultStyle.height=0
            //     defaultStyle.paddingBottom=0
            //     defaultStyle.paddingTop=0
            //     defaultSceneStyle.paddingBottom=0
            // }

            return(

            <TabNavigator  tabBarStyle={defaultStyle} sceneStyle={defaultSceneStyle}>
                {this._createNavigatorItem('广告','home')}
                {this._createNavigatorItem('改价','edit')}
                {this._createNavigatorItem('收银','search')}
                {this._createNavigatorItem('进货','tag')}
                {this._createNavigatorItem('我的','user-o')}
                {this._createNavigatorItem('公告','home')}
            </TabNavigator>

                // <Navigator
                //     initialRoute={{ name: 'query', component:Query }}
                //     configureScene={(route) => {
                //         return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                //       }}
                //     renderScene={(route, navigator) => {
                //         let Component = route.component;
                //         this.navigator=navigator;
                //         return <Component {...route.params} navigator={navigator} />
                //       }} />

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

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange.bind(this)
        );


    }

    _handleConnectionInfoChange(connectionInfo) {
        const connectionInfoHistory = this.props.connectionInfoHistory.slice();
        connectionInfoHistory.push(connectionInfo);
        const {dispatch} = this.props;
        dispatch(setNetInfo(connectionInfoHistory));

    }

    componentWillUnmount() {

        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );

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
        auth: state.user.auth,
        connectionInfoHistory:state.netInfo.connectionInfoHistory,
    })
)(App);

