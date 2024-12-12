let addBttn = document.getElementById("add-btn");
let optionBttns = document.getElementById("options");
let openCatContent = null; // Track current catContent
let points = 0; // total points
let likedCats = new Set(); // Track liked cats
let selectedPlant = null; // Current selected plant
let plantIndex = 0; 

window.onload = () => {
    initializeGarden();
    // let bgm = new Audio("/bgm.mp3");
    // bgm.play();
};

function initializeGarden() {
    loadPlants();
    organizeCats();
    updatePointsDisplay();
    addBttn.addEventListener("click", () => {
        optionBttns.classList.toggle("hidden"); 
    });


    // Global click
    document.addEventListener("click", handleGlobalClicks);

    // garden button
    const buildGardenBtn = document.getElementById("buildGardenBtn");
    const plantDiv = document.getElementById("plantDiv");
    buildGardenBtn.addEventListener("click", () => {
        plantDiv.style.display = "flex";
        document.addEventListener("click", closePlantDivOnOutsideClick);
    });

    // Plant select
    plantDiv.addEventListener("click", handlePlantSelection);
    const catsDiv = document.querySelector(".cats");
    catsDiv.addEventListener("click", placePlantInGarden);
}


function handleGlobalClicks(event) {
    const isFishDiv = event.target.closest(".fishDiv");
    const isCatContent = openCatContent && openCatContent.contains(event.target);
    const isCat = event.target.closest(".cat");

    // Keep catContent
    if (isFishDiv || isCatContent || isCat) return;

    if (openCatContent) {
        const catNumber = openCatContent.id.replace("cat", "");
        const fishDiv = document.getElementById(`fish${catNumber}`);
        openCatContent.style.display = "none";
        fishDiv.style.display = "none";
        openCatContent = null;
    }


    if(document.querySelector("audio").paused){
        document.querySelector("audio").play()
    }
}


function showContent(catNumber) {
    const contentDiv = document.getElementById(`cat${catNumber}`);
    const fishDiv = document.getElementById(`fish${catNumber}`);
    const catElement = document.querySelector(`.cat[onclick="showContent('${catNumber}')"]`);

    if (!catElement) {
        console.error(`Cat element with number ${catNumber} not found.`);
        return;
    }

    // Play corresponding sound
    const sound = catElement.getAttribute("data-sound");
    if (sound) {
        const audio = new Audio(`sound${sound}.wav`);
        audio.play();
    }

    if (openCatContent && openCatContent !== contentDiv) {
        const previousCatNumber = openCatContent.id.replace("cat", "");
        const previousFishDiv = document.getElementById(`fish${previousCatNumber}`);
        openCatContent.style.display = "none";
        previousFishDiv.style.display = "none";
    }

    if (contentDiv.style.display === "none" || contentDiv.style.display === "") {
        contentDiv.style.display = "block";
        fishDiv.style.display = "block";
        openCatContent = contentDiv;
    } else {
        contentDiv.style.display = "none";
        fishDiv.style.display = "none";
        openCatContent = null;
    }
}

//click fish
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("fishDiv")) {
        const fishDiv = event.target;
        const catNumber = fishDiv.getAttribute("data-cat-number");

        // Prevent duplicate likes, alert
        if (likedCats.has(catNumber)) {
            alert("You already liked this cat!");
            return;
        }

        likedCats.add(catNumber);

        // Update fish
        const response = await fetch("/update-fish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ catNumber }),
        });

        const result = await response.json();
        if (result.success) {
            const fishCountSpan = fishDiv.querySelector(".fishCount");
            fishCountSpan.textContent = result.fish;
            fishDiv.classList.add("clicked");
            //here
            let fishSound = new Audio(`/fish.wav`);
            fishSound.play();
            points++;
            updatePointsDisplay();
        } else {
            console.error(result.message);
        }
    }
});

//plant selection editing
function handlePlantSelection(event) {
    const plantOption = event.target.closest(".plantOption");
    if (!plantOption || points <= 0) return;

    // Highlighting
    document.querySelectorAll(".plantOption").forEach(option => option.classList.remove("selected"));
    plantOption.classList.add("selected");
    selectedPlant = plantOption.dataset.plant;

    points--;
    updatePointsDisplay();

    const plantImg = document.createElement("img");
    plantImg.src = `/images/plant${selectedPlant}.PNG`;
    plantImg.id = "plantPreview";
    plantImg.style.position = "absolute";
    plantImg.style.pointerEvents = "none";
    plantImg.style.zIndex = 2000;


    plantImg.style.width = "60px"; 
    plantImg.style.height = "60px";

document.body.appendChild(plantImg);

    document.addEventListener("mousemove", movePlantPreview);
}

