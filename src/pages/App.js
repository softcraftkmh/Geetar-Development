import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import Categories from "./Categories";
import Items from "./Items";
import BuyVouchers from "./BuyVouchers";
import SellVouchers from "./SellVouchers";
import Analysis from "./Analysis";
import Home from "./Home";

import MyAppBar from "../components/App/AppBar";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <MyAppBar />
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Route exact path="/" component={Home} />
              <Route exact path="/categories" component={Categories} />
              <Route exact path="/items" component={Items} />
              <Route exact path="/buy_vouchers" component={BuyVouchers} />
              <Route exact path="/sell_vouchers" component={SellVouchers} />
              <Route exact path="/analysis" component={Analysis} />
            </Grid>
            <Grid item xs={1} />
          </Grid>
          <div style={{ height: 50 }} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
