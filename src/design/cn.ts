/** Junta classes ignorando falsy. Mantido minúsculo de propósito —
 *  o projeto não precisa de tailwind-merge para o que faz hoje. */
export function cn(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(' ')
}
