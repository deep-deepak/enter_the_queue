import { useRouter } from 'next/router'
import Link from "next/link";
import { ReactNode } from 'react';

interface CustomNavLinkProps {
  children: ReactNode;
  url?: any;
  href: string;
}

function CustomNavLink({ children, url = [], href }: CustomNavLinkProps) {
  const router = useRouter();
  const activeLinkClass = url.includes(router.pathname) || router.pathname == href ? ' active' : "";

  return (
    <li className="nav-item">
      <Link
        href={href}
        passHref
        legacyBehavior
        >
          <a className={`nav-link${activeLinkClass}`}>{children}</a>
      </Link>
    </li>
  );
}

export default CustomNavLink