import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    agent.Catalog.list()
      .then((data) => setProducts(data))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
