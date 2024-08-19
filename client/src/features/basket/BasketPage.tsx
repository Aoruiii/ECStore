import { useState } from "react";
import agent from "../../app/api/agent";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { dot } from "mathjs";
import {
  AddCircleOutline,
  DeleteOutline,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
function BasketPage() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleAddItem(productId: number) {
    setIsLoading(true);
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }

  function handleRemoveItem(productId: number, quantity: number = 1) {
    setIsLoading(true);
    agent.Basket.removeItem(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }

  if (!basket)
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
              <TableCell align="right">
                ${(item.price / 100).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  <RemoveCircleOutline />
                </IconButton>
                {item.quantity}
                <IconButton
                  color="primary"
                  onClick={() => handleAddItem(item.productId)}
                >
                  <AddCircleOutline />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleRemoveItem(item.productId, item.quantity)
                  }
                >
                  <DeleteOutline />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">
              $
              {(
                dot(
                  basket.items.map((i) => i.price),
                  basket.items.map((i) => i.quantity)
                ) / 100
              ).toFixed(2)}
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasketPage;
