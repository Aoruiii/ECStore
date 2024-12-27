import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import { ChangeEvent, useEffect, useState } from "react";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

function ProductDetail() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const basketItem = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (basketItem) setQuantity(basketItem.quantity);
    id &&
      agent.Catalog.details(parseInt(id))
        .then((res) => setProduct(res))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
  }, [id, basketItem]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }

  function handleUpdateCart() {
    if (!product) return;
    setIsSubmitting(true);
    if (!basketItem || quantity > basketItem.quantity) {
      const addQuantity = basketItem
        ? quantity - basketItem.quantity
        : quantity;
      agent.Basket.addItem(product.id, addQuantity)
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setIsSubmitting(false));
    } else if (quantity < basketItem.quantity) {
      const removeQuantity = basketItem.quantity - quantity;
      agent.Basket.removeItem(product.id, removeQuantity)
        .then(() => removeItem(product.id, removeQuantity))
        .catch((error) => console.log(error))
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Loading />;
  if (!product) return <NotFound />;

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img src={product.pictureUrl} alt={product.name} width="100%" />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{ mb: 4, mt: 1 }}></Divider>
          <Typography variant="h3" color="secondary">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <TableContainer sx={{ mt: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                type="number"
                label="Quantity"
                fullWidth
                onChange={handleInputChange}
                value={quantity}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                sx={{ height: "55px" }}
                disabled={
                  basketItem
                    ? quantity === basketItem?.quantity
                    : quantity === 0
                    ? true
                    : false
                }
                onClick={handleUpdateCart}
                loading={isSubmitting}
                color="primary"
                size="large"
                variant="contained"
                fullWidth
              >
                {basketItem ? "Update Quantity" : "Add To Cart"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductDetail;
