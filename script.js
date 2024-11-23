// Definiere die benötigten Variablen
const clientId = '4ad5305537e04829849e01baa716e4d4';
const clientSecret = '9283743107c04edda09bad5480192a8e';
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI

// Hole den Authorization Code von der URL
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get('code');

// Überprüfe, ob der Authorization Code existiert
if (authorizationCode) {
  // Code aus der URL erhalten und gegen Access Token eintauschen
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  // Vorbereiten der POST-Daten
  const postData = new URLSearchParams();
  postData.append('grant_type', 'authorization_code');
  postData.append('code', authorizationCode);
  postData.append('redirect_uri', redirectUri);
  postData.append('client_id', clientId);
  postData.append('client_secret', clientSecret);

  // Sende POST-Anfrage an Spotify für das Access Token
  fetch(tokenEndpoint, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Zeige das Access Token an oder speichere es
    console.log('Access Token:', data.access_token);
    // Optional: Speichere das Token in LocalStorage oder in einer Variable
    localStorage.setItem('access_token', data.access_token);
  })
  .catch(error => {
    console.error('Fehler beim Abrufen des Access Tokens:', error);
  });
} else {
  console.log('Kein Authorization Code in der URL gefunden.');
}
