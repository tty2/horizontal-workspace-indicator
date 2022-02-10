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
    });

    // Add a simple title and add it to the prefsWidget
    let title = new Gtk.Label({
        label: `<b>Preferences</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    const widgetPositionLabel = new Gtk.Label({
        label: "Widget position",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(widgetPositionLabel, 0, 1, 1, 1);

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
    prefsWidget.attach(widgetPositionComboBox, 1, 1, 1, 1);

    return prefsWidget;
}