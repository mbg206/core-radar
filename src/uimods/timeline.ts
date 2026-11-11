const TIMELINE = document.getElementById("timeline") as HTMLDivElement;
const OUTLOOK_CONTROLS = document.getElementById("outlook-controls") as HTMLDivElement;

let activeRow: HTMLDivElement;
let activeRowBtn: HTMLButtonElement;
let activeProdBtn: HTMLButtonElement;

export interface OutlookButtonRow {
    label: string;
    buttons: OutlookButton[];
}
export interface OutlookButton {
    label: string;
    onclick: () => void;
}

export function setOutlookControls(controls: OutlookButtonRow[]) {
    const rowSelect = document.createElement("div");
    rowSelect.className = "outlook-row";
    OUTLOOK_CONTROLS.append(rowSelect);

    let first: HTMLButtonElement = null;

    for (const row of controls) {
        // outer row (select) button + row of category buttons
        const btn = document.createElement("button");
        btn.className = "outlook-btn";
        btn.textContent = row.label;

        const rowContainer = document.createElement("div");
        rowContainer.className = "outlook-row";
        rowContainer.style.display = "none";

        for (const product of row.buttons) {
            // inner product select button
            const btn = document.createElement("button");
            btn.className = "outlook-btn";
            btn.textContent = product.label;
            btn.addEventListener("click", () => {
                if (btn == activeProdBtn) return;
                if (activeProdBtn) {
                    activeProdBtn.classList.remove("selected");
                }
                btn.classList.add("selected");
                activeProdBtn = btn;
                product.onclick();
            });
            rowContainer.append(btn);
        }

        btn.addEventListener("click", () => {
            if (activeRow == rowContainer) return;

            if (activeRow) {
                activeRow.style.display = "none";
                activeRowBtn.classList.remove("selected");
            }
            rowContainer.style.display = "";
            btn.classList.add("selected");

            activeRow = rowContainer;
            activeRowBtn = btn;
            (rowContainer.children[0] as HTMLButtonElement).click();
        });

        rowSelect.append(btn);
        if (first == null) {
            first = btn;
        }

        OUTLOOK_CONTROLS.append(rowContainer);
    }

    first.click();
    OUTLOOK_CONTROLS.style.display = "";
}

export function hideOutlookControls() {
    OUTLOOK_CONTROLS.style.display = "none";
    activeRow = null;
    activeRowBtn = null;
    activeProdBtn = null;
    OUTLOOK_CONTROLS.innerHTML = "";
}
    OUTLOOK_CONTROLS.innerHTML = "";
