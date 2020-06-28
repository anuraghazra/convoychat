import React, { useContext, useReducer, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "@convoy-ui";
import {
  Me,
  useLogoutMutation,
  useCurrentUserLazyQuery,
} from "graphql/generated/graphql";

interface AuthState {
  user: Me | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContext extends AuthState {
  dispatch: React.Dispatch<AuthActions>;
  login?: any;
  logout?: any;
}
const AuthContext = React.createContext<AuthContext>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  dispatch: () => {},
});

const useAuthContext = () => {
  return useContext(AuthContext);
};

type AuthActions =
  | { type: "AUTH_SUCCESS"; payload: any }
  | { type: "AUTH_FAILED" }
  | { type: "AUTH_RESET" };

const authReducer = (state: AuthState, action: AuthActions) => {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case "AUTH_FAILED":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      };
    case "AUTH_RESET":
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  let [login] = useCurrentUserLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted(data) {
      dispatch({ type: "AUTH_SUCCESS", payload: data.me });
      // if we are in login screen redirect to dashboard
      // else redirect to the path we were on
      const pathName = history.location.pathname;
      const search = history.location.search;
      history.push(pathName === "/login" ? "/" : pathName + search);
    },
    onError() {
      toast.error("Authentication Error");
      dispatch({ type: "AUTH_FAILED" });
    },
  });

  let [logout] = useLogoutMutation({
    onCompleted() {
      dispatch({ type: "AUTH_RESET" });
      history.push("/login");
    },
  });

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        dispatch,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext, useAuthContext };
