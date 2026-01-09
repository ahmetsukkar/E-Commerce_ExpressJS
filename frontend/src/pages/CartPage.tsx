import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const CartPage = () => {
  const {
    cartItems,
    totalAmount,
    updateItemInCart,
    removeItemInCart,
    clearCart,
  } = useCart();

  const handelQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    updateItemInCart(productId, quantity);
  };

  const handelRemove = (productId: string) => {
    removeItemInCart(productId);
  };

  const renderCartItems = () => (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      {cartItems.map((item) => (
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            border: 1,
            borderColor: "#f2f2f2",
            borderRadius: 5,
            padding: 1,
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={5}
          >
            <img src={item.image} width={100} />
            <Box>
              <Typography variant="h6">{item.title}</Typography>
              <Typography>
                {item.quantity} x {item.unitPrice} TL
              </Typography>
              <Button
                onClick={() => handelRemove(item.productId)}
                variant="contained"
              >
                Remove Item
              </Button>
            </Box>
          </Box>

          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              onClick={() => handelQuantity(item.productId, item.quantity - 1)}
            >
              -
            </Button>
            <Button
              onClick={() => handelQuantity(item.productId, item.quantity + 1)}
            >
              +
            </Button>
          </ButtonGroup>
        </Box>
      ))}
      <Box>
        <Typography variant="h4">
          Total Amount: {totalAmount.toFixed(2)} TL
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container fixed sx={{ mt: 2 }}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">My Cart</Typography>
        <Button onClick={() => clearCart()} variant="contained">
          Clear Cart
        </Button>
      </Box>

      {cartItems.length ? (
        renderCartItems()
      ) : (
        <Typography>Cart is Empty</Typography>
      )}
    </Container>
  );
};

export default CartPage;
