export function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
