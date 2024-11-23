const clientId = '4ad5305537e04829849e01baa716e4d4'; // Deine Client ID
const clientSecret = '9283743107c04edda09bad5480192a8e'; // Dein Client Secret
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI

const authEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Berechtigungen (Scopes), die du für den Zugriff auf die API benötigst
const scopes = 'user-library-read user-read-playback-state user-modify-playback-state';

// Funktion zur Weiterleitung zur Spotify-Auth-Seite
function redirectToSpotifyAuth() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  window.location.href = authUrl;
}

// Funktion zum Austausch des Codes gegen ein Access Token
function exchangeCodeForToken(code) {
  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', code);
  data.append('redirect_uri', redirectUri);
  data.append('client_id', clientId);
  data.append('client_secret', clientSecret);

  // Anfrage zum Token-Endpunkt
  fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data.toString(),
  })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        console.log('Access Token erhalten:', data.access_token);
        // Das Access Token speichern (z.B. im Local Storage)
        localStorage.setItem('access_token', data.access_token);

        // Button-Text ändern, um den Benutzer zu informieren
        document.getElementById('connect-button').textContent = "Erfolgreich verbunden!";
      } else {
        console.error('Fehler beim Abrufen des Access Tokens:', data);
      }
    })
    .catch(error => {
      console.error('Fehler beim Abrufen des Access Tokens:', error);
    });
}

// Hole den Code aus der URL, falls vorhanden
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code'); // Code aus der URL holen

if (code) {
  // Code gegen das Access Token tauschen
  exchangeCodeForToken(code);
} else {
  console.log('Kein Code in der URL gefunden');
}

// Button-Eventlistener
document.getElementById('connect-button').addEventListener('click', function() {
  redirectToSpotifyAuth(); // Weiterleitung zur Authentifizierungsseite
});
