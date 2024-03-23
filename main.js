
async function get(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw response.status;
        return await response.json();
    } catch (error) {
        console.error(`Get request to ${url} failed: ${error}`);
        return null;
    }
}

const { destinations } = await get("https://www.luxairtours.lu/luxair_destinations_overview");
const data = [];
for (const [key, destination] of Object.entries(destinations)) {
    data.push({
        id: destination.field_airport,
        country: destination.field_country.title.en,
        place: destination.title.en,
        categories: []
    });
    for (const category of destination.field_arrival_guide_destination.raw.Categories.en.Category) {
        data[data.length - 1].categories.push({
            id: category.Id,
            name: category.Name
        });
    }
}
console.log(JSON.stringify(data));


const hotels = [
    {
        title: "Test_Hotel_1",
        description: "Destination in a beach with a forest. Price: 999 Euro",
        image: "https://www.gliddenlodge.com/wp-content/uploads/2018/09/door-county-beach.jpg",
        url: "about:blank",
        type: [0],
        place: [1],
        people: [0, 1, 2, 3],
        activities: [0, 1, 2, 3],
        price: 999
    },
    {
        title: "Test_Hotel_2",
        description: "Destination in a city near mountains. Maximum 2 people. Price: 1999 Euro",
        image: "https://images7.alphacoders.com/112/1120507.jpg",
        url: "about:blank",
        type: [0],
        place: [0],
        people: [0, 1, 2, 3],
        activities: [0, 1, 2, 3],
        price: 1999
    },
    {
        title: "Test_Hotel_3",
        description: "Hotel in a city with a beach. Price: 3999 Euro",
        image: "https://www.touropia.com/gfx/b/2009/03/jumeirah_beach.jpg",
        url: "about:blank",
        type: [1],
        place: [0, 1],
        people: [0, 1, 2, 3],
        activities: [0, 1, 2, 3],
        price: 3999
    }
];

const properties = {
    type: {
        question: "What are you looking for?",
        answers: [
            { text: "Destination with hotel", image: "images/luxairtours.png" },
            { text: "Just a destination", image: "images/luxair.png" }
        ]
    },
    place: {
        question: "Where would you like to go?",
        answers: [
            { text: "City", image: "images/city.webp" },
            { text: "Beach", image: "images/beach.webp" }
        ]
    },
    people: {
        question: "Who are you traveling with?",
        answers: [
            { text: "Alone", image: "" },
            { text: "With another person", image: "" },
            { text: "With my family", image: "" },
            { text: "With friends", image: "" }
        ]
    },
    activities: {
        question: "What would you like to do?",
        answers: [
            { text: "Visit a museum", image: "" },
            { text: "Visit a Zoo", image: "" },
            { text: "Go to a cinema", image: "" },
            { text: "Relax", image: "" }
        ]
    },
    price: {
        question: "What is your budget?",
        slider: { min: 0, max: 8050, step: 50 }
    }
};

const content = document.getElementById("content");
const answerContainer = document.getElementById("answerContainer");
const questionElement = document.getElementById("questionElement");

const userAnswers = {};

let currentQuestion = 0;

function displayQuestion() {
    const [property, { question, answers, slider }] = Object.entries(properties)[currentQuestion];
    questionElement.innerHTML = question;
    if (slider) {
        const sliderValue = document.createElement("h2");
        sliderValue.innerHTML = "0";

        const sliderElement = document.createElement("input");
        sliderElement.className = "slider";
        sliderElement.type = "range";
        sliderElement.min = slider.min;
        sliderElement.max = slider.max;
        sliderElement.oninput = function () {
            sliderValue.innerHTML = this.value == 8050 ? "No limit" : Math.floor(this.value / slider.step) * slider.step;
        }

        const buttonText = document.createElement("h2");
        buttonText.innerHTML = "Submit";

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.appendChild(buttonText);
        submitButton.onclick = function () {
            userAnswers[property] = sliderElement.value == 8050 ? 999999 : Math.floor(sliderElement.value / slider.step) * slider.step;
            sliderElement.parentElement.removeChild(sliderElement);
            sliderValue.parentElement.removeChild(sliderValue);
            submitButton.parentElement.removeChild(submitButton);
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
    else if (answers) {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer"
        buttonContainer.className = answers.length == 3 ? "grid3" : "grid4";
        answerContainer.appendChild(buttonContainer);

        for (let [index, answer] of answers.entries()) {

            const answerButton = document.createElement("button");
            answerButton.className = "answerButton";
            answerButton.type = "button";
            answerButton.onclick = function () {
                userAnswers[property] = index;
                buttonContainer.parentElement.removeChild(buttonContainer);
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
                answerImage.alt = "Photo of a " + answer.text.toLowerCase() + " travel destination";
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

function displayResult() {
    questionElement.parentElement.removeChild(questionElement);
    answerContainer.parentElement.removeChild(answerContainer);
    for (const hotel of hotels) {
        hotel.rating = 0;
        for (const [property, userAnswer] of Object.entries(userAnswers)) {
            if (properties[property].slider) {
                hotel.rating += Math.max(0, 1 - Math.abs(1 - userAnswer / hotel[property]));
            }
            else if (hotel[property].includes(userAnswer)) {
                hotel.rating++;
            }
        }
    }
    const sortedResults = hotels.sort((a, b) => b.rating - a.rating);

    for (const result of sortedResults) {

        const resultLink = document.createElement("a");
        resultLink.href = result.url;
        content.appendChild(resultLink);

        const resultContainer = document.createElement("div");
        resultContainer.className = "resultContainer";
        resultLink.appendChild(resultContainer);

        const resultImage = document.createElement("img");
        resultImage.className = "resultImage";
        resultImage.src = result.image;
        resultContainer.appendChild(resultImage);

        const resultText = document.createElement("div");
        resultText.className = "resultText";
        resultContainer.appendChild(resultText);

        const resultTitle = document.createElement("h2");
        resultTitle.innerHTML = result.title;
        resultText.appendChild(resultTitle);

        const resultDescription = document.createElement("p");
        resultDescription.innerHTML = result.description;
        resultText.appendChild(resultDescription);
    }
}

displayQuestion();