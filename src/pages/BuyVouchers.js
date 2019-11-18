import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Select from "react-select";
import ReactTable from "react-table";
import api from "../utils/api";

export class BuyVouchers extends Component {
  state = {
    itemBuy: "",
    itemBuyPrice: 0,
    itemBuyQuantity: 0,
    isLoading: false,
    isSnackBarOpen: false,
    categories: [],
    items: [],
    snackBarMessage: "",
    itemsAutoComplete: [],
    itemBuys: [],
    buyVouchers: []
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isSnackBarOpen: false });
  };

  handleAutoComplete = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleChange = name => event => {
    if (!name || !event) return;
    this.setState({
      [name]: event.target.value
    });
  };

  getTotalPrice = () => {
    let totalPrice = 0;
    this.state.itemBuys.forEach(item => {
      totalPrice += item.itemBuyQuantity * item.itemBuyPrice;
    });
    return totalPrice;
  };

  async componentDidMount() {
    const categoriesResponse = await api.getItemCategories();
    const itemsResponse = await api.getItems();
    const itemsAutoComplete = itemsResponse.data.expectedData.items.map(
      item => ({
        label: item.name,
        value: item._id
      })
    );
    this.setState({
      categories: categoriesResponse.data.expectedData.categories,
      items: itemsResponse.data.expectedData.items,
      itemsAutoComplete
    });
  }

  createBuyVoucher = async () => {
    if (this.state.itemBuys.length === 0) return;
    const buyItems = this.state.itemBuys.map(
      ({ itemBuyId, itemBuyPrice, itemBuyQuantity }) => ({
        _id: itemBuyId,
        quantity: itemBuyQuantity,
        itemBuyPrice
      })
    );
    this.setState({ isLoading: true });
    const { expectedData } = (await api.postBuyVouchers({ buyItems })).data;
    const { status, message, buyVouchers } = expectedData;
    if (status === "success") {
      this.setState({
        isLoading: false,
        snackBarMessage: message,
        isSnackBarOpen: true,
        itemBuys: [],
        buyVouchers,
        itemBuy: "",
        itemBuyPrice: 0,
        itemBuyQuantity: 0
      });
    }
  };

  createNewBuyItem = async event => {
    event.preventDefault();

    const { itemBuy, itemBuyQuantity, itemBuyPrice } = this.state;
    if (!itemBuy) return;
    if (!itemBuy.label || !itemBuy.value || !itemBuyQuantity || !itemBuyPrice) {
      return;
    }

    this.setState(prevState => {
      return {
        itemBuys: [
          ...prevState.itemBuys,
          {
            itemBuyName: prevState.itemBuy.label,
            itemBuyId: prevState.itemBuy.value,
            itemBuyQuantity: prevState.itemBuyQuantity,
            itemBuyPrice: prevState.itemBuyPrice
          }
        ],
        itemBuy: {},
        itemBuyPrice: 0,
        itemBuyQuantity: 0
      };
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.createNewBuyItem}>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <Select
                textFieldProps={{
                  label: "Label",
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                options={this.state.itemsAutoComplete}
                value={this.state.itemBuy}
                onChange={this.handleAutoComplete("itemBuy")}
                isClearable
              />
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                id="itemBuyPrice"
                label="Item Buy Price"
                variant="outlined"
                value={this.state.itemBuyPrice}
                onChange={this.handleChange("itemBuyPrice")}
              />
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                id="itemBuyQuantity"
                label="Item Buy Quantity"
                variant="outlined"
                value={this.state.itemBuyQuantity}
                onChange={this.handleChange("itemBuyQuantity")}
              />
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#8bc34a" }}
                onClick={this.createNewBuyItem}
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid container>
          <Grid item xs={12} style={{ paddingTop: 30, paddingBottom: 30 }}>
            {this.state.isLoading && <LinearProgress />}
            <Divider />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            {
              <ReactTable
                pageSize={5}
                data={this.state.itemBuys}
                columns={[
                  { Header: "Item Name", accessor: "itemBuyName" },
                  { Header: "Item Quantity", accessor: "itemBuyQuantity" },
                  { Header: "Item Price", accessor: "itemBuyPrice" },
                  {
                    Header: "Total",
                    id: "_id",
                    accessor: d => d.itemBuyQuantity * d.itemBuyPrice
                  }
                ]}
              />
            }
          </Grid>
        </Grid>
        <div style={{ marginTop: 32 }} />
        <Grid container>
          <Grid item xs={10} />
          <Grid item xs={2}>
            Total Price: {this.getTotalPrice()} Kyats
          </Grid>
        </Grid>
        <div style={{ marginTop: 32 }} />
        <Grid container>
          <Grid item xs={10} />
          <Grid item xs={2}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={this.createBuyVoucher}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={this.state.isSnackBarOpen}
          autoHideDuration={3000}
          onClose={this.handleClose}
          message={<span>{this.state.snackBarMessage}</span>}
        />
      </div>
    );
  }
}

export default BuyVouchers;
