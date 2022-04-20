const { Clutter, St, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;

const bullet = "●";
const circle = "○";
const leftButton = 1;
const middleButton = 2;
const rightButton = 3;

let WorkspaceIndicator = GObject.registerClass(
    class WorkspaceIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Horizontal workspace indicator'));
            
            this._container = new St.Widget({
                layout_manager: new Clutter.BinLayout(),
                x_expand: true,
                y_expand: true,
                style_class: "widget",
            });
            this.add_actor(this._container);
            
            this._statusLabel = new St.Label({
                style_class: "panel-button-text",
                text: getWidgetText(),
                x_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            this._container.add_actor(this._statusLabel);

            let workspaceManager = global.workspace_manager;
            this._workspaceManagerSignals = [
                workspaceManager.connect_after('notify::n-workspaces',
                    this._updateView.bind(this)),
                workspaceManager.connect_after('workspace-switched',
                    this._updateView.bind(this)),
            ];

            this.connect('button-press-event', this._onButtonPress);
        }

        destroy() {
            for (let i = 0; i < this._workspaceManagerSignals.length; i++)
                global.workspace_manager.disconnect(this._workspaceManagerSignals[i])
            super.destroy();
        }

        _updateView() {
            this._statusLabel.text = getWidgetText();
        }

        _onButtonPress(actor, event) {
            let workspaceManager = global.workspace_manager;
            let activeWorkspaceIndex = workspaceManager.get_active_workspace_index();
            let button = event.get_button();

            if (button == leftButton) {
                if (activeWorkspaceIndex == 0) {
                    return
                }
                Main.wm.actionMoveWorkspace(workspaceManager.get_workspace_by_index(activeWorkspaceIndex-1));
            } else if (button == rightButton) {
                if (activeWorkspaceIndex == workspaceManager.get_n_workspaces()-1) {
                    return
                }
                Main.wm.actionMoveWorkspace(workspaceManager.get_workspace_by_index(activeWorkspaceIndex+1));
            } else if (button == middleButton) {
                if (Main.overview.visible) {
                    Main.overview.hide();
                } else {
                    Main.overview.show();
                }
            }
        }
    }
);

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }
    
    enable() {
        this._indicator = new WorkspaceIndicator();
        this._settings = ExtensionUtils.getSettings();
        let widgetPosition = this._settings.get_value("widget-position").unpack();
        Main.panel.addToStatusArea(this._uuid, this._indicator, getWidgetIndex(widgetPosition), widgetPosition);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        this._settings = null;
    }
}

function getWidgetIndex(position) {
    if (position === "right") {
        return 0
    } 

    return 1
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

function init(meta) {
    return new Extension(meta.uuid);
}