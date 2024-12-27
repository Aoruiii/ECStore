import { TableCell, TableRow, Typography } from "@mui/material";

import { useStoreContext } from "../../app/context/StoreContext";
import { dot } from "mathjs";
import { currencyFormat } from "../../app/utilities/utility";

function BasketSummary() {
  const { basket } = useStoreContext();

  //   if (!basket || basket.items.length <= 0) return <></>;

  const DELIVERY_FEE = 5000;
  const FREE_DELIVERY = 10000;

  const subtotal =
    basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const deliveryFee = subtotal > FREE_DELIVERY ? 0 : DELIVERY_FEE;

  const total = subtotal + deliveryFee;

  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          Subtotal
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          Delivery Fee (Free For Order over $100)
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          Total
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">{currencyFormat(total)}</TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
    </>
  );
}

export default BasketSummary;
