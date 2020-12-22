const { Clutter, St, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


const bullet = "●";
const circle = "○";

let _indicator;

let WorkspaceIndicator = GObject.registerClass(
    class WorkspaceIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Workspace Indicator'));
            
            let container = new St.Widget({
                layout_manager: new Clutter.BinLayout(),
                x_expand: true,
                y_expand: true,
            });
            this.add_actor(container);
            
            this._statusLabel = new St.Label({
                style_class: "panel-button-text",
                text: getWidgetText(),
                x_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            container.add_actor(this._statusLabel);

            let workspaceManager = global.workspace_manager;
            this._workspaceManagerSignals = [
                workspaceManager.connect_after('notify::n-workspaces',
                    this._nWorkspacesChanged.bind(this)),
                workspaceManager.connect_after('workspace-switched',
                    this._onWorkspaceSwitched.bind(this)),
            ];

        }

        _onDestroy() {
            super._onDestroy();
        }

        _onWorkspaceSwitched() {
            this._statusLabel.text = getWidgetText();
        }
    
        _nWorkspacesChanged() {
            this._statusLabel.text = getWidgetText();
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