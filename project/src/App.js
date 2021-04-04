import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AuthService from './utils/ApiUtils/AuthService';
import DashboardUI from './components/Dashboard/DashboardUI';
import Login from './components/Login/Login';

class App extends Component {
  constructor(props){
    super(props);
    AuthService.initializeValidUsers();
    this.state = {
      isLoggedIn: AuthService.isAuthenticated()
    }
  }

  onLogin = () => {
    this.setState({ isLoggedIn: AuthService.isAuthenticated() });
  }

  render(){
    return (
      <Router>
        <Switch>
          {this.state.isLoggedIn && <Route path="/" component={DashboardUI} />}
          <Route exact path="/" render={() => <Login onLogin={this.onLogin} />} />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }
}

export default App;
