const mpBtn = document.getElementById("mp");
const spBtn = document.getElementById("sp");
const container = document.getElementById("container");
const overlay = document.getElementById("overlay");
const overlay1 = document.getElementById("overlay1");
const overlay2 = document.getElementById("overlay2");
const start = document.getElementById("elements");
const title = document.getElementById("title");
const begin = document.getElementById("begin");
const logo = document.getElementById("logo");
const subtitle = document.getElementById("subtitle");
const sound = document.getElementById("sound");
const home = document.getElementById("home");
let copyright = document.getElementById("copyright");
let mute = true;
let selected = [];
let categories;
let quiz = [];
let amount = 0;
let number;
let cat;
let buffer = 0;
let correct = 0;
let index = 0;

const generation = document.createElement("div");
generation.id = "generation";

const generation1 = document.createElement("div");
generation1.id = "generation1";

const generation2 = document.createElement("div");
generation2.id = "generation2";

const generation3 = document.createElement("div");
generation3.id = "generation3";

generation.appendChild(generation1);
generation.appendChild(generation2);
generation.appendChild(generation3);
generation.style.display = "none";

container.appendChild(generation);

function addCopyright() {
    copyright = document.createElement("h6");
    copyright.id = "copyright";
    copyright.textContent = "Copyright | © Vikram Varadarajan 2025 | Version 1.1";

    container.appendChild(copyright);
}

function Start(quiz, amount) {
    const question = document.createElement("p");
    question.id = "question";

    const answers = document.createElement("div");
    answers.id = "answers";
    const answer1 = document.createElement("p");
    answer1.id = "answer1";
    const answer2 = document.createElement("p");
    answer2.id = "answer2";
    const answer3 = document.createElement("p");
    answer3.id = "answer3";
    const answer4 = document.createElement("p");
    answer4.id = "answer4";

    answers.appendChild(answer1);
    answers.appendChild(answer2);
    answers.appendChild(answer3);
    answers.appendChild(answer4);

    container.appendChild(question);
    container.appendChild(answers);

    addCopyright();

    function displayQ(index) {
        question.innerHTML = `<strong>Score: ${correct}/${amount}</strong><br><br>${index+1}. ${quiz[index].question}`;

        const allAnswers = [
            quiz[index].correct_answer,
            quiz[index].incorrect_answers[0],
            quiz[index].incorrect_answers[1],
            quiz[index].incorrect_answers[2]
        ];
        
        allAnswers.sort(() => Math.random() - 0.5);
        
        answer1.textContent = allAnswers[0];
        answer2.textContent = allAnswers[1];
        answer3.textContent = allAnswers[2];
        answer4.textContent = allAnswers[3];
    }
    
    answer1.addEventListener("click", () => {
        Check(answer1, quiz[index].correct_answer);
    });
    answer2.addEventListener("click", () => {
        Check(answer2, quiz[index].correct_answer);
    });
    answer3.addEventListener("click", () => {
        Check(answer3, quiz[index].correct_answer);
    });
    answer4.addEventListener("click", () => {
        Check(answer4, quiz[index].correct_answer);
    });

    function Check(answer, correctAnswer) {
        document.querySelectorAll("#answers p").forEach(option => {
            option.style.pointerEvents = "none";
        });

        let rightAnswer;

        const correctSound = document.getElementById("correct");
        const incorrectSound = document.getElementById("incorrect");

        if (answer.textContent == correctAnswer) {
            correct++;
            answer.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
            correctSound.volume = 0.5;
            correctSound.play();
        }
        else {
            answer.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            incorrectSound.volume = 0.5;
            incorrectSound.play();

            rightAnswer = [...document.querySelectorAll("#answers p")].find(option => option.textContent === correctAnswer);
            if (rightAnswer) {
                setTimeout(() => {
                    rightAnswer.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
                }, 1000);
            }
        }

        setTimeout(() => {
            answer.style.backgroundColor = "";
            
            if (rightAnswer) {
                rightAnswer.style.backgroundColor = "";
            }

            document.querySelectorAll("#answers p").forEach(option => {
                option.style.pointerEvents = "auto";
            });
    
            index++;
            if (index < quiz.length) {
                displayQ(index);
            } else {
                question.remove();
                answers.remove();
                copyright.remove();

                const finalMsg = document.createElement("p");
                finalMsg.textContent = `Your final score was: ${correct}/${amount}. Thanks for playing!`;
                container.appendChild(finalMsg);

                const reset = document.createElement("button");
                reset.innerHTML = `<p>Play Again</p>`;
                container.appendChild(reset);           

                addCopyright();

                reset.addEventListener("click", () => {
                    copyright.remove();
                    reset.remove();
                    finalMsg.remove();
                    
                    logo.style.display = "flex";
                    spBtn.style.display = "flex";
                    mpBtn.style.display = "flex";

                    addCopyright();

                    index = 0;
                    buffer = 0;
                    selected = [];
                    quiz = [];
                    amount = 0;
                    correct = 0;
                });
            }
        }, 3000);
    }

    displayQ(index);
}

