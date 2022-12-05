"use strict";

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

function init() {}

function buildPrefsWidget() {
    this.settings = ExtensionUtils.getSettings();

    const prefsWidget = new Gtk.Grid({
        margin_top: 20,
        margin_bottom: 20,
        margin_start: 20,
        margin_end: 20,
        column_spacing: 12,
        row_spacing: 12,
        visible: true,
        halign: Gtk.Align.CENTER,
    });

    let title = new Gtk.Label({
        label: `<b>Preferences</b>`,
        halign: Gtk.Align.CENTER,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    let note = new Gtk.Label({
        label: `After any changes turn the extension off and on again.`,
        halign: Gtk.Align.CENTER,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(note, 0, 1, 2, 1);

    const widgetPositionLabel = new Gtk.Label({
        label: "Widget position",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(widgetPositionLabel, 0, 2, 1, 1);

    const widgetPositionComboBox = new Gtk.ComboBoxText();
    widgetPositionComboBox.append("right", "Right corner | Status area");
    widgetPositionComboBox.append("center", "Center | Date time area");
    widgetPositionComboBox.append("left", "Left corner | Activities area");
    this.settings.bind(
        "widget-position",
        widgetPositionComboBox,
        "active-id",
        Gio.SettingsBindFlags.DEFAULT
    );
    prefsWidget.attach(widgetPositionComboBox, 1, 2, 1, 1);

    const widgetOrientationLabel = new Gtk.Label({
        label: "Widget orientation",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(widgetOrientationLabel, 0, 3, 1, 1);

    const widgetOrientationComboBox = new Gtk.ComboBoxText();
    widgetOrientationComboBox.append("horizontal", "Horizontal");
    widgetOrientationComboBox.append("vertical", "Vertical");
    this.settings.bind(
        "widget-orientation",
        widgetOrientationComboBox,
        "active-id",
        Gio.SettingsBindFlags.DEFAULT
    );
    prefsWidget.attach(widgetOrientationComboBox, 1, 3, 1, 1);

    const styleLabel = new Gtk.Label({
        label: "Icons Style",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(styleLabel, 0, 4, 1, 1);

    const styleComboBox = new Gtk.ComboBoxText();
    styleComboBox.append("circles", "Circles");
    styleComboBox.append("lines", "Lines");
    this.settings.bind(
        "icons-style",
        styleComboBox,
        "active-id",
        Gio.SettingsBindFlags.DEFAULT
    );
    prefsWidget.attach(styleComboBox, 1, 4, 1, 1);

    return prefsWidget;
}
