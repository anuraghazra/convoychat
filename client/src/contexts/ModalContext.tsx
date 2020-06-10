import React, { useContext, useReducer } from "react";

type ModalTypes = "InviteMembers" | "CreateRoom";
type ModalValues = "isInviteMembersModalOpen" | "isCreateRoomModalOpen";
type AuthActions =
  | { type: "CLOSE"; modal: ModalTypes }
  | { type: "OPEN"; modal: ModalTypes };

interface IModalState {
  isCreateRoomModalOpen?: boolean;
  isInviteMembersModalOpen?: boolean;
}

const modalStateNameMap: Record<ModalTypes, ModalValues> = {
  InviteMembers: "isInviteMembersModalOpen",
  CreateRoom: "isCreateRoomModalOpen",
};

const modalReducer = (state: IModalState, action: AuthActions) => {
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
