import type { LucideIcon } from 'lucide-react';

export interface SubItemDef {
  name: string;
  path: string;
}

export interface NavItemDef {
  name: string;
  path?: string;
  icon: LucideIcon;
  subItems?: SubItemDef[];
}

export interface RouteNavigationInfo {
  parentTitle: string | null;
  activeTitle: string;
  isNested: boolean;
  activeNavItemName: string | null;
}

/**
 * Checks if a submenu item is active given current pathname and query search.
 * Handles exact query matching (e.g. ?gender=male vs ?gender=female) and sub-routes.
 */
export function isSubItemActive(
  subPath: string,
  currentPathname: string,
  currentSearch: string = '',
  siblingSubItems?: SubItemDef[]
): boolean {
  const [subBasePath, subQuery] = subPath.split('?');
  const cleanCurrentPath = currentPathname.replace(/\/+$/, '') || '/';
  const cleanSubBase = subBasePath.replace(/\/+$/, '') || '/';

  // 1. If this subItem has specific query parameters (e.g. ?gender=male)
  if (subQuery) {
    if (cleanCurrentPath !== cleanSubBase) return false;
    return currentSearch.includes(subQuery);
  }

  // 2. If this subItem has NO query parameters (e.g. /members or /settings)
  if (cleanCurrentPath === cleanSubBase) {
    // If a sibling subItem defines a query param and current search matches that sibling,
    // this base item should not be active (e.g., gender=male matches Male Profiles, not All Members)
    if (siblingSubItems && currentSearch && currentSearch !== '?') {
      const matchingSiblingWithQuery = siblingSubItems.some((sib) => {
        const [, sibQuery] = sib.path.split('?');
        return Boolean(sibQuery && currentSearch.includes(sibQuery));
      });
      if (matchingSiblingWithQuery) {
        return false;
      }
    }
    return true;
  }

  // 3. Nested child route under this subBase (e.g. /settings/password/reset or /members/emp_001)
  if (cleanSubBase !== '/' && cleanCurrentPath.startsWith(cleanSubBase + '/')) {
    // If another sibling is a more specific exact match or closer prefix, do not greedily match this base
    if (siblingSubItems) {
      const hasMoreSpecificSibling = siblingSubItems.some((sib) => {
        if (sib.path === subPath) return false;
        const [sibBase] = sib.path.split('?');
        const cleanSibBase = sibBase.replace(/\/+$/, '') || '/';
        return (
          cleanSibBase.length > cleanSubBase.length &&
          (cleanCurrentPath === cleanSibBase || cleanCurrentPath.startsWith(cleanSibBase + '/'))
        );
      });
      if (hasMoreSpecificSibling) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Checks if a top-level nav item is active (directly or via any child/nested route).
 */
export function isNavItemActive(
  item: NavItemDef,
  currentPathname: string,
  currentSearch: string = ''
): boolean {
  const cleanCurrentPath = currentPathname.replace(/\/+$/, '') || '/';

  // 1. Check if any sub-item is active
  if (item.subItems && item.subItems.length > 0) {
    const hasActiveSub = item.subItems.some((sub) =>
      isSubItemActive(sub.path, cleanCurrentPath, currentSearch, item.subItems)
    );
    if (hasActiveSub) return true;

    // Check if current route is directly on parent path or nested under parent path
    if (item.path) {
      const cleanItemPath = item.path.replace(/\/+$/, '') || '/';
      if (cleanCurrentPath === cleanItemPath) return true;
      if (cleanItemPath !== '/' && cleanCurrentPath.startsWith(cleanItemPath + '/')) {
        return true;
      }
    }
    return false;
  }

  // 2. Direct top-level item without sub-items
  if (!item.path) return false;
  const cleanItemPath = item.path.replace(/\/+$/, '') || '/';

  if (cleanItemPath === '/') {
    return cleanCurrentPath === '/' && (!currentSearch || currentSearch === '?');
  }

  // Exact match
  if (cleanCurrentPath === cleanItemPath) {
    return true;
  }

  // Alias match for support
  if (cleanCurrentPath === '/support' && cleanItemPath === '/help-support') {
    return true;
  }

  // Nested match: e.g. /employees/emp_003 matches /employees
  if (cleanCurrentPath.startsWith(cleanItemPath + '/')) {
    return true;
  }

  // Special match for admin route aliases (e.g. /admin/employees/emp_003 matches /employees)
  if (cleanCurrentPath.startsWith('/admin' + cleanItemPath + '/')) {
    return true;
  }

  return false;
}

/**
 * Calculates breadcrumbs, parent tab name, and dynamic active title for the header.
 */
export function getRouteNavigationInfo(
  allNavItems: NavItemDef[],
  currentPathname: string,
  currentSearch: string = ''
): RouteNavigationInfo {
  const cleanCurrentPath = currentPathname.replace(/\/+$/, '') || '/';

  // 1. Search in subItems first (for accurate active sub-title)
  for (const item of allNavItems) {
    if (item.subItems && item.subItems.length > 0) {
      const sortedSubItems = [...item.subItems].sort((a, b) => b.path.length - a.path.length);
      for (const sub of sortedSubItems) {
        if (isSubItemActive(sub.path, cleanCurrentPath, currentSearch, item.subItems)) {
          return {
            parentTitle: item.name,
            activeTitle: sub.name,
            isNested: true,
            activeNavItemName: item.name,
          };
        }
      }
    }
  }

  // 2. Search in top-level items
  for (const item of allNavItems) {
    if (isNavItemActive(item, cleanCurrentPath, currentSearch)) {
      const cleanItemPath = (item.path || '').replace(/\/+$/, '') || '/';
      const isAlias = cleanCurrentPath === '/support' && cleanItemPath === '/help-support';
      const isNested = !isAlias && cleanCurrentPath !== cleanItemPath && cleanItemPath !== '/';

      let childTitle = item.name;
      if (isNested) {
        if (cleanCurrentPath.includes('/employees/')) {
          childTitle = 'Employee 360° Profile';
        } else if (cleanCurrentPath.includes('/leads/')) {
          childTitle = 'Lead Profile & Activity';
        } else if (cleanCurrentPath.includes('/members/')) {
          childTitle = 'Member Profile Details';
        } else {
          childTitle = `${item.name} View`;
        }
      }

      return {
        parentTitle: isNested ? item.name : null,
        activeTitle: childTitle,
        isNested,
        activeNavItemName: item.name,
      };
    }
  }

  // 3. Fallbacks for unlisted deep routes
  if (cleanCurrentPath.includes('/employees/')) {
    return {
      parentTitle: 'Employees & Access',
      activeTitle: 'Employee 360° Profile',
      isNested: true,
      activeNavItemName: 'Employees & Access',
    };
  }

  return {
    parentTitle: null,
    activeTitle: 'Sindhi Matrimony Admin CRM',
    isNested: false,
    activeNavItemName: null,
  };
}
