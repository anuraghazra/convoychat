import React, { useContext, useReducer } from "react";

interface IModalState {
  isCreateRoomModalOpen?: boolean;
  isInviteMembersModalOpen?: boolean;
}

interface IModalContext {
  dispatch: React.Dispatch<AuthActions>;
  state: IModalState;
}
const ModalContext = React.createContext<IModalContext>({
  dispatch: () => {},
  state: {},
});

const useModalContext = () => {
  return useContext(ModalContext);
};

type AuthActions =
  | { type: "CLOSE"; modal: string }
  | { type: "OPEN"; modal: string };

const modalReducer = (state: IModalState, action: AuthActions) => {
  const modalStateNameMap = {
    InviteMembers: "isInviteMembersModalOpen",
    CreateRoom: "isCreateRoomModalOpen",
  };

  switch (action.type) {
    case "CLOSE":
      return {
        ...state,
        [modalStateNameMap[action.modal]]: false,
      };
    case "OPEN":
      return {
        ...state,
        [modalStateNameMap[action.modal]]: true,
      };

    default:
      return state;
  }
};

const ModalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, {
    isCreateRoomModalOpen: false,
    isInviteMembersModalOpen: false,
  });

  return (
    <ModalContext.Provider
      value={{
        dispatch,
        state,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, ModalContext, useModalContext };
