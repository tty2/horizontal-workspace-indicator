const { Clutter, St } = imports.gi;
const Main = imports.ui.main;

const bullet = "●";
const circle = "○";

let panelButton, panelButtonText;


function init() {
    panelButton = new St.Bin({
        style_class: "panel-button"
    });
    panelButtonText = new St.Label({
        style_class: "panel-button-text",
        text: getWidgetText(),
        x_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child(panelButtonText);
}

function getWidgetText() {
    let txt = "";
    let numberWorkspaces = global.workspace_manager.get_n_workspaces();
    let currentWorkspaceIndex = global.workspace_manager.get_active_workspace_index();
    for (let i = 0; i < numberWorkspaces; i++) {
        if (i == currentWorkspaceIndex) {
            txt += bullet;
        } else {
            txt += circle;
        }
    }
    return txt
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(panelButton, 1);
}

function disable() {
    Main.panel._rightBox.remove_child(panelButton);
}