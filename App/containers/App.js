import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    Navigator
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome.js';

import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabNavigator from 'react-native-tab-navigator';

import Login from '../containers/Login';
import Query from '../containers/Query';

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

