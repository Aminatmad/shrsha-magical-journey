/* =========================================
   СОСТОЯНИЕ ИГРЫ
========================================= */

const gameState = {
    currentLevel: 1,
    completedLevels: [],

    mediaRecorder: null,
    audioChunks: [],
    recordingFinished: false
};


/* =========================================
   ЗАДАНИЯ
========================================= */

const tasks = {

    1: {
        title: "Что это?",

        image: "assets/images/mandarin.png",
        background: "assets/images/mandarinbackground.png",

        answers: [
            {
                text: "яблоко",
                correct: false
            },
            {
                text: "мандарин",
                correct: true
            },
            {
                text: "собака",
                correct: false
            },
            {
                text: "банан",
                correct: false
            }
        ]
    },


    2: {
        title: "Что делает человек?",

        image: "assets/images/runner.png",
        background: "assets/images/runnerbackground.png",

        answers: [
            {
                text: "сидит",
                correct: false
            },
            {
                text: "лежит",
                correct: false
            },
            {
                text: "ползёт",
                correct: false
            },
            {
                text: "бежит",
                correct: true
            }
        ]
    },


    3: {
        title: "Какого цвета яблоко?",

        image: "assets/images/apple.png",
        background: "assets/images/applebackground.png",

        answers: [
            {
                text: "синее",
                correct: false
            },
            {
                text: "жёлтое",
                correct: false
            },
            {
                text: "красное",
                correct: true
            },
            {
                text: "зелёное",
                correct: false
            }
        ]
    },


    4: {
        title: "Где находится лисёнок?",

        image: "assets/images/foxbox.png",
        background: "assets/images/boxbackground.png",

        answers: [
            {
                text: "в коробке",
                correct: true
            },
            {
                text: "на коробке",
                correct: false
            },
            {
                text: "под коробкой",
                correct: false
            },
            {
                text: "за коробкой",
                correct: false
            }
        ]
    },


    5: {
        title: "Расскажи историю",

        image: "assets/images/storyimage.png",
        background: "assets/images/booksbackground.png",

        voice: true
    }

};


/* =========================================
   ПОЛУЧАЕМ ЭЛЕМЕНТЫ
========================================= */

const homeScreen =
    document.getElementById("home-screen");

const forestScreen =
    document.getElementById("forest-screen");

const gameScreen =
    document.getElementById("game-screen");


const startGameButton =
    document.getElementById("start-game-button");

const detailsButton =
    document.getElementById("details-button");


const forestBackButton =
    document.getElementById("forest-back-button");

const gameBackButton =
    document.getElementById("game-back-button");


const taskNumber =
    document.getElementById("task-number");

const taskTitle =
    document.getElementById("task-title");

const taskImage =
    document.getElementById("task-image");

const taskCard =
    document.getElementById("task-card");

const answersContainer =
    document.getElementById("answers");

const voiceArea =
    document.getElementById("voice-area");


const retryModal =
    document.getElementById("retry-modal");

const successModal =
    document.getElementById("success-modal");

const lockedModal =
    document.getElementById("locked-modal");

const finalModal =
    document.getElementById("final-modal");


const successStars =
    document.getElementById("success-stars");


const retryBackButton =
    document.getElementById("retry-back-button");

const successNextButton =
    document.getElementById("success-next-button");

const lockedCloseButton =
    document.getElementById("locked-close-button");

const restartButton =
    document.getElementById("restart-button");


const levelButtons =
    document.querySelectorAll(".level-button");


/* =========================================
   ПОКАЗ ЭКРАНОВ
========================================= */

function hideAllScreens() {

    homeScreen.classList.add("hidden");
    forestScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
}


