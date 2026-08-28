import { NavExpandable } from './Expandable';
import { NavItem } from './Item';
import { NavLink } from './Link';
import { NavShortLink } from './ShortLink';

export const Nav = {
  Item: NavItem,
  Link: NavLink,
  ShortLink: NavShortLink,
  Expandable: NavExpandable,
};

export { type INavItemProps } from './Item';
export { type INavLinkProps } from './Link';
export { type INavShortLinkProps } from './ShortLink';
export { type INavExpandableProps } from './Expandable';
