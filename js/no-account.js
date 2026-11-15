export function showNoAccountOverlay() {
    const noAccOverlay = document.getElementById('no-acc-overlay');
    const closeNoAccOverlay = document.getElementById('close-no-acc-overlay');
    const loginButton = document.getElementById('login-button');

    noAccOverlay.hidden = false;

    closeNoAccOverlay.addEventListener('click', () => {
        noAccOverlay.hidden = true;
    });

    noAccOverlay.addEventListener('click', (event) => {
        if (event.target === noAccOverlay) {
            noAccOverlay.hidden = true;
        }
    });

    loginButton.addEventListener('click', () => {
        noAccOverlay.hidden = true;

        const accountOverlay = document.getElementById('account-overlay');

        accountOverlay.hidden = false;
    });
    
    

}