//preview plant (with mouse)
function movePlantPreview(event) {
    const preview = document.getElementById("plantPreview");
    if (preview) {
        preview.style.left = `${event.pageX}px`;
        preview.style.top = `${event.pageY}px`;
    }
}

//Place selected plant
function placePlantInGarden(event) {
    if (!selectedPlant) return;

    const catsDiv = document.querySelector(".cats");
    const catsRect = catsDiv.getBoundingClientRect();
    const x = event.pageX - catsRect.left;
    const y = event.pageY - catsRect.top;

    // Add plant
    const plantImg = document.createElement("img");
    plantImg.src = `/images/plant${selectedPlant}.PNG`;
    plantImg.style.position = "absolute";
    plantImg.style.left = `${x - 40}px`;
    plantImg.style.top = `${y - 40}px`;
    plantImg.style.width = "20vh";
    plantImg.style.height = "20vh";
    catsDiv.appendChild(plantImg);

    // Remove preview
    const preview = document.getElementById("plantPreview");
    if (preview) preview.remove();
    // selectedPlant = null;
    console.log(selectedPlant)
    // Save plant to server
    fetch("/save-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, plant: selectedPlant, index: ++plantIndex }),
    });
}


async function loadPlants() {
    const response = await fetch("/load-plants"); 
    const plants = await response.json();
    const catsDiv = document.querySelector(".cats");

    plants.forEach(({ x, y, plant }) => {
        const plantImg = document.createElement("img");
        plantImg.src = `/images/plant${plant}.PNG`;
        plantImg.style.position = "absolute";
        plantImg.style.left = `${x - 40}px`;
        plantImg.style.top = `${y - 40}px`;
        
        plantImg.style.width = "20vh";
        plantImg.style.height = "20vh";
        catsDiv.appendChild(plantImg);
    });
}


function updatePointsDisplay() {
    const pointsDisplay = document.getElementById("pointText");
    pointsDisplay.textContent = `Points: ${points}`;
}


function closePlantDivOnOutsideClick(event) {
    const plantDiv = document.getElementById("plantDiv");
    const buildGardenBtn = document.getElementById("buildGardenBtn");
    if (!plantDiv.contains(event.target) && event.target !== buildGardenBtn) {
        plantDiv.style.display = "none";
        document.removeEventListener("click", closePlantDivOnOutsideClick);
    }
}


function zeCats() {
    const catElements = document.querySelectorAll(".cat");
    const catsContainer = document.querySelector(".cats");

    const containerWidth = catsContainer.offsetWidth;
    const containerHeight = catsContainer.offsetHeight;
    const catWidth = 10 * window.innerWidth / 100;
    const catHeight = 10 * window.innerWidth / 100;

    catElements.forEach(cat => {
        const randomLeft = Math.random() * (containerWidth - catWidth);
        const randomTop = Math.random() * (containerHeight - catHeight);
        cat.style.left = `${randomLeft}px`;
        cat.style.top = `${randomTop}px`;
    });

    updateZIndex();
}


function updateZIndex() {
    const catElements = Array.from(document.querySelectorAll(".cat"))
        .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top));
    catElements.forEach((cat, index) => {
        cat.style.zIndex = index + 1;
    });
}
/**
 * Show the mood preview when hovering over a cat
 * @param {string} mood - The mood value of the cat
 * @param {HTMLElement} catElement - The cat element being hovered
 */
function showMood(mood, catElement) {
    if (!mood) return; // If no mood, do nothing

    const moodPreview = catElement.querySelector(".moodPreview");
    if (!moodPreview) return; 
    moodPreview.style.display = "block"; 
    moodPreview.style.backgroundImage = `url('/images/mood${mood}.PNG')`; 
    
}

/**
 * Hide the mood preview when the mouse leaves the cat
 * @param {HTMLElement} catElement - The cat element being hovered
 */
function hideMood(catElement) {
    const moodPreview = catElement.querySelector(".moodPreview");
    if (moodPreview) {
        moodPreview.style.display = "none"; 
    }
}
