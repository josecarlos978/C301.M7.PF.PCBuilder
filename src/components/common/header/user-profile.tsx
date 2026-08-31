"use client";

import {
  BillingIcon,
  GearIcon,
  LogoutIcon,
  UserCircleIcon,
} from "@/components/common/header/icons";
import { Avatar, AvatarFallback } from "@/components/tailgrids/core/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailgrids/core/dropdown";
import { AltArrowDownIcon } from "@/utils/icon";
import { logout } from "@/services/auth/actions";
import Link from "next/link";

interface UserProfileMenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

// Login de un solo admin compartido (sin tabla de usuarios), por eso no hay nombre/correo real.
const ADMIN_LABEL = "Administrador";

export function UserProfileButton() {
  const menuItems: UserProfileMenuItem[] = [
    {
      href: "/profile",
      icon: <UserCircleIcon />,
      label: "View profile",
    },
    {
      href: "#",
      icon: <GearIcon />,
      label: "Account Settings",
    },
    {
      href: "#",
      icon: <BillingIcon />,
      label: "Billing and Plan",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-lg border-0 p-0 transition-all outline-none focus-visible:ring-4 focus-visible:ring-input-primary-focus-border/20 focus-visible:ring-offset-1">
        <Avatar>
          <AvatarFallback className="rounded-lg border border-border-secondary-alt bg-background-gray-secondary_alt">
            {ADMIN_LABEL.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm leading-5 font-medium text-text-primary">{ADMIN_LABEL}</span>

        <AltArrowDownIcon className="text-icon-tertiary transition-transform duration-200 group-aria-expanded:-rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent placement="bottom end" className="w-70 overflow-hidden p-0 shadow-3xl">
        <DropdownMenuHeader className="flex w-full items-center justify-start gap-2 border-b border-border-secondary-alt px-4 py-3">
          <Avatar size="md">
            <AvatarFallback className="border border-border-secondary-alt bg-background-gray-secondary_alt">
              {ADMIN_LABEL.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">{ADMIN_LABEL}</span>
          </span>
        </DropdownMenuHeader>

        <DropdownMenuSection className="p-1.5">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              href={item.href}
              className="cursor-pointer px-3 py-2.5"
              render={(domProps) =>
                "href" in domProps ? <Link {...domProps} /> : <div {...domProps} />
              }
            >
              <span className="shrink-0 text-icon-secondary group-hover:text-text-primary">
                {item.icon}
              </span>
              <span className="leading-5 font-medium">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSection>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onAction={() => {
            logout();
          }}
          className="m-1.5 w-auto cursor-pointer px-3 py-2.5"
        >
          <span className="text-icon-secondary group-hover:text-text-primary">
            <LogoutIcon />
          </span>
          <span className="leading-5">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