async function GenerateTrivia(selected, amount) {

    cat = selected[0].cat;

    if (selected.length === 1 && !selected.some(item => item.id === "all" || item.id === "science" || item.id === "entertainment")) {
        number = amount;
    }
    else {
        number = 50;
    }

    const url = `https://opentdb.com/api.php?amount=${number}&type=multiple&category=${cat}`;

    try {
        generation.style.display = "flex"

        const response = await fetch(url);
        if (!response.ok) {
            alert("Reload and Try again.");
        }

        const data = await response.json();
        console.log("Trivia questions:", data.results);

        for (let i = 0; i < data.results.length; i++) {
            if (buffer >= amount) {
                break;
            }

            if (selected.some(item => item.label === data.results[i].category) || selected.some(item => data.results[i].category.includes(item.label)) || selected[0].label == "Select All") {
                quiz.push(data.results[i]);
                buffer++;
            }
        }

        console.log(quiz);

        if (buffer < amount) {
            setTimeout(() => {
                GenerateTrivia(selected, amount);
            }, 5000);
        }
        else {
            generation.remove();
            copyright.remove();

            Start(quiz, amount);
            quiz = [];
        }


    }
    catch (error) {
        console.error("Error fetching trivia questions:", error);
        alert("Reload and Try again.");
    }
}

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

    copyright.remove();

    const options = document.createElement("div");
    options.id = "options";

    const form = document.createElement("form");
    const qLabel = document.createElement("label");
    qLabel.innerText = "Number of Questions: ";
    const questions = document.createElement("input");
    questions.type = "number";
    questions.max = "50";
    const catLabel = document.createElement("label");
    catLabel.innerText = "Select Categories: ";

    form.appendChild(qLabel);
    form.appendChild(questions);
    form.appendChild(document.createElement("br"));
    options.appendChild(catLabel);
    options.appendChild(document.createElement("br"));

    const categories = [
        { label: "All", id: "all", cat: 0 },
        { label: "Animals", id: "animals", cat: 27 },
        { label: "Art", id: "art", cat: 25 },
        { label: "Celebrities", id: "celebrities", cat: 26 },
        { label: "Entertainment", id: "entertainment", cat: 0 },
        { label: "General Knowledge", id: "gk", cat: 9 },
        { label: "Geography", id: "geography", cat: 22 },
        { label: "History", id: "history", cat: 23 },
        { label: "Mythology", id: "mythology", cat: 20 },
        { label: "Politics", id: "politics", cat: 24 },
        { label: "Science", id: "science", cat: 0 },
        { label: "Sports", id: "sports", cat: 21 },
        { label: "Vehicles", id: "vehicles", cat: 28 }
    ];

    categories.forEach(category => {
        const label = document.createElement("label");
        label.htmlFor = category.id;
        label.innerText = category.label;

        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.id = category.id;
        checkbox.name = "category";

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selected.pop();
                selected.push({label: category.label, id: category.id, cat: category.cat});
                console.log(selected);
            }
        });

        options.appendChild(checkbox);
        options.appendChild(label);
        options.appendChild(document.createElement("br"));
    });

    form.appendChild(options);
    
    const play = document.createElement("button");
    play.id = "play";
    play.innerHTML = `<p>Play</p>`;
    form.appendChild(play);

    container.appendChild(form);
    addCopyright();    

    play.addEventListener("click", (event) => {
        event.preventDefault();
        if (questions.value && questions.value <= 50 && questions.value >= 1 && Number.isInteger(parseInt(questions.value))) {
            form.remove();
            logo.style.display = "none";
            amount = questions.value;
            GenerateTrivia(selected, amount);
        }
        else {
            alert("Please enter a valid whole number between 1 and 50!")
        }
    });
});