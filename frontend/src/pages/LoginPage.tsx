import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log(email)
     console.log(password)

    if (!email || !password) {
      setError("check submitted data");
      return;
    }

    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("API Called")

    if (!response.ok) {
        console.log("!response.ok")
      const result = await response.json();
      setError(result.data);
      return;
    }

    const token = await response.json();

    if (!token) {
      return setError("Incorrect Token");
    }

    login(email, token);
    navigate("/");
  };

  return (
    <Container>
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6">Login</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            border: 1,
            borderColor: "#f5f5f5",
            padding: 2,
          }}
        >
          <TextField inputRef={emailRef} label="Email" name="email"></TextField>
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
          ></TextField>
          <Button variant="contained" onClick={onSubmit}>
            Login
          </Button>
          {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
