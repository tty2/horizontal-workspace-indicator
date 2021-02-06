const { Clutter, St, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


const bullet = "●";
const circle = "○";
const leftButton = 1;
const rightButton = 3;

let _indicator;

let WorkspaceIndicator = GObject.registerClass(
    class WorkspaceIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Workspace Indicator'));
            
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

        _onDestroy() {
            for (let i = 0; i < this._workspaceManagerSignals.length; i++)
                global.workspace_manager.disconnect(this._workspaceManagerSignals[i])
            super._onDestroy();
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
            }
        }
    }
);

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

function init() {
}

function enable() {
    _indicator = new WorkspaceIndicator();
    Main.panel.addToStatusArea('workspace-indicator', _indicator);
}

function disable() {
    _indicator.destroy();
}