/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TextInput, Dimensions, Platform, AsyncStorage } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
//import { AppLoading } from 'expo';
import ToDo from './ToDo';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; //npm i --save react-native-get-random-values -> //npm i --save nanoid (출처: https://www.jacepark.com/how-to-use-uuid-in-react-native-with-expo/)

const { height, width } = Dimensions.get("window") //margin을 주기 위한 방법. 휴대폰 스크린의 높이, 가로 길이를 가져온다.

export default class App extends React.Component {
  //value control을 위한 state 초기화
  state = {
    newToDo: "", //TextInput으로 전달. ///TODO를 디스크에 저장: 앱을 열면, TODO 리스트를 불러올 수 있어야 한다.
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  };

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    //TODO가 로딩이 안 되어있다면 AppLoading을 리턴
    if (!loadedToDos) {
      return <Text>App Loading</Text> //<AppLoading />;
    }
    //TODO가 로딩이 되어있다면 여기를 리턴
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
            returnKeyType={"done"}        //ios 키보드 설정: (스페이스바 오른쪽 버튼을 'done'으로 만듦)
            autoCorrect={false}           //자동 수정
            onSubmitEditing={this._addToDo}//'완료'를 클릭할 때 보여줄 것을 의미함.
          />
          {/* New To Do 제목 아래 적을 내용. 제목란은 상단 고정하는 반면, 내용란은 Scroll을 내릴 수 있어야 함. */}
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo =>
              <ToDo
                key={toDo.id}
                {...toDo}
                deleteToDo={this._deleteToDo} //deleteToDo는 _deleteToDo 함수임.
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  //text input의 value를 관리하기 위한 함수
  _controlNewToDo = text => { //이벤트로부터 'text'를 가져옴
    this.setState({
      newToDo: text
    })
  }

  //TODO 리스트 로딩이 끝나면 loadedToDos의 state를 true로 바꾼다.
  _loadToDos = () => {
    console.log("_loadToDos");
    this.setState({
      loadedToDos: true
    })
  }

  _addToDo = () => {
    console.log("Adding New one");
    const { newToDo } = this.state; //newToDo를 state에서 가져온다.
    if (newToDo !== "") {
      //state를 다시 변경한다. 단, toDo를 변경하는 것이 아니라 추가하는 것이다(toDos: prevState.toDos + newToDo)
      //원하는 오브젝트를 생성하고, 리스트 끝에 ToDo를 넣고, 리스트를 교체하는 것이 아니라 추가하는 것이다.
      //새로운 ToDo를 추가한다고 state이 바뀌지는 않는다. 
      this.setState(prevState => {
        const ID = uuidv4(); //ID 생성을 위한 라이브러리
        const newToDoObject = { //newToDoObject라는 오브젝트 생성
          [ID]: { // ID가 키
            id: ID, //오브젝트에 ID를 주는 이유: State는 데이터베이스이다!! 그냥 array를 만드는 것보다 object-oriented. 수정, 삭제 등의 기능을 사용하려면 오브젝트가 더 빠르다.
            isCompleted: false,
            text: newToDo, //state에 있음.
            createdAt: Date.now()
          }
        };

        console.log('newToDoObject', newToDoObject)
        //TODo는 자주 수정될 것이고, 삭제도 되고, 완료 표시 및 업데이트도 될 것이다. 그렇다면, Key로서의 id를 가지고 있는 오브젝트 형태가 가장 쉬운 방법이다.
        //많은 ToDo를 저장할 수 있게 하게 위해, array를 만들어서 할 수 도 있지만, 객체로 만들겠다.


        const newState = { //newState은 이전까지의 ToDo 리스트 기록 + 새로운 ToDo Object
          ...prevState,
          newToDo: "", //newToDo를 다시 초기화
          toDos: {
            ...prevState.toDos, //이전 ToDos
            ...newToDoObject    //새로운 ToDo
          }
        };
        console.log('...newState', newState);
        this._saveToDos(newState.toDos) //CRUD 모든 기능에서 리턴하기 전에 TODO를 저장한다        
        return { ...newState }; //작성한 ToDo를 로컬 저장소에 저장을 해야 하고, 리스트에 보여줄 수 있어야 한다.
      });
    }
  };

  //삭제 함수 //삭제를 하려면 id를 가져온다.
  _deleteToDo = (id) => {
    console.log("delete");
    this.setState(prevState => {
      const toDos = prevState.toDos; //모든 todo 목록을 가져와서
      delete toDos[id]; //원하는 id를 삭제한다(오브젝트이므로 id만 삭제해주면 목록 하나를 삭제시킬 수 있다).
      const newState = {
        ...prevState, //prevState엔 삭제하려 했던 항목이 삭제되고 나머지 목록들만 남아있다.
        ...toDos
      };
      this._saveToDos(newState.toDos) //CRUD 모든 기능에서 리턴하기 전에 TODO를 저장한다      
      return { ...newState };
    });
  };

  //TODO list를 완성, 미완성으로 나누기
  _uncompleteToDo = (id) => {
    console.log("_uncompleteToDo");
    this.setState(prevState => {
      const newState = {
        ...prevState, //이전에 있던 state을 주고, 
        toDos: {
          ...prevState.toDos,
          [id]: { //이 id를 갖고있는 새로운 것이 있다면 덮어쓴다.
            ...prevState.toDos[id], //우리가 찾는 ID의 TODO를 찾고, 해당 TODO 이전의 내용에 새로운 덮어쓰고 싶은 내용을 추가. //그리고 이 id 전의 것들을 달라. 즉, text, id, createdAt을 요구하는 것이다.
            isCompleted: false,
          }
        }
      };
      this._saveToDos(newState.toDos) //CRUD 모든 기능에서 리턴하기 전에 TODO를 저장한다      
      return { ...newState };
    });
  };

  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos, //이전의 todo들을 가져온다
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
          }
        }
      };
      this._saveToDos(newState.toDos) //CRUD 모든 기능에서 리턴하기 전에 TODO를 저장한다      
      return { ...newState };
    });
  }

  //텍스트를 변경하기 위한 함수 //ToDo.js는 새로운 텍스트, id를 전달할 것이다.
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState, //newToDo, loadedToDo 등의 prevState을 가져옴.
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], text: text } //_compleToDo에서 isCompleted를 변경했던 것처럼, 여기서는 text를 새 text 내용으로 변경한다.
        }
      };
      this._saveToDos(newState.toDos) //CRUD 모든 기능에서 리턴하기 전에 TODO를 저장한다.
      return { ...newState };
    });
  }

  //데이터를 내 디스크에 저장해 보자.
  _saveToDos = (newToDos) => { //전체 state를 저장하지 않고 to do 오브젝트를 저장한다.
    //const saveToDos = AsyncStorage.setItem("toDos", newToDos); //key: "toDos", value: newToDos
    //윗줄을 실행하면 저장이 안 되고 앱이 강제종료될 수도 있다. async Storage는 오브젝트 저장용이 아니라 string 저장용이기 때문이다. 그러므로 stringify로 형변환 해줘야 한다.
    console.log(JSON.stringify(newToDos));
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };
}
//TODO 저장: 어떻게 TODO가 보이고, 어떻게 저장하고, 디스크를 어떻게 하는지 확인


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
  },

  toDos: {
    alignItems: "center"
  }

});