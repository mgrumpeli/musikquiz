// Deine Client ID und Client Secret (direkt von Spotify)
const clientId = '4ad5305537e04829849e01baa716e4d4'; // DEINE CLIENT ID
const clientSecret = '9283743107c04edda09bad5480192a8e'; // DEIN CLIENT SECRET
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

// Funktion zum Austausch des Codes gegen ein Access Token
function exchangeCodeForToken(code) {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  // Die notwendigen Daten für den Token-Austausch
  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', code);
  data.append('redirect_uri', redirectUri);
  data.append('client_id', clientId);
  data.append('client_secret', clientSecret);

  // Sende die Anfrage zum Token-Endpunkt
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
        // Speichere das Access Token im Local Storage
        localStorage.setItem('access_token', data.access_token);

        // Ändere den Button-Text nach erfolgreicher Verbindung
        document.getElementById('connect-button').textContent = "Erfolgreich verbunden!";
        
        // Optional: Weiterführende Schritte, wie API-Anfragen, hier einfügen
      } else {
        console.error('Fehler beim Abrufen des Access Tokens:', data);
      }
    })
    .catch(error => {
      console.error('Fehler beim Abrufen des Access Tokens:', error);
    });
}

// Hol den Code aus der URL und tausche ihn gegen das Access Token
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code'); // Code aus der URL holen
if (code) {
  exchangeCodeForToken(code); // Wenn der Code vorhanden ist, Token anfordern
} else {
  console.log('Kein Code in der URL gefunden');
}

// Button Eventlistener: Wenn der Button geklickt wird, leite den Benutzer zur Spotify-Authentifizierungsseite weiter
document.getElementById('connect-button').addEventListener('click', function() {
  redirectToSpotifyAuth(); // Benutzer zur Spotify-Auth-Seite weiterleiten
});
