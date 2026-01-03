export type NavLink = {
    href: string;
    label: string;
}

export const links: NavLink[] =[
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/menu', label: 'Menu' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/contact', label: 'Contact' },
]