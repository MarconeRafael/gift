const loader = document.getElementById("pageLoader");
const reveals = document.querySelectorAll(".reveal");
const scrollButtons = document.querySelectorAll("[data-scroll]");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const questionActions = document.getElementById("questionActions");
const questionHint = document.getElementById("questionHint");

const successScreen = document.getElementById("successScreen");
const closeSuccess = document.getElementById("closeSuccess");
const confetti = document.getElementById("confetti");

const noMessages = [
    "Tem certeza? 😶",
    "Pensa mais um pouquinho...",
    "Depois de tudo isso? 🥺",
    "Você está dificultando meu trabalho.",
    "Olha que eu vou começar a desconfiar...",
    "Essa opção está ficando cada vez mais suspeita.",
    "Última chance de mudar de ideia. ❤️"
];

let noAttempts = 0;
let noEscaping = false;

window.addEventListener("load", () => {
    window.setTimeout(() => {
        loader.classList.add("hidden");
        initReveal();
    }, 500);
});

function initReveal() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    reveals.forEach(element => observer.observe(element));
}

scrollButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.scroll);

        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

noButton.addEventListener("click", () => {
    noAttempts += 1;

    questionHint.textContent =
        noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];

    noButton.classList.remove("playful");

    void noButton.offsetWidth;

    noButton.classList.add("playful");

    if (noAttempts >= 3) {
        enableNoEscape();
    }
});

function enableNoEscape() {
    if (noEscaping) {
        moveNoButton();
        return;
    }

    noEscaping = true;

    noButton.addEventListener("mouseenter", moveNoButton);
    noButton.addEventListener("touchstart", handleTouchAttempt, {
        passive: true
    });

    moveNoButton();
}

function handleTouchAttempt(event) {
    event.preventDefault();
    moveNoButton();
}

function moveNoButton() {
    const actionsRect = questionActions.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    const padding = 12;

    const maxX = Math.max(
        padding,
        actionsRect.width - buttonRect.width - padding
    );

    const maxY = Math.max(
        padding,
        actionsRect.height - buttonRect.height - padding
    );

    const x = randomBetween(padding, maxX);
    const y = randomBetween(padding, maxY);

    const rotation = randomBetween(-8, 8);

    noButton.style.position = "absolute";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.transform = `rotate(${rotation}deg)`;
}

function randomBetween(min, max) {
    if (max <= min) {
        return min;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

yesButton.addEventListener("click", openSuccess);

function openSuccess() {
    createConfetti();

    successScreen.classList.add("visible");
    successScreen.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
}

closeSuccess.addEventListener("click", () => {
    successScreen.classList.remove("visible");
    successScreen.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function createConfetti() {
    confetti.replaceChildren();

    const amount = window.innerWidth < 700 ? 55 : 90;

    for (let index = 0; index < amount; index += 1) {
        const piece = document.createElement("span");

        piece.className = "confetti-piece";

        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty(
            "--x",
            `${randomBetween(-250, 250)}px`
        );
        piece.style.setProperty(
            "--rotation",
            `${randomBetween(-720, 720)}deg`
        );
        piece.style.animationDuration =
            `${randomBetween(3, 6) / 10 + 1.8}s`;
        piece.style.animationDelay =
            `${Math.random() * 0.6}s`;

        confetti.appendChild(piece);
    }
}

window.addEventListener("resize", () => {
    if (noEscaping) {
        noButton.style.position = "";
        noButton.style.left = "";
        noButton.style.top = "";
        noButton.style.transform = "";

        window.setTimeout(moveNoButton, 100);
    }
});
