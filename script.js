/* =========================================================
   ВОЛШЕБНОЕ ПУТЕШЕСТВИЕ ЛИСЁНКА СТЕШИ
========================================================= */


/* =========================================================
   СОСТОЯНИЕ ИГРЫ
========================================================= */

const gameState = {

    currentLevel: 1,

    completedLevels: [],

    recordingFinished: false,

    mediaRecorder: null,

    audioChunks: []

};


/* =========================================================
   ДАННЫЕ ЗАДАНИЙ
========================================================= */

const tasks = {

    1: {

        title: "Что это?",

        image:
            "/assets/images/mandarin.png.png",

        background:
            "/assets/images/mandarinbackground.png.png",

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

        image:
            "/assets/images/runner.png.png",

        background:
            "/assets/images/runnerbackground.png.png",

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

        image:
            "/assets/images/apple.png.png",

        background:
            "/assets/images/applebackground.png.png",

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

        image:
            "/assets/images/foxbox.png.png",

        background:
            "/assets/images/boxbackground.png.png",

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

        image:
            "/assets/images/storyimage.png.png",

        background:
            "/assets/images/booksbackground.png.png",

        voice: true

    }

};


/* =========================================================
   DOM
========================================================= */

const homeScreen =
    document.getElementById("home-screen");

const detailsSection =
    document.getElementById("details-section");

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

const taskImage =
    document.getElementById("task-image");

const taskTitle =
    document.getElementById("task-title");

const answersContainer =
    document.getElementById("answers");

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

const voiceStatus =
    document.getElementById("voice-status");

const levelButtons =
    document.querySelectorAll(".level-button");


/* =========================================================
   ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ЭКРАНОВ
========================================================= */

function hideAllMainScreens() {

    homeScreen.classList.add("hidden");

    detailsSection.classList.add("hidden");

    forestScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

}


/* =========================================================
   ГЛАВНАЯ → ИГРА
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        hideAllMainScreens();

        forestScreen.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   ПОДРОБНОСТИ
========================================================= */

detailsButton.addEventListener(
    "click",
    () => {

        detailsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   ИЗ ЛЕСА НАЗАД НА ГЛАВНУЮ
========================================================= */

forestBackButton.addEventListener(
    "click",
    () => {

        hideAllMainScreens();

        homeScreen.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   УРОВНИ
========================================================= */

levelButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const level =
                    Number(
                        button.dataset.level
                    );


                if (
                    button.disabled ||
                    button.classList.contains("locked")
                ) {

                    showModal(
                        lockedModal
                    );

                    return;

                }


                openLevel(level);

            }
        );

    }
);


/* =========================================================
   ОТКРЫТИЕ УРОВНЯ
========================================================= */

