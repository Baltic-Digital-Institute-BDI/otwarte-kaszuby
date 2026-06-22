// Strona główna · render hardcoded version (full visual parity z backup)
// Storyblok story 'home' jest dostępna do edycji przez Aleksandrę, ale frontend wyświetla
// pełną wersję hardcoded żeby zagwarantować 1:1 wygląd. W przyszłości można aktywować
// override przez Storyblok edytując sekcje story 'home' (wówczas Storyblok wins).
import HomePageHardcoded from './_hardcoded'

export const metadata = {
  title: 'Stowarzyszenie Otwarte Kaszuby',
  description: 'Łączymy ludzi, kultury i społeczności na Kaszubach. Stowarzyszenie OPP działa od 2018 roku.',
}

export default function HomePage() {
  return <HomePageHardcoded />
}