function showHome() {

    hideAllScreens();

    homeScreen.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showForest() {

    hideAllScreens();

    forestScreen.classList.remove("hidden");

    updateLevelButtons();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showGame() {

    hideAllScreens();

    gameScreen.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   НАЧАТЬ ИГРУ
========================================= */

startGameButton.addEventListener("click", () => {

    showForest();

});


/* =========================================
   ПОДРОБНОСТИ
========================================= */

detailsButton.addEventListener("click", () => {

    const detailsSection =
        document.getElementById("details-section");

    detailsSection.scrollIntoView({
        behavior: "smooth"
    });

});


/* =========================================
   НАЗАД ИЗ ЛЕСА
========================================= */

forestBackButton.addEventListener("click", () => {

    showHome();

});


/* =========================================
   НАЗАД ИЗ ЗАДАНИЯ
========================================= */

gameBackButton.addEventListener("click", () => {

    showForest();

});


/* =========================================
   УРОВНИ
========================================= */

levelButtons.forEach(button => {

    button.addEventListener("click", () => {

        const level =
            Number(button.dataset.level);

        /*
         * Если уровень ещё закрыт —
         * показываем сообщение.
         */

        if (
            level > 1 &&
            !gameState.completedLevels.includes(level - 1)
        ) {

            showModal(lockedModal);

            return;
        }


        openLevel(level);

    });

});


/* =========================================
   ОТКРЫТЬ УРОВЕНЬ
========================================= */

function openLevel(level) {

    /*
     * Нельзя перескочить через уровень.
     */

    if (
        level > 1 &&
        !gameState.completedLevels.includes(level - 1)
    ) {

        showModal(lockedModal);

        return;
    }


    gameState.currentLevel = level;

    showGame();

    renderTask(level);

}


/* =========================================
   ОТРИСОВКА ЗАДАНИЯ
========================================= */

function renderTask(level) {

    const task =
        tasks[level];

    if (!task) {
        return;
    }


    taskNumber.textContent =
        level;

    taskTitle.textContent =
        task.title;

    taskImage.src =
        task.image;

    taskImage.alt =
        task.title;


    /*
     * Меняем фон именно для текущего задания.
     */

    gameScreen.style.backgroundImage =
        `url("${task.background}")`;


    /*
     * Очищаем старое содержимое.
     */

    answersContainer.innerHTML = "";

    voiceArea.innerHTML = "";


    answersContainer.classList.remove("hidden");

    voiceArea.classList.add("hidden");


    /*
     * Если это голосовое задание.
     */

    if (task.voice) {

        renderVoiceTask();

        return;
    }


    /*
     * Обычное задание с вариантами ответов.
     */

    task.answers.forEach(answer => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "answer-button";

        button.textContent =
            answer.text;


        button.addEventListener("click", () => {

            checkAnswer(answer.correct);

        });


        answersContainer.appendChild(button);

    });

}


/* =========================================
   ПРОВЕРКА ОТВЕТА
========================================= */

function checkAnswer(isCorrect) {

    if (isCorrect) {

        completeCurrentLevel();

    } else {

        showModal(retryModal);

    }

}


/* =========================================
   ЗАВЕРШИТЬ УРОВЕНЬ
========================================= */

function completeCurrentLevel() {

    const level =
        gameState.currentLevel;


    /*
     * Не добавляем один и тот же уровень
     * несколько раз.
     */

    if (!gameState.completedLevels.includes(level)) {

        gameState.completedLevels.push(level);

    }


    updateLevelButtons();


    /*
     * Если это 5 уровень —
     * показываем финал.
     */

    if (level === 5) {

        setTimeout(() => {

            showModal(finalModal);

        }, 250);

        return;
    }


    /*
     * Для уровней 1-4 показываем
     * окно "Молодец!".
     */

    showSuccessModal(level);

}


/* =========================================
   ОКНО "МОЛОДЕЦ!"
========================================= */

function showSuccessModal(level) {

    successStars.innerHTML = "";


    /*
     * Уровень 1 = 1 звезда
     * Уровень 2 = 2 звезды
     * ...
     */

    for (let i = 0; i < level; i++) {

        const star =
            document.createElement("img");

        star.src =
            "assets/images/star.png";

        star.alt =
            "Звезда";

        successStars.appendChild(star);

    }


    /*
     * Меняем текст кнопки
     * после 4 уровня.
     */

    if (level === 4) {

        successNextButton.innerHTML =
            'Последнее задание <span>→</span>';

    } else {

        successNextButton.innerHTML =
            'Следующее задание <span>→</span>';

    }


    showModal(successModal);

}


/* =========================================
   СЛЕДУЮЩИЙ УРОВЕНЬ
========================================= */

successNextButton.addEventListener("click", () => {

    hideModal(successModal);

    const nextLevel =
        gameState.currentLevel + 1;

    openLevel(nextLevel);

});


/* =========================================
   ПОПРОБОВАТЬ ЕЩЁ РАЗ
========================================= */

retryBackButton.addEventListener("click", () => {

    hideModal(retryModal);

});


/* =========================================
   ЗАКРЫТЬ "УРОВЕНЬ ЗАКРЫТ"
========================================= */

lockedCloseButton.addEventListener("click", () => {

    hideModal(lockedModal);

});


/* =========================================
   ФИНАЛ: НАЧАТЬ ЗАНОВО
========================================= */

restartButton.addEventListener("click", () => {

    resetGame();

    hideModal(finalModal);

    showForest();

});


/* =========================================
   МОДАЛКИ
========================================= */

function showModal(modal) {

    modal.classList.remove("hidden");

}


function hideModal(modal) {

    modal.classList.add("hidden");

}


/*
 * Крестик закрытия.
 */

document.querySelectorAll("[data-close-modal]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const modal =
                button.closest(".modal");

            if (modal) {
                hideModal(modal);
            }

        });

    });


