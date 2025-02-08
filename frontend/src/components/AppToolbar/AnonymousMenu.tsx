import { Button } from "@mui/material";
import { Link as NavLink } from "react-router-dom";

const AnonymousMenu = () => {
  return (
    <>
        <Button
            component={NavLink}
            to="/register"
            sx={{
                fontWeight: "bold",
                color: "#4caf50",
                border: "2px solid #4caf50",
                borderRadius: "10px",
                textTransform: "uppercase",
                margin: "0 8px",
                padding: "6px 24px",
                transition: "all 0.3s",
                "&:hover": {
                    backgroundColor: "#4caf50",
                    color: "#fff",
                },
            }}
        >
            Sign up
        </Button>
        <Button
            component={NavLink}
            to="/login"
            sx={{
                fontWeight: "bold",
                color: "#2196f3",
                border: "2px solid #2196f3",
                borderRadius: "10px",
                textTransform: "uppercase",
                margin: "0 8px",
                padding: "6px 24px",
                transition: "all 0.3s",
                "&:hover": {
                    backgroundColor: "#2196f3",
                    color: "#fff",
                },
            }}
        >
            Sign in
        </Button>
    </>
  );
};

export default AnonymousMenu;
