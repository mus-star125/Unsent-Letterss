
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyv4TYPuAgOiEGue243lL5siXRXaYz7mVBMsXE8mxwBRVQ1VhhD-KxfraZef9EAUu0QTA/exec';

// Read More button on the individual letter page
const button = document.getElementById('read-more-button');
const fullLetter = document.getElementById('full-letter');

if (button && fullLetter) {
    button.addEventListener('click', function () {
        if (fullLetter.style.display === 'block') {
            fullLetter.style.display = 'none';
            button.textContent = 'Read More';
        } else {
            fullLetter.style.display = 'block';
            button.textContent = 'Read Less';
        }
    });
}

// Save a new letter
const form = document.getElementById('letter-form');

if (form) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const recipient = document.getElementById('recipient').value.trim();
        const content = document.getElementById('letter-content').value.trim();

        if (!recipient || !content) {
            alert('Please enter a recipient and a letter.');
            return;
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({
                    recipient: recipient,
                    content: content
                })
            });

            
            alert('Your letter was sent! Check the spreadsheet to confirm.');
            form.reset();
        } catch (error) {
            console.error('Could not send letter:', error);
            alert('Sorry, something went wrong. Please try again.');
        }
    });
}

// Load public letters
async function loadLetters() {
    const container = document.getElementById('letters-container');
    if (!container) return;

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) {
            throw new Error('Could not retrieve letters.');
        }

        const data = await response.json();
        container.innerHTML = '';

        data.forEach(function (letter) {
            const card = document.createElement('div');
            card.classList.add('envelope')
            const envelopeImage = document.createElement('img');
                envelopeImage.src = 'images/image_2151814e (1).jpg';
                envelopeImage.alt = 'Cute sealed letter';
                envelopeImage.style.width = '140px';
                envelopeImage.style.display = 'block';
envelopeImage.style.margin = '0 auto 15px';

card.appendChild(envelopeImage);
            card.classList.add('letter-card');

            const title = document.createElement('h3');
            title.textContent = ' To: ' + letter.recipient;

            const preview = document.createElement('p');
            const fullMessage = document.createElement('p');
            fullMessage.classList.add('letter-paper');

            const previewLength = 120;
            const isLong = letter.content.length > previewLength;

            preview.textContent = isLong
                ? letter.content.slice(0, previewLength) + '...'
                : letter.content;

            fullMessage.textContent = letter.content;
            fullMessage.style.display = 'none';
            fullMessage.classList.add('letter-paper');

            card.appendChild(title);
            card.style.cursor = 'pointer';
            card.appendChild(fullMessage);

            card.addEventListener('click', function () {
    const isClosed = fullMessage.style.display === 'none';

    preview.style.display = isClosed ? 'none' : 'block';
    fullMessage.style.display = isClosed ? 'block' : 'none';
});

            if (isLong) {
                const moreButton = document.createElement('button');
                moreButton.textContent = 'Read More';

                moreButton.addEventListener('click', function () {
                    const expanded = fullMessage.style.display === 'none';

                    preview.style.display = expanded ? 'none' : 'block';
                    fullMessage.style.display = expanded ? 'block' : 'none';
                    moreButton.textContent = expanded ? 'Read Less' : 'Read More';
                });

                
            }

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Could not load letters:', error);
        container.textContent =
            'Letters could not be loaded. Please try again later.';
    }
}

loadLetters();

// Search by recipient
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-recipient');

if (searchButton && searchInput) {
    searchButton.addEventListener('click', function () {
        const searchValue = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll(
            '#letters-container .letter-card'
        );

        cards.forEach(function (card) {
            const recipient = card.querySelector('h3').textContent
                .replace('To: ', '')
                .toLowerCase();

            card.style.display = recipient.includes(searchValue)
                ? 'block'
                : 'none';
        });
    });c
}