/*
 * Клик по затемнённому фону
 * закрывает модальное окно.
 */

document.querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {

                hideModal(modal);

            }

        });

    });


/* =========================================
   ОБНОВЛЕНИЕ КНОПОК УРОВНЕЙ
========================================= */

function updateLevelButtons() {

    levelButtons.forEach(button => {

        const level =
            Number(button.dataset.level);


        /*
         * Первый уровень всегда доступен.
         */

        const unlocked =
            level === 1 ||
            gameState.completedLevels.includes(level - 1);


        if (unlocked) {

            button.classList.remove("locked");

            button.setAttribute(
                "aria-disabled",
                "false"
            );

            const lock =
                button.querySelector(".level-lock");

            if (lock) {
                lock.textContent = "🔓";
            }

        } else {

            button.classList.add("locked");

            button.setAttribute(
                "aria-disabled",
                "true"
            );

            const lock =
                button.querySelector(".level-lock");

            if (lock) {
                lock.textContent = "🔒";
            }

        }

    });

}


/* =========================================
   ГОЛОСОВОЕ ЗАДАНИЕ
========================================= */

function renderVoiceTask() {

    answersContainer.classList.add("hidden");

    voiceArea.classList.remove("hidden");


    voiceArea.innerHTML = `
        <p class="voice-instruction">
            Посмотри на картинку и расскажи
            небольшую историю.
        </p>

        <button
            id="record-button"
            class="voice-button"
            type="button"
        >
            🎤 Начать запись
        </button>

        <div
            id="voice-status"
            class="voice-status"
        >
            Нажми кнопку, чтобы начать.
        </div>

        <button
            id="voice-finish-button"
            class="voice-finish-button"
            type="button"
            style="display: none;"
        >
            Завершить задание
        </button>
    `;


    const recordButton =
        document.getElementById("record-button");

    const voiceStatus =
        document.getElementById("voice-status");

    const finishButton =
        document.getElementById("voice-finish-button");


    recordButton.addEventListener(
        "click",
        async () => {

            /*
             * Если запись уже идёт,
             * второй раз ничего не делаем.
             */

            if (
                gameState.mediaRecorder &&
                gameState.mediaRecorder.state === "recording"
            ) {
                return;
            }


            try {

                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });


                gameState.audioChunks = [];


                gameState.mediaRecorder =
                    new MediaRecorder(stream);


                gameState.mediaRecorder.ondataavailable =
                    event => {

                        if (event.data.size > 0) {

                            gameState.audioChunks.push(
                                event.data
                            );

                        }

                    };


                gameState.mediaRecorder.onstop =
                    () => {

                        stream
                            .getTracks()
                            .forEach(track => track.stop());

                    };


                gameState.mediaRecorder.start();


                gameState.recordingFinished = false;


                recordButton.textContent =
                    "⏹ Остановить запись";

                recordButton.classList.add(
                    "recording"
                );


                voiceStatus.textContent =
                    "Запись идёт... Рассказывай!";


                finishButton.style.display =
                    "inline-block";


                /*
                 * Второе нажатие останавливает запись.
                 */

                recordButton.onclick = () => {

                    if (
                        gameState.mediaRecorder &&
                        gameState.mediaRecorder.state === "recording"
                    ) {

                        gameState.mediaRecorder.stop();

                        recordButton.textContent =
                            "🎤 Записать ещё раз";

                        recordButton.classList.remove(
                            "recording"
                        );

                        voiceStatus.textContent =
                            "Запись завершена. Нажми «Завершить задание».";

                    }

                };


            } catch (error) {

                console.error(error);

                voiceStatus.textContent =
                    "Не удалось получить доступ к микрофону. " +
                    "Но ты всё равно можешь завершить задание.";

                finishButton.style.display =
                    "inline-block";

            }

        }
    );


    finishButton.addEventListener(
        "click",
        () => {

            gameState.recordingFinished = true;

            completeCurrentLevel();

        }
    );

}


/* =========================================
   СБРОС ИГРЫ
========================================= */

function resetGame() {

    gameState.currentLevel = 1;

    gameState.completedLevels = [];

    gameState.audioChunks = [];

    gameState.recordingFinished = false;


    if (
        gameState.mediaRecorder &&
        gameState.mediaRecorder.state === "recording"
    ) {

        gameState.mediaRecorder.stop();

    }


    gameState.mediaRecorder = null;


    updateLevelButtons();

}


/* =========================================
   СТАРТОВОЕ СОСТОЯНИЕ
========================================= */

resetGame();

showHome();
