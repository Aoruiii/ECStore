import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../utilities/utility";
import agent from "../api/agent";
import Loading from "./Loading";

function App() {
  const { setBasket } = useStoreContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const paletteType = darkMode ? "dark" : "light";

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.items()
        .then((data) => setBasket(data))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <Loading />;

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  function changeMode() {
    setDarkMode((mode) => !mode);
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} changeMode={changeMode} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