function openLevel(level) {

    if (
        level > 1 &&
        !gameState.completedLevels.includes(
            level - 1
        )
    ) {

        showModal(
            lockedModal
        );

        return;

    }


    gameState.currentLevel =
        level;


    forestScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    renderTask(level);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   ОТОБРАЖЕНИЕ ЗАДАНИЯ
========================================================= */

function renderTask(level) {

    const task =
        tasks[level];


    if (!task) {
        return;
    }


    taskNumber.textContent =
        level;


    taskImage.src =
        task.image;

    taskImage.alt =
        task.title;


    gameScreen.style.backgroundImage =
        `url("${task.background}")`;


    gameScreen.style.backgroundSize =
        "cover";


    gameScreen.style.backgroundPosition =
        "center";


    gameScreen.style.backgroundRepeat =
        "no-repeat";


    answersContainer.innerHTML =
        "";


    gameState.recordingFinished =
        false;


    if (task.voice) {

        renderVoiceTask();

        return;

    }


    taskImage.style.display =
        "block";


    taskImage.classList.remove(
        "story-image"
    );


    taskTitle.style.display =
        "block";


    taskTitle.textContent =
        task.title;


    task.answers.forEach(
        answer => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "answer-button";


            button.textContent =
                answer.text;


            button.addEventListener(
                "click",
                () => {

                    handleAnswer(
                        answer.correct
                    );

                }
            );


            answersContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   ОТВЕТ
========================================================= */

function handleAnswer(correct) {

    if (!correct) {

        showModal(
            retryModal
        );

        return;

    }


    completeCurrentLevel();

}


/* =========================================================
   ПРОХОЖДЕНИЕ УРОВНЯ
========================================================= */

function completeCurrentLevel() {

    const level =
        gameState.currentLevel;


    if (
        !gameState.completedLevels.includes(
            level
        )
    ) {

        gameState.completedLevels.push(
            level
        );

    }


    unlockNextLevel();


    if (level === 5) {

        showFinalModal();

        return;

    }


    showSuccessModal(level);

}


/* =========================================================
   ОТКРЫТЬ СЛЕДУЮЩИЙ УРОВЕНЬ
========================================================= */

function unlockNextLevel() {

    const nextLevel =
        gameState.currentLevel + 1;


    if (nextLevel > 5) {
        return;
    }


    const nextButton =
        document.getElementById(
            `level-${nextLevel}-button`
        );


    if (!nextButton) {
        return;
    }


    nextButton.disabled =
        false;


    nextButton.classList.remove(
        "locked"
    );


    const lock =
        nextButton.querySelector(
            ".lock-overlay"
        );


    if (lock) {

        lock.remove();

    }

}


/* =========================================================
   МОЛОДЕЦ
========================================================= */

function showSuccessModal(level) {

    successStars.innerHTML =
        "";


    for (
        let i = 0;
        i < level;
        i++
    ) {

        const star =
            document.createElement(
                "img"
            );


        star.src =
            "/assets/images/star.png.png";


        star.alt =
            "Звезда";


        successStars.appendChild(
            star
        );

    }


    showModal(
        successModal
    );

}


/* =========================================================
   ДАЛЬШЕ
========================================================= */

successNextButton.addEventListener(
    "click",
    () => {

        hideModal(
            successModal
        );


        const nextLevel =
            gameState.currentLevel + 1;


        if (nextLevel <= 5) {

            openLevel(
                nextLevel
            );

        }

    }
);


/* =========================================================
   ПОПРОБОВАТЬ ЕЩЁ РАЗ
========================================================= */

retryBackButton.addEventListener(
    "click",
    () => {

        hideModal(
            retryModal
        );

    }
);


/* =========================================================
   НАЗАД В ЛЕС
========================================================= */

gameBackButton.addEventListener(
    "click",
    () => {

        if (
            gameState.mediaRecorder &&
            gameState.mediaRecorder.state === "recording"
        ) {

            gameState.mediaRecorder.stop();

        }


        gameScreen.classList.add(
            "hidden"
        );


        forestScreen.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   ЗАКРЫТЬ LOCKED
========================================================= */

lockedCloseButton.addEventListener(
    "click",
    () => {

        hideModal(
            lockedModal
        );

    }
);


/* =========================================================
   МОДАЛКИ
========================================================= */

function showModal(modal) {

    modal.classList.remove(
        "hidden"
    );

}


function hideModal(modal) {

    modal.classList.add(
        "hidden"
    );

}


/* =========================================================
   ЗАДАНИЕ 5 — ГОЛОС
========================================================= */

function renderVoiceTask() {

    taskImage.style.display =
        "block";


    taskImage.classList.add(
        "story-image"
    );


    taskTitle.style.display =
        "block";


    taskTitle.textContent =
        tasks[5].title;


    answersContainer.innerHTML =
        "";


    const voiceContainer =
        document.createElement(
            "div"
        );


    voiceContainer.className =
        "voice-task";


    /* =====================================================
       КНОПКА ЗАПИСИ
    ====================================================== */

    const recordButton =
        document.createElement(
            "button"
        );


    recordButton.type =
        "button";


    recordButton.className =
        "voice-button";


    recordButton.textContent =
        "Нажми и говори";


    /* =====================================================
       ПОСЛУШАТЬ ПРИМЕР
    ====================================================== */

    const exampleButton =
        document.createElement(
            "button"
        );


    exampleButton.type =
        "button";


    exampleButton.className =
        "example-button";


    exampleButton.textContent =
        "Послушать пример";


    /*
       У тебя сейчас нет папки audio,
       поэтому кнопку оставляем визуально рабочей,
       но без несуществующего файла.
    */

    exampleButton.addEventListener(
        "click",
        () => {

            alert(
                "Пример аудио пока не добавлен."
            );

        }
    );


    /* =====================================================
       ЗАКОНЧИТЬ
    ====================================================== */

    const finishButton =
        document.createElement(
            "button"
        );


    finishButton.type =
        "button";


    finishButton.className =
        "finish-button";


    finishButton.textContent =
        "Закончить";


    finishButton.disabled =
        true;


    /* =====================================================
       ЗАПИСЬ
    ====================================================== */

    recordButton.addEventListener(
        "click",
        async () => {

            if (
                gameState.mediaRecorder &&
                gameState.mediaRecorder.state ===
                "recording"
            ) {

                stopRecording(
                    recordButton,
                    finishButton
                );

                return;

            }


            await startRecording(
                recordButton,
                finishButton
            );

        }
    );


    /* =====================================================
       ЗАКОНЧИТЬ
    ====================================================== */

    finishButton.addEventListener(
        "click",
        () => {

            if (
                !gameState.recordingFinished
            ) {

                return;

            }


            completeCurrentLevel();

        }
    );


    voiceContainer.appendChild(
        recordButton
    );


    voiceContainer.appendChild(
        exampleButton
    );


    voiceContainer.appendChild(
        finishButton
    );


    answersContainer.appendChild(
        voiceContainer
    );

}


/* =========================================================
   НАЧАЛО ЗАПИСИ
========================================================= */

async function startRecording(
    recordButton,
    finishButton
) {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Этот браузер не поддерживает запись с микрофона."
        );

        return;

    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        gameState.audioChunks =
            [];


        const recorder =
            new MediaRecorder(
                stream
            );


        gameState.mediaRecorder =
            recorder;


        recorder.addEventListener(
            "dataavailable",
            event => {

                if (
                    event.data.size > 0
                ) {

                    gameState.audioChunks.push(
                        event.data
                    );

                }

            }
        );


        recorder.addEventListener(
            "stop",
            () => {

                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );


                gameState.recordingFinished =
                    true;


                finishButton.disabled =
                    false;


                finishButton.classList.add(
                    "active"
                );


                recordButton.classList.remove(
                    "recording"
                );


                recordButton.textContent =
                    "Записать ещё раз";


                voiceStatus.classList.add(
                    "hidden"
                );

            }
        );


        recorder.start();


        recordButton.classList.add(
            "recording"
        );


        recordButton.textContent =
            "Остановить запись";


        voiceStatus.textContent =
            "Запись идёт...";


        voiceStatus.classList.remove(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Ошибка микрофона:",
            error
        );


        alert(
            "Не удалось получить доступ к микрофону. Разреши доступ к микрофону в браузере."
        );

    }

}


/* =========================================================
   ОСТАНОВКА ЗАПИСИ
========================================================= */

function stopRecording(
    recordButton,
    finishButton
) {

    if (
        !gameState.mediaRecorder
    ) {

        return;

    }


    if (
        gameState.mediaRecorder.state ===
        "recording"
    ) {

        gameState.mediaRecorder.stop();

    }

}


/* =========================================================
   ФИНАЛ
========================================================= */

function showFinalModal() {

    showModal(
        finalModal
    );

}


/* =========================================================
   НАЧАТЬ ЗАНОВО
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        gameState.currentLevel =
            1;


        gameState.completedLevels =
            [];


        gameState.recordingFinished =
            false;


        if (
            gameState.mediaRecorder &&
            gameState.mediaRecorder.state ===
            "recording"
        ) {

            gameState.mediaRecorder.stop();

        }


        gameState.mediaRecorder =
            null;


        gameState.audioChunks =
            [];


        resetLevels();


        hideModal(
            finalModal
        );


        hideAllMainScreens();


        homeScreen.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   СБРОС УРОВНЕЙ
========================================================= */

function resetLevels() {

    levelButtons.forEach(
        (button, index) => {

            const level =
                index + 1;


            if (level === 1) {

                button.disabled =
                    false;


                button.classList.remove(
                    "locked"
                );


                const lock =
                    button.querySelector(
                        ".lock-overlay"
                    );


                if (lock) {

                    lock.remove();

                }

            } else {

                button.disabled =
                    true;


                button.classList.add(
                    "locked"
                );


                if (
                    !button.querySelector(
                        ".lock-overlay"
                    )
                ) {

                    const lock =
                        document.createElement(
                            "span"
                        );


                    lock.className =
                        "lock-overlay";


                    lock.textContent =
                        "🔒";


                    button.appendChild(
                        lock
                    );

                }

            }

        }
    );

}


/* =========================================================
   ЗАКРЫТИЕ МОДАЛКИ ПО КЛИКУ НА ФОН
========================================================= */

document.querySelectorAll(
    ".modal-overlay"
).forEach(
    overlay => {

        overlay.addEventListener(
            "click",
            () => {

                const modal =
                    overlay.closest(
                        ".modal"
                    );


                if (modal) {

                    hideModal(
                        modal
                    );

                }

            }
        );

    }
);


/* =========================================================
   ПЕРВИЧНОЕ СОСТОЯНИЕ
========================================================= */

resetLevels();
