import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { setBasket } = useStoreContext();

  function handleAddItem(productId: number) {
    setIsLoading(true);
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
            sx: { fontWeight: "bold", color: "secondary.main" },
          }}
        ></CardHeader>
        <CardMedia
          sx={{
            height: 140,
            backgroundSize: "contain",
            bgcolor: "primary.light",
          }}
          image={product.pictureUrl}
          title={product.name}
          component={Link}
          to={`/catalog/${product.id}`}
        />
        <CardContent>
          <Typography gutterBottom color="secondary" variant="h5">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand}/${product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            onClick={() => handleAddItem(product.id)}
            loading={isLoading}
          >
            Add To Cart
          </LoadingButton>
          <Button size="small" component={Link} to={`/catalog/${product.id}`}>
            More Details
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ProductCard;
