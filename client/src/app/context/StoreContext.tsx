import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
  const [basket, setBasket] = useState<Basket | null>(null);

  function removeItem(productId: number, quantity: number) {
    if (!basket) return;
    const items = [...basket.items];
    const index = items.findIndex((i) => i.productId === productId);
    if (index >= 0) {
      items[index].quantity -= quantity;
      if (items[index].quantity <= 0) {
        items.splice(index, 1);
      }
      setBasket((prevState) => {
        return { ...prevState!, items };
      });
    }
  }

  // function addItem(productId: number, quantity: number) {
  //   if(!basket){
  //     setBasket(new Basket{
  //       baske
  //     })
  //   }
  // }

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("Ooops - we do not seem to be inside the provider");
  }

  return context;
}
