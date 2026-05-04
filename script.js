const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");

const player = document.getElementById("player");
const songImg = document.getElementById("songImg");
const songTitle = document.getElementById("songTitle");
const statusText = document.getElementById("status");
const playBtn = document.getElementById("playBtn");

let currentVideoId = "";
let playing = false;

function selectSong(videoId, title) {
  currentVideoId = videoId;

  player.style.display = "flex";
  songImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  songTitle.textContent = title;
  statusText.textContent = "Selected";
  playBtn.textContent = "▶";
  playing = false;
}

playBtn.addEventListener("click", function () {
  if (!currentVideoId) return;

  const selectedCard = [...cards].find(card =>
    card.getAttribute("onclick").includes(currentVideoId)
  );

  if (!selectedCard) return;

  const iframe = selectedCard.querySelector("iframe");

  if (!playing) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "playVideo",
        args: []
      }),
      "*"
    );

    playBtn.textContent = "⏸";
    statusText.textContent = "Now Playing";
    playing = true;
  } else {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "pauseVideo",
        args: []
      }),
      "*"
    );

    playBtn.textContent = "▶";
    statusText.textContent = "Paused";
    playing = false;
  }
});

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase().trim();
  let found = false;

  cards.forEach(card => {
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