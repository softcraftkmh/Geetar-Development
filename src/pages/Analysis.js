import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactTable from "react-table";
import moment from "moment";
import api from "../utils/api";

export class analysis extends Component {
  state = {
    sellVouchers: [],
    buyVouchers: []
  };

  async componentDidMount() {
    const response = await Promise.all([
      api.getBuyVouchers(),
      api.getSellVouchers()
    ]);
    console.log("TCL: analysis -> componentDidMount -> response", response);
    const { buyVouchers } = response[0].data;
    const { sellVouchers } = response[1].data;
    console.log(
      "TCL: analysis -> componentDidMount -> sellVouchers",
      sellVouchers
    );
    this.setState({ buyVouchers, sellVouchers }, () => console.log(this.state));
  }

  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={12} style={{ margin: "24px 0px" }}>
            <Typography variant="title">The Buy Vouchers: </Typography>
          </Grid>
          <Grid item xs={12}>
            <ReactTable
              pageSize={5}
              data={this.state.buyVouchers}
              SubComponent={row => {
                return (
                  <ReactTable
                    pageSize={3}
                    data={row.original.buyItems}
                    columns={[
                      {
                        Header: "Item Name",
                        accessor: "item.name"
                      },
                      {
                        Header: "Quantity",
                        accessor: "quantity"
                      },
                      {
                        Header: "Buy Price",
                        accessor: "itemBuyPrice"
                      },
                      {
                        Header: "Total Price",
                        accessor: "itemBuyTotalPrice"
                      }
                    ]}
                  />
                );
              }}
              columns={[
                { Header: "Total Price", accessor: "totalPrice" },
                {
                  Header: "Date",
                  accessor: "createdAt",

                  Cell: row => (
                    <div>
                      {moment(row.value).format("MMMM Do YYYY, h:mm:ss a")}
                    </div>
                  )
                }
              ]}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} style={{ margin: "24px 0px" }}>
            <Typography variant="title">The Sell Vouchers: </Typography>
          </Grid>
          <Grid item xs={12}>
            <ReactTable
              pageSize={5}
              data={this.state.sellVouchers}
              SubComponent={row => {
                return (
                  <ReactTable
                    pageSize={3}
                    data={row.original.sellItems}
                    columns={[
                      {
                        Header: "Item Name",
                        accessor: "item.name"
                      },
                      {
                        Header: "Quantity",
                        accessor: "quantity"
                      },
                      {
                        Header: "Buy Price",
                        accessor: "itemBuyPrice"
                      },
                      {
                        Header: "Total Price",
                        accessor: "itemBuyTotalPrice"
                      }
                    ]}
                  />
                );
              }}
              columns={[
                {
                  Header: "Total Price",
                  accessor: "totalPrice"
                },
                {
                  Header: "Date",
                  accessor: "createdAt",

                  Cell: row => (
                    <div>
                      {moment(row.value).format("MMMM Do YYYY, h:mm:ss a")}
                    </div>
                  )
                }
              ]}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default analysis;
