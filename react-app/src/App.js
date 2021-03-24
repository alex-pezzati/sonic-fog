import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./services/auth";


import AWS from './components/AWS'


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      const user = await authenticate();
      console.log('USER', user)
      if (!user.errors) {
        setAuthenticated(true);
      }
      setIsLoaded(true);
    })();
  }, []);

  // if (!isLoaded) {
  //   return null;
  // }

  return isLoaded && (
    <BrowserRouter>
      <NavBar isLoaded={isLoaded} authenticated={authenticated} setAuthenticated={setAuthenticated} />
      <Switch>
        {/* <Route path="/login" exact={true}>
          <LoginForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
        </Route> */}
      {/* <Route path="/sign-up" exact={true}>
        <SignUpForm authenticated={authenticated} setAuthenticated={setAuthenticated} />
      </Route> */}
      {/* <ProtectedRoute path="/" exact={true} authenticated={authenticated}>
        <h1>My Home Page</h1>
      </ProtectedRoute> */}
        <Route path="/" exact={true}>
          <h1>Hello Users</h1>
        </Route>
        <ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true} authenticated={authenticated}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/images" exact={true} authenticated={authenticated}>
          <AWS />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
