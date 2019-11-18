import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ReactTable from "react-table";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../utils/api";

export class BuyVouchers extends Component {
  state = {
    newItemName: "",
    newItemCategoryId: "",
    newItemSellPrice: 0,
    isLoading: false,
    isSnackBarOpen: false,
    categories: [],
    items: [],
    snackBarMessage: ""
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isSnackBarOpen: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  async componentDidMount() {
    const categoriesResponse = await api.getItemCategories();
    const itemsResponse = await api.getItems();
    this.setState({
      categories: categoriesResponse.data.expectedData.categories,
      items: itemsResponse.data.expectedData.items
    });
  }

  createNewItem = async event => {
    // name, itemCategory, itemSellPrice
    event.preventDefault();
    const name = this.state.newItemName;
    const itemCategory = this.state.newItemCategoryId;
    const itemSellPrice = this.state.newItemSellPrice;

    if (!name || !itemCategory || !itemSellPrice) return;

    const payload = { item: { name, itemCategory, itemSellPrice } };
    this.setState({ isLoading: true });
    const { data } = await api.postItems(payload);
    const { expectedData, message } = data;
    this.setState({
      snackBarMessage: message,
      isSnackBarOpen: true,
      isLoading: false,
      items: expectedData.items
    });
  };

  render() {
    return (
      <div>
        <form noValidate onSubmit={this.createNewItem}>
          <Grid container direction="row-reverse" alignItems="center">
            <Grid item xs={2}>
              <Button
                variant="contained"
                style={{ backgroundgolor: "#8bc34a" }}
                onClick={this.createNewItem}
                type="submit"
              >
                Add New Item
              </Button>
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                id="newItemSellPrice"
                label="Item Sell Price"
                variant="outlined"
                value={this.state.newItemSellPrice}
                onChange={this.handleChange("newItemSellPrice")}
              />
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                value={this.state.newItemCategoryId}
                id="categorySelector"
                select
                variant="outlined"
                onChange={this.handleChange("newItemCategoryId")}
                style={{ width: "100%" }}
              >
                {this.state.categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={1} />

            <Grid item xs={2}>
              <TextField
                id="newItemName"
                label="Item Name"
                variant="outlined"
                value={this.state.newItemName}
                onChange={this.handleChange("newItemName")}
              />
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
            <ReactTable
              expandedRows
              data={this.state.items}
              columns={[
                {
                  Header: "Item Name",
                  accessor: "name"
                },
                {
                  Header: "Item Category",
                  id: "_id",
                  accessor: d => d.itemCategory.name
                },
                {
                  Header: "Item Sell Price",
                  accessor: "itemSellPrice"
                },
                {
                  Header: "Stock Left",
                  accessor: "stockQuantity"
                }
              ]}
            />
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
