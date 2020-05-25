/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TextInput, Dimensions, Platform } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import ToDo from './ToDo';

const { height, width } = Dimensions.get("window") //margin을 주기 위한 방법. 휴대폰 스크린의 높이, 가로 길이를 가져온다.

export default class App extends React.Component {
  //value control을 위한 state 초기화
  state = {
    newToDo: ""
  }

  render() {
    const { newToDo } = this.state.newToDo
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New To Do"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"} //Text color of placeholder
          //ios 키보드 설정: returnKeyType={"done"} (스페이스바 오른쪽 버튼을 'done'으로 만듦)
          //ios 키보드 설정: autoCorrect={false} (자동 수정)
          />
          {/* New To Do 제목 아래 적을 내용. 제목란은 상단 고정하는 반면, 내용란은 Scroll을 내릴 수 있어야 함. */}
          <ScrollView>
            <ToDo />
          </ScrollView>
        </View>
      </View>
    )
  }

  //text input을 관리하기 위한 함수
  _controlNewToDo = text => { //이벤트로부터 'text'를 가져옴
    this.setState({
      newToDo: text
    })
  }
}

const styles = StyleSheet.create({
  //배경
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
    //justifyContent: 'center', //설정 안 하면 컨테이너는 상단으로 가고, center로 설정하면 중앙에 위치한다.
  },

  //제목
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 40,
    fontWeight: '200', //어째선지 700이 제일 두껍게 나온다.
    marginBottom: 30 //타이틀(Kawai To Do가 적힌 부분)의 아래쪽 마진.
  },

  //카드(작성란)
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25, //스크린 전체의 width - 25
    //borderRadius: 10, //모서리를 둥글게 하면 귀여운 느낌이 든다.
    borderTopLeftRadius: 10, //상단 좌측만 둥글게 함.
    borderTopRightRadius: 10, //상단 우측만 둥글게 함.
    //쉐도우 추가: 쉐도우는 플랫폼(ios, andriod)에 따라 다르다. 따라서 platform-specific code를 작성해야 한다.
    //ios: shadowColor, shadowOffset, shadowOpacity, shadowRadius
    //android: elevation(0~5. 숫자가 커질수록 쉐도우가 커짐)
    //Platform.select() 명령어를 사용하면 내 플랫폼에 체크하고 그에 맞는 쉐도우 키워드를 제시해 준다.
    ...Platform.select({
      android: {
        elevation: 5
      }
    })
  },

  //New To Do 인풋창 설정
  input: {
    padding: 20,
    borderBottomWidth: 1, //StyleSheet.hairlineWidth은 너무 얇음
    borderBottomColor: '#bbb',
    fontSize: 25
  }

});
