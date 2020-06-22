import React, { useRef } from "react";
import styled, { css } from "styled-components/macro";
import Flex from "./Flex";
import { ErrorMessage } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";

const StyledLabel = styled.label<{ hasErrors?: boolean }>`
  display: flex;
  flex-direction: column;

  span {
    font-size: 14px;
    margin-bottom: ${p => p.theme.space.medium}px;
  }

  ${p =>
    p.hasErrors &&
    css`
      color: ${p => p.theme.colors.red};
    `}

  .input__wrapper {
    position: relative;

    input {
      padding-left: 40px;
      padding-right: 40px;
      color: inherit;
    }

    .input__icon {
      position: absolute;
      margin-left: 15px;
    }

    .postfix-icon {
      cursor: pointer;
      margin-right: 15px;
      right: 0;

      &:hover {
        color: ${p => p.theme.colors.primary};
      }
    }
  }
`;

export const InputStyles = css`
  width: 100%;
  border: none;
  border-radius: ${p => p.theme.radius.small}px;
  padding: 10px;

  color: ${p => p.theme.colors.white};
  background-color: ${p => p.theme.colors.dark3};

  &::placeholder {
    color: ${p => p.theme.colors.gray};
  }

  @media (${p => p.theme.media.tablet}) {
    padding: 15px;
  }
`;

const StyledInput = styled.input`
  ${InputStyles}
`;

export const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;

  .text--error {
    font-size: 12px;
    margin-top: 5px;
    margin-left: 0;
    transition: 0.3s;
    transform: translateY(-20px);
    opacity: 0;
    color: ${p => p.theme.colors.red};
    &:before {
      content: "* ";
    }
  }
  .show-error {
    transform: translateY(0);
    opacity: 1;
    transition: 0.3s;
  }
`;

interface InputProps {
  label?: string | React.ReactNode;
  icon?: any;
  postfixIcon?: any;
  inputRef?: any;
  errors?: any;
  onPostfixIconClick?: (input?: HTMLInputElement) => void;
  [x: string]: any;
}

export const Textarea = styled(StyledInput).attrs(p => ({ as: "textarea" }))`
  padding: ${p => p.theme.space.medium}px;
  margin: 0;
`;

export const Input: React.FC<InputProps> = ({
  label,
  inputRef,
  errors,
  icon: Icon,
  postfixIcon: PostFixIcon,
  onPostfixIconClick,
  ...props
}) => {
  let _inputRef = useRef<HTMLInputElement>();
  let hasErrors = errors && errors[props?.name];

  return (
    <InputWrapper className="form--input__wrapper">
      <StyledLabel hasErrors={hasErrors}>
        {label && <span>{label}</span>}

        <Flex align="center" className={!!Icon ? "input__wrapper" : ""}>
          {Icon && <Icon className="input__icon" />}
          <StyledInput
            ref={e => {
              _inputRef.current = e;
              inputRef && inputRef(e);
            }}
            {...props}
          />
          {PostFixIcon && (
            <PostFixIcon
              onClick={() => onPostfixIconClick(_inputRef?.current)}
              className="input__icon postfix-icon"
            />
          )}
        </Flex>
      </StyledLabel>
      {errors && (
        <div
          data-testid="input-error"
          className={`text--error ${hasErrors && "show-error"}`}
        >
          <ErrorMessage errors={errors} name={props?.name} />
        </div>
      )}
    </InputWrapper>
  );
};

export default Input;
