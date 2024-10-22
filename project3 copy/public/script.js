//Scrolling pages
let currentSection = 0
let sections = document.querySelectorAll('.main')
let totalS = sections.length;
let slowScro = false;
let addSec = 0;

//Images
let colors = ['#1a0d4b','#5642a8','#9380e4','#d1c6ff','#8372c8'];
let imageSrc = [];
let totalImg = 67; //The amount of images! changable
let gridContainer = document.getElementById("gridContainer");
let scrollSpeed = 1;
let speed = 0.5;
let imgArray=[];



window.onload=()=>{
    
    let addSec = parseInt(document.getElementById('type').dataset.pageType);
    function scrollSec(index){
        sections[index].scrollIntoView({behavior:'smooth'});
    }


    window.addEventListener('wheel',(event)=>{
        if(slowScro)return
        slowScro = true
        
        if(event.deltaY>0){ //if scrolldown
            if(currentSection<totalS-1){
                currentSection++;
                scrollSec(currentSection)
            }
        }else{
            if(currentSection>0){
                currentSection--;
                scrollSec(currentSection);
            }
        }

        setTimeout(()=>{
            slowScro = false
        },700)
    })
    // document.getElementById('right1').addEventListener('click',()=>{
    //     currentSection=1;
    //     scrollSec(currentSection);
    // })
    document.getElementById('left1').addEventListener('click',()=>{
        currentSection = 1;
        scrollSec(currentSection-addSec);
    })
    document.getElementById('left2').addEventListener('click',()=>{
        currentSection = 2;
        scrollSec(currentSection-addSec);
    })
    document.getElementById('left3').addEventListener('click',()=>{
        currentSection = 3;
        scrollSec(currentSection-addSec);
    })
    document.getElementById('left4').addEventListener('click',()=>{
        currentSection = 4;
        scrollSec(currentSection-addSec);
    })
    document.getElementById('right4').addEventListener('click',()=>{
        currentSection = 4;
        scrollSec(currentSection-addSec);
    })


    for (let i=1; i<=totalImg;i++){
        imageSrc.push(`images/p${i}.jpeg`);
    }

    if (addSec == 0){
        for(let i=0; i<60; i++){
            let randomIndex = Math.floor(Math.random()* imageSrc.length);
            let imgSrc = imageSrc[randomIndex];
    
            let randomColor = Math.floor(Math.random()*colors.length);
            let color = colors[randomColor];
    
            let imgBox = document.createElement('div');
            imgBox.classList.add('imgBox');
            imgBox.innerHTML = `<img src="${imgSrc}">`;
    
            let flipcard = document.createElement('div');
            flipcard.classList.add('flip-card');
    
            let flipcardInner = document.createElement('div');
            flipcardInner.classList.add('flip-card-inner');
    
            let flipcardFront = document.createElement('div');
            flipcardFront.classList.add('flip-card-front');
    
            let flipcardBack = document.createElement('div');
            flipcardBack.style.backgroundColor=color;
            flipcardBack.classList.add('flip-card-back');
            
            flipcardFront.appendChild(imgBox);
            flipcardInner.appendChild(flipcardBack);
            flipcardInner.appendChild(flipcardFront);
            flipcard.appendChild(flipcardInner);
            gridContainer.appendChild(flipcard);
        }
        let flipcard = document.querySelectorAll(".flip-card");
        flipcard.forEach(card=> {
            let inner = card.querySelector('.flip-card-inner');
            card.addEventListener('mouseenter',()=>{
                inner.classList.add('flipped');
            });
            card.addEventListener('mouseleave',()=>{
                setTimeout(()=>{
                    inner.classList.remove('flipped');
                },1000)
            })
        })
    }else{
        
        
        const gallery = document.getElementById('publicGallery');
        const publicInfo = JSON.parse(gallery.getAttribute('data-public-info'));

        let galleries = [
            document.getElementById('gallery1'),
            document.getElementById('gallery2'),
            document.getElementById('gallery3'),
            document.getElementById('gallery4')
        ];
        
        let scrollSpeeds = [speed, -speed, speed, -speed];
        galleries.forEach((gallery, index) => {
            if (gallery) {
                initializeGallery(gallery, index);
        
                let scrollSpeed = scrollSpeeds[index];
                let cloneWidth = gallery.scrollWidth;
                if (scrollSpeed > 0) {
                    gallery.style.transform = `translateX(${-cloneWidth}px)`;
                    addCloneToLeft(gallery); 
                } else {
                    addCloneToRight(gallery); 
                }
        
                let scrollAmount = 0;
                function autoScroll() {
                    scrollAmount += scrollSpeed;
                    if (scrollSpeed > 0 && scrollAmount >= 0) {
                        scrollAmount = -cloneWidth;
                        removeCloneFromRight(gallery);
                        addCloneToLeft(gallery);
                    }
                    if (scrollSpeed < 0 && Math.abs(scrollAmount) >= cloneWidth) {
                        scrollAmount = 0;
                        removeCloneFromLeft(gallery);
                        addCloneToRight(gallery);
                    }
                    gallery.style.transform = `translateX(${scrollAmount}px)`;
        
                    requestAnimationFrame(autoScroll); 
                }
        
                autoScroll();
            } else {
                console.error(`Gallery ${index + 1} not found.`);
            }
        });
        
        for (let i = 0; i < publicInfo.length; i++) {

            let imgElement = document.getElementById(`img${i}`);
            let popup = document.getElementById(`popup${i}`);
            // console.log(popup)
                imgElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    popup.style.display = 'block';
                    console.log('yesss')
                });

                document.addEventListener('click', (event) => {
                    if (!popup.contains(event.target)) {
                        popup.style.display = 'none';
                    }
                });
            
        }
        function initializeGallery(gallery, index) {
            for (let i = index; i < totalImg; i += 4) {
                let imgSrc = imageSrc[i % imageSrc.length];
                let imgBox = document.createElement('div');
                imgBox.classList.add('galleryBox');
                imgBox.innerHTML = `<img src="${imgSrc}" alt="Image ${i}">`;
                gallery.appendChild(imgBox);
            }
        }
        function addCloneToLeft(gallery) {
            let clone = gallery.cloneNode(true);
            gallery.prepend(clone);
        }
        function addCloneToRight(gallery) {
            let clone = gallery.cloneNode(true);
            gallery.appendChild(clone);
        }
        function removeCloneFromLeft(gallery) {
            if (gallery.children.length > 3) {
                gallery.removeChild(gallery.firstElementChild);
            }
        }
        function removeCloneFromRight(gallery) {
            if (gallery.children.length > 3) {
                gallery.removeChild(gallery.lastElementChild);
            }
        }

        //Public gallery start
        let publics = [
            document.getElementById('public1'),
            document.getElementById('public2'),
            document.getElementById('public3'),
        ];
        publics.forEach((publicElem, index) => {
            if (publicElem) {
              initializePublic(publicElem); 
          
              let scrollSpeed = scrollSpeeds[index];
              let cloneWidth = publicElem.scrollWidth;
              let scrollAmount = 0;
              
          
              function autoScrollp() {
                scrollAmount += scrollSpeed;
                if (scrollSpeed > 0 && scrollAmount >= 0) {
                  scrollAmount = -cloneWidth;
                  removeCloneFromRightp(publicElem);
                  addCloneToLeftp(publicElem);
                }
                if (scrollSpeed < 0 && Math.abs(scrollAmount) >= cloneWidth) {
                  
                    scrollAmount = 0;
                  removeCloneFromLeftp(publicElem);
                  addCloneToRightp(publicElem);
                }
          
                publicElem.style.transform = `translateX(${scrollAmount}px)`;
                requestAnimationFrame(autoScrollp);
              }
          
              autoScrollp(); 
            }
          });
         
          //Public gallery edit!!!
          
          function initializePublic(publicElem) {
            let imgCount = publicElem.children.length;
            for (let i = 0; i < imgCount; i++) {
              let randomColor = colors[Math.floor(Math.random() * colors.length)];
              publicElem.children[i].style.backgroundColor = randomColor;
            }
          }
          function addCloneToLeftp(publicElem) {
            let clone = publicElem.cloneNode(true);
            publicElem.prepend(clone);
          }
          function addCloneToRightp(publicElem) {
            let clone = publicElem.cloneNode(true);
            publicElem.appendChild(clone);
          }
          function removeCloneFromLeftp(publicElem) {
            if (publicElem.children.length > 30) {
              publicElem.removeChild(publicElem.firstElementChild);
            }
          }
          function removeCloneFromRightp(publicElem) {
            if (publicElem.children.length > 30) {
              publicElem.removeChild(publicElem.lastElementChild);
            }
          }

          
        
    }
    const uploadForm = document.getElementById('imageUploadForm');
        const popupForm = document.getElementById('popupForm');
        const infoForm = document.getElementById('infoForm');
        const imagePathInput = document.getElementById('imagePath');

        // Image upload
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(uploadForm);
            const response = await fetch('/upload-image', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                imagePathInput.value = data.imagePath; // Store the uploaded image path
                popupForm.style.display = 'block'; 
            } else {
                alert('Image upload failed.');
            }
        });

        infoForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const formData = new FormData(infoForm);
            const response = await fetch('/upload-text', {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            if (response.ok) {
                alert('Image information saved successfully!');
                popupForm.style.display = 'none'; // Hide the popup form
                infoForm.reset(); // Reset the popup form
            } else {
                alert('Failed to save image information.');
            }
        });

        let imageBttn = document.getElementById('submitButton');
        let pop = document.getElementById('popupForm');
        imageBttn.addEventListener('click',function(){
            pop.style.display = 'block';
        });
        let textBttn = document.getElementById('textBttn');
        textBttn.addEventListener('click',function(){
            pop.style.display='none';
        })


        
    

    
    
    
}
