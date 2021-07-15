import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import rootReducer from './reducer/RootReducer'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import initialState from './reducer/initialState'
const middlewares = [thunk]
const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))
export default store

ReactDOM.render(
	<Provider store={store}>
		<script src="../src/utility/socketFunctions.js"></script>
		<script src="/socket.io/socket.io.js"></script>
		<App />
	</Provider>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
