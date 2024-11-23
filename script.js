// Deine Client ID und Client Secret (direkt von Spotify)
const clientId = '4ad5305537e04829849e01baa716e4d4';
const clientSecret = '9283743107c04edda09bad5480192a8e';

// Die Redirect URI, die du bei Spotify hinterlegt hast
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/';

// Die URL für den Authentifizierungs-Endpunkt
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Die URL, an die das Token gesendet wird
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Die erforderlichen Berechtigungen für die API (Scopes)
const scopes = 'user-library-read user-read-playback-state user-modify-playback-state';

// Funktion, um den Code aus der URL zu extrahieren
function getAuthCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
}

// Funktion, um das Access Token zu holen
function getAccessToken(authCode) {
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', authCode); // Der Code, den wir von der URL erhalten haben
  body.append('redirect_uri', redirectUri); // Die gleiche Redirect URI wie bei der Anfrage
  body.append('client_id', clientId); // Deine Client ID
  body.append('client_secret', clientSecret); // Dein Client Secret

  // Anfrage an Spotify, um das Access Token zu erhalten
  fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  })
  .then(response => response.json())  // Wir erwarten eine JSON-Antwort
  .then(data => {
    if (data.access_token) {
      console.log('Access Token:', data.access_token); // Das Token, das du für Spotify-API-Anfragen verwenden kannst
      localStorage.setItem('spotifyAccessToken', data.access_token); // Speichern des Tokens im localStorage
      window.location.href = '/'; // Optional: Weiterleitung zur Startseite nach erfolgreicher Authentifizierung
    } else {
      console.error('Fehler: Kein Access Token erhalten');
    }
  })
  .catch(error => {
    console.error('Fehler beim Abrufen des Tokens:', error);
  });
}

// Wenn der Code in der URL vorhanden ist, holen wir das Access Token
const authCode = getAuthCodeFromUrl();
if (authCode) {
  getAccessToken(authCode); // Wir rufen die Funktion auf, um das Access Token zu holen
}

// Funktion, um den Benutzer zur Spotify-Autorisierungsseite zu leiten
function redirectToSpotifyAuth() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  window.location.href = authUrl; // Weiterleitung zur Spotify-Authentifizierungsseite
}

// Wenn die Seite geladen wird, prüfen wir, ob der Benutzer bereits authentifiziert ist
window.onload = function() {
  // Wenn wir bereits ein Access Token im localStorage haben, brauchen wir den Authentifizierungsprozess nicht mehr
  const storedToken = localStorage.getItem('spotifyAccessToken');
  if (storedToken) {
    console.log('Benutzer bereits authentifiziert');
    // Hier kannst du den Code einfügen, um Spotify-API-Aufrufe zu tätigen, z.B. Playlist laden oder Wiedergabe steuern
  } else {
    console.log('Benutzer nicht authentifiziert');
    // Wenn noch kein Token da ist, leiten wir den Benutzer zur Spotify-Login-Seite weiter
    redirectToSpotifyAuth();
  }
};
