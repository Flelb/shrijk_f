import './App.css'
import React, { Component } from 'react'

import Header from './components/header/Header.js'
import Homepage from './components/homepage/Homepage.js'
import Footer from './components/footer/Footer.js'
import HostRoomPage from './components/pages/HostRoomPage.js'
import PlayerRoomPage from './components/pages/PlayerRoomPage.js'
import GamePage from './components/pages/GamePage.js'
import GameEndPage from './components/pages/GameEndPage.js'
import { connect } from 'react-redux'

var page = require('./constants/pageNames')

const mapStateToProps = state => {
	return state
}

class App extends Component {
	render() {
		let content = <></>
		switch (this.props.currentPage) {
			case page.HOME_PAGE:
				content = <Homepage />
				break

			case page.ROOM_HOST:
				content = <HostRoomPage />
				break

			case page.ROOM_PAGE:
				content = <PlayerRoomPage />
				break

			case page.GAME_PAGE:
				content = <GamePage />
				break

			case page.GAME_END_PAGE:
				content = <GameEndPage />
				break
				
			default:
				content = <></>
				break
		}

		return (
			<>
				<Header />
				{content}
				<Footer />
			</>
		)
	}
}

// export default App;
export default connect(mapStateToProps, null)(App)
