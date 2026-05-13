import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.scss";

type ButtonVariant = "ghost" | "primary";

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ children, className, variant = "ghost", ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    const { href, type: _type, ...linkProps } = props as ButtonAsLink;

    return (
      <a className={classes} href={href} {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { type: _type, ...buttonProps } = props as ButtonAsButton;

  return (
    <button className={classes} type="button" {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
