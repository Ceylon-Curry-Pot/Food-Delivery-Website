/** Returns an error message, or null if the password is acceptable. */
export function checkPassword(password: unknown, name: string, email: string): string | null {
if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters';
}
  // bcrypt silently ignores everything past 72 bytes, so refuse longer passwords.
if (Buffer.byteLength(password) > 72) {
    return 'Password must be 72 characters or fewer';
}
if (
    password.toLowerCase() === name.toLowerCase() ||
    password.toLowerCase() === email.split('@')[0].toLowerCase()
) {
    return 'Password is too easy to guess. Please choose a stronger password.';
    }
return null;
}