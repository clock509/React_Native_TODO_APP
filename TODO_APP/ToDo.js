import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";

const { width, height } = Dimensions.get("window");

//클래스 컴포넌트를 만드는 이유: editing 버튼을 통해 state을 수정 모드로 변경할 수 있어야 하기 때문이다.
//즉 stateful component가 필요하다.
export default class ToDo extends React.Component {
  //이 ToDo App은 2개의 state가 있다. 하나는 수정할 떄, 다른 하나는 수정을 안 할 때(그냥 보여줄 때)이다.
  //따라서 2개의 state를 만들고, 둘 사이를 이동해야 한다.  
  state = {
    isEditing: false,
    isCompleted: false,
    todoValue: ""
  }
  render() {
    const { isCompleted, isEditing, todoValue } = this.state
    const { text } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            {/* multiple style. 글 작성이 완료되었을 때와 미완료 상태일 때의 버튼 스타일을 다르게 주기 위함. */}
            {/* View의 style 항목을 배열로 준 것에 주의하라. */}
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle
              ]}
            />
            {/* TouchableOpacity 안에 있으므로 circle은 클릭이 됨 */}
          </TouchableOpacity>
          {/* multiple style. 버튼 클릭에 따라 글자 색도 바뀐다. */}
          {/* '수정하기' 버튼을 클릭하고 편집을 하면 해당 텍스트를 지우고 텍스트 인풋을 생성한다. */}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText]} //완성, 미완성에 따라 줄 긋거나 안 그음.
              value={todoValue}
              multiline={true} //TextInput의 내용이 길어질 수도 있으므로 multiline은 true.
              onChangeText={this._controlInput}
              returnKeyType={"done"}
              onBlur={this._finishEditing} //blur할 떄 일어날 일 설정: 뭔가를 쓰다가 blur하면(= 칸 밖을 클릭하면), 편집이 종료됨.
            />
          ) : (
              <Text
                style={[
                  styles.text,
                  isCompleted ? styles.completedText : styles.uncompletedText
                ]}
              >
                {text}
              </Text>
            )}
        </View>

        {isEditing ? (
          //수정할 때의 모드
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                {/* 수정완료 글씨를 터치하면 수정하기 모드가 끝난다. */}
                <Text style={styles.actionText}>수정완료</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
            //수정하지 않을 때의 모드
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  {/* 수정하기 글씨를 터치하면 수정하기 모드가 시작된다. */}
                  <Text style={styles.actionText}>수정하기</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.actionContainer}>
                  {/* 삭제 글씨를 터치하면 TO DO List가 삭제된다.. */}
                  <Text style={styles.actionText}>삭제</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
    )
  }
  //리스트 작성 완료/미완료 상태를 구분하기 위한 함수
  _toggleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted //클릭할 때마다 prevState의 반대(false : true)값을 state에 전달한다.
      }
    })
  }

  //편집 모드를 할 떄, 안 할 때를 구분하기 위한 함수
  _startEditing = () => {
    const { text } = this.props; //props를 state에 넣어서 나중에 관리할 수 있도록 한다.
    this.setState({
      isEditing: true,
      todoValue: text
    })
  }

  _finishEditing = () => {
    this.setState({
      isEditing: false
    })
  }

  _controlInput = (text) => {
    this.setState({ todoValue: text })
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth, //내용란에 공책처럼 밑줄 그어주기
    flexDirection: "row", //메모들이 바로 옆에 위치한다.
    alignItems: "center",
    justifyContent: "space-between"
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 15, //원을 그리고 싶다면, borderRadius는 항상 width, height의 절반이어야 한다.
    borderColor: "red", //원 테두리 색
    borderWidth: 3, //원 테두리 폭. 클수록 circle 가운데의 흰 동그라미가 작아짐.
    marginRight: 20
  },

  completedCircle: {
    borderColor: "#bbb" //gray

  },

  uncompletedCircle: {
    borderColor: "#F23657" //red

  },

  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20 //상단, 하단
  },

  completedText: {
    color: "#bbb", //gray
    textDecorationLine: "line-through" //글자에 선 긋기
  },

  uncompletedText: {
    color: "#353535" //red
  },

  column: {
    flexDirection: 'row',
    alignItems: "center",
    width: width / 2,
    justifyContent: "space-between"
  },

  actions: {
    flexDirection: "row"
  },

  actionContainer: {
    marginVertical: 10, //버튼쪽 근처를 터치해도 감지할 수 있다(손가락 두꺼운 사람의 경우에도 터치가 가능하도록).
    marginHorizontal: 10
  },

  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
});