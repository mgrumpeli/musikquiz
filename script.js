// Deine Client ID und Client Secret (direkt von Spotify)
const clientId = '4ad5305537e04829849e01baa716e4d4'; // DEINE CLIENT ID
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI

// Die URL für den Authentifizierungs-Endpunkt
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Die erforderlichen Berechtigungen für die API (Scopes)
const scopes = 'user-library-read user-read-playback-state user-modify-playback-state';

// Funktion, um den Benutzer zur Spotify-Auth-Seite weiterzuleiten
function redirectToSpotifyAuth() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  window.location.href = authUrl; // Weiterleitung zur Spotify-Authentifizierungsseite
}
