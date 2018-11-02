import React, { Component } from 'react';
import { AppRegistry, Platform, StyleSheet, ScrollView, View, Image, TouchableHighlight, AsyncStorage, WebView, Linking } from 'react-native';
import { Spinner, Header, Left, Body, Right, Button, Icon, Title, Card, CardItem, Text, Content } from 'native-base';
import { StackActions, createStackNavigator } from 'react-navigation';

import { config } from './env'

import { Permissions, Notifications } from 'expo';

import PTRView from 'react-native-pull-to-refresh';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class HomePage extends Component {
  constructor(props) {
    super(props);
    state = {
      page: 0,
      data: [],
      end: false
    }

  }
  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      // return;
    }
    console.log("đg gửi");
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)
  }

  loadData = async (id) => {
    try {
      if (id.id == -1) {
        state.data = [];
        state.page = 0;
        setState(state);
      }
    } catch (e) { }

    const self = this;
    fetch(config.apihost + "/api/news?index=" + state.page.toString())
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        this.state.data = this.state.data.concat(data.data);
        this.state.page++;
        this.state.end = data.end;
        self.setState(this.state);
        console.log(self.state.data);
      }).catch(err => {
        alert(err.message);
      });
    return new Promise((resolve) => {
      setTimeout(() => { resolve() }, 1000)
    });
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token');
    this.loadData();
    if (token == null) {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    var Dimensions = require('Dimensions');
    var { width, height } = Dimensions.get('window');
    var list;
    try {
      list = this.state.data.map((data) => {
        return (
          <TouchableHighlight
            key={data.id_news}
            onPress={() => this.props.navigation.navigate('ReadPage', { id: data.id })}
            underlayColor="white">
            <Card>
              <CardItem cardBody>
                <Image source={{ uri: (data.image) }}
                  style={{ height: 180, width: null, flex: 1, backgroundColor: "#ccc" }} />
              </CardItem>
              <Card style={{ paddingHorizontal: 9 }} transparent>
                <Text style={styles.title}>{data.header}</Text>
                <Text style={styles.content}>
                  {data.introduce_news}
                </Text>
              </Card>
            </Card>
          </TouchableHighlight>
        )
      })

    } catch (e) {

    }
    return (
      <View style={{ flex: 1 }}>
        <Header
          style={{ backgroundColor: '#0D47A1', color: "#fff" }}
          androidStatusBarColor="#0b3b84"
          iosBarStyle="light-content"
        >

          <Body>
            <Title style={{ color: "#fff", fontWeight: "500" }}>Tin tức UET</Title>
          </Body>
        </Header>
        <PTRView onRefresh={() => this.loadData({ id: -1 })}>
          <Content style={{ paddingHorizontal: 9, paddingVertical: 4 }}>

            {/* <TouchableHighlight
              onPress={() => this.registerForPushNotificationsAsync()}
              underlayColor="white">
              <Card>
                <CardItem cardBody>
                  <Image source={require('./img/a.jpg')}
                    style={{ height: 180, width: null, flex: 1, backgroundColor: "#ccc" }} />
                </CardItem>
                <Card style={{ paddingHorizontal: 9 }} transparent>
                  <Text style={styles.title}>Nam thần 2018 đã lộ diện</Text>
                  <Text style={styles.content}>
                    Vừa qua bạn Trần Mạnh Cường lớp K62-C-CLC đã đạt giải nam thần UET năm 2018. Đây là
                    niềm hạnh phúc của khoa CNTT nói riêng và....
              </Text>
                </Card>
              </Card>
            </TouchableHighlight> */}

            {list ? list : null}
            {
              state.end ? <Text style={{ color: "#aaa", alignSelf: "center" }}>Không có thêm nội dung</Text> : <Button block onPress={this.loadData} ><Text>Tải thêm tin</Text></Button>
            }

          </Content>
        </PTRView>

      </View>
    );
  }
}
class ReadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: "",
      content: ""
    }
  }
  goBack = () => {
    const popAction = StackActions.pop({
      n: 1,
    });
    this.props.navigation.dispatch(popAction);
  }
  componentDidMount() {
    id = this.props.navigation.state.params.id;
    const self = this;
    console.log(id);
    fetch(config.apihost + '/api/news/' + id, {
      method: 'GET',
    }).then(res => res.json())
      .catch(error => alert("Lỗi khi nhận thông tin"))
      .then(response => {
        if (response.success) {
          self.state = response.data;
          self.setState(self.state);
          console.log("state", self.state);
        } else {
          console.log(response);
          alert("Có lỗi xảy ra khi lấy thông tin");
        }
      });
  }

  onShouldStartLoadWithRequest = (event) => {
    Linking.canOpenURL(event.url).then(supported => {
      if (supported) {
        Linking.openURL(event.url);
      } else {
        console.log('Don\'t know how to open URI: ' + event.url);
      }
      return false
    });
  }


  render() {
    const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* <QRCodeScanner/> */}
        <Button rounded
          onPress={() => { this.goBack() }}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 10,
            zIndex: 20,
            width: 40,
            height: 40,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        ><Icon style={{ color: "#fff", fontSize: 21 }} name='arrow-back' /></Button>
        {/* <Image
        source={{ uri: (this.state.image) }}
          style={{ height: 180, width: null,backgroundColor: "#ccc" }}
        /> */}
        {/* <View
          style={{
            marginTop:Platform.OS=='ios'?20:0,
            padding: 6,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{
            fontSize: 20
          }}>{this.state.header}</Text>
        </View> */}
        <Header
          style={{ backgroundColor: '#0D47A1', color: "#fff" }}
          androidStatusBarColor="#0b3b84"
          iosBarStyle="light-content"
        >
          <Body>
            <Title style={{ color: "#fff", fontWeight: "500" }}>{this.state.header}</Title>
          </Body>
        </Header>

        <WebView
          ref="webview"
          style={{ width: "100%", marginTop: 1, flex: 1 }} automaticallyAdjustContentInsets originWhitelist={['*']} source={{ html: this.state.content, baseUrl: '' }}
          onNavigationStateChange={(event) => {
            //  alert(event.url);
            if (event.url.indexOf("http") == 0) {
              this.refs.webview.stopLoading();
              Linking.openURL(event.url);
            }
          }}
        />


      </View>
    )
  }
}



export default Home = createStackNavigator({
  HomePage: {
    screen: HomePage,
    path: '/',
  },
  ReadPage: {
    screen: ReadPage,
    path: '/read',
  }
}, {
    headerMode: 'none'
  });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#345'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  content: {
    color: '#456'
  }
});
