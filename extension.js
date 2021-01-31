const { Clutter, St, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
// const Util = imports.util;


const bullet = "●";
const circle = "○";

let _indicator;

let WorkspaceIndicator = GObject.registerClass(
    class WorkspaceIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Workspace Indicator'));
            
            this._container = new St.Widget({
                layout_manager: new Clutter.BinLayout(),
                x_expand: true,
                y_expand: true,
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

            // Util.connectSmart(this, 'scro_onScrollEventll-event',            this, '_handleScrollEvent')

        }

        _onDestroy() {
            for (let i = 0; i < this._workspaceManagerSignals.length; i++)
                global.workspace_manager.disconnect(this._workspaceManagerSignals[i])
            super._onDestroy();
        }

        _updateView() {
            this._statusLabel.text = getWidgetText();
        }

        _onScrollEvent() {
            log("inside on scroll event")
        }

        scroll(dx, dy) {
            log("movement", dy)
            let workspaceManager = global.workspace_manager;
            let activeWorkspaceIndex = workspaceManager.get_active_workspace_index();
            let window = global.display.get_focus_window()
            if (dy < 0) {
                // scroll up (move left)
                if (activeWorkspaceIndex == 0) {
                    return
                }
                window.change_workspace_by_index(activeWorkspaceIndex-1, false);
            } else if (dy > 0) {
                // scroll down (move right)
                if (activeWorkspaceIndex == workspaceManager.get_n_workspaces()) {
                    return
                }
                window.change_workspace_by_index(activeWorkspaceIndex+1, false);
            }
        }

        _handleScrollEvent(actor, event) {
            log("handle scroll event")
            if (actor != this)
                return Clutter.EVENT_PROPAGATE
    
            if (event.get_source() != this)
                return Clutter.EVENT_PROPAGATE
    
            if (event.type() != Clutter.EventType.SCROLL)
                return Clutter.EVENT_PROPAGATE
    
            // Since Clutter 1.10, clutter will always send a smooth scrolling event
            // with explicit deltas, no matter what input device is used
            // In fact, for every scroll there will be a smooth and non-smooth scroll
            // event, and we can choose which one we interpret.
            if (event.get_scroll_direction() == Clutter.ScrollDirection.SMOOTH) {
                let [ dx, dy ] = event.get_scroll_delta()
    
                this.scroll(dx, dy)
            }
    
            return Clutter.EVENT_STOP
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