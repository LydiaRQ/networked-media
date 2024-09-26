let addHour = 0;

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
    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    let bg = document.getElementById('background');
    let bttn = document.querySelectorAll('button');

    let totalHour = hour+addHour;
    bg.innerHTML = `After Suicide ${totalHour}h ${minute}m ${second}s`;
    bg.style.backgroundColor = `rgba(148,152,138,${1*totalHour/24})`;
    document.getElementById('scar').style.filter = `brightness(${1-totalHour/26}) saturate(${1+totalHour/30})`;
    document.getElementById('leftIris').style.filter = `brightness(${1+totalHour/9}) saturate(${1-totalHour/25})`;
    document.getElementById('rightIris').style.filter = `brightness(${1+totalHour/9}) saturate(${1-totalHour/25})`;
    
    if(totalHour>18){
        bg.style.color = 'white';
        bttn.forEach(button=>{
            button.style.color = 'white';
        })
    }else if(totalHour<0){
        document.getElementById('scar').style.display = 'none';
        document.getElementById('fly').style.display = 'none';
        bg.style.color = 'black';
        bttn.forEach(button=>{
            button.style.color = 'black';
        })
    }else{
        document.getElementById('scar').style.display = 'block';
        document.getElementById('fly').style.display = 'block';
        bg.style.color = 'black';
        bttn.forEach(button=>{
            button.style.color = 'black';
        })
    }

}
