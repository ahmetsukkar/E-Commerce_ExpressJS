import { Box, Container, TextField, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems, totalAmount } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const addressRef = useRef<HTMLInputElement>(null);

  const handelConfirmOrder = async () => {
    const address = addressRef.current?.value;
    if (!address) return;

    const response = await fetch(`${BASE_URL}/cart/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      return;
    }

    navigate("/ordersuccess");
  };

  const renderCartItems = () => (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={1}
      sx={{
        border: 1,
        borderColor: "#f2f2f2",
        borderRadius: 5,
        padding: 1,
      }}
    >
      {cartItems.map((item) => (
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width="100%"
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={5}
            width="100%"
          >
            <img src={item.image} width={100} />
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width="100%"
            >
              <Typography variant="h6">{item.title}</Typography>
              <Typography>
                {item.quantity} x {item.unitPrice} TL
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
      <Box>
        <Typography variant="body2" sx={{ textAlign: "right" }}>
          Total Amount: {totalAmount.toFixed(2)} TL
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container
      fixed
      sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Checkout</Typography>
      </Box>
      <TextField
        inputRef={addressRef}
        label="Delivery Address"
        name="address"
        fullWidth
      />
      {renderCartItems()}
      <Button onClick={handelConfirmOrder} variant="contained" fullWidth>
        Pay Now
      </Button>
    </Container>
  );
};

export default CheckoutPage;
