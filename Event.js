import React, { Component } from 'react';
import { Platform, StyleSheet, ScrollView, View, Image, TouchableHighlight, AsyncStorage, WebView } from 'react-native';
import { Content, Spinner, Header, Left, Body, Right, Button, Icon, Title, Card, CardItem, Text } from 'native-base';
import { StackActions, createStackNavigator } from 'react-navigation';
import moment from 'moment';
import 'moment/locale/vi';

import { config } from './env';

import PTRView from 'react-native-pull-to-refresh';


class EventPage extends Component {
  constructor(props) {
    super(props);
    state = {
      data: [],
      page: 0,
      end: false
    }
    moment.locale('vi');
  }
  componentDidMount() {
    this.loadData();
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
    fetch(config.apihost + "/api/events/?index=0" + state.page.toString())
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

  follow = async (id) => {
    const self = this;
    const token = await AsyncStorage.getItem('token');
    console.log(id);
    if (token !== null) {
      fetch(config.apihost + '/api/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id_eve: id.id })
      }).then(res => res.json())
        .catch(error => alert("Lỗi không xác định"))
        .then(response => {
          if (response.success) {
            alert("Bạn đang theo dõi sự kiện này!");
          } else {
            console.log(response);
            alert("Có lỗi xảy ra khi xử lí thông tin");
          }
        });
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
            onPress={() => this.props.navigation.navigate('ReadEventPage', { id: data.id })}
            underlayColor="white">
            <Card>
              <CardItem cardBody>
                <Image source={{ uri: (data.image) }}
                  style={{ height: 180, width: null, flex: 1, backgroundColor: "#ccc" }} />
              </CardItem>
              <Card style={{ paddingHorizontal: 9 }} transparent>
                <Text style={styles.title}>{data.header}</Text>
                <View style={{ marginTop: 6 }}>
                  <Text>Địa điểm: <Text style={{ fontWeight: '600' }}>{data.place}</Text></Text>
                  <Text>Thời gian: <Text style={{ fontWeight: '600' }}>{moment(data.time_start).format('llll')}</Text></Text>
                </View>
              </Card>

              <Button
                onPress={() => this.follow({ id: data.id })}
                style={{ borderRadius: 0 }} full light>
                <Icon style={{ fontSize: 18, color: "#345" }} name='ios-bookmark' />
                <Text style={{ fontWeight: '600', color: '#345' }}>Quan tâm sự kiện này</Text>
              </Button>

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
            <Title style={{ color: "#fff", fontWeight: "500" }}>Sự kiện UET</Title>
          </Body>
        </Header>
        <PTRView onRefresh={() => this.loadData({ id: -1 })}>

        <Content style={{ paddingHorizontal: 9, paddingVertical: 4 }}>

          {list ? list : null}
          {
              state.end ? <Text style={{color:"#aaa",alignSelf:"center"}}>Không có thêm nội dung</Text> : <Button block onPress={this.loadData} ><Text>Tải thêm tin</Text></Button>
            }
        </Content>
        </PTRView>

      </View>
    );

  }

}
class ReadEventPage extends Component {
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
  follow = async (id) => {
    const self = this;
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      fetch(config.apihost + '/api/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id_eve: id.id })
      }).then(res => res.json())
        .catch(error => alert("Lỗi không xác định"))
        .then(response => {
          if (response.success) {
            alert("Bạn đang theo dõi sự kiện này!");
          } else {
            console.log(response);
            alert(response.message);
          }
        });
    }
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
    const token = await AsyncStorage.getItem('token');
    console.log(id);
    fetch(config.apihost + '/api/events/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }

    }).then(res => res.json())
      .catch(error => alert("Lỗi khi nhận sự kiện"))
      .then(response => {
        if (response.success) {
          self.state = response.data;
          self.setState(self.state);
          console.log("event_doc", self.state);
        } else {
          console.log(response);
          alert(response.message);
        }
      });
  }
  componentDidMount() {
    id = this.props.navigation.state.params.id;
    this.loadData(id);
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
        <Header
          style={{ backgroundColor: '#0D47A1', color: "#fff" }}
          androidStatusBarColor="#0b3b84"
          iosBarStyle="light-content"
        >
          <Body>
            <Title style={{ color: "#fff", fontWeight: "500" }}>{this.state.header}</Title>
          </Body>
        </Header>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>

          <Image
            source={{ uri: (this.state.image) }}
            style={{ height: 180, width: null, backgroundColor: "#ccc" }}
          />
          <View style={{ padding: 9 }}>
            <Text>Địa điểm: <Text style={{ fontWeight: 'bold' }}>{this.state.place}</Text></Text>
            <Text>Thời gian: <Text style={{ fontWeight: 'bold' }}>{moment(this.state.time_start).format('llll')}</Text></Text>
          </View>
          <Text style={{
            padding: 9,
            backgroundColor: "#fff",
            flex: 1,
            marginTop: 1
          }}>
            {this.state.content}
          </Text>
          {
 this.state.link_register!=null?<WebView
 source={{uri: this.state.link_register}}
 style={{flex:1,height:400,width:"100%"}}
/>:null
          }
         
        </ScrollView>
        <Button
          onPress={() => this.follow({ id: this.state.id })}
          style={{ borderRadius: 0 }} full light>
          <Icon style={{ fontSize: 18, color: "#345" }} name='ios-bookmark' />
          <Text style={{ fontWeight: '600', color: '#345' }}>Quan tâm sự kiện này</Text>
        </Button>
      </View>
    )
  }
}
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

export default Event = createStackNavigator({
  EventPage: {
    screen: EventPage,
    path: '/event',
  },
  ReadEventPage: {
    screen: ReadEventPage,
    path: '/readevent',
  }
}, {
    headerMode: 'none'
  });