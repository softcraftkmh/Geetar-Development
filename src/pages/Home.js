import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

export class Home extends Component {
  render() {
    return (
      <div>
        <Grid container spacing={16}>
          <Grid
            item
            xs={4}
            // 1
          >
            <Link to="/analysis">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Analysis
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            // 2
          >
            <Link to="/buy_vouchers">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Buy Voucher
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            // 3
          >
            <Link to="/sell_vouchers">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Sell Voucher
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            // 4
          >
            <Link to="/items">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Items
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            // 5
          >
            <Link to="/categories">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Categories
              </Button>
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
