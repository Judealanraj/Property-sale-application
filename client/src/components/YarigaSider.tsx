import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemedSider as DefaultSider } from "@refinedev/mui";
import { useLogout } from "@refinedev/core";
import logo from "../assets/logo.svg";

export const YarigaSider = (props: any) => {
  const { mutate: logout } = useLogout();

  return (
    <div className="yariga-sider-root">
      <DefaultSider
        {...props}
        render={({ items, collapsed }) => (
          <>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              py={2}
              gap={1}
            >
              <img
                src={logo}
                alt="YARIGA Logo"
                style={{
                  height: collapsed ? "32px" : "48px",
                  transition: "height 0.2s",
                }}
              />
              {!collapsed && (
                <Typography variant="h6" fontWeight={700}>
                  YARIGA
                </Typography>
              )}
            </Box>

            {items}

            <Box mt="auto" p={1}>
              <ListItemButton onClick={() => logout()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </Box>
          </>
        )}
      />
    </div>
  );
};
