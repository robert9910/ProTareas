export const ADMIN_EMAIL = "robertoaguilarbadilla91@gmail.com";

export function isAdminEmail(email: string | null | undefined) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
