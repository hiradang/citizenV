// import './App.css';
import { Route, Switch, Redirect } from 'react-router';
import HomePage from './components/home-page/home-page';
import { roleA } from './constants/listItem';
import Login from './components/home-page/Login'
function App() {
  return (
    <div className="App">
      <Switch>
        <Redirect from="/" to="/trangchu" exact></Redirect>
        <Route path='/login' exact component ={Login}></Route>
        <Route path="/">
          <HomePage listItems={roleA} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
