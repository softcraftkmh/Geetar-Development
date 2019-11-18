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

export class SellVouchers extends Component {
  state = {
    itemSell: "",
    itemSellQuantity: 0,
    itemSellPrice: 0,
    isLoading: false,
    isSnackBarOpen: false,
    categories: [],
    items: [],
    snackBarMessage: "",
    itemsAutoComplete: [],
    itemSells: [],
    sellVouchers: [],
    discount: 0
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isSnackBarOpen: false });
  };

  handleAutoComplete = name => value => {
    const foundItem = this.state.items.find(({ _id }) => {
      return _id === value.value;
    });
    this.setState({
      [name]: value,
      itemSellPrice: foundItem.itemSellPrice
    });
  };

  handleChange = name => event => {
    if (!name || !event) return;
    this.setState({
      [name]: event.target.value
    });
  };

  onChangeDiscount = () => event => {
    const { value } = event.target;
    this.setState({ discount: value });
  };

  getTotalPrice = () => {
    let totalPrice = 0;
    this.state.itemSells.forEach(item => {
      totalPrice += item.itemSellTotalPrice;
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

  createSellVoucher = async () => {
    const sellItems = this.state.itemSells.map(
      ({ itemSellId, itemSellQuantity }) => ({
        _id: itemSellId,
        quantity: itemSellQuantity
      })
    );

    this.setState({ isLoading: true });

    const { expectedData } = (await api.postSellVouchers({ sellItems })).data;
    const { status, message, sellVouchers } = expectedData;
    if (status === "success") {
      this.setState({
        isLoading: false,
        snackBarMessage: message,
        isSnackBarOpen: true,
        itemSells: [],
        sellVouchers,
        itemSell: "",
        itemSellPrice: 0,
        itemSellQuantity: 0
      });
    }
  };

  createNewSellItem = async event => {
    event.preventDefault();

    const { itemSell, itemSellQuantity, itemSellPrice } = this.state;
    if (!itemSell) return;
    if (
      (!itemSell.label || !itemSell.value || !itemSellQuantity, !itemSellPrice)
    ) {
      return;
    }

    this.setState(prevState => {
      return {
        itemSells: [
          ...prevState.itemSells,
          {
            itemSellName: prevState.itemSell.label,
            itemSellId: prevState.itemSell.value,
            itemSellQuantity: prevState.itemSellQuantity,
            itemSellPrice: prevState.itemSellPrice,
            itemSellTotalPrice:
              prevState.itemSellPrice * prevState.itemSellQuantity
          }
        ],
        itemSell: {},
        itemSellQuantity: 0,
        itemSellPrice: 0
      };
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.createNewSellItem}>
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
                value={this.state.itemSell}
                onChange={this.handleAutoComplete("itemSell")}
                isClearable
              />
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                id="itemSellQuantity"
                label="Item Sell Quantity"
                variant="outlined"
                value={this.state.itemSellQuantity}
                onChange={this.handleChange("itemSellQuantity")}
              />
            </Grid>

            <Grid item xs={4} />

            <Grid item xs={2}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#8bc34a" }}
                onClick={this.createNewSellItem}
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
                data={this.state.itemSells}
                columns={[
                  { Header: "Item Name", accessor: "itemSellName" },
                  { Header: "Item Quantity", accessor: "itemSellQuantity" },
                  { Header: "Item Prce", accessor: "itemSellPrice" },
                  { Header: "Total", accessor: "itemSellTotalPrice" }
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
          <Grid item xs={10}></Grid>
          <Grid item xs={2}>
            <TextField
              value={this.state.discount}
              onChange={this.onChangeDiscount()}
              label="Discount"
            ></TextField>
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
              onClick={this.createSellVoucher}
            >
              Check Out
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

export default SellVouchers;
