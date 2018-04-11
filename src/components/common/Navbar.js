import React from 'react';
// withRouter lets us pass in history from props
import { Link, withRouter } from 'react-router-dom';
// import Auth
import Auth from '../../lib/Auth';

class Navbar2 extends React.Component {

  state = {
    navIsOpen: false
  }

  handleToggle = () => {
    this.setState({ navIsOpen: !this.state.navIsOpen });
  }

  handleLogout = () => {
    Auth.logout();
    this.props.history.push('/login');
  }

  componentWillUpdate() {
    if(this.state.navIsOpen) this.setState({ navIsOpen: false });
  }

  render() {

    const inactiveBottomNav = {
      textAlign: 'center',
      width: '100%',
      height: '60px',
      position: 'fixed',
      zIndex: '3',
      bottom: '0',
      left: '0',
      backgroundColor: 'white',
      color: 'white',
      overflowX: 'hidden',
      transition: '0.5s'
    };

    const activeBottomNav = {
      textAlign: 'center',
      width: '100%',
      height: '300px',
      position: 'fixed',
      zIndex: '3',
      bottom: '0',
      left: '0',
      backgroundColor: 'lightGrey',
      color: 'white',
      overflowX: 'hidden',
      transition: '0.5s',
      overflow: 'scroll'
    };


    const bottomNavLeft = {
      display: 'inline-block',
      width: '30%'
    };

    const bottomNavRight = {
      display: 'inline-block',
      width: '30%'
    };

    const bottomNavMiddle = {
      display: 'inline-block',
      width: '40%',
      verticalAlign: 'top',
      lineHeight: '4em',
      color: 'black'
    };

    const burger = {
      width: '30px',
      height: '30px',
      float: 'left',
      marginLeft: '10px',
      marginTop: '15px'
    };

    const profile = {
      width: '30px',
      height: '30px',
      float: 'right',
      marginRight: '10px',
      marginTop: '15px'
    };

    const contentLogo = {
      marginTop: '10px',
      height: '40px'
    };

    return (
      <div
        style={this.state.navIsOpen ? activeBottomNav : inactiveBottomNav}
      >
        <div style={bottomNavRight}>
          <img
            onClick={this.handleToggle}
            className="nav-button"
            src="/assets/burger.png"
            style={burger}
          />
        </div>
        <div style={bottomNavMiddle}>
          <img src="/assets/content-logo.png" style={contentLogo} />
          {this.state.navIsOpen &&
            <div>
              <div className="bottom-nav-button">
                <Link className="nav-button" to="/">home</Link>
              </div>
              <div className="bottom-nav-button">
                <Link className="nav-button" to="/content">browse</Link>
              </div>
              <div className="bottom-nav-button">
                {Auth.isAuthenticated() &&
                  <a onClick={this.handleLogout} className="nav-button">logout</a>
                }
              </div>
              <div className="bottom-nav-button">
                {!Auth.isAuthenticated() && <Link className="nav-button" to="/login">Login</Link>}
              </div>
              <div className="bottom-nav-button">
                {!Auth.isAuthenticated() && <Link className="nav-button" to="/register">Register</Link>}
              </div>
            </div>
          }
        </div>
        <div style={bottomNavLeft}>
          {Auth.isAuthenticated() && !this.state.navIsOpen &&
              <Link style={profile} className="nav-button" to={`/user/${Auth.getPayload().sub}`}><img src="/assets/profile.png" /></Link>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar2);
