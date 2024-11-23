const clientId = 'DEIN_CLIENT_ID';
const clientSecret = 'DEIN_CLIENT_SECRET';
const redirectUri = 'https://mgrumpeli.github.io/musikquiz/'; // Deine Redirect URI
const authEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Beispiel-Songs (mit Spotify URIs)
const songs = [
  {
    title: "Sunny",
    artist: "Bobby Hebb",
    spotifyURI: "spotify:track:3N4u8NYy6jZlftGV25rGVk" // Beispiel URI
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    spotifyURI: "spotify:track:3amjTbU8FgIuKqvsZgr8wb" // Beispiel URI
  }
];

// Globales Access Token
let accessToken = '';

// Funktion, um den Benutzer zur Spotify-Auth-Seite weiterzuleiten
function redirectToSpotify() {
  const scopes = 'user-library-read user-read-playback-state user-modify-playback-state';
  const responseType = 'code';
  const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=${responseType}`;

  window.location.href = url;  // Benutzer zur Spotify-Login-Seite weiterleiten
}

// Wenn die Seite geladen wird, versuchen wir, das Access Token zu bekommen
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    getAccessToken(code);  // Wenn ein Code in der URL ist, holen wir das Access Token
  } else {
    redirectToSpotify();  // Sonst starten wir den Authentifizierungsprozess
  }
};

// Funktion, um den Authorization Code gegen ein Access Token zu tauschen
function getAccessToken(code) {
  const body = new URLSearchParams({
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  const headers = {
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  fetch(tokenEndpoint, {
    method: 'POST',
    headers: headers,
    body: body
  })
  .then(response => response.json())
  .then(data => {
    accessToken = data.access_token;
    console.log('Access Token:', accessToken);
    createSongCards();  // Wenn das Token da ist, können wir die Songs erstellen
  })
  .catch(error => console.error('Fehler:', error));
}

// Funktion, um die Song-Karten dynamisch zu erstellen
function createSongCards() {
  const songList = document.getElementById('song-list');
  songs.forEach(song => {
    const songCard = document.createElement('div');
    songCard.classList.add('song-card');
    
    const songTitle = document.createElement('p');
    songTitle.classList.add('song-title');
    songTitle.textContent = `${song.title} - ${song.artist}`;
    songCard.appendChild(songTitle);
    
    songList.appendChild(songCard);
  });
}

// Funktionen für die Buttons

// Play Button
document.getElementById('play-button').addEventListener('click', () => {
  const songUri = songs[0].spotifyURI;  // Beispiel: der erste Song
  playSong(songUri);
});

// Pause Button
document.getElementById('pause-button').addEventListener('click', () => {
  pauseSong();
});

// Next Button (Weiter)
document.getElementById('next-button').addEventListener('click', () => {
  skipSong();
});

// Funktion, um einen Song abzuspielen
function playSong(songUri) {
  const url = `https://api.spotify.com/v1/me/player/play`;
  const body = {
    uris: [songUri]  // Spotify URI des Songs
  };

  fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => console.log('Song wird abgespielt:', data))
  .catch(error => console.error('Fehler beim Abspielen:', error));
}

// Funktion, um einen Song zu pausieren
function pauseSong() {
  const url = `https://api.spotify.com/v1/me/player/pause`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log('Song pausiert:', data))
  .catch(error => console.error('Fehler beim Pausieren:', error));
}

// Funktion, um zum nächsten Song zu springen
function skipSong() {
  const url = `https://api.spotify.com/v1/me/player/next`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log('Zum nächsten Song gewechselt:', data))
  .catch(error => console.error('Fehler beim Weitergehen:', error));
}
