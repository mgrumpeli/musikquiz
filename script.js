// Deine Client ID und Client Secret (direkt von Spotify)
const clientId = '4ad5305537e04829849e01baa716e4d4'; // DEINE CLIENT ID
const clientSecret = '9283743107c04edda09bad5480192a8e'; // DEIN CLIENT SECRET

// Die Redirect URI, die du bei Spotify hinterlegt hast
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI

// Die URL für den Authentifizierungs-Endpunkt
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Die URL, an die das Token gesendet wird
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Die erforderlichen Berechtigungen für die API (Scopes)
const scopes = 'user-library-read user-read-playback-state user-modify-playback-state';
function redirectToSpotifyAuth() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  window.location.href = authUrl; // Weiterleitung zur Spotify-Authentifizierungsseite
}
