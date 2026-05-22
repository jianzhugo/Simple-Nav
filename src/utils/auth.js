export function isPasswordValidated() {
  const validatedAt = parseInt(localStorage.getItem('passwordValidatedAt')) || 0;
  return (Date.now() - validatedAt) < 60 * 60 * 1000;
}
