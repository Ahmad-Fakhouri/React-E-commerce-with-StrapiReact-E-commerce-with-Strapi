import { useTheme } from "@emotion/react";
import { Close } from "@mui/icons-material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import {
  Box,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGetproductByNameQuery } from "../../Redux/product";
import ProductDetails from "./ProductDetails";
const Main = () => {
  // this is for the text inside the category when we change iy from light to dark mood
  const theme = useTheme();

  //this is for the category
  // const [alignment, setAlignment] = useState("left");

  // @ts-ignore
  const handleAlignment = (event, newValue) => {
    if (newValue !== null) {
      setmyDate(newValue);
    }
  };
  //IT'S USED WHEN YOU PRESS THE CART INSIDE THE CARD
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // we put them in variables so they can be filtered
  const allProductsAPI = "products?populate=*";
  const sedanCategoryAPI = "products?populate=*&filters[category][$eqi]=sedan";
  const car4x4CategoryAPI =
    "products?populate=*&filters[category][$eqi]=car%204x4";

  const [myDate, setmyDate] = useState(allProductsAPI);
  //for connecting the DB using API
  const { data, error, isLoading } = useGetproductByNameQuery(myDate);
  //for the product details
  const [clickedProduct, setclickedProduct] = useState({});
  if (isLoading) {
    return (
      <Box sx={{ py: 11, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        sx={{
          py: 11,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          {
            // @ts-ignore
            error.error
          }
        </Typography>

        <Typography variant="h6">Please try again later</Typography>
      </Container>
    );
  }

  if (data) {
    return (
      <Container sx={{ py: 9 }}>
        {/* this stack containts the words and the category */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={3}
        >
          <Box>
            <Typography variant="h6">Selected Services</Typography>
            <Typography fontWeight={300} variant="body1">
              All our Discounted Services
            </Typography>
          </Box>
          {/* this is for the the three selected category  */}
          <ToggleButtonGroup
            color="error"
            value={myDate}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
            //   this code is when the option is selected the below
            sx={{
              ".Mui-selected": {
                border: "1px solid rgba(233, 69, 96, 0.5) !important",
                color: "#e94560",
                backgroundColor: "initial",
              },
            }}
          >
            <ToggleButton
              // @ts-ignore
              sx={{ color: theme.palette.text.primary }}
              className="myButton"
              value={allProductsAPI}
              aria-label="left aligned"
            >
              All Services
            </ToggleButton>
            <ToggleButton
              // @ts-ignore
              sx={{ mx: "16px !important", color: theme.palette.text.primary }}
              className="myButton"
              value={sedanCategoryAPI}
              aria-label="centered"
            >
              Sedan
            </ToggleButton>
            <ToggleButton
              // @ts-ignore
              sx={{ color: theme.palette.text.primary }}
              className="myButton"
              value={car4x4CategoryAPI}
              aria-label="right aligned"
            >
              4x4
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {/* this stack contains the cards */}
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <AnimatePresence>
            {data.data.map((item) => {
              return (
                <Card
                  component={motion.section}
                  layout
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 1.6, type: "spring", stiffness: 50 }}
                  key={item.id}
                  sx={{
                    maxWidth: 333,
                    mt: 6,
                    ":hover .MuiCardMedia-root": {
                      rotate: "1deg",
                      scale: "1.1",
                      transition: "0.35s",
                    },
                  }}
                >
                  <CardMedia
                    sx={{ height: 277 }}
                    // we made a variabale in .env and store the local host so we dont need to call it repetadly
                    // @ts-ignore
                    image={`${item.attributes.productImg.data[0].attributes.url}`}
                    title="green iguana"
                  />
                  <CardContent>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography gutterBottom variant="h6" component="div">
                        {item.attributes.productTitle}
                      </Typography>

                      <Typography variant="subtitle1" component="p">
                        ${item.attributes.productPrice}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {item.attributes.productDescription}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      onClick={() => {
                        handleClickOpen();
                        setclickedProduct(item);
                      }}
                      sx={{ textTransform: "capitalize" }}
                      size="large"
                    >
                      <AddShoppingCartOutlinedIcon
                        sx={{ mr: 1 }}
                        fontSize="small"
                      />
                      Add to cart
                    </Button>
                    <Rating
                      precision={0.1}
                      name="read-only"
                      value={item.attributes.productRating}
                      readOnly
                    />
                  </CardActions>
                </Card>
              );
            })}
          </AnimatePresence>
        </Stack>

        <Dialog
          sx={{ ".MuiPaper-root": { minWidth: { xs: "100%", md: 800 } } }}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <IconButton
            sx={{
              ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
              position: "absolute",
              top: 0,
              right: 10,
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
          {/* <ProductDetails/> */}
          <ProductDetails clickedProduct={clickedProduct} />
        </Dialog>
      </Container>
    );
  }
};
export default Main;
