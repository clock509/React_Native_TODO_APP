import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

//클래스 컴포넌트를 만드는 이유: editing 버튼을 통해 state을 수정 모드로 변경할 수 있어야 하기 때문이다.
//즉 stateful component가 필요하다.

export default class ToDo extends React.Component {
  render() {
    return (
      <View>
        <Text>Hello, I'm a To Do.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({});