async function loadSharedElements() {
    const [headerResponse, overlaysResponse] = await Promise.all([
        fetch("html/header.html"),
        fetch("html/overlays.html")
    ]);

    if (!headerResponse.ok || !overlaysResponse.ok) {
        throw new Error("Could not load shared HTML");
    }

    const [headerHtml, overlaysHtml] = await Promise.all([
        headerResponse.text(),
        overlaysResponse.text()
    ]);

    document.getElementById("header-container").innerHTML = headerHtml;
    document.getElementById("overlay-container").innerHTML = overlaysHtml;

    const script = document.createElement('script');
    script.src = 'js/main.js';
    script.type = 'module';
    document.body.appendChild(script);
}

loadSharedElements().catch(error => {
    console.error("Could not load shared elements", error);
});