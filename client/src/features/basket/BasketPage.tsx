import { useState } from "react";
import agent from "../../app/api/agent";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  AddCircleOutline,
  DeleteOutline,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utilities/utility";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";

function BasketPage() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [status, setStatus] = useState({
    isLoading: false,
    name: "",
  });

  function handleAddItem(productId: number, name: string) {
    setStatus({ isLoading: true, name });
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .catch((err) => console.error(err))
      .finally(() => setStatus({ isLoading: false, name: "" }));
  }

  function handleRemoveItem(productId: number, quantity: number, name: string) {
    setStatus({ isLoading: true, name });
    agent.Basket.removeItem(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .catch((err) => console.error(err))
      .finally(() => setStatus({ isLoading: false, name: "" }));
  }

  if (!basket || basket.items.length <= 0)
    return <Typography variant="h3">Your shopping cart is empty</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map((item) => (
            <TableRow
              key={item.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    src={item.pictureUrl}
                    alt={item.name}
                    style={{ height: 50, marginRight: 20 }}
                  />
                  <span>{item.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">{currencyFormat(item.price)}</TableCell>
              <TableCell align="center">
                <LoadingButton
                  color="primary"
                  loading={
                    status.isLoading && status.name == "rem" + item.productId
                  }
                  onClick={() =>
                    handleRemoveItem(item.productId, 1, "rem" + item.productId)
                  }
                >
                  <RemoveCircleOutline />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  color="primary"
                  loading={
                    status.isLoading && status.name == "add" + item.productId
                  }
                  onClick={() =>
                    handleAddItem(item.productId, "add" + item.productId)
                  }
                >
                  <AddCircleOutline />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <LoadingButton
                  color="warning"
                  loading={
                    status.isLoading && status.name == "del" + item.productId
                  }
                  onClick={() =>
                    handleRemoveItem(
                      item.productId,
                      item.quantity,
                      "del" + item.productId
                    )
                  }
                >
                  <DeleteOutline />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
          <BasketSummary />
        </TableBody>
      </Table>
      <Button
        component={Link}
        to="/checkout"
        variant="contained"
        size="large"
        fullWidth
      >
        Check Out
      </Button>
    </TableContainer>
  );
}

export default BasketPage;
