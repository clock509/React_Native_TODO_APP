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

const { height, width } = Dimensions.get("window") //margin을 주기 위한 방법. 휴대폰 스크린의 높이, 가로 길이를 가져온다.

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={"New To Do"} />
          {/* TextInput requires height */}

        </View>
      </View>
    )
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
  }

});
