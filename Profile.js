import React, { Component } from 'react';
import { Platform, StyleSheet, ScrollView, View, Text, AsyncStorage,Linking} from 'react-native';
import { StatusBar, Image } from 'react-native';
import { Content, List, Switch, ListItem, Header, Left, Right, Body, Icon, Button, Title } from 'native-base';
import { StackActions, createStackNavigator } from 'react-navigation';
import QRCode from 'react-native-qrcode';

//component
import Info from "./component/info"
import Count from "./component/count"
import Password from "./component/password"
//page
import StudentInfo from "./component/studentinfo"


class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mssv: "",
      role: "2"
    }

    const didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.load();
      }
    );
  }
  componentDidMount = () => {
    this.load();
  }
  load = async () => {
    const mssv = await AsyncStorage.getItem('mssv');
    const role = await AsyncStorage.getItem('role');
    this.setState({ mssv, role });
  }
  logOut = async () => {
    // this.props.navigation.navigate('Login')

    await AsyncStorage.removeItem('token').then(
      this.props.navigation.navigate('Login')
    )
  }
  render() {
    var Dimensions = require('Dimensions');
    var { width, height } = Dimensions.get('window');
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Header
          style={{ backgroundColor: '#0D47A1', color: "#fff" }}
          androidStatusBarColor="#0b3b84"
          iosBarStyle="light-content"
        >
          <Body>
            <Title style={{ color: "#fff", fontWeight: "500" }}>Cá nhân</Title>
          </Body>

        </Header>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
          {/* <Image
            style={{
              width: 128, height: 128,
              marginTop: 10,
              marginHorizontal: "50%",
              backgroundColor: "#ccc",
              transform: [{ translateX: -64 }]
            }}
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=17028884&size=220x220&margin=0' }}
          /> */}
          <View style={{ alignItems: "center", marginTop: 9, marginBottom: 6 }}>
            <QRCode
              value={this.state.mssv}
              size={128}
              bgColor='black'
              fgColor='white' />
            <Text style={{ marginTop: 6, fontSize: 16, backgroundColor: "#fff", padding: 6 }}>{this.state.mssv}</Text>
          </View>

          <Content style={styles.group}>
            <ListItem
              onPress={() => this.props.navigation.navigate('SettingPage', { id: "1" })}
              icon>
              <Left>
                <Icon active style={{ color: "#555" }} name="contact" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Thông tin của bạn</Text>
              </Body>
            </ListItem>
          </Content>

          <Content style={styles.group}>
            <ListItem onPress={()=>{alert("Chức năng đang được phát triển")}} icon>
              <Left>
                <Icon active style={{ color: "#555" }} name="clipboard" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Điểm rèn luyện</Text>
              </Body>
            </ListItem>
            
            <ListItem icon onPress={ ()=>{ Linking.openURL('http://112.137.129.30/viewgrade/')}}>
              <Left>
                <Icon active style={{ color: "#555" }} name="grid" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Điểm thi</Text>
              </Body>
            </ListItem>

            <ListItem icon onPress={ ()=>{ Linking.openURL('https://112.137.129.87/congdaotao/module/dsthi_new/')}}>
              <Left>
                <Icon active style={{ color: "#555" }} name="calendar" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Lịch thi</Text>
              </Body>
            </ListItem>
          </Content>
          {
            this.state.role == '2' ? null :
              <Content style={styles.group}>
                <ListItem
                  onPress={() => this.props.navigation.navigate('SettingPage', { id: "2" })}
                  icon>
                  <Left>
                    <Icon active style={{ color: "#555" }} name="camera" />
                  </Left>
                  <Body>
                    <Text style={{ color: "#555" }}>Điểm danh sinh viên</Text>
                  </Body>
                </ListItem>
              </Content>
          }


          <Content style={styles.group}>
            <ListItem
              onPress={() => this.props.navigation.navigate('SettingPage', { id: "0" })}
              icon>
              <Left>
                <Icon active style={{ color: "#555" }} name="paper" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Sự kiện đã tham gia</Text>
              </Body>
            </ListItem>
          </Content>

          <Content style={styles.group}>
            <ListItem
              onPress={() => this.props.navigation.navigate('SettingPage', { id: "3" })}
              icon>
              <Left>
                <Icon active style={{ color: "#555" }} name="lock" />
              </Left>
              <Body>
                <Text style={{ color: "#555" }}>Đổi mật khẩu</Text>
              </Body>
            </ListItem>

            <ListItem
              onPress={this.logOut}
              icon>
              <Left>
                <Icon active style={{ color: "#f55" }} name="log-out" />
              </Left>
              <Body>
                <Text style={{ color: "#f55" }}>Đăng xuất</Text>
              </Body>
            </ListItem>
          </Content>

        </ScrollView>
      </View>
    )
  }
}
class SettingPage extends Component {
  constructor(props) {
    super(props);
  }
  goBack = () => {
    const popAction = StackActions.pop({
      n: 1,
    });
    this.props.navigation.dispatch(popAction);
  }
  render() {
    const components = [
      {
        title: "Sự kiện đã tham gia",
        cpn: <Info />
      },
      {
        title: "Cá nhân",
        cpn: <StudentInfo />
      },
      {
        title: "Điểm danh",
        cpn: <Count />
      },
      {
        title: "Đổi mật khẩu",
        cpn: <Password />
      }
    ];
    const { navigation } = this.props;
    console.log(navigation.state.params.id);
    const component = components[navigation.state.params.id];
    return (
      <View>
        <Header
          style={{ backgroundColor: '#0D47A1', color: "#fff" }}
          androidStatusBarColor="#0b3b84"
          iosBarStyle="light-content"
        >
          <Left>
            <Button transparent
              onPress={() => { this.goBack() }}>
              <Icon style={{ color: "#fff" }} name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#fff", fontWeight: "500" }}>{component.title}</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        {/* <Text>Đây là nội dung nè</Text> */}
        <ScrollView>
          {component.cpn}
        </ScrollView>
      </View>
    )
  }
}

export default Profile = createStackNavigator({
  ProfilePage: {
    screen: ProfilePage,
    path: 'setting/',
  },
  SettingPage: {
    screen: SettingPage,
    path: 'setting/page/:id'
  },
}, {
    headerMode: 'none'
  });


const styles = StyleSheet.create({
  group: {
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  }
});


