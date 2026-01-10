import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "../context/Auth/AuthContext";
import { useEffect } from "react";

const MyOrdersPage = () => {
  const { getMyOrders, myOrders } = useAuth();

  useEffect(() => {
    getMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(myOrders);

  return (
    <Container
      fixed
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
        <Typography>My Orders</Typography>
      {myOrders.map((item) => (
        <Box sx={{border:1, borderColor:"gray", borderRadius:2, padding:1}}>
          <Typography>Address: {item.address}</Typography>
          <Typography>Items: {item.orderItems.length}</Typography>
          <Typography>Total: {item.total}</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default MyOrdersPage;
