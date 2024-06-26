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
        card.push(colNumbers);
    }

    // Central space is free
    card[2][2] = 'FREE';

    return card;
}

function displayBingoCard(card) {
    const bingoCardDiv = document.getElementById('bingo-card');
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
                td.textContent = 'FREE';
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

        for (let i = 1; i <= 75; i++) {
            if (i % 15 === 1) {
                var tr = document.createElement('tr');
            }
            const td = document.createElement('td');
            if (this.markedNumbers.has(i)) {
                td.textContent = [i];
                td.classList.add('marked');
            } else {
                td.textContent = i;
            }
            tr.appendChild(td);

            if (i % 15 === 0) {
                table.appendChild(tr);
            }
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
    window.open('bingo-card.html', '_blank');
}
