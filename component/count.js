import React, { Component } from 'react';
import { Platform, StyleSheet, ScrollView, View, AsyncStorage } from 'react-native';
import { StatusBar, Image } from 'react-native';
import { Container, Header, Content, Icon, Picker, Form, Button, Input, Text } from "native-base";
import { Constants, BarCodeScanner, Permissions } from 'expo';

import { config } from './../env'


export default class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mssv: "",
      selected: undefined,
      hasCameraPermission: null,
      list: []
    };
  }
  onValueChange = (value) => {
    this.setState({
      selected: value
    });
    console.log(value);
  }
  componentDidMount() {
    this._requestCameraPermission();
    self = this;
    fetch(config.apihost + '/api/events/list_events/config', {
      method: 'GET',
    }).then(res => res.json())
      .catch(error => alert("Lỗi khi nhận sự kiện"))
      .then(response => {
        if (response.success) {
          self.state.list = response.data;
          self.setState(self.state);
          console.log("event_doc", self.state.list);
          if(Platform.OS=="android"){
            this.setState({selected:this.state.list[0].id_eve})
          }
        } else {
          console.log(response);
          alert("Có lỗi xảy ra khi lấy sự kiện");
        }
      });
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  count = async (data) => {
    console.log("Đang điểm danh");
    const self = this;
    const token = await AsyncStorage.getItem('token').then(
      console.log("ok", token)
    )

    if (token !== null) {
      fetch(config.apihost + '/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id_eve: this.state.selected, mssv: this.state.mssv })
      }).then(res => res.json())
        .catch(error => alert("Lỗi không xác định"))
        .then(response => {
          if (response.success) {
            alert(response.data.full_name);
          } else {
            console.log(response);
            alert("Có lỗi xảy ra khi xử lí thông tin");
          }
        });
    }
  }

  _handleBarCodeRead = data => {
    if(data.data==this.state.mssv){
      return;
    }else{
      this.setState({mssv:data.data})
    }
    if(this.state.selected==undefined){
      alert("Vui lòng chọn sự kiện");
    }else{
      this.count(data.data);
    }
  }

  render() {
    list = this.state.list.map((data, i) => {
      return (
        <Picker.Item label={data.header+" - "+data.id} value={data.id} key={i} />
      )
    });
    return (
      <View>
        <Form>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            placeholder="Chọn một sự kiện"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            style={{ width: "100%" }}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange}
          >
            {list}
          </Picker>
        </Form>

        <View style={styles.container}>
          {this.state.hasCameraPermission === null ?
            <Text>Requesting for camera permission</Text> :
            this.state.hasCameraPermission === false ?
              <Text>Camera permission is not granted</Text> :
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{ height: 300, width: 300 }}
              />
          }
        </View>
        <View style={{ padding: 6, marginTop: 3 }}>
        <Input
          placeholder="Nhập mã số SV"
          onChangeText={mssv => this.setState({ mssv })}
          value={this.state.mssv} />
        <Button
        onPress={this.count}
        block><Text>Điểm danh</Text></Button>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight
  }
});