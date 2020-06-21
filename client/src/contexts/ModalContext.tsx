import React, { useContext, useReducer } from "react";

enum ModalStateEnum {
  CreateRoom = "isCreateRoomModalOpen",
  InviteMembers = "isInviteMembersModalOpen",
  UserSettings = "isUserSettingsModalOpen",
}
type ModalTypes = keyof typeof ModalStateEnum;
type ModalValues = typeof ModalStateEnum[keyof typeof ModalStateEnum];

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
interface IModalState extends OptionalRecord<ModalValues, boolean> {}

type ModalActions =
  | { type: "CLOSE"; modal: ModalTypes }
  | { type: "OPEN"; modal: ModalTypes };

const modalReducer = (state: IModalState, action: ModalActions) => {
  switch (action.type) {
    case "CLOSE":
      return {
        ...state,
        [ModalStateEnum[action.modal]]: false,
      };
    case "OPEN":
      return {
        ...state,
        [ModalStateEnum[action.modal]]: true,
      };

    default:
      return state;
  }
};

interface IModalContext {
  dispatch: React.Dispatch<ModalActions>;
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
