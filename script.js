let player;
let isPlaying = false;

function onYouTubeIframeAPIReady(){
  player = new YT.Player("youtube-player", {
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event){

  if(event.data === YT.PlayerState.PLAYING){
    isPlaying = true;
    document.getElementById("player").classList.remove("empty");
    document.getElementById("status").textContent = "Now Playing";
    document.getElementById("playBtn").textContent = "⏸";
  }

  if(event.data === YT.PlayerState.PAUSED){
    isPlaying = false;
    document.getElementById("status").textContent = "Paused";
    document.getElementById("playBtn").textContent = "▶";
  }

  if(event.data === YT.PlayerState.ENDED){
    isPlaying = false;
    document.getElementById("status").textContent = "Ended";
    document.getElementById("playBtn").textContent = "▶";
  }
}

document.getElementById("playBtn").addEventListener("click", function(){

  if(!player) return;

  if(isPlaying){
    player.pauseVideo();
  }else{
    player.playVideo();
  }

});
