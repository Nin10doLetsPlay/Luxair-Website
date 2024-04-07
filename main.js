const content = document.getElementById("content");
const answerContainer = document.getElementById("answerContainer");
const questionElement = document.getElementById("questionElement");

async function get(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw response.status;
        return await response.json();
    } catch (error) {
        console.error(`Fetching ${url} failed: ${error}`);
        return null;
    }
}

const properties = await get("questions.json");
const results = await get("hotels.json");

const userAnswers = {};

let currentQuestion = 0;

function displayQuestion() {
    const [key, property] = Object.entries(properties)[currentQuestion];
    questionElement.innerHTML = property.question;
    if (property.type == "slider") {
        const sliderValue = document.createElement("h2");
        sliderValue.innerHTML = "0" + property.unit;

        const sliderElement = document.createElement("input");
        sliderElement.className = "slider";
        sliderElement.type = "range";
        sliderElement.min = property.min;
        sliderElement.max = property.max;
        sliderElement.value = 0;
        sliderElement.oninput = function () {
            sliderValue.innerHTML = this.value == property.max && property.maxText != null ? property.maxText : (Math.floor(this.value / property.step) * property.step) + property.unit;
        }

        const buttonText = document.createElement("h2");
        buttonText.innerHTML = "Submit";

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.appendChild(buttonText);
        submitButton.onclick = function () {
            userAnswers[key] = Math.floor(sliderElement.value / property.step) * property.step;
            answerContainer.innerHTML = "";
            currentQuestion++;
            if (currentQuestion < Object.entries(properties).length) {
                displayQuestion();
            }
            else {
                displayResult();
            }
        }

        answerContainer.appendChild(sliderElement);
        answerContainer.appendChild(sliderValue);
        answerContainer.appendChild(submitButton);
    }
    else if (property.type == "answers") {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer"
        buttonContainer.className = property.answers.length == 3 ? "grid3" : "grid4";
        answerContainer.appendChild(buttonContainer);

        for (const answer of property.answers) {

            const answerButton = document.createElement("button");
            answerButton.className = "answerButton";
            answerButton.type = "button";
            answerButton.onclick = function () {
                userAnswers[key] = answer.id;
                answerContainer.innerHTML = "";
                currentQuestion++;
                if (currentQuestion < Object.entries(properties).length) {
                    displayQuestion();
                }
                else {
                    displayResult();
                }
            }

            if (answer.image) {
                const answerImage = document.createElement("img");
                answerImage.className = "answerImage";
                answerImage.alt = answer.text;
                answerImage.src = answer.image;
                answerButton.classList.add("imageAnswerButton");

                const imageContainer = document.createElement("div");
                imageContainer.className = "imageContainer";
                imageContainer.appendChild(answerImage);

                answerButton.appendChild(imageContainer)
            }

            const answerText = document.createElement("h2");
            answerText.className = "answerText";
            answerText.innerHTML = answer.text;
            answerButton.appendChild(answerText);

            buttonContainer.appendChild(answerButton);
        }
    }
}

async function displayResult() {
    content.innerHTML = "";
    for (const result of results) {
        result.rating = 0;
        for (const [property, userAnswer] of Object.entries(userAnswers)) {
            if (properties[property].type == "slider") {
                result.rating += properties[property].weight * Math.max(0, 1 - (Math.abs(userAnswer - result[property]) / properties[property].range));
            }
            else if (properties[property].type == "answers") {
                if (result[property][userAnswer] == true) result.rating += properties[property].weight;
            }
        }
    }
    const sortedResults = results.sort((a, b) => b.rating - a.rating);

    for (const sortedResult of sortedResults) {

        const resultLink = document.createElement("a");
        resultLink.href = sortedResult.url;
        content.appendChild(resultLink);

        const resultContainer = document.createElement("div");
        resultContainer.className = "resultContainer";
        resultLink.appendChild(resultContainer);

        const resultImage = document.createElement("img");
        resultImage.className = "resultImage";
        resultImage.src = sortedResult.images[0];
        resultContainer.appendChild(resultImage);

        const resultText = document.createElement("div");
        resultText.className = "resultText";
        resultContainer.appendChild(resultText);

        const resultTitle = document.createElement("h2");
        resultTitle.innerHTML = sortedResult.name + " - " + sortedResult.country;
        resultText.appendChild(resultTitle);

        const resultDescription = document.createElement("p");
        const totalWeight = Object.values(properties).reduce((accumulator, property) => { return accumulator + property.weight; }, 0);
        resultDescription.innerHTML = "Price: " + sortedResult.price + "€<br>Recommended at " + Math.round(sortedResult.rating / totalWeight * 100) + "%";
        resultText.appendChild(resultDescription);
    }
}

displayQuestion();