import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as navi from '../../actions/NavigationActions'
import logo from '../../layout/img/logo.png'
import backbtn from '../../layout/img/zur_vorherigen_Seite.png'

var page = require('../../constants/pageNames')

const mapStateToProps = state => {
	return state
}

class Header extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userID: this.props.userID,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage,
			previousPage: this.props.previousPage
		}
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target
		const { getSwitchToHomePageAction } = this.props
		const { getSwitchToRoomPageAction } = this.props
		const { getSwitchToRoomSettingsAction } = this.props
		const { getSwitchToHostRoomAction } = this.props

		window.location.reload()
	}

	render() {
		return (
			<>
				<header>
					<nav>
						<img src={logo} id="headerlogo" alt="User Avatar Icon" onClick={this.handleClick} />
					</nav>
				</header>
			</>
		)
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({ getSwitchToHomePageAction: navi.getSwitchToHomePageAction }, dispatch)

const ConnectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header)
export default ConnectedHeader

// export default Header;
