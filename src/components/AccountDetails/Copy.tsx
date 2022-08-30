import { Trans } from "@lingui/macro";

import useCopyClipboard from "hooks/useCopyClipboard";
import React, {
  forwardRef,
  HTMLProps,
  ReactNode,
  useCallback,
  useImperativeHandle,
} from "react";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink as ExternalLinkIconFeather,
  Link as LinkIconFeather,
  Trash,
  X,
} from "react-feather";
import styled, { css, keyframes } from "styled-components/macro";

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme, disabled }) => (disabled ? "#C3C5CB" : "#2172E5")};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :active {
    text-decoration: none;
  }
`;
export const OPACITY_HOVER = 0.6;
export const OPACITY_CLICK = 0.4;

export const ClickableStyle = css`
  text-decoration: none;
  cursor: pointer;

  :hover {
    opacity: ${OPACITY_HOVER};
  }
  :active {
    opacity: ${OPACITY_CLICK};
  }
`;

const CopyHelperContainer = styled(LinkStyledButton)<{ clicked: boolean }>`
  ${({ clicked }) => !clicked && ClickableStyle};
  color: ${({ color, theme }) => color || "#FB118E"};
  padding: 0;
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ color, theme }) => color || "#FB118E"};
  }
`;
const CopyHelperText = styled.span<{ fontSize: number }>`
  ${({ theme }) => theme.flexRowNoWrap};
  font-size: ${({ fontSize }) => fontSize + "px"};
  font-weight: 400;
  align-items: center;
`;
const CopiedIcon = styled(CheckCircle)`
  color: ${({ theme }) => "#76D191"};
  stroke-width: 1.5px;
`;
interface CopyHelperProps {
  link?: boolean;
  toCopy: string;
  color?: string;
  fontSize?: number;
  iconSize?: number;
  gap?: number;
  iconPosition?: "left" | "right";
  iconColor?: string;
  children: ReactNode;
}

export type CopyHelperRefType = { forceCopy: () => void };
export const CopyHelper = forwardRef<CopyHelperRefType, CopyHelperProps>(
  (
    {
      link,
      toCopy,
      color,
      fontSize = 16,
      iconSize = 20,
      gap = 12,
      iconPosition = "left",
      iconColor,
      children,
    }: CopyHelperProps,
    ref
  ) => {
    const [isCopied, setCopied] = useCopyClipboard();
    const copy = useCallback(() => {
      setCopied(toCopy);
    }, [toCopy, setCopied]);

    useImperativeHandle(ref, () => ({
      forceCopy() {
        copy();
      },
    }));

    const BaseIcon = isCopied ? CopiedIcon : link ? LinkIconFeather : Copy;

    return (
      <CopyHelperContainer onClick={copy} color={color} clicked={isCopied}>
        <div style={{ display: "flex", flexDirection: "row", gap }}>
          {iconPosition === "left" && (
            <BaseIcon size={iconSize} strokeWidth={1.5} color={iconColor} />
          )}
          <CopyHelperText fontSize={fontSize}>
            {isCopied ? <Trans>Copied!</Trans> : children}
          </CopyHelperText>
          {iconPosition === "right" && (
            <BaseIcon size={iconSize} strokeWidth={1.5} color={iconColor} />
          )}
        </div>
      </CopyHelperContainer>
    );
  }
);
CopyHelper.displayName = "CopyHelper";
