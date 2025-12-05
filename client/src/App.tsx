import {
  Authenticated,
  AuthProvider,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import VillaOutlinedIcon from "@mui/icons-material/VillaOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import {
  Login,
  Dashboard,
  Home,
  Agent,
  MyProfile,
  PropertyDetails,
  AllProperties,
  CreateProperty,
  EditProperty,
  AgentProfile,
} from "./pages";
import { parseJwt } from "./utils/parse-jwt";
import { YarigaSider } from "./components/YarigaSider";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        try {
          // Send user data to server to create/register user
          const serverUrl =
            import.meta.env.VITE_SERVER_URL || "https://property-sale-application-8ky7porsg-judes-projects-19ab628c.vercel.app";

          console.log("👤 Google login successful. Profile:", {
            name: profileObj.name,
            email: profileObj.email,
            picture: profileObj.picture ? "provided" : "missing",
          });

          console.log("📤 Sending user data to:", `${serverUrl}/api/v1/users`);

          const response = await axios.post(
            `${serverUrl}/api/v1/users`,
            {
              email: profileObj.email,
              name: profileObj.name,
              picture: profileObj.picture,
              googleId: profileObj.sub,
            },
            {
              headers: {
                Authorization: `Bearer ${credential}`,
              },
            }
          );

          console.log("✓ Server response:", response.status, response.data);

          const userData = response.data || {
            ...profileObj,
            avatar: profileObj.picture,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", `${credential}`);

          console.log("✓ User saved to localStorage");

          return {
            success: true,
            redirectTo: "/",
          };
        } catch (error) {
          console.error(
            "❌ Error creating user on server:",
            error instanceof Error ? error.message : String(error)
          );
          // Still allow login locally even if server fails
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
            })
          );
          localStorage.setItem("token", `${credential}`);

          return {
            success: true,
            redirectTo: "/",
          };
        }
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://property-sale-application-8ky7porsg-judes-projects-19ab628c.vercel.app/api/v1")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "dashboard",
                    list: "/dashboard",
                    meta: {
                      icon: <DashboardOutlinedIcon />,
                    },
                  },
                  {
                    name: "properties",
                    list: "/properties",
                    create: "/properties/create",
                    edit: "/properties/edit/:id",
                    show: "/properties/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <VillaOutlinedIcon />,
                    },
                  },
                  {
                    name: "agent",
                    list: "/agent",
                    meta: {
                      icon: <PeopleAltOutlinedIcon />,
                    },
                  },
                  {
                    name: "review",
                    list: "/review",
                    meta: {
                      icon: <StarOutlineRoundedIcon />,
                    },
                  },
                  {
                    name: "message",
                    list: "/message",
                    meta: {
                      icon: <ChatBubbleOutlineIcon />,
                    },
                  },
                  {
                    name: "my-profile",
                    list: "/my-profile",
                    meta: {
                      icon: <AccountCircleOutlinedIcon />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "kcDinl-iafb75-9w8Tsr",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Sider={YarigaSider}
                          Title={() => null}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="dashboard" />}
                    />
                    <Route path="/dashboard">
                      <Route index element={<Dashboard />} />
                    </Route>
                    <Route path="/properties">
                      <Route index element={<AllProperties />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="edit/:id" element={<EditProperty />} />
                      <Route path="show/:id" element={<PropertyDetails />} />
                    </Route>
                    <Route path="/agent">
                      <Route index element={<Agent />} />
                      <Route path=":id" element={<AgentProfile />} />
                    </Route>
                    <Route path="/review">
                      <Route index element={<Home />} />
                    </Route>
                    <Route path="/message">
                      <Route index element={<Home />} />
                    </Route>
                    <Route path="/my-profile">
                      <Route index element={<MyProfile />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
