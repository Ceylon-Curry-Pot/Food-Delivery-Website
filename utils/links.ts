export type NavLink = {
  href:  string;
  label: string;
};

export const links: NavLink[] = [
  { href: '/home',    label: 'Home'    },
  { href: '/menu',    label: 'Menu'    },
  { href: '/tracker', label: 'Tracker' },
  { href: '/loyalty', label: 'Rewards' },
  { href: '/about',   label: 'About'   },
  { href: '/contact', label: 'Contact' },
];