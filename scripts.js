function openCheckCard() {
    window.open('check-card.html', '_blank');
}

function encodeBingoCard(card) {
    const cardString = card.flat().map(num => (num === 'FREE' ? '00' : num.toString().padStart(2, '0'))).join('');
    return btoa(cardString);
}

function decodeBingoCard(encodedCard) {
    const cardString = atob(encodedCard);
    const card = [];
    for (let i = 0; i < 25; i++) {
        const num = cardString.slice(i * 2, i * 2 + 2);
        if (num === '00') {
            card.push('FREE');
        } else {
            card.push(parseInt(num, 10));
        }
    }
    return [
        card.slice(0, 5),
        card.slice(5, 10),
        card.slice(10, 15),
        card.slice(15, 20),
        card.slice(20, 25)
    ];
}

function generateBingoCard() {
    const card = [];
    const columns = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
        { start: 1, end: 15 },
        { start: 16, end: 30 },
        { start: 31, end: 45 },
        { start: 46, end: 60 },
        { start: 61, end: 75 }
    ];

    for (let i = 0; i < 5; i++) {
        let colNumbers = [];
        while (colNumbers.length < 5) {
            const num = Math.floor(Math.random() * (ranges[i].end - ranges[i].start + 1)) + ranges[i].start;
            if (!colNumbers.includes(num)) {
                colNumbers.push(num);
            }
        }
        colNumbers.sort((a, b) => a - b); // Ordena os números em cada coluna
        card.push(colNumbers);
    }

    // Central space is free (index 2,2)
    card[2][2] = 'FREE';

    const cardId = encodeBingoCard(card);
    saveBingoCardAsCookie(card, cardId);

    return { card, cardId };
}

function displayBingoCard(card) {
    const bingoCardDiv = document.getElementById('bingo-card');
    if (bingoCardDiv) {
        bingoCardDiv.innerHTML = ''; // Clear previous card
        const table = document.createElement('table');

        const header = document.createElement('tr');
        ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
            const th = document.createElement('th');
            th.textContent = letter;
            header.appendChild(th);
        });
        table.appendChild(header);

        for (let row = 0; row < 5; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < 5; col++) {
                const td = document.createElement('td');
                if (card[col][row] === 'FREE') {
                    // Adding an image instead of text 'FREE'
                    const img = document.createElement('img');
                    img.src = 'img/ficha.png'; // Specify the path to your image
                    img.alt = 'FREE';
                    img.classList.add('free-image');
                    td.appendChild(img);
                    td.classList.add('free');
                } else {
                    td.textContent = card[col][row];
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        bingoCardDiv.appendChild(table);
    }
}

function saveBingoCardAsCookie(card, cardId) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 4);
    document.cookie = `bingoCard=${JSON.stringify(card)};expires=${expires.toUTCString()};path=/`;
    document.cookie = `cardId=${cardId};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function loadBingoCardFromCookie() {
    const card = getCookie('bingoCard');
    if (card) {
        return JSON.parse(card);
    }
    return null;
}

class BingoGame {
    constructor() {
        this.allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.markedNumbers = new Set();
        this.lastNumbers = [];
    }

    drawNumber() {
        if (this.allNumbers.length === 0) {
            throw new Error("All numbers have been drawn.");
        }

        const drawnIndex = Math.floor(Math.random() * this.allNumbers.length);
        const drawnNumber = this.allNumbers.splice(drawnIndex, 1)[0];
        this.markedNumbers.add(drawnNumber);

        // Adiciona o número aos últimos três números sorteados
        this.lastNumbers.push(drawnNumber);
        if (this.lastNumbers.length > 3) {
            this.lastNumbers.shift();
        }

        return drawnNumber;
    }

    displayTable() {
        const bingoTableDiv = document.getElementById('bingo-table');
        bingoTableDiv.innerHTML = ""; // Clear previous table
        const table = document.createElement('table');

        const header = document.createElement('tr');
        ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
            const th = document.createElement('th');
            th.textContent = letter;
            header.appendChild(th);
        });
        table.appendChild(header);

        const ranges = [
            { start: 1, end: 15 },
            { start: 16, end: 30 },
            { start: 31, end: 45 },
            { start: 46, end: 60 },
            { start: 61, end: 75 }
        ];

        for (let i = 0; i < 15; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < 5; j++) {
                const td = document.createElement('td');
                const number = ranges[j].start + i;
                if (this.markedNumbers.has(number)) {
                    td.textContent = number;
                    td.classList.add('marked');
                } else {
                    td.textContent = number;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        bingoTableDiv.appendChild(table);
    }

    displayLastNumbers() {
        const lastNumbersDiv = document.getElementById('last-numbers');
        lastNumbersDiv.textContent = `Last Numbers Drawn: ${this.lastNumbers.join(', ')}`;
    }
}

const bingoGame = new BingoGame();

function drawNumber() {
    const drawnNumber = bingoGame.drawNumber();
    alert(`Number drawn: ${drawnNumber}`);
    bingoGame.displayTable();
    bingoGame.displayLastNumbers();
}

function openBingoCard() {
    const bingoCardData = generateBingoCard();
    alert(`Bingo Card ID: ${bingoCardData.cardId}`);
    window.open('bingo-card.html', '_blank');
}

function checkBingoCard() {
    const cardId = prompt("Enter Bingo Card ID:");
    if (!cardId) {
        alert("Please enter a valid Bingo Card ID.");
        return;
    }

    const savedCardId = getCookie('cardId');
    if (savedCardId !== cardId) {
        const decodedCard = decodeBingoCard(cardId);
        if (decodedCard) {
            displayBingoCard(decodedCard);
        } else {
            alert("Invalid Bingo Card ID.");
        }
    } else {
        const savedCard = loadBingoCardFromCookie();
        if (!savedCard) {
            alert("Bingo card not found.");
            return;
        }
        displayBingoCard(savedCard);
    }
}
