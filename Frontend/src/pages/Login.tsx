
/**
 * Login page component.
 * This component is used to login to the application.
 */

import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import UserContext from "../Context/userContext";
import { Auth } from "../API/Auth-API";


/**
 * Card component.
 * This component is used to display the outlined card.
 */
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

/**
 * SignInContainer component.
 * This component is used to display the container for the sign in form.
 */
const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Login = () => {
  const navigate = useNavigate();
  //state to save the backdrop open/close state
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  //state to save the snackbar open/close state
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  //state to save the snackbar message
  const [snackbarMessage, setSnackbarMessage] = useState<string>("Login successful!!");

  //state to save the snackbar severity
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  //function to handle the close of the snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  //state to save the user data to Context API 
  const { setUser } = useContext(UserContext);

  //state to save the email error
  const [emailError, setEmailError] = useState<boolean>(false);

  //state to save the email error message
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  //state to save the password error
  const [passwordError, setPasswordError] = useState<boolean>(false);

  //state to save the password error message
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

  //state to save the email
  const [email, setEmail] = useState<string>("");

  //state to save the password
  const [password, setPassword] = useState<string>("");

  //function to handle the close of the backdrop
  const handleCloseBackdrop = () : void => {
    setOpenBackdrop(false);
  };

  //function to validate the inputs and fetch the user data from the API
  const fetchData = async () : Promise<void> => {
    try {
      setOpenBackdrop(true);
      //API call to login the user
      const data = await Auth.login(email, password);

      //Checking if the user is logged in successfully
      if (!data.error) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful!!");
        setOpenSnackbar(true);
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          token: data.user.token,
        });
        localStorage.setItem("token", data.user.token);
        navigate("/");
      }else{
        throw new Error(data.message);
      }
      } catch (error: any) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Login failed: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };
  
  //function to handle the submit of the form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) : void => {
    event.preventDefault();
    //if validation fails, prevent the form from submitting and display the error messages
    if (!validateInputs()) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    fetchData();
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  //function to validate the inputs and display the error messages
  const validateInputs = () : boolean => {
    let isValid = true;

    //Checking if the email is valid and displaying the error message if it is not valid
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setSnackbarMessage("Please enter a valid email address.");
      setOpenSnackbar(true);
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    //Checking if the password is valid and displaying the error message if it is not valid
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      setSnackbarSeverity("error");
      setSnackbarMessage("Password must be at least 6 characters long.");
      setOpenSnackbar(true);
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <SignInContainer>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign in
              </Button>
            </Box>
          </Card>
        </SignInContainer>
      </SignInContainer>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}

          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
