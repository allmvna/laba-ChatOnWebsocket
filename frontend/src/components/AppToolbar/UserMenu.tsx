import {Button, Menu, MenuItem} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {UserFields} from "../../../types";
import {useAppDispatch} from "../../../app/hooks.ts";
import {logout} from "../../features/users/userThunks.ts";
import {unsetUser} from "../../features/users/userSlice.ts";


interface Props {
  user: UserFields;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(unsetUser());
    handleClose();
  };
  return (
    <>
        <Grid display='flex' mr='30px'>
            <Button
            onClick={handleClick}
            color="inherit"
            sx={{
                fontWeight: "bold",
                transition: "color 0.3s",
                "&:hover": {
                    textDecoration: "underline",
                },
            }}
        >
            Hello, {user.username}!
        </Button>
        </Grid>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          <MenuItem component={NavLink} to="/">Profile</MenuItem>
          <MenuItem component={NavLink} to="/">My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
