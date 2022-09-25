const SET_WORDS_TO_TYPE = 'SET_WORDS_TO_TYPE';
const ADD_WORDS_TO_TYPE = 'ADD_WORDS_TO_TYPE';
const SET_INPUT_TEXT = 'SET_INPUT_TEXT';
const RESET_ROW_INDEX = 'RESET_ROW_INDEX';
const NEXT_ROW_INDEX = 'NEXT_ROW_INDEX';
const PREV_ROW_INDEX = 'PREV_ROW_INDEX';
const INCREMENT_TIME = 'INCREMENT_TIME';
const MODIFY_LETTER_COUNT = 'MODIFY_LETTER_COUNT';
const SET_ACCURACY_MODE = 'SET_ACCURACY_MODE';
const SET_FINISH = 'SET_FINISH';
/*
Our store should contain the following.

An array of strings containings words for the user to type on.
The current row index
The current user input.
*/

//default State
const defaultState = {
    words_to_type: [],
    current_input: "",
    current_row_index: 0,
    typingFinished: false,
    elapsedTime: 0.0,
    letters_typed: 0,
    accuracyMode: false,
    current_typing_topic: "",
    
    timer_maxTime: 0.0
}
//Reducer
const messageReducer = (state = defaultState, action) => {
    //Since our store is an object, BUT our object is immutable, we must use object assign on an empty object to create a new object.
  switch (action.type) {
    case SET_WORDS_TO_TYPE: {
        return Object.assign({}, state, { words_to_type: action.message, current_typing_topic : action.identifer });
    }
    case ADD_WORDS_TO_TYPE: {
        return Object.assign({}, state, { words_to_type: [...state.words_to_type , action.message ].flat()});
    }
    case SET_INPUT_TEXT: {
        return Object.assign({}, state, { current_input: action.message});
    }
    case RESET_ROW_INDEX: {
        return Object.assign({}, state, { current_row_index : 0, typingFinished: false, current_input: "", elapsedTime: 0, letters_typed: 0});
    }
    case PREV_ROW_INDEX: {
        if (state.current_row_index - 1 >= 0) {
       
            return Object.assign({}, state, { current_row_index : state.current_row_index - 1 });
        } 
        return state;
    }
    case NEXT_ROW_INDEX: {
        if(state.current_row_index + 1 < state.words_to_type.length) {
            return Object.assign({}, state, { current_row_index : state.current_row_index + 1, current_input: ""});
        } 
        else {
            return Object.assign({}, state, { current_row_index : state.current_row_index + 1, typingFinished: true, current_input: ""});
        }   
    }
    case INCREMENT_TIME: {
        return Object.assign({}, state, {elapsedTime: action.message});
    }
    case MODIFY_LETTER_COUNT: {
        return Object.assign({}, state, {letters_typed: state.letters_typed + action.message});
    }
    case SET_ACCURACY_MODE: {
        return Object.assign({}, state, {accuracyMode: action.message});
    }
    case SET_FINISH: {
        return Object.assign({}, state, { typingFinished: true });
    }
    default:
        return state;
  }
};
//Actions
const _setWordsToType = (word, index) => {
    return {
        type: SET_WORDS_TO_TYPE,
        message: word,
        identifer: index
    }
}
const _addWordsToType = (word) => {
    return {
        type: ADD_WORDS_TO_TYPE,
        message: word
    }
}
const  _setInputText = (word) => {
    return {
        type: SET_INPUT_TEXT,
        message: word
    }
}
const _resetRowIndex = () => {
    return {
        type: RESET_ROW_INDEX
    }
}

const _nextRowIndex = () => {
    return {
        type: NEXT_ROW_INDEX
    }
}
const _prevRowIndex = () => {
    return {
        type: PREV_ROW_INDEX
    }
}
const _incrementTime = (time) => {
    return {
        type: INCREMENT_TIME,
        message: time
    }
}
const _modifyLetterCount = (letters) => {
    return {
        type: MODIFY_LETTER_COUNT,
        message: letters
    }
}
const _setAccuracyMode = (mode) => {
    return {
        type:SET_ACCURACY_MODE,
        message: mode
    }
}
const _setFinished = (mode) => {
    return {
        type: SET_FINISH,
        message: mode
    }
}
//Create the store for our data. It takes a reducer which handles what operation has been modified in our state.
const store = Redux.createStore(messageReducer);



  