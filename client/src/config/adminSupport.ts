/**
 * Support contact shown in the admin Help modal. Both values are optional and
 * come from the build environment; the "Need more help?" block is hidden when
 * neither is set (no placeholder contact details ship in the bundle).
 */
export type AdminSupportContact = {
  email: string | null;
  phone: string | null;
};

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const ADMIN_SUPPORT_CONTACT: AdminSupportContact = {
  email: clean(import.meta.env.VITE_ADMIN_SUPPORT_EMAIL),
  phone: clean(import.meta.env.VITE_ADMIN_SUPPORT_PHONE),
};

export function hasAdminSupportContact(
  contact: AdminSupportContact = ADMIN_SUPPORT_CONTACT,
): boolean {
  return Boolean(contact.email || contact.phone);
}
