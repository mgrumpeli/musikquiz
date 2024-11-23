const clientId = 'DEIN_CLIENT_ID'; // Deine Spotify-Client-ID
const clientSecret = 'DEIN_CLIENT_SECRET'; // Dein Spotify-Client-Secret
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI
const authEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope = 'user-library-read user-read-playback-state user-modify-playback-state'; // Berechtigungen

// 1. Authentifizierung: Benutzer zur Spotify-Anmeldeseite weiterleiten
function redirectToSpotifyAuth() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
  window.location.href = authUrl;
}

// 2. Wenn die Seite zurückkommt, den Authorization Code extrahieren
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get('code');  // Der Code aus der URL

if (authorizationCode) {
  console.log("Authorization Code gefunden:", authorizationCode);
  // Hier rufst du die Token-Funktion auf, um den Access Token zu erhalten
  getAccessToken(authorizationCode);
} else {
  // Wenn kein Code vorhanden ist, starte die Authentifizierung
  redirectToSpotifyAuth();
}

// 3. Holen des Access Tokens mit dem Authorization Code
function getAccessToken(code) {
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', code);
  body.append('redirect_uri', redirectUri);
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);

  fetch(tokenEndpoint, {
    method: 'POST',
    body: body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      const accessToken = data.access_token;
      localStorage.setItem('access_token', accessToken);  // Access Token speichern
      console.log("Access Token erhalten:", accessToken);
      // Nun kannst du die Spotify API mit diesem Token anrufen
      getCurrentTrack(accessToken);
    } else {
      console.error('Fehler beim Abrufen des Access Tokens');
    }
  })
  .catch(error => console.error('Fehler bei der Anfrage:', error));
}

// 4. Abrufen des aktuell abgespielten Songs
function getCurrentTrack(accessToken) {
  const apiEndpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

  fetch(apiEndpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`  // Access Token im Header verwenden
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.item) {
      // Den Titel und Künstler des aktuellen Songs anzeigen
      document.getElementById('track-info').textContent = 
        `Aktueller Song: ${data.item.name} - ${data.item.artists[0].name}`;
    } else {
      console.log('Kein Song gerade abgespielt');
    }
  })
  .catch(error => console.error('Fehler beim Abrufen des Songs:', error));
}

// Beim Laden der Seite: Wenn der Code nicht vorhanden ist, starte die Authentifizierung
window.onload = function() {
  const token = localStorage.getItem('access_token');
  if (token) {
    // Du hast bereits ein Token, also rufe die API auf
    getCurrentTrack(token);
  } else {
    // Andernfalls starte die Authentifizierung
    redirectToSpotifyAuth();
  }
};
