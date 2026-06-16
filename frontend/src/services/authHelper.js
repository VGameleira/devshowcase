/**
 * Utilitário pra ler o token do localStorage.
 *
 * Separado do AuthContext pra não depender do React,
 * já que o interceptor do axios roda fora do ciclo de vida.
 */
export function getToken() {
  return localStorage.getItem('devshowcase_token');
}
