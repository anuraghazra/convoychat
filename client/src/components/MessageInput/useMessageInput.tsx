import { OnChangeHandlerFunc } from "react-mentions";
import { useRef, useState, useCallback } from "react";

interface useMessageReturn {
  value: string;
  handleChange: OnChangeHandlerFunc;
  handleEmojiClick: (emoji: string) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | undefined>;
}

export const useMessageInput = ({
  defaultValue,
}: { defaultValue?: string } = {}): useMessageReturn => {
  const textareaRef = useRef<HTMLTextAreaElement | undefined>();
  const [value, setValue] = useState<string>(defaultValue || "");

  const handleChange: OnChangeHandlerFunc = useCallback(
    (e, _newValue, _newPlainText, mention) => {
      setValue(e.target.value);
    },
    []
  );

  const handleEmojiClick = useCallback((emoji: any) => {
    setValue(prev => {
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const before = prev.substring(0, start);
      const after = prev.substring(end, prev.length);
      el.selectionStart = 5;
      el.focus();
      return before + emoji.native + after;
    });
  }, []);

  return {
    value,
    setValue,
    handleChange,
    handleEmojiClick,
    textareaRef,
  };
};

export default useMessageInput;
