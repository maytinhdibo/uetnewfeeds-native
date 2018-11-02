import React, { Component } from 'react';
import { ScrollView, TextInput, StyleSheet, AsyncStorage, View } from 'react-native';
import { Item, Input, Right, Text, Body, Icon, Button, Title, Card, CardItem,Content,ListItem,List,Left,Switch } from 'native-base';

import { config } from './../env'

class StudentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mssv: '',
            class: '',
            course: '',
            email: '',
            full_name: '',
            phone_number: '',
            faculty: ''
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = async () => {
        const self = this;
        console.log("ok");
        const token = await AsyncStorage.getItem('token');
        console.log(token);

        if (token !== null) {
            fetch(config.apihost + '/api/student', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            }).then(res => res.json())
                .catch(error => alert("Lỗi khi nhận thông tin"))
                .then(response => {
                    if (response.success) {
                        console.log(response.data);
                        self.state = response.data;
                        self.setState(self.state);
                        console.log("state", self.state);
                    }else{
                        console.log(response);
                        alert("Có lỗi xảy ra khi lấy thông tin");
                    }
                });
        }
    }
    savedata= async ()=>{
        const self = this;
        console.log("saving");
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
            fetch(config.apihost + '/api/student', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body:JSON.stringify({email:this.state.email,phone_number:this.state.phone_number})
            }).then(res => res.json())
                .catch(error => alert("Lỗi khi sửa thông tin"))
                .then(response => {
                    if (response.success) {
                        alert("Đã sửa thông tin");
                        console.log(response.data);
                        self.state = response.data;
                        self.setState(self.state);
                        console.log("state", self.state);
                    }else{
                        console.log(response);
                        alert(response.reason);
                    }
                });
        }
    }

    render() {
        return (
            <View  style={{paddingBottom:60}}>
<Content style={{backgroundColor:"#fff"}}>
         
          <ListItem icon>
            <Body>
              <Text>Tên của bạn</Text>
            </Body>
            <Right>
                
              <Text>{this.state.full_name}</Text>
            </Right>
          </ListItem>

           <ListItem icon>
            <Body>
              <Text>Mã số sinh viên</Text>
            </Body>
            <Right>
              <Text>{this.state.mssv}</Text>
            </Right>
          </ListItem>

           <ListItem icon>
            <Body>
              <Text>Thư điện tử</Text>
            </Body>
            <Right style={{textAlign: 'right'}}>
              <Icon active name="arrow-forward" />
            </Right>
            <Input style={{backgroundColor:"rgba(0,0,0,0)",position:"absolute",right:22,textAlign: 'right',width:"50%",color:"#888"}}
            onChangeText={email => this.setState({ email })}
            value={this.state.email} />

          </ListItem>

          <ListItem icon>
            <Body>
              <Text>Số điện thoại</Text>
            </Body>
            <Right>
              {/* <Text>{this.state.phone_number}</Text> */}
              
              <Icon active name="arrow-forward" />
            </Right>
            <Input style={{backgroundColor:"rgba(0,0,0,0)",position:"absolute",right:22,textAlign: 'right',width:"50%",color:"#888"}}
            onChangeText={phone_number => this.setState({ phone_number })}
            value={this.state.phone_number} />
          </ListItem>

          <ListItem icon>
            <Body>
              <Text>Khóa</Text>
            </Body>
            <Right>
              <Text>K{this.state.course}</Text>
            </Right>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text>Lớp</Text>
            </Body>
            <Right>
              <Text>{this.state.class}</Text>
            </Right>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text>Khoa</Text>
            </Body>
            <Right>
              <Text>{this.state.faculty}</Text>
            </Right>
          </ListItem>
        </Content>

                {/* <Card>
                    <CardItem header bordered>
                        <Text>Tên của bạn</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{this.state.full_name}</Text>
                        </Body>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem header bordered>
                        <Text>Mã số sinh viên</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{this.state.mssv}</Text>
                        </Body>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem header bordered>
                        <Text>Thư điện tử</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Item regular>
                                <Input
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email} />
                            </Item>
                        </Body>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem header bordered>
                        <Text>Số điện thoại</Text>
                    </CardItem>
                    <CardItem>
                        <Body>

                            <Item regular>
                                <Input
                                    onChangeText={phone_number => this.setState({ phone_number })}
                                    value={this.state.phone_number} />
                            </Item>

                        </Body>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem header bordered>
                        <Text>Lớp</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>K{this.state.course} - {this.state.class}</Text>
                        </Body>
                    </CardItem>
                </Card> */}
                <View style={{ padding: 6, marginTop: 9 }}>
                    <Button onPress={this.savedata} block><Text>Lưu thay đổi</Text></Button>
                </View>

            </View>
        )
    }
}
export default StudentInfo;