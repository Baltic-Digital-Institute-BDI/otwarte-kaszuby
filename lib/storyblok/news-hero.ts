import type { AktualnoscContent, StoryblokAsset } from './types'

/**
 * Zdjecie glowne aktualnosci — jedno miejsce decyzji (lista, strona szczegolowa, podglad w edytorze).
 *
 * - Schemat Storyblok (blok `aktualnosc`) ma pole `zdjecie` — w edytorze podpisane "Zdjecie hero".
 *   Tu zapisuje redaktorka.
 * - Artykuly zmigrowane ze starej strony maja zdjecie w polu `zdjecie_hero` (spoza schematu,
 *   w edytorze niewidoczne).
 *
 * Pierwszenstwo ma pole z edytora; stare pole jest tylko zapasem.
 */
export function newsHeroAsset(c?: Partial<AktualnoscContent> | null): StoryblokAsset | undefined {
  if (c?.zdjecie?.filename) return c.zdjecie
  if (c?.zdjecie_hero?.filename) return c.zdjecie_hero
  return undefined
}
