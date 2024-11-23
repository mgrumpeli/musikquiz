// Deine Spotify App-Daten
const clientId = '4ad5305537e04829849e01baa716e4d4';  // Deine Client-ID
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/';  // Deine Redirect URI
const authEndpoint = 'https://accounts.spotify.com/authorize'; // Spotify Auth Endpoint

// Funktion zur Erstellung der Authentifizierungs-URL
function generateAuthUrl() {
  const scope = 'user-library-read user-read-playback-state user-modify-playback-state'; // Berechtigungen
  const responseType = 'code'; // Wir benötigen den Autorisierungscode

  // Erstelle die URL mit den Parametern
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

  console.log(authUrl); // Gibt die Auth-URL in der Konsole aus, damit du sie überprüfen kannst

  // Umleitung zur Authentifizierungsseite von Spotify
  window.location.href = authUrl;
}

// Aufruf der Funktion beim Laden der Seite
window.onload = function() {
  generateAuthUrl();
};
