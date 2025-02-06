const mpBtn = document.getElementById("mp");
const spBtn = document.getElementById("sp");
const container = document.getElementById("container");
const overlay1 = document.getElementById("overlay1");
const overlay2 = document.getElementById("overlay2");
const start = document.getElementById("elements");
const title = document.getElementById("title");
const begin = document.getElementById("begin");
const logo = document.getElementById("logo");
const subtitle = document.getElementById("subtitle");
const sound = document.getElementById("sound");
const home = document.getElementById("home");
let mute = true;

begin.addEventListener("click", () => {
    overlay1.style.animation = "slide1 3s ease-out forwards";
    overlay2.style.animation = "slide2 3s ease-out forwards";
    title.style.animation = "fadeMove1 2s ease-out forwards";
    begin.style.animation = "fadeOut 2s ease-out forwards";
    subtitle.style.animation = "fadeMove2 2s ease-out forwards";
    logo.style.animation = "flash 2s ease-out forwards";
    container.style.animation = "fadeIn 2s ease-out forwards";
    container.style.display = "flex";
    begin.remove();

    const landing = document.getElementById("landing");
    landing.play().catch(err => console.warn("Autoplay blocked:", err));

    const theme = document.getElementById("theme");
    setTimeout(() =>{
        theme.play();
    }, 2000)
    theme.volume = 0.1;
    theme.addEventListener("ended", function() {
        this.currentTime = 0;
        this.play();
    });
});

home.addEventListener("click", () => {
    location.reload();
});

sound.addEventListener("click", () => {
    if (mute) {
        theme.volume = 0;
        mute = false;
        sound.src = "images/mute.png";
    }
    else {
        theme.volume = 0.1;
        mute = true;
        sound.src = "images/sound.png";
    }
});

mpBtn.addEventListener("click", () => {
    alert("Coming Soon!");
});

spBtn.addEventListener("click", () => {
    spBtn.style.display = "none";
    mpBtn.style.display = "none";

    const options = document.createElement("div");
    options.id = "options";

    const form = document.createElement("form");
    const qLabel = document.createElement("label");
    qLabel.innerText = "Number of Questions: ";
    const questions = document.createElement("input");
    questions.type = "number";
    questions.max = "100";
    const catLabel = document.createElement("label");
    catLabel.innerText = "Select Categories: ";

    form.appendChild(qLabel);
    form.appendChild(questions);
    form.appendChild(document.createElement("br"));
    form.appendChild(catLabel);
    form.appendChild(document.createElement("br"));

    const categories = [
        { label: "All", id: "all" },
        { label: "Entertainment", id: "entertainment" },
        { label: "Science", id: "science" },
        { label: "General Knowledge", id: "gk" },
        { label: "Mythology", id: "mythology" },
        { label: "Sports", id: "sports" },
        { label: "Geography", id: "geography" },
        { label: "History", id: "history" },
        { label: "Politics", id: "politics" },
        { label: "Art", id: "art" },
        { label: "Celebrities", id: "celebrities" },
        { label: "Animals", id: "animals" },
        { label: "Vehicles", id: "vehicles" }
    ];

    categories.forEach(category => {
        const label = document.createElement("label");
        label.htmlFor = category.id;
        label.innerText = category.label;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = category.id;
        checkbox.name = "category";

        options.appendChild(checkbox);
        options.appendChild(label);
        options.appendChild(document.createElement("br"));
    });

    form.appendChild(options);
    container.appendChild(form);
});