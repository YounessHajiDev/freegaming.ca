export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined

export function isAdminPassword(input: string): boolean {
  return !!ADMIN_PASSWORD && input === ADMIN_PASSWORD
}
