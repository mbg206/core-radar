const quickControlContainer = document.getElementById("quick-controls") as HTMLElement;

function addQuickControl(text: string, toggled: boolean) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("bubble", "control");
    if (toggled) {
        button.classList.add("enabled");
    }
    button.addEventListener("click", () => button.classList.toggle("enabled"))

    quickControlContainer.append(button);
    return button;
}

addQuickControl("Show MDs", true);
addQuickControl("Show Alerts", true);
addQuickControl("Show Reports", false);
addQuickControl("Show Outlook", false);