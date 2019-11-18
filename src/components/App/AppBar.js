import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

const MyAppBar = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography style={{ color: "white" }} variant="h6">
            <Link to="/">
              <Grid container alignItems="center">
                <HomeIcon />
                <span style={{ marginLeft: 8 }} />GeeTar
              </Grid>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ height: 24 }} />
    </div>
  );
};

export default MyAppBar;
