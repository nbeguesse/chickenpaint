/*
    ChickenPaint
    
    ChickenPaint is a translation of ChibiPaint from Java to JavaScript
    by Nicholas Sherlock / Chicken Smoothie.
    
    ChibiPaint is Copyright (c) 2006-2008 Marc Schefer

    ChickenPaint is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ChickenPaint is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ChickenPaint. If not, see <http://www.gnu.org/licenses/>.
*/

import CPCanvas from "./CPCanvas";
import CPPaletteManager from "./CPPaletteManager";

export default function CPMainGUI(controller, uiElem) {
    var
        lowerArea = document.createElement("div"),
        canvas = new CPCanvas(controller),
        paletteManager = new CPPaletteManager(controller),
        menuBar,
        
        keyboardShortcutActions,
        
        macPlatform = /^Mac/i.test(navigator.platform),
        
        that = this;
    
    function menuItemClicked(target) {
        var
            action = target.data('action'),
            checkbox = target.data('checkbox'),
            selected;
        
        if (checkbox) {
            target.toggleClass("selected");
            selected = target.hasClass("selected");
        } else {
            selected = false;
        }
        
        controller.actionPerformed({
            action: action,
            checkbox: checkbox,
            selected: selected
        });
    }
    
    function presentShortcutText(shortcut) {
        shortcut = shortcut.toUpperCase();
        
        // Only show the first potential shortcut out of the comma-separated list
        shortcut = shortcut.replace(/(,.+)$/, "");
        
        if (macPlatform) {
            shortcut = shortcut.replace(/([^+])\+/g, "$1");
        } else {
            shortcut = shortcut.replace(/([^+])\+/g, "$1 ");
        }
        
        return shortcut;
    }
    
    function recurseFillMenu(menuElem, entries) {
        for (var i = 0; i < entries.length; i++) {
            (function(entry) {
                var 
                    entryElem;
    
                if (entry.children) {
                    entryElem = $(
                        '<li class="dropdown">'
                            + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + entry.name + ' <span class="caret"></span></a>'
                            + '<ul class="dropdown-menu">'
                            + '</ul>'
                        + '</li>'
                    );
                    
                    recurseFillMenu($(".dropdown-menu", entryElem), entry.children);
                } else if (entry.name == '-') {
                    entryElem = $('<li role="separator" class="divider"></li>');
                } else {
                    entryElem = $('<li><a href="#" data-action="' + entry.action + '"><span>' + entry.name + '</span></a></li>');
                    
                    if (entry.checkbox) {
                        $("a", entryElem)
                            .data("checkbox", true)
                            .toggleClass("selected", !!entry.checked);
                    }
                }
                
                if (entry.title) {
                    entryElem.attr('title', entry.title);
                }
                
                if (entry.shortcut) {
                    var
                        menuLink = $("> a", entryElem),
                        shortcutDesc = document.createElement("small");
                    
                    // Rewrite the shortcuts to Mac-style
                    if (macPlatform) {
                        entry.shortcut = entry.shortcut.replace(/SHIFT/im, "⇧");
                        entry.shortcut = entry.shortcut.replace(/ALT/im, "⌥");
                        entry.shortcut = entry.shortcut.replace(/CTRL/im, "⌘");
                    }
                    
                    shortcutDesc.className = "chickenpaint-shortcut pull-right";
                    shortcutDesc.innerHTML = presentShortcutText(entry.shortcut);
                    
                    menuLink.append(shortcutDesc);
                    
                    key(entry.shortcut, function() {
                        menuItemClicked(menuLink);
                        
                        return false;
                    });
                }
                
                menuElem.append(entryElem);
            })(entries[i]);
        }
    }
    
    function createMainMenu(listener) {
        var
            menuEntries = [
                {
                    name: "File",
                    mnemonic: "F",
                    children: [
                        {
                            name: "Save as...",
                            action: "CPSave",
                            mnemonic: "S",
                            shortcut: "ctrl+s"
                        },
                        {
                            name: "Save Oekaki", /* to the server */
                            action: "CPSend",
                            mnemonic: "S",
                            shortcut: "ctrl+s"
                        },
                    ],
                },
                {
                    name: "Edit",
                    mnemonic: "E",
                    children: [
                        {
                            name: "Undo",
                            action: "CPUndo",
                            mnemonic: "U",
                            shortcut: "ctrl+z",
                            title: "Undoes the most recent action"
                        },
                        {
                            name: "Redo",
                            action: "CPRedo",
                            mnemonic: "R",
                            shortcut: "shift+ctrl+z",
                            title: "Redoes a previously undone action"
                        },
                        {
                            name: "Clear history",
                            action: "CPClearHistory",
                            mnemonic: "H",
                            title: "Removes all undo/redo information to regain memory"
                        },
                        {
                            name: "-",
                        },
                        {
                            name: "Cut",
                            action: "CPCut",
                            mnemonic: "T",
                            shortcut: "ctrl+x"
                        },
                        {
                            name: "Copy",
                            action: "CPCopy",
                            mnemonic: "C",
                            shortcut: "ctrl+c"
                        },
                        {
                            name: "Copy merged",
                            action: "CPCopyMerged",
                            mnemonic: "Y",
                            shortcut: "shift+ctrl+c"
                        },
                        {
                            name: "Paste",
                            action: "CPPaste",
                            mnemonic: "P",
                            shortcut: "ctrl+v"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Select all",
                            action: "CPSelectAll",
                            mnemonic: "A",
                            shortcut: "ctrl+a"
                        },
                        {
                            name: "Deselect",
                            action: "CPDeselectAll",
                            mnemonic: "D",
                            shortcut: "ctrl+d"
                        }
                    ]
                },
                {
                    name: "Layers",
                    mnemonic: "L",
                    children: [
                        {
                            name: "Duplicate",
                            action: "CPLayerDuplicate",
                            mnemonic: "D",
                            shortcut: "shift+ctrl+d",
                            title: "Creates a copy of the currently selected layer"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Merge down",
                            action: "CPLayerMergeDown",
                            mnemonic: "E",
                            shortcut: "ctrl+e",
                            title: "Merges the currently selected layer with the one directly below it"
                        },
                        {
                            name: "Merge all layers",
                            action: "CPLayerMergeAll",
                            mnemonic: "A",
                            shortcut: "ctrl+s",
                            title: "Merges all the layers"
                        },
                    ],
                },
                {
                    name: "Effects",
                    mnemonic: "E",
                    children: [
                        {
                            name: "Clear",
                            action: "CPClear",
                            mnemonic: "D",
                            shortcut: "del,backspace",
                            title: "Clears the selected area"
                        },
                        {
                            name: "Fill",
                            action: "CPFill",
                            mnemonic: "F",
                            shortcut: "ctrl+f",
                            title: "Fills the selected area with the current color"
                        },
                        {
                            name: "Flip horizontal",
                            action: "CPHFlip",
                            mnemonic: "H",
                            title: "Flips the current selected area horizontally"
                        },
                        {
                            name: "Flip vertical",
                            action: "CPVFlip",
                            mnemonic: "V",
                            title: "Flips the current selected area vertically"
                        },
                        {
                            name: "Invert",
                            action: "CPFXInvert",
                            mnemonic: "I",
                            title: "Invert the image colors"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Box blur...",
                            action: "CPFXBoxBlur",
                            mnemonic: "B",
                            title: "Blur effect"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Monochromatic noise",
                            action: "CPMNoise",
                            mnemonic: "M",
                            title: "Fills the selection with noise"
                        },
                        {
                            name: "Color noise",
                            action: "CPCNoise",
                            mnemonic: "C",
                            title: "Fills the selection with colored noise"
                        }
                    ],
                },
                {
                    name: "View",
                    mnemonic: "V",
                    children: [
                        {
                            name: "Zoom in",
                            action: "CPZoomIn",
                            mnemonic: "I",
                            shortcut: "ctrl++",
                            title: "Zooms in"
                        },
                        {
                            name: "Zoom out",
                            action: "CPZoomOut",
                            mnemonic: "O",
                            shortcut: "ctrl+-",
                            title: "Zooms out"
                        },
                        {
                            name: "Zoom 100%",
                            action: "CPZoom100",
                            mnemonic: "1",
                            shortcut: "ctrl+0",
                            title: "Resets the zoom factor to 100%"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Smooth-out zoomed canvas",
                            action: "CPLinearInterpolation",
                            mnemonic: "L",
                            title: "Linear interpolation is used to give a smoothed looked to the picture when zoomed in",
                            checkbox: true
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Show grid",
                            action: "CPToggleGrid",
                            mnemonic: "G",
                            shortcut: "ctrl+g",
                            title: "Displays a grid over the image",
                            checkbox: true,
                            checked: false
                        },
                        {
                            name: "Grid options...",
                            action: "CPGridOptions",
                            mnemonic: "D",
                            title: "Shows the grid options dialog box",
                        }
                    ],
                },
                {
                    name: "Palettes",
                    mnemonic: "P",
                    children: [
                        {
                            name: "Rearrange",
                            action: "CPArrangePalettes",
                            title: "Rearrange the palette windows"
                        },
                        {
                            name: "Toggle palettes",
                            action: "CPTogglePalettes",
                            mnemonic: "P",
                            shortcut: "tab",
                            title: "Hides or shows all palettes"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "Show brush",
                            action: "CPPalBrush",
                            mnemonic: "B",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show color",
                            action: "CPPalColor",
                            mnemonic: "C",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show layers",
                            action: "CPPalLayers",
                            mnemonic: "Y",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show misc",
                            action: "CPPalMisc",
                            mnemonic: "M",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show stroke",
                            action: "CPPalStroke",
                            mnemonic: "S",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show swatches",
                            action: "CPPalSwatches",
                            mnemonic: "W",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show textures",
                            action: "CPPalTextures",
                            mnemonic: "X",
                            checkbox: true,
                            checked: true
                        },
                        {
                            name: "Show tools",
                            action: "CPPalTool",
                            mnemonic: "T",
                            checkbox: true,
                            checked: true
                        }
                    ]
                },
                {
                    name: "Help",
                    mnemonic: "H",
                    children: [
                        {
                            name: "Tablet support",
                            mnemonic: "T",
                            action: "CPTabletSupport",
                            title: "Help with getting a drawing tablet working"
                        },
                        {
                            name: "-"
                        },
                        {
                            name: "About",
                            mnemonic: "A",
                            action: "CPAbout",
                            title: "Displays some information about ChickenPaint"
                        }
                    ]
                },
            ],
            
            bar = $(
                '<nav class="navbar navbar-default">'
                    + '<div class="container-fluid">'
                        + '<div class="navbar-header">'
                            + '<a class="navbar-brand" href="#">ChickenPaint</a>'
                        + '</div>'
                        + '<ul class="nav navbar-nav">'
                        + '</ul>'
                    + '</div>'
                + '</nav>'
            );
        
        recurseFillMenu($(".navbar-nav", bar), menuEntries);

        $(bar).on('click', 'a:not(.dropdown-toggle)', function(e) {
            menuItemClicked($(this));

            e.preventDefault();
        });
        
        return bar[0];
    }
    
    function onPaletteVisChange(paletteName, show) {
        // Toggle the tickbox of the corresponding menu entry to match the new palette visibility
        var
            palMenuEntry = $('[data-action=\"CPPal' + paletteName.substring(0, 1).toUpperCase() + paletteName.substring(1) + '\"]', menuBar);
        
        palMenuEntry.toggleClass("selected", show);
    }
    
    this.togglePalettes = function() {
        paletteManager.togglePalettes();
    };
    
    this.arrangePalettes = function() {
        // Give the browser a chance to do the sizing of the palettes before we try to rearrange them
        setTimeout(function() {
            paletteManager.arrangePalettes();
        }, 0);
    };

    this.constrainPalettes = function() {
        paletteManager.constrainPalettes();
    };
    
    this.showPalette = function(paletteName, show) {
        paletteManager.showPaletteByName(paletteName, show);
    };
    
    this.getSwatches = function() {
        return paletteManager.palettes.swatches.getSwatches();
    };

    this.setSwatches = function(swatches) {
        paletteManager.palettes.swatches.setSwatches(swatches);
    };

    paletteManager.on("paletteVisChange", onPaletteVisChange);
    
    window.addEventListener("resize", function() {
        that.constrainPalettes();
    });

    menuBar = createMainMenu();
    
    uiElem.appendChild(menuBar);
    
    lowerArea.className = 'chickenpaint-main-section';
    
    lowerArea.appendChild(canvas.getElement());
    lowerArea.appendChild(paletteManager.getElement());
    
    uiElem.appendChild(lowerArea);
   
    setTimeout(function() {
        canvas.resize();
    }, 0);
}

CPMainGUI.prototype = Object.create(EventEmitter.prototype);
CPMainGUI.prototype.constructor = CPMainGUI;