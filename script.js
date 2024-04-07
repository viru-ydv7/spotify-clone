// Getting list of songs
let play=document.getElementById("play");
console.log(play);
let songs;
let volumerange=0.1;
let currFolder;

let currentSong=new Audio();
async function getSongs(folder){
    currFolder=folder;
    let a=await fetch(`http://127.0.0.1:3000/vid70_SPOTIFY/songs/${currFolder}/`);
    console.log(a);
    let response=await a.text();
    console.log(response)
    let div=document.createElement('div');
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
        
    }


    // putting songs into the list
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    console.log(songUL);
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ `<li>
        <i class="fa-solid fa-music"></i>
        <div class="songInfo">
            <div>${song.replaceAll("%20"," ")}</div>
        </div>
        <img src="images/play.svg" alt="">
    </li>`;
    }

    // //playing the audio
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata",()=>{
    //     let duration = audio.duration;
    //     console.log(duration);
    // })


    //Attatch an event listerner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>
        {
        e.addEventListener("click",()=>{
            playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML);
            play.src = "images/pause.svg";

        })
        
    });

    return songs;

}

//convertring seconds to minutes
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




const playMusic=(track)=>{

    // let audio=new Audio("/vid70_SPOTIFY/songs/" + track)
    currentSong.src= `/vid70_SPOTIFY/songs/${currFolder}/` + track
    console.log(currentSong.src);
    currentSong.play()
    const songInfoElement=document.querySelector(".song-ki-details");
    songInfoElement.textContent=track;
    document.querySelector(".songTime").innerHTML="00:00//00:00"

};


async function displayAlbums(){
    let a=await fetch(`http://127.0.0.1:3000/vid70_SPOTIFY/songs/${currFolder}/`);
    console.log(a);
    let response=await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    console.log(div);
    
    // console.log(response)
}

async function main()
{
    await getSongs("");
    console.log(songs);

    //displaying all the albums on the page
    displayAlbums();




    //Attach an event listerenr to play and pause

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "images/pause.svg";
        }
        else if(!currentSong.paused){
            currentSong.pause();
            play.src = "images/play.svg";
        }
    
    })



    //Attach an event listerenr for time display

    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);

        document.querySelector(".songTime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%"
    });


    //Attach an event listerener to the seek bar

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        // document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoudingClientRect().width)*100+ "%"
        // console.log(e.target.getBoundingClientRect().width,e.offsetX);
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        console.log((e.offsetX/e.target.getBoundingClientRect().width)*100);
        document.querySelector(".circle").style.left=percent+"%";

        currentSong.currentTime= (percent/100)*currentSong.duration;
    })




    //Attach an event listerner for hamburger
    document.querySelector(".hamburger").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left=0;
    });
    //Attach an event listerner for close icon
    document.querySelector(".close").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left=-100+"%";
    })


    //Attach an evetn listerener to previous and next
    document.querySelector("#previous").addEventListener("click",(e)=>{
        console.log("previous clicked");
        console.log(currentSong.src.split("/").slice(-1));
        console.log(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs);
        //jo current song chal raha hai uski index dhundni hogi in the songs list;
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        index=index-1;
        if(index>=0){
            playMusic(songs[index].replaceAll("%20"," "));
            play.src = "images/pause.svg";
        }
    });


    document.querySelector("#next").addEventListener("click",(e)=>{
        console.log("next clicked");
        console.log(currentSong.src.split("/").slice(-1));
        console.log(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs);
        //jo current song chal raha hai uski index dhundni hogi in the songs list;
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        index=index+1;
        console.log(songs.length);
        if(index<=(songs.length-1)){
            playMusic(songs[index].replaceAll("%20"," "));
            play.src = "images/pause.svg";
        }
    });

    
    //Attach an event listener to the vol button
    document.querySelector(".vol-range").addEventListener("change",(e)=>{
        console.log(e.target,e.target.value)
        volumerange=parseInt(e.target.value)/100;
        console.log(volumerange)
        currentSong.volume=volumerange;

        if (currentSong.volume > 0){
            document.querySelector(".volume>img").src="/vid70_SPOTIFY/images/volume.svg"
        }
    })

    document.querySelector(".volumeButton").addEventListener("click",(e)=>{
        if (currentSong.volume!=0){
            currentSong.volume=0;
            console.log(e.target.src);
            e.target.src="/vid70_SPOTIFY/images/mute.svg"
            console.log(e.target.src);
            console.log(volumerange);
        }
        else if(currentSong.volume==0){
            currentSong.volume=volumerange;
            e.target.src="/vid70_SPOTIFY/images/volume.svg"
        }
    })


    //Load the playlists whenever the card is clicked
    Array.from(document.querySelectorAll(".card")).forEach(e=>{
        e.addEventListener("click",async (item)=>{
            console.log(item.currentTarget.dataset);
            songs= await getSongs(`${item.currentTarget.dataset.folder}`);

            playMusic(songs[0].replaceAll("%20"," "));
            play.src = "images/pause.svg";
            
        })
    })
}

main(); 