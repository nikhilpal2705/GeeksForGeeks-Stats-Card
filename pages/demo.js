let isRaw = document.querySelector("#raw").checked;

function toggleRaw() {
    const themeSelect = document.getElementById('theme');
    isRaw = document.getElementById('raw').checked;
    if (isRaw) {
        themeSelect.disabled = true;
    } else {
        themeSelect.disabled = false;
    }
}

function url() {

    if (!value("username")) document.querySelector("#username").value = "nikhilpal2705";
    return (location.origin + "/" + encodeURIComponent(value("username")) + (isRaw ? "?raw=true" : "?theme=" + encodeURIComponent(value("theme"))));
}

async function preview() {
    const previewDiv = document.querySelector("#preview");
    const pre = document.createElement("pre");

    try {
        if (isRaw) {
            const response = await axios.get(url());
            pre.textContent = JSON.stringify(response.data, null, 4);
            previewDiv.innerHTML = "";
            previewDiv.appendChild(pre);
        } else {
            const img = document.createElement("img");

            await new Promise((resolve, reject) => {
                img.src = url();
                img.onload = () => resolve();
                img.onerror = () => reject(new Error("User not found or data unavailable."));
            });
            previewDiv.innerHTML = "";
            previewDiv.appendChild(img);
        }
    } catch (error) {
        pre.textContent = error.response?.data || error.message;
        previewDiv.innerHTML = "";
        previewDiv.appendChild(pre);
    }
}
// Call preview initially
preview();

function go() {
    let win = window.open();
    win.location = url();
}

function md() {
    if (isRaw) {
        prompt("URL:", url());
    } else {
        let code = "![GeeksforGeeks Stats](" + url() + ")";
        prompt("Markdown Code:", code);
    }
}

function value(id) {
    return document.querySelector("#" + id).value.trim() || "";
}