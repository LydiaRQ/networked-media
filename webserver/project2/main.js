let addHour = 0;
let timer = 0;

window.onload = () => {
    getTime();
    setInterval(getTime,1000);
    document.getElementById("regret").addEventListener('click',()=>{
        addHour-=1;
    });
    document.getElementById("noregret").addEventListener('click',()=>{
        addHour+=1;
    })
}

function getTime(){
    timer+=1;
    let hour = Math.floor(timer/3600);
    let minute = Math.floor(timer%3600/60);
    let second=timer%3600%60;
    
    let bg = document.getElementById('background');
    let bttn = document.querySelectorAll('button');

    let totalHour = hour+addHour;
    bg.innerHTML = `Working for ${totalHour}h ${minute}m ${second}s`;
    bg.style.backgroundColor = `rgba(255,255,255,${1*totalHour/40})`;
    document.getElementById('scar').style.filter = `opacity(${totalHour/24}) saturate(${1+totalHour/30})`;
    document.getElementById('leftIris').style.filter = `brightness(${1+totalHour/9}) saturate(${1-totalHour/25})`;
    document.getElementById('rightIris').style.filter = `brightness(${1+totalHour/9}) saturate(${1-totalHour/25})`;
    document.getElementById('hlContainer').style.filter = `opacity(${1-totalHour/24})`;
    document.getElementById('bcContainer').style.filter = `opacity(${totalHour/24})`;
    
    if(totalHour>12){
        bg.style.color = 'black';
        bttn.forEach(button=>{
            button.style.color = 'black';
        })
    }else if(totalHour<0){
        document.getElementById('scar').style.display = 'none';
        document.getElementById('fly').style.display = 'none';
        bg.style.color = 'white';
        bttn.forEach(button=>{
            button.style.color = 'white';
        })
    }else{
        document.getElementById('scar').style.display = 'block';
        document.getElementById('fly').style.display = 'block';
        bg.style.color = 'white';
        bttn.forEach(button=>{
            button.style.color = 'white';
        })
    }

}
