const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");

const playerBar = document.getElementById("player");
const songImg = document.getElementById("songImg");
const songTitle = document.getElementById("songTitle");
const statusText = document.getElementById("status");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");

let players = {};
let currentPlayerId = null;
let currentIndex = 0;
let isPlaying = false;
let repeatMode = false;

const songs = [
  {
    playerId: "player1",
    videoId: "y13-xeaShIo",
    title: "Jade LeMac - Constellations"
  },
  {
    playerId: "player2",
    videoId: "SOJpE1KMUbo",
    title: "Dave - Raindance (ft. Tems)"
  },
  {
    playerId: "player3",
    videoId: "7GwLnsVUwHY",
    title: "Don Toliver - E85"
  }
];

function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(tag, firstScript);
}

window.onYouTubeIframeAPIReady = function () {
  createPlayers();
};

function createPlayers() {
  const youtubePlayers = document.querySelectorAll(".youtube-player");

  youtubePlayers.forEach((playerDiv) => {
    const playerId = playerDiv.id;
    const videoId = playerDiv.dataset.videoId;
    const title = playerDiv.dataset.title;

    players[playerId] = new YT.Player(playerId, {
      videoId: videoId,
      playerVars: {
        rel: 0,
        controls: 1,
        playsinline: 1
      },
      events: {
        onStateChange: function (event) {
          handlePlayerStateChange(event, playerId, videoId, title);
        }
      }
    });
  });
}

function handlePlayerStateChange(event, playerId, videoId, title) {
  if (event.data === YT.PlayerState.PLAYING) {
    currentPlayerId = playerId;
    currentIndex = songs.findIndex(song => song.playerId === playerId);
    isPlaying = true;

    pauseOtherSongs(playerId);
    showBottomPlayer(videoId, title, "Now Playing", "⏸");
  }

  if (event.data === YT.PlayerState.PAUSED) {
    if (currentPlayerId === playerId) {
      isPlaying = false;
      statusText.textContent = "Paused";
      playBtn.textContent = "▶";
    }
  }

  if (event.data === YT.PlayerState.ENDED) {

    if (repeatMode) {
      players[playerId].seekTo(0);
      players[playerId].playVideo();
      return;
    }

    if (currentPlayerId === playerId) {
      playNextSong();
    }
  }
}

function showBottomPlayer(videoId, title, status, buttonText) {
  playerBar.style.display = "flex";
  songImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  songTitle.textContent = title;
  statusText.textContent = status;
  playBtn.textContent = buttonText;
}

function pauseOtherSongs(activePlayerId) {
  Object.keys(players).forEach((id) => {
    if (id !== activePlayerId && players[id] && players[id].pauseVideo) {
      players[id].pauseVideo();
    }
  });
}

cards.forEach((card) => {
  card.addEventListener("click", function () {
    const youtubeDiv = card.querySelector(".youtube-player");
    if (!youtubeDiv) return;

    const playerId = youtubeDiv.id;
    const videoId = youtubeDiv.dataset.videoId;
    const title = youtubeDiv.dataset.title;

    currentPlayerId = playerId;
    currentIndex = songs.findIndex(song => song.playerId === playerId);

    showBottomPlayer(videoId, title, "Selected", "▶");

    if (players[playerId] && players[playerId].playVideo) {
      players[playerId].playVideo();
    }
  });
});

playBtn.addEventListener("click", function () {
  if (!currentPlayerId || !players[currentPlayerId]) return;

  if (isPlaying) {
    players[currentPlayerId].pauseVideo();
  } else {
    players[currentPlayerId].playVideo();
  }
});

nextBtn.addEventListener("click", function () {
  playNextSong();
});

prevBtn.addEventListener("click", function () {
  if (!currentPlayerId || !players[currentPlayerId]) return;

  const currentTime = players[currentPlayerId].getCurrentTime();

  if (currentTime > 5) {
    players[currentPlayerId].seekTo(0, true);
    players[currentPlayerId].playVideo();
  } else {
    playPreviousSong();
  }
});

repeatBtn.addEventListener("click", function () {
  repeatMode = !repeatMode;

  if (repeatMode) {
    repeatBtn.classList.add("repeat-active");
  } else {
    repeatBtn.classList.remove("repeat-active");
  }
});

function playNextSong() {
  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }

  playSongByIndex(currentIndex);
}

function playPreviousSong() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }

  playSongByIndex(currentIndex);
}

function playSongByIndex(index) {
  const song = songs[index];

  currentPlayerId = song.playerId;
  currentIndex = index;

  showBottomPlayer(song.videoId, song.title, "Now Playing", "⏸");

  pauseOtherSongs(song.playerId);

  if (players[song.playerId] && players[song.playerId].playVideo) {
    players[song.playerId].playVideo();
  }
}

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase().trim();
  let found = false;

  cards.forEach((card) => {
    const title = card.dataset.title.toLowerCase();

    if (title.startsWith(searchValue)) {
      card.style.display = "block";
      found = true;
    } else {
      card.style.display = "none";
    }
  });

  noResults.style.display = found ? "none" : "block";
});

loadYouTubeAPI();