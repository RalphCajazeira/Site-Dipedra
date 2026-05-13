import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

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

type ButtonAsRouteLink = CommonProps & {
  to: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouteLink;

export function Button({ children, className, variant = "ghost", ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if ("to" in props && props.to) {
    const { to, type: _type, ...linkProps } = props as ButtonAsRouteLink;

    return (
      <Link className={classes} to={to} {...(linkProps as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}>
        {children}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    const { href, type: _type, ...linkProps } = props as ButtonAsLink;

    return (
      <a className={classes} href={href} {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { type, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      className={classes}
      type={type ?? "button"}
      {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
