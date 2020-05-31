import { useState } from "react";

interface useModalReturn {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}
const useModal = (defaultOpen?: boolean): useModalReturn => {
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  return { openModal, closeModal, isOpen };
};

export default useModal;
