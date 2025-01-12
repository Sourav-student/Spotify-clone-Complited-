let currentSong = new Audio();
let songs;
let currFolder;
let artists = Math.random()
if (artists < 0.13) {
  artists = "Pritam"
}
else if (artists < 0.23) {
  artists = "Arijit"
}
else if (artists < 0.33) {
  artists = "Udit Narayan"
}
else if (artists < 0.43) {
  artists = "Atif Aslam"
}
else if (artists < 0.53) {
  artists = "Anirudh"
}
else if (artists < 0.66) {
  artists = "Sourav"
}
else if (artists < 0.76) {
  artists = "Sachin-Jigar"
}
else if (artists < 0.86) {
  artists = "Vishal Mishra"
}

else {
  artists = "A.R. Rahman"
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`

}




async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`/songs/${folder}/`);
  let response = await a.text();
  console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }

  }

  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `  <li>
                                <img src="music.svg" alt="" style="filter:invert(1);padding-right:5px; ">
                                <div class="names">
                                    <p> ${song.replaceAll("%20", " ")} </p>
                                    <p>${artists} </p>
                                </div>
                                <div class="control">
                                    Play Now
                                    <img src="play.svg" alt="" style="filter:invert(1); padding-left:5px; ">
                                </div> </li>`;
  }


  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.getElementsByClassName("names")[0].childNodes[1].innerHTML.trim())
    })

  })

  return songs

}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "pause.svg"
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function main() {

  // get the list of all the songs
  await getsongs("songs/ncs");
  playMusic(songs[0], true)



  //Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "play.svg"
    }
  })

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }

  })


  prvious.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }

  })


  //listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //add an event listneer to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  document.querySelector(".volumebar").getElementsByTagName("input")[0].addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100
  })

  //Load the playlist whenever card is clicked

  Array.from(document.getElementsByClassName("artistsphoto")).forEach(e => {
    e.addEventListener("click", async item => {
      console.log("Fetching Songs")
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])

    })
  })


}

main()

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".container1").style.left = "0px"
})

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".container1").style.left = "-100%"
})

const element1 = document.getElementsByClassName("hi");

for (let i = 0; i < element1.length; i++) {
  const element = element1[i];
  element.addEventListener("click", () => {
    document.querySelector(".container1").style.left = "0px"

  })

}