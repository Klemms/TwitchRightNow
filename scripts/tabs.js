window.addEventListener("load", function() {
    Array.from(document.getElementById("bottom-bar").getElementsByClassName("tab-button")).forEach(element => {
        element.onclick = function(click) {
            switchTab(element.id);
        };
    });

    switchTab("followed-streams-button");
});

function switchTab(tabName) {
    removeAllSelected();
    hideAllTabs();

    switch(tabName) {
        case "followed-streams-button":
            this.document.getElementById("followed-streams-button").classList.add("selected");
            this.document.getElementById("streams-page").style["display"] = "block";
            break;
        case "streams-notifications-button":
            this.document.getElementById("streams-notifications-button").classList.add("selected");
            this.document.getElementById("notifications-page").style["display"] = "block";
            break;
    }
}

function removeAllSelected() {
    var selected = Array.from(document.getElementById("bottom-bar").getElementsByClassName("selected"));
    console.log(selected);
    selected.forEach(element => {
        element.classList.remove("selected");
    });
}

function hideAllTabs() {
    var selected = Array.from(document.getElementsByClassName("tab"));
    console.log(selected);
    selected.forEach(element => {
        element.style["display"] = "none";
    });
}