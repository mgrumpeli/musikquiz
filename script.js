const clientId = 'DEIN_CLIENT_ID'; // Deine Client ID
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scope = 'user-library-read user-read-playback-state user-modify-playback-state'; // Erforderliche Berechtigungen

// Authentifizierungs-URL erstellen
const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

// Benutzer auf Spotify-Login umleiten
window.location.href = authUrl;
