let playerName = '';
let playerPoints = 0;
let currentSongIndex = 0;
let playlist = []; // Hier werden später die Songs der Playlist gespeichert

// Start des Spiels
function startGame() {
  playerName = document.getElementById('player-name').value;
  if (!playerName) {
    alert('Bitte gib deinen Namen ein!');
    return;
  }

  document.getElementById('player-info').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  
  // Playlist laden
  loadPlaylist();
}

// Playlist laden
function loadPlaylist() {
  const accessToken = localStorage.getItem('access_token');
  const playlistId = '15UCVVElT6HxNsAB3ah1aN'; // Playlist ID von Spotify

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      playlist = data.items;
      playNextSong();
    })
    .catch(error => console.error('Fehler beim Abrufen der Playlist:', error));
}

// Nächsten Song abspielen
function playNextSong() {
  if (currentSongIndex < playlist.length) {
    const song = playlist[currentSongIndex];
    const songName = song.track.name;
    const artist = song.track.artists[0].name;

    // Songname und Künstler anzeigen
    document.getElementById('song-info').textContent = `Song: ${songName} - Artist: ${artist}`;
    
    // Hier könnte die Spotify-Wiedergabe-API eingebunden werden, um den Song abzuspielen
    playSongOnSpotify(song.track.uri);
    
    currentSongIndex++;
  } else {
    alert('Das Spiel ist zu Ende!');
  }
}

// Song über Spotify abspielen
function playSongOnSpotify(songUri) {
  const accessToken = localStorage.getItem('access_token');
  
  fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: [songUri]
    })
  })
    .then(response => {
      if (response.ok) {
        console.log('Song wird abgespielt');
      } else {
        console.error('Fehler beim Abspielen des Songs:', response);
      }
    })
    .catch(error => console.error('Fehler beim Abspielen des Songs:', error));
}

// Antwort überprüfen
function checkAnswer() {
  const answer = document.getElementById('answer').value.trim().toLowerCase();
  const currentSong = playlist[currentSongIndex - 1].track;
  const correctAnswer = currentSong.name.toLowerCase();

  if (answer === correctAnswer) {
    playerPoints++;
    document.getElementById('player-points').textContent = `Punkte: ${playerPoints}`;
    
    // Überprüfen, ob jemand 10 Punkte erreicht hat
    if (playerPoints === 10) {
      alert(`${playerName} hat gewonnen!`);
      // Spiel zurücksetzen
      resetGame();
    }
  } else {
    alert('Leider falsch, versuche es nochmal!');
  }

  document.getElementById('answer').value = ''; // Antwortfeld leeren
}

// Nächsten Song laden
function nextSong() {
  playNextSong();
}

// Spiel zurücksetzen
function resetGame() {
  playerPoints = 0;
  currentSongIndex = 0;
  document.getElementById('player-points').textContent = 'Punkte: 0';
  document.getElementById('answer').value = '';
  loadPlaylist(); // Playlist erneut laden
}
