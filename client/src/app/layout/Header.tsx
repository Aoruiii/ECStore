import { Label, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const endLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  typography: "h6",
  "&:hover": {
    color: "grey.400",
  },
  "&.active": { color: "text.secondary" },
  textDecoration: "none",
};

interface Props {
  darkMode: boolean;
  changeMode: () => void;
}

function Header({ darkMode, changeMode }: Props) {
  const { basket } = useStoreContext();
  const itemCount = basket
    ? `${basket?.items.reduce((acc, cur) => acc + cur.quantity, 0)}`
    : "0";

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" component={NavLink} to="/" sx={navStyles}>
            MY STORE
          </Typography>
          <Switch
            checked={!darkMode}
            onClick={changeMode}
            color="secondary"
            sx={{ ml: 1 }}
          />
        </Box>

        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={title} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton
            size="large"
            color="inherit"
            edge="start"
            sx={{ mr: 2, textDecoration: "none" }}
            component={Link}
            to={"/basket"}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex" }}>
            {endLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={title}
                sx={navStyles}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
