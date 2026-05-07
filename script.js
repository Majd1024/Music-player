const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");

const playerBar = document.getElementById("player");
const songImg = document.getElementById("songImg");
const songTitle = document.getElementById("songTitle");
const statusText = document.getElementById("status");
const playBtn = document.getElementById("playBtn");

let players = {};
let currentPlayerId = null;
let isPlaying = false;

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
        onReady: function () {
          console.log(playerId + " ready");
        },
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
    if (currentPlayerId === playerId) {
      isPlaying = false;
      statusText.textContent = "Ended";
      playBtn.textContent = "▶";
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