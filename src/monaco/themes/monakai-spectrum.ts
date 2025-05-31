import * as monaco from "monaco-editor-core"

monaco.editor.defineTheme("monokai-pro-spectrum", {
    inherit: false,
    base: "vs-dark",
    colors: {
        "activityBar.activeFocusBorder": "#fce566",
        "activityBar.background": "#131313",
        "activityBar.border": "#131313",
        "activityBar.foreground": "#bab6c0",
        "activityBar.inactiveForeground": "#525053",
        "activityBarBadge.background": "#fce566",
        "activityBarBadge.foreground": "#222222",
        "activityBarTop.background": "#191919",
        "activityBarTop.foreground": "#bab6c0",
        "activityBarTop.inactiveForeground": "#525053",
        "badge.background": "#fce566",
        "badge.foreground": "#222222",
        "banner.background": "#363537",
        "banner.foreground": "#bab6c0",
        "banner.iconForeground": "#bab6c0",
        "breadcrumb.activeSelectionForeground": "#f7f1ff",
        "breadcrumb.focusForeground": "#bab6c0",
        "breadcrumb.foreground": "#8b888f",
        "breadcrumbPicker.background": "#222222",
        "button.background": "#363537",
        "button.foreground": "#f7f1ff",
        "button.hoverBackground": "#525053",
        "button.secondaryBackground": "#363537",
        "button.secondaryForeground": "#bab6c0",
        "button.secondaryHoverBackground": "#525053",
        "button.separator": "#222222",
        "charts.blue": "#5ad4e6",
        "charts.foreground": "#f7f1ff",
        "charts.green": "#7bd88f",
        "charts.lines": "#69676c",
        "charts.orange": "#fd9353",
        "charts.purple": "#948ae3",
        "charts.red": "#fc618d",
        "charts.yellow": "#fce566",
        "chat.avatarBackground": "#222222",
        "chat.avatarForeground": "#948ae3",
        "chat.requestBackground": "#363537",
        "chat.requestBorder": "#525053",
        "chat.slashCommandBackground": "#00000000",
        "chat.slashCommandForeground": "#fce566",
        "checkbox.background": "#363537",
        "checkbox.border": "#525053",
        "checkbox.foreground": "#fce566",
        "commandCenter.activeBackground": "#222222",
        "commandCenter.activeForeground": "#bab6c0",
        "commandCenter.background": "#191919",
        "commandCenter.border": "#222222",
        "commandCenter.debuggingBackground": "#191919",
        "commandCenter.foreground": "#8b888f",
        "debugConsole.errorForeground": "#fc618d",
        "debugConsole.infoForeground": "#5ad4e6",
        "debugConsole.sourceForeground": "#f7f1ff",
        "debugConsole.warningForeground": "#fd9353",
        "debugConsoleInputIcon.foreground": "#fce566",
        "debugExceptionWidget.background": "#363537",
        "debugExceptionWidget.border": "#191919",
        "debugIcon.breakpointCurrentStackframeForeground": "#fce566",
        "debugIcon.breakpointDisabledForeground": "#bab6c0",
        "debugIcon.breakpointForeground": "#fc618d",
        "debugIcon.breakpointStackframeForeground": "#f7f1ff",
        "debugIcon.breakpointUnverifiedForeground": "#fd9353",
        "debugIcon.continueForeground": "#f7f1ff",
        "debugIcon.disconnectForeground": "#f7f1ff",
        "debugIcon.pauseForeground": "#f7f1ff",
        "debugIcon.restartForeground": "#7bd88f",
        "debugIcon.startForeground": "#7bd88f",
        "debugIcon.stepBackForeground": "#f7f1ff",
        "debugIcon.stepIntoForeground": "#f7f1ff",
        "debugIcon.stepOutForeground": "#f7f1ff",
        "debugIcon.stepOverForeground": "#f7f1ff",
        "debugIcon.stopForeground": "#fc618d",
        "debugTokenExpression.boolean": "#fd9353",
        "debugTokenExpression.error": "#fc618d",
        "debugTokenExpression.name": "#5ad4e6",
        "debugTokenExpression.number": "#948ae3",
        "debugTokenExpression.string": "#fce566",
        "debugTokenExpression.value": "#f7f1ff",
        "debugToolBar.background": "#363537",
        "debugView.exceptionLabelBackground": "#fc618d",
        "debugView.exceptionLabelForeground": "#222222",
        "debugView.stateLabelBackground": "#7bd88f",
        "debugView.stateLabelForeground": "#222222",
        "debugView.valueChangedHighlight": "#fce566",
        descriptionForeground: "#8b888f",
        "diffEditor.diagonalFill": "#363537",
        "diffEditor.insertedLineBackground": "#7bd88f19",
        "diffEditor.insertedTextBackground": "#7bd88f19",
        "diffEditor.move.border": "",
        "diffEditor.moveActive.border": "",
        "diffEditor.removedLineBackground": "#fc618d19",
        "diffEditor.removedTextBackground": "#fc618d19",
        "diffEditor.unchangedCodeBackground": "#191919",
        "diffEditor.unchangedRegionBackground": "#191919",
        "diffEditor.unchangedRegionForeground": "#bab6c0",
        "diffEditor.unchangedRegionShadow": "#131313",
        "diffEditorGutter.insertedLineBackground": "#7bd88f19",
        "diffEditorGutter.removedLineBackground": "#fc618d19",
        "diffEditorOverview.insertedForeground": "#7bd88fa5",
        "diffEditorOverview.removedForeground": "#fc618da5",
        "dropdown.background": "#363537",
        "dropdown.border": "#525053",
        "dropdown.foreground": "#8b888f",
        "dropdown.listBackground": "#363537",
        "editor.background": "#222222",
        "editor.findMatchBackground": "#f7f1ff26",
        "editor.findMatchBorder": "#fce566",
        "editor.findMatchHighlightBackground": "#f7f1ff26",
        "editor.findMatchHighlightBorder": "#00000000",
        "editor.findRangeHighlightBackground": "#f7f1ff0c",
        "editor.findRangeHighlightBorder": "#00000000",
        "editor.focusedStackFrameHighlightBackground": "#bab6c026",
        "editor.foldBackground": "#f7f1ff0c",
        "editor.foreground": "#f7f1ff",
        "editor.hoverHighlightBackground": "#f7f1ff0c",
        "editor.inactiveSelectionBackground": "#f7f1ff0c",
        "editor.inlineValuesBackground": "#525053",
        "editor.inlineValuesForeground": "#bab6c0",
        "editor.lineHighlightBackground": "#f7f1ff0c",
        "editor.lineHighlightBorder": "#00000000",
        "editor.linkedEditingBackground": "#363537",
        "editor.rangeHighlightBackground": "#363537",
        "editor.rangeHighlightBorder": "#363537",
        "editor.selectionBackground": "#bab6c026",
        "editor.selectionHighlightBackground": "#f7f1ff26",
        "editor.selectionHighlightBorder": "#00000000",
        "editor.stackFrameHighlightBackground": "#bab6c026",
        "editor.wordHighlightBackground": "#f7f1ff26",
        "editor.wordHighlightBorder": "#00000000",
        "editor.wordHighlightStrongBackground": "#f7f1ff26",
        "editor.wordHighlightStrongBorder": "#00000000",
        "editorBracketHighlight.foreground1": "#fc618d",
        "editorBracketHighlight.foreground2": "#fd9353",
        "editorBracketHighlight.foreground3": "#fce566",
        "editorBracketHighlight.foreground4": "#7bd88f",
        "editorBracketHighlight.foreground5": "#5ad4e6",
        "editorBracketHighlight.foreground6": "#948ae3",
        "editorBracketMatch.background": "#222222",
        "editorBracketMatch.border": "#69676c",
        "editorCodeLens.foreground": "#69676c",
        "editorCursor.background": "#222222",
        "editorCursor.foreground": "#f7f1ff",
        "editorError.background": "#00000000",
        "editorError.border": "#00000000",
        "editorError.foreground": "#fc618d",
        "editorGhostText.foreground": "#69676c",
        "editorGroup.border": "#191919",
        "editorGroup.dropBackground": "#191919bf",
        "editorGroup.emptyBackground": "#131313",
        "editorGroup.focusedEmptyBorder": "#191919",
        "editorGroupHeader.noTabsBackground": "#222222",
        "editorGroupHeader.tabsBackground": "#222222",
        "editorGroupHeader.tabsBorder": "#222222",
        "editorGutter.addedBackground": "#7bd88f",
        "editorGutter.background": "#222222",
        "editorGutter.deletedBackground": "#fc618d",
        "editorGutter.foldingControlForeground": "#bab6c0",
        "editorGutter.modifiedBackground": "#fd9353",
        "editorHint.border": "#222222",
        "editorHint.foreground": "#948ae3",
        "editorHoverWidget.background": "#363537",
        "editorHoverWidget.border": "#191919",
        "editorIndentGuide.background": "#363537",
        "editorInfo.background": "#00000000",
        "editorInfo.border": "#222222",
        "editorInfo.foreground": "#5ad4e6",
        "editorInlayHint.background": "#363537",
        "editorInlayHint.foreground": "#8b888f",
        "editorLightBulb.foreground": "#fce566",
        "editorLightBulbAi.foreground": "#fce566",
        "editorLightBulbAutoFix.foreground": "#7bd88f",
        "editorLineNumber.activeForeground": "#bab6c0",
        "editorLineNumber.foreground": "#525053",
        "editorLink.activeForeground": "#5ad4e6",
        "editorMarkerNavigation.background": "#363537",
        "editorMarkerNavigationError.background": "#fc618d",
        "editorMarkerNavigationInfo.background": "#5ad4e6",
        "editorMarkerNavigationWarning.background": "#fd9353",
        "editorOverviewRuler.addedForeground": "#7bd88f",
        "editorOverviewRuler.border": "#222222",
        "editorOverviewRuler.currentContentForeground": "#363537",
        "editorOverviewRuler.deletedForeground": "#fc618d",
        "editorOverviewRuler.errorForeground": "#fc618d",
        "editorOverviewRuler.findMatchForeground": "#f7f1ff26",
        "editorOverviewRuler.incomingContentForeground": "#363537",
        "editorOverviewRuler.infoForeground": "#5ad4e6",
        "editorOverviewRuler.modifiedForeground": "#fd9353",
        "editorOverviewRuler.rangeHighlightForeground": "#f7f1ff26",
        "editorOverviewRuler.selectionHighlightForeground": "#f7f1ff26",
        "editorOverviewRuler.warningForeground": "#fd9353",
        "editorOverviewRuler.wordHighlightForeground": "#f7f1ff26",
        "editorOverviewRuler.wordHighlightStrongForeground": "#f7f1ff26",
        "editorPane.background": "#222222",
        "editorRuler.foreground": "#525053",
        "editorStickyScroll.background": "#222222",
        "editorStickyScroll.border": "#363537",
        "editorStickyScroll.shadow": "#222222",
        "editorStickyScrollHover.background": "#f7f1ff0c",
        "editorSuggestWidget.background": "#363537",
        "editorSuggestWidget.border": "#191919",
        "editorSuggestWidget.foreground": "#bab6c0",
        "editorSuggestWidget.highlightForeground": "#f7f1ff",
        "editorSuggestWidget.selectedBackground": "#69676c",
        "editorUnnecessaryCode.opacity": "#000000a5",
        "editorWarning.background": "#00000000",
        "editorWarning.border": "#00000000",
        "editorWarning.foreground": "#fd9353",
        "editorWhitespace.foreground": "#525053",
        "editorWidget.background": "#363537",
        "editorWidget.border": "#191919",
        errorForeground: "#fc618d",
        "extensionBadge.remoteForeground": "#7bd88f",
        "extensionButton.background": "#363537",
        "extensionButton.foreground": "#bab6c0",
        "extensionButton.hoverBackground": "#525053",
        "extensionButton.prominentBackground": "#363537",
        "extensionButton.prominentForeground": "#f7f1ff",
        "extensionButton.prominentHoverBackground": "#525053",
        "extensionIcon.preReleaseForeground": "#948ae3",
        "extensionIcon.sponsorForeground": "#5ad4e6",
        "extensionIcon.starForeground": "#fce566",
        "extensionIcon.verifiedForeground": "#7bd88f",
        focusBorder: "#222222",
        foreground: "#f7f1ff",
        "gitDecoration.addedResourceForeground": "#7bd88f",
        "gitDecoration.conflictingResourceForeground": "#fd9353",
        "gitDecoration.deletedResourceForeground": "#fc618d",
        "gitDecoration.ignoredResourceForeground": "#525053",
        "gitDecoration.modifiedResourceForeground": "#fce566",
        "gitDecoration.stageDeletedResourceForeground": "#fc618d",
        "gitDecoration.stageModifiedResourceForeground": "#fce566",
        "gitDecoration.untrackedResourceForeground": "#bab6c0",
        "icon.foreground": "#8b888f",
        "inlineChat.background": "#222222",
        "inlineChat.border": "#191919",
        "inlineChat.shadow": "#131313",
        "inlineChatDiff.inserted": "#7bd88f19",
        "inlineChatDiff.removed": "#7bd88f19",
        "input.background": "#363537",
        "input.border": "#525053",
        "input.foreground": "#f7f1ff",
        "input.placeholderForeground": "#69676c",
        "inputOption.activeBackground": "#525053",
        "inputOption.activeBorder": "#525053",
        "inputOption.activeForeground": "#f7f1ff",
        "inputOption.hoverBackground": "#525053",
        "inputValidation.errorBackground": "#363537",
        "inputValidation.errorBorder": "#fc618d",
        "inputValidation.errorForeground": "#fc618d",
        "inputValidation.infoBackground": "#363537",
        "inputValidation.infoBorder": "#5ad4e6",
        "inputValidation.infoForeground": "#5ad4e6",
        "inputValidation.warningBackground": "#363537",
        "inputValidation.warningBorder": "#fd9353",
        "inputValidation.warningForeground": "#fd9353",
        "interactive.activeCodeBorder": "#69676c",
        "interactive.inactiveCodeBorder": "#363537",
        "keybindingLabel.background": "#525053",
        "keybindingLabel.border": "#525053",
        "keybindingLabel.bottomBorder": "#525053",
        "keybindingLabel.foreground": "#bab6c0",
        "list.activeSelectionBackground": "#f7f1ff0c",
        "list.activeSelectionForeground": "#fce566",
        "list.dropBackground": "#191919bf",
        "list.errorForeground": "#fc618d",
        "list.focusBackground": "#222222",
        "list.focusForeground": "#f7f1ff",
        "list.highlightForeground": "#f7f1ff",
        "list.hoverBackground": "#f7f1ff0c",
        "list.hoverForeground": "#f7f1ff",
        "list.inactiveFocusBackground": "#222222",
        "list.inactiveSelectionBackground": "#bab6c00c",
        "list.inactiveSelectionForeground": "#fce566",
        "list.invalidItemForeground": "#fc618d",
        "list.warningForeground": "#fd9353",
        "listFilterWidget.background": "#222222",
        "listFilterWidget.noMatchesOutline": "#fc618d",
        "listFilterWidget.outline": "#222222",
        "listFilterWidget.shadow": "#131313",
        "menu.background": "#222222",
        "menu.border": "#191919",
        "menu.foreground": "#f7f1ff",
        "menu.selectionForeground": "#fce566",
        "menu.separatorBackground": "#363537",
        "menubar.selectionForeground": "#f7f1ff",
        "merge.border": "#222222",
        "merge.commonContentBackground": "#f7f1ff19",
        "merge.commonHeaderBackground": "#f7f1ff26",
        "merge.currentContentBackground": "#fc618d19",
        "merge.currentHeaderBackground": "#fc618d26",
        "merge.incomingContentBackground": "#7bd88f19",
        "merge.incomingHeaderBackground": "#7bd88f26",
        "mergeEditor.change.background": "#f7f1ff19",
        "mergeEditor.change.word.background": "#f7f1ff19",
        "mergeEditor.conflict.handled.minimapOverViewRuler": "#7bd88f",
        "mergeEditor.conflict.handledFocused.border": "#7bd88f",
        "mergeEditor.conflict.handledUnfocused.border": "#7bd88f",
        "mergeEditor.conflict.unhandled.minimapOverViewRuler": "#fc618d",
        "mergeEditor.conflict.unhandledFocused.border": "#fc618d",
        "mergeEditor.conflict.unhandledUnfocused.border": "#fc618d",
        "minimap.errorHighlight": "#fc618da5",
        "minimap.findMatchHighlight": "#8b888fa5",
        "minimap.infoHighlight": "#5ad4e6a5",
        "minimap.selectionHighlight": "#bab6c026",
        "minimap.selectionOccurrenceHighlight": "#69676ca5",
        "minimap.warningHighlight": "#fd9353a5",
        "minimapGutter.addedBackground": "#7bd88f",
        "minimapGutter.deletedBackground": "#fc618d",
        "minimapGutter.modifiedBackground": "#fce566",
        "notebook.cellBorderColor": "#363537",
        "notebook.cellEditorBackground": "#1919197f",
        "notebook.cellInsertionIndicator": "#f7f1ff",
        "notebook.cellStatusBarItemHoverBackground": "#69676c",
        "notebook.cellToolbarSeparator": "#363537",
        "notebook.editorBackground": "#222222",
        "notebook.focusedEditorBorder": "#69676c",
        "notebookStatusErrorIcon.foreground": "#fc618d",
        "notebookStatusRunningIcon.foreground": "#f7f1ff",
        "notebookStatusSuccessIcon.foreground": "#7bd88f",
        "notificationCenter.border": "#191919",
        "notificationCenterHeader.background": "#363537",
        "notificationCenterHeader.foreground": "#8b888f",
        "notificationLink.foreground": "#fce566",
        "notifications.background": "#363537",
        "notifications.border": "#191919",
        "notifications.foreground": "#bab6c0",
        "notificationsErrorIcon.foreground": "#fc618d",
        "notificationsInfoIcon.foreground": "#5ad4e6",
        "notificationsWarningIcon.foreground": "#fd9353",
        "notificationToast.border": "#191919",
        "panel.background": "#363537",
        "panel.border": "#131313",
        "panel.dropBackground": "#191919bf",
        "panelStickyScroll.background": "#363537",
        "panelStickyScroll.border": "#525053",
        "panelStickyScroll.shadow": "#363537",
        "panelTitle.activeBorder": "#fce566",
        "panelTitle.activeForeground": "#fce566",
        "panelTitle.inactiveForeground": "#8b888f",
        "peekView.border": "#191919",
        "peekViewEditor.background": "#363537",
        "peekViewEditor.matchHighlightBackground": "#525053",
        "peekViewEditorGutter.background": "#363537",
        "peekViewResult.background": "#363537",
        "peekViewResult.fileForeground": "#8b888f",
        "peekViewResult.lineForeground": "#8b888f",
        "peekViewResult.matchHighlightBackground": "#525053",
        "peekViewResult.selectionBackground": "#363537",
        "peekViewResult.selectionForeground": "#f7f1ff",
        "peekViewTitle.background": "#191919",
        "peekViewTitleDescription.foreground": "#8b888f",
        "peekViewTitleLabel.foreground": "#f7f1ff",
        "pickerGroup.border": "#222222",
        "pickerGroup.foreground": "#525053",
        "ports.iconRunningProcessForeground": "#7bd88f",
        "problemsErrorIcon.foreground": "#fc618d",
        "problemsInfoIcon.foreground": "#5ad4e6",
        "problemsWarningIcon.foreground": "#fd9353",
        "profileBadge.background": "#363537",
        "profileBadge.foreground": "#bab6c0",
        "progressBar.background": "#69676c",
        "quickInput.background": "#363537",
        "quickInput.foreground": "#8b888f",
        "sash.hoverBorder": "#69676c",
        "scmGraph.historyItemHoverLabelForeground": "#222222",
        "scmGraph.foreground1": "#fc618d",
        "scmGraph.foreground2": "#fd9353",
        "scmGraph.foreground3": "#fce566",
        "scmGraph.foreground4": "#7bd88f",
        "scmGraph.foreground5": "#948ae3",
        "scmGraph.historyItemHoverAdditionsForeground": "#7bd88f",
        "scmGraph.historyItemHoverDeletionsForeground": "#fc618d",
        "scmGraph.historyItemRefColor": "#948ae3",
        "scmGraph.historyItemRemoteRefColor": "#7bd88f",
        "scmGraph.historyItemBaseRefColor": "#5ad4e6",
        "scmGraph.historyItemHoverDefaultLabelForeground": "#222222",
        "scmGraph.historyItemHoverDefaultLabelBackground": "#69676c",
        "scrollbar.shadow": "#222222",
        "scrollbarSlider.activeBackground": "#f7f1ff59",
        "scrollbarSlider.background": "#bab6c026",
        "scrollbarSlider.hoverBackground": "#f7f1ff26",
        "selection.background": "#bab6c026",
        "settings.checkboxBackground": "#363537",
        "settings.checkboxBorder": "#525053",
        "settings.checkboxForeground": "#fce566",
        "settings.dropdownBackground": "#363537",
        "settings.dropdownBorder": "#525053",
        "settings.dropdownForeground": "#f7f1ff",
        "settings.dropdownListBorder": "#8b888f",
        "settings.headerForeground": "#fce566",
        "settings.modifiedItemForeground": "#fce566",
        "settings.modifiedItemIndicator": "#fce566",
        "settings.numberInputBackground": "#363537",
        "settings.numberInputBorder": "#525053",
        "settings.numberInputForeground": "#f7f1ff",
        "settings.rowHoverBackground": "#69676c0c",
        "settings.sashBorder": "#363537",
        "settings.settingsHeaderHoverForeground": "#f7f1ff",
        "settings.textInputBackground": "#363537",
        "settings.textInputBorder": "#525053",
        "settings.textInputForeground": "#f7f1ff",
        "sideBar.background": "#191919",
        "sideBar.border": "#131313",
        "sideBar.dropBackground": "#191919bf",
        "sideBar.foreground": "#8b888f",
        "sideBarSectionHeader.background": "#191919",
        "sideBarSectionHeader.foreground": "#69676c",
        "sideBarStickyScroll.background": "#191919",
        "sideBarStickyScroll.border": "#363537",
        "sideBarStickyScroll.shadow": "#191919",
        "sideBarTitle.foreground": "#525053",
        "simpleFindWidget.sashBorder": "",
        "statusBar.background": "#191919",
        "statusBar.border": "#131313",
        "statusBar.debuggingBackground": "#69676c",
        "statusBar.debuggingBorder": "#191919",
        "statusBar.debuggingForeground": "#f7f1ff",
        "statusBar.focusBorder": "#363537",
        "statusBar.foreground": "#69676c",
        "statusBar.noFolderBackground": "#191919",
        "statusBar.noFolderBorder": "#131313",
        "statusBar.noFolderForeground": "#69676c",
        "statusBarItem.activeBackground": "#222222",
        "statusBarItem.errorBackground": "#222222",
        "statusBarItem.errorForeground": "#fc618d",
        "statusBarItem.focusBorder": "#69676c",
        "statusBarItem.hoverBackground": "#191919",
        "statusBarItem.hoverForeground": "#f7f1ff",
        "statusBarItem.prominentBackground": "#363537",
        "statusBarItem.offlineBackground": "",
        "statusBarItem.offlineForeground": "",
        "statusBarItem.prominentHoverBackground": "#363537",
        "statusBarItem.remoteBackground": "#191919",
        "statusBarItem.remoteForeground": "#7bd88f",
        "statusBarItem.remoteHoverBackground": "#7bd88f",
        "statusBarItem.remoteHoverForeground": "#222222",
        "statusBarItem.warningBackground": "#222222",
        "statusBarItem.warningForeground": "#fd9353",
        "symbolIcon.arrayForeground": "#fc618d",
        "symbolIcon.booleanForeground": "#fc618d",
        "symbolIcon.classForeground": "#5ad4e6",
        "symbolIcon.colorForeground": "#948ae3",
        "symbolIcon.constantForeground": "#948ae3",
        "symbolIcon.constructorForeground": "#7bd88f",
        "symbolIcon.enumeratorForeground": "#fd9353",
        "symbolIcon.enumeratorMemberForeground": "#fd9353",
        "symbolIcon.eventForeground": "#fd9353",
        "symbolIcon.fieldForeground": "#fd9353",
        "symbolIcon.fileForeground": "#bab6c0",
        "symbolIcon.folderForeground": "#bab6c0",
        "symbolIcon.functionForeground": "#7bd88f",
        "symbolIcon.interfaceForeground": "#5ad4e6",
        "symbolIcon.keyForeground": "#fd9353",
        "symbolIcon.keywordForeground": "#fc618d",
        "symbolIcon.methodForeground": "#7bd88f",
        "symbolIcon.moduleForeground": "#5ad4e6",
        "symbolIcon.namespaceForeground": "#5ad4e6",
        "symbolIcon.nullForeground": "#948ae3",
        "symbolIcon.numberForeground": "#948ae3",
        "symbolIcon.objectForeground": "#5ad4e6",
        "symbolIcon.operatorForeground": "#fc618d",
        "symbolIcon.packageForeground": "#948ae3",
        "symbolIcon.propertyForeground": "#fd9353",
        "symbolIcon.referenceForeground": "#948ae3",
        "symbolIcon.snippetForeground": "#7bd88f",
        "symbolIcon.stringForeground": "#fce566",
        "symbolIcon.structForeground": "#fc618d",
        "symbolIcon.textForeground": "#fce566",
        "symbolIcon.typeParameterForeground": "#fd9353",
        "symbolIcon.unitForeground": "#948ae3",
        "symbolIcon.variableForeground": "#5ad4e6",
        "tab.activeBackground": "#222222",
        "tab.activeBorder": "#fce566",
        "tab.activeForeground": "#fce566",
        "tab.activeModifiedBorder": "#525053",
        "tab.border": "#222222",
        "tab.hoverBackground": "#222222",
        "tab.hoverBorder": "#525053",
        "tab.hoverForeground": "#f7f1ff",
        "tab.inactiveBackground": "#222222",
        "tab.inactiveForeground": "#8b888f",
        "tab.inactiveModifiedBorder": "#525053",
        "tab.lastPinnedBorder": "#525053",
        "tab.unfocusedActiveBorder": "#8b888f",
        "tab.unfocusedActiveForeground": "#bab6c0",
        "tab.unfocusedActiveModifiedBorder": "#363537",
        "tab.unfocusedHoverBackground": "#222222",
        "tab.unfocusedHoverBorder": "#222222",
        "tab.unfocusedHoverForeground": "#bab6c0",
        "tab.unfocusedInactiveForeground": "#8b888f",
        "tab.unfocusedInactiveModifiedBorder": "#363537",
        "terminal.ansiBlack": "#363537",
        "terminal.ansiBlue": "#fd9353",
        "terminal.ansiBrightBlack": "#69676c",
        "terminal.ansiBrightBlue": "#fd9353",
        "terminal.ansiBrightCyan": "#5ad4e6",
        "terminal.ansiBrightGreen": "#7bd88f",
        "terminal.ansiBrightMagenta": "#948ae3",
        "terminal.ansiBrightRed": "#fc618d",
        "terminal.ansiBrightWhite": "#f7f1ff",
        "terminal.ansiBrightYellow": "#fce566",
        "terminal.ansiCyan": "#5ad4e6",
        "terminal.ansiGreen": "#7bd88f",
        "terminal.ansiMagenta": "#948ae3",
        "terminal.ansiRed": "#fc618d",
        "terminal.ansiWhite": "#f7f1ff",
        "terminal.ansiYellow": "#fce566",
        "terminal.background": "#363537",
        "terminal.foreground": "#f7f1ff",
        "terminal.selectionBackground": "#f7f1ff26",
        "terminalCommandDecoration.defaultBackground": "#f7f1ff",
        "terminalCommandDecoration.errorBackground": "#fc618d",
        "terminalCommandDecoration.successBackground": "#7bd88f",
        "terminalCursor.background": "#00000000",
        "terminalCursor.foreground": "#f7f1ff",
        "testing.iconErrored": "#fc618d",
        "testing.iconFailed": "#fc618d",
        "testing.iconPassed": "#7bd88f",
        "testing.iconQueued": "#f7f1ff",
        "testing.iconSkipped": "#fd9353",
        "testing.iconUnset": "#8b888f",
        "testing.message.error.decorationForeground": "#fc618d",
        "testing.message.error.lineBackground": "#fc618d19",
        "testing.message.info.decorationForeground": "#f7f1ff",
        "testing.message.info.lineBackground": "#f7f1ff19",
        "testing.runAction": "#fce566",
        "textBlockQuote.background": "#363537",
        "textBlockQuote.border": "#363537",
        "textCodeBlock.background": "#363537",
        "textLink.activeForeground": "#f7f1ff",
        "textLink.foreground": "#fce566",
        "textPreformat.foreground": "#f7f1ff",
        "textSeparator.foreground": "#69676c",
        "titleBar.activeBackground": "#191919",
        "titleBar.activeForeground": "#8b888f",
        "titleBar.border": "#131313",
        "titleBar.inactiveBackground": "#191919",
        "titleBar.inactiveForeground": "#525053",
        "tree.inactiveIndentGuidesStroke": "#222222",
        "tree.indentGuidesStroke": "#363537",
        "walkThrough.embeddedEditorBackground": "#191919",
        "welcomePage.buttonBackground": "#363537",
        "welcomePage.buttonHoverBackground": "#525053",
        "welcomePage.progress.background": "#69676c",
        "welcomePage.progress.foreground": "#8b888f",
        "welcomePage.tileBackground": "#363537",
        "welcomePage.tileHoverBackground": "#525053",
        "welcomePage.tileShadow": "#131313",
        "widget.shadow": "#131313"
    },
    rules: [
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment keyword"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment markup.underline.link"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment string"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment punctuation.definition"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment punctuation"
        },
        {
            fontStyle: "italic",
            foreground: "#69676c",
            token: "comment text"
        },
        {
            foreground: "#69676c",
            token: "comment storage.type"
        },
        {
            foreground: "#bab6c0",
            token: "comment entity.name.type"
        },
        {
            foreground: "#bab6c0",
            token: "comment variable"
        },
        {
            foreground: "#bab6c0",
            token: "comment variable.other"
        },
        {
            foreground: "#bab6c0",
            token: "comment keyword"
        },
        {
            foreground: "#bab6c0",
            token: "comment entity.name.tag"
        },
        {
            foreground: "#bab6c0",
            token: "entity.name.tag.documentation"
        },
        {
            foreground: "#948ae3",
            token: "comment keyword.codetag.notation"
        },
        {
            foreground: "#fc618d",
            token: "comment.git-status.header.remote"
        },
        {
            foreground: "#5ad4e6",
            token: "comment.git-status.header.local"
        },
        {
            foreground: "#f7f1ff",
            token: "comment.other.git-status.head"
        },
        {
            foreground: "#69676c",
            token: "string.quoted.docstring"
        },
        {
            foreground: "#69676c",
            token: "string.quoted.docstring punctuation.definition"
        },
        {
            foreground: "#948ae3",
            token: "constant"
        },
        {
            foreground: "#f7f1ff",
            token: "constant.other"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.caps"
        },
        {
            foreground: "#fd9353",
            token: "constant.other.placeholder"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.property"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.citation.latex"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.color"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.character-class.escape"
        },
        {
            foreground: "#948ae3",
            token: "constant.other.key"
        },
        {
            foreground: "#fd9353",
            token: "constant.other.symbol"
        },
        {
            foreground: "#5ad4e6",
            token: "constant.other.elm"
        },
        {
            foreground: "#948ae3",
            token: "constant.numeric"
        },
        {
            foreground: "#948ae3",
            token: "constant.language"
        },
        {
            foreground: "#948ae3",
            token: "constant.character.escape"
        },
        {
            foreground: "#525053",
            token: "constant.numeric.line-number.find-in-files"
        },
        {
            foreground: "#fce566",
            token: "constant.numeric.line-number.match.find-in-files"
        },
        {
            foreground: "#fce566",
            token: "entity.name.section"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name.function"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name.function.templated"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name.function.member.static"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.class.templated"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.class.generic"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.namespace"
        },
        {
            foreground: "#948ae3",
            token: "entity.name.label"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.function.preprocessor"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.class"
        },
        {
            foreground: "#948ae3",
            token: "entity.name.constant"
        },
        {
            foreground: "#f7f1ff",
            token: "entity.name.namespace"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.other.inherited-class"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name.function"
        },
        {
            foreground: "#fc618d",
            token: "entity.name.tag"
        },
        {
            foreground: "#fc618d",
            token: "entity.name.tag.js.jsx support.class.component.js.jsx"
        },
        {
            foreground: "#fc618d",
            token: "entity.name.tag support.class.component"
        },
        {
            foreground: "#fc618d",
            token: "source.vue support.class.component"
        },
        {
            foreground: "#5ad4e6",
            token: "source.ansible entity.name.tag"
        },
        {
            foreground: "#fc618d",
            token: "entity.name.function.operator"
        },
        {
            foreground: "#8b888f",
            token: "meta.brackets entity.name.function.operator"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.separator entity.name.function.operator"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.class.reference"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.class.value"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.other.attribute-name"
        },
        {
            foreground: "#7bd88f",
            token: "entity.other.attribute-name.class.css"
        },
        {
            foreground: "#7bd88f",
            token: "entity.other.attribute-name.parent-selector-suffix.css"
        },
        {
            foreground: "#7bd88f",
            token: "entity.other.attribute-name.parent-selector-suffix.css punctuation.definition.entity.css"
        },
        {
            foreground: "#7bd88f",
            token: "entity.other.attribute-name.css"
        },
        {
            foreground: "#7bd88f",
            token: "entity.other.animation-name.css"
        },
        {
            foreground: "#fd9353",
            token: "entity.other.attribute-name.id.css"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.other.attribute-name.pseudo-class.css"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.other.pseudo-class.css"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.other.pseudo-element.css"
        },
        {
            foreground: "#7bd88f",
            token: "entity.name.function"
        },
        {
            foreground: "#7bd88f",
            token: "support.function"
        },
        {
            foreground: "#948ae3",
            token: "entity.other.git-status.hex"
        },
        {
            foreground: "#8b888f",
            token: "entity.other.jinja2.delimiter"
        },
        {
            foreground: "#f7f1ff",
            token: "entity.name.operator.custom-literal"
        },
        {
            foreground: "#fce566",
            token: "entity.name.operator.custom-literal.string"
        },
        {
            foreground: "#948ae3",
            token: "entity.name.operator.custom-literal.number"
        },
        {
            foreground: "#5ad4e6",
            token: "entity.name.type.rust"
        },
        {
            foreground: "#fc618d",
            token: "entity.name.lifetime.rust"
        },
        {
            foreground: "#fc618d",
            fontStyle: "italic underline",
            token: "invalid"
        },
        {
            foreground: "#fd9353",
            fontStyle: "italic underline",
            token: "invalid.deprecated"
        },
        {
            foreground: "#fc618d",
            token: "keyword"
        },
        {
            foreground: "#fc618d",
            token: "keyword.control"
        },
        {
            foreground: "#fc618d",
            token: "keyword.control.directive"
        },
        {
            foreground: "#fc618d",
            token: "keyword.operator"
        },
        {
            foreground: "#fc618d",
            token: "keyword.operator.member"
        },
        {
            foreground: "#fc618d",
            token: "keyword.operator.new"
        },
        {
            foreground: "#8b888f",
            token: "keyword.other.substitution"
        },
        {
            foreground: "#fc618d",
            token: "keyword.other.template.begin"
        },
        {
            foreground: "#fc618d",
            token: "keyword.other.template.end"
        },
        {
            foreground: "#8b888f",
            token: "keyword.operator.heading.restructuredtext"
        },
        {
            foreground: "#8b888f",
            token: "keyword.operator.table.row.restructuredtext keyword.operator.table.data.restructuredtext"
        },
        {
            foreground: "#8b888f",
            token: "keyword.other.parenthesis.elm"
        },
        {
            foreground: "#5ad4e6",
            token: "keyword.other.fn.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "keyword.other.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "keyword.other.unsafe.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "keyword.other.where.rust"
        },
        {
            foreground: "#fc618d",
            token: "keyword.control.rust"
        },
        {
            foreground: "#fc618d",
            token: "keyword.operator.misc.rust"
        },
        {
            foreground: "#fc618d",
            token: "keyword.declaration.class.ruby"
        },
        {
            foreground: "#fc618d",
            token: "keyword.declaration.function.ruby"
        },
        {
            foreground: "#fc618d",
            token: "keyword.declaration.namespace.ruby"
        },
        {
            fontStyle: "italic",
            token: "markup.italic"
        },
        {
            fontStyle: "bold",
            token: "markup.bold"
        },
        {
            foreground: "#fce566",
            token: "markup.heading"
        },
        {
            foreground: "#fd9353",
            token: "markup.raw"
        },
        {
            fontStyle: "underline",
            token: "markup.underline"
        },
        {
            foreground: "#7bd88f",
            token: "markup.underline.link"
        },
        {
            foreground: "#7bd88f",
            token: "markup.inserted"
        },
        {
            foreground: "#7bd88f",
            token: "markup.inserted punctuation.definition.inserted"
        },
        {
            foreground: "#fc618d",
            token: "markup.deleted"
        },
        {
            foreground: "#fc618d",
            token: "markup.deleted punctuation.definition.deleted"
        },
        {
            foreground: "#fce566",
            token: "markup.changed"
        },
        {
            foreground: "#fce566",
            token: "markup.changed punctuation.definition.changed"
        },
        {
            foreground: "#8b888f",
            token: "markup.ignored"
        },
        {
            foreground: "#8b888f",
            token: "markup.ignored punctuation.definition.ignored"
        },
        {
            foreground: "#8b888f",
            token: "markup.untracked"
        },
        {
            fontStyle: "italic",
            token: "markup.quote"
        },
        {
            foreground: "#8b888f",
            token: "meta.brace.round"
        },
        {
            foreground: "#8b888f",
            token: "meta.brace.square"
        },
        {
            foreground: "#8b888f",
            token: "meta.brace.curly"
        },
        {
            foreground: "#8b888f",
            token: "meta.delimiter.comma.js"
        },
        {
            foreground: "#8b888f",
            token: "meta.function-call.without-arguments.js"
        },
        {
            foreground: "#8b888f",
            token: "meta.function-call.method.without-arguments.js"
        },
        {
            foreground: "#7bd88f",
            token: "meta.function-call.generic.python"
        },
        {
            foreground: "#7bd88f",
            token: "support.function.builtin.python"
        },
        {
            foreground: "#f7f1ff",
            token: "meta.function-call.python meta.function-call.arguments.python"
        },
        {
            foreground: "#fd9353",
            token: "meta.interpolation"
        },
        {
            foreground: "#7bd88f",
            token: "meta.instance.constructor"
        },
        {
            foreground: "#7bd88f",
            token: "meta.attribute-with-value.class string"
        },
        {
            foreground: "#7bd88f",
            token: "meta.attribute.class.html string"
        },
        {
            foreground: "#fd9353",
            token: "meta.attribute-with-value.id string"
        },
        {
            foreground: "#fd9353",
            token: "meta.attribute.id.html string"
        },
        {
            foreground: "#f7f1ff",
            token: "source.json meta.mapping.key string"
        },
        {
            foreground: "#fc618d",
            token: "source.yaml meta.mapping.key string"
        },
        {
            foreground: "#f7f1ff",
            token: "meta.object.member"
        },
        {
            foreground: "#fd9353",
            token: "meta.property-list.css variable.other"
        },
        {
            foreground: "#948ae3",
            token: "entity.name.constant.preprocessor"
        },
        {
            foreground: "#948ae3",
            token: "meta.preprocessor"
        },
        {
            foreground: "#fce566",
            token: "meta.diff.git-diff.header"
        },
        {
            foreground: "#f7f1ff",
            token: "meta.type_params.rust"
        },
        {
            foreground: "#bab6c0",
            token: "meta.attribute.rust"
        },
        {
            foreground: "#bab6c0",
            token: "meta.annotation.rust"
        },
        {
            foreground: "#bab6c0",
            token: "variable.language.rust"
        },
        {
            foreground: "#bab6c0",
            token: "variable.annotation.rust"
        },
        {
            foreground: "#bab6c0",
            token: "meta.annotation.rust string"
        },
        {
            foreground: "#bab6c0",
            token: "meta.annotation.rust keyword"
        },
        {
            foreground: "#bab6c0",
            token: "meta.annotation.rust keyword.operator"
        },
        {
            foreground: "#bab6c0",
            token: "meta.attribute.rust string"
        },
        {
            foreground: "#948ae3",
            token: "meta.type variable"
        },
        {
            foreground: "#948ae3",
            token: "meta.type variable.other.readwrite"
        },
        {
            foreground: "#8b888f",
            token: "punctuation"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.tag"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.tag source"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.group.begin.ruby"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.group.end.ruby"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.group.begin.css"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.group.end.css"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.string.end.html source.css"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.block"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.parameters.begin"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.definition.parameters.end"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.separator.parameter"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.accessor"
        },
        {
            foreground: "#8b888f",
            token: "punctuation.terminator"
        },
        {
            foreground: "#f7f1ff",
            token: "punctuation.definition.group"
        },
        {
            foreground: "#69676c",
            token: "punctuation.definition.comment"
        },
        {
            foreground: "#bab6c0",
            token: "punctuation.definition.variable"
        },
        {
            foreground: "#bab6c0",
            token: "punctuation.definition.keyword.scss"
        },
        {
            foreground: "#bab6c0",
            token: "punctuation.definition.entity.css"
        },
        {
            foreground: "#fd9353",
            token: "punctuation.section.embedded"
        },
        {
            foreground: "#fd9353",
            token: "punctuation.section.embedded entity.name.tag"
        },
        {
            foreground: "#fd9353",
            token: "punctuation.section.embedded constant.other"
        },
        {
            foreground: "#fd9353",
            token: "punctuation.section.embedded source"
        },
        {
            foreground: "#fd9353",
            token: "punctuation.section.embedded.begin"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.template-string.element.begin"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.template-string.element.end"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.definition.string.template.begin"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.definition.string.template.end"
        },
        {
            foreground: "#fc618d",
            token: "string.quoted.template punctuation.definition.string.begin"
        },
        {
            foreground: "#fc618d",
            token: "string.quoted.template punctuation.definition.string.end"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.definition.template-expression.begin"
        },
        {
            foreground: "#fc618d",
            token: "punctuation.definition.template-expression.end"
        },
        {
            background: "#948ae3",
            token: "meta.paragraph.markdown meta.dummy.line-break"
        },
        {
            background: "#948ae3",
            token: "meta.paragraph.markdown meta.hard-line-break.markdown"
        },
        {
            foreground: "#7bd88f",
            token: "markup.underline.link punctuation"
        },
        {
            foreground: "#8b888f",
            token: "meta.brace.round"
        },
        {
            foreground: "#8b888f",
            token: "meta.brace.square"
        },
        {
            foreground: "#8b888f",
            token: "keyword.operator.type.annotation"
        },
        {
            foreground: "#8b888f",
            token: "meta.type storage.modifier.array"
        },
        {
            foreground: "#fc618d",
            background: "#fc618d59",
            token: "region.redish"
        },
        {
            foreground: "#fd9353",
            background: "#fd935359",
            token: "region.orangish"
        },
        {
            foreground: "#fce566",
            background: "#fce56659",
            token: "region.yellowish"
        },
        {
            foreground: "#7bd88f",
            background: "#7bd88f59",
            token: "region.greenish"
        },
        {
            foreground: "#5ad4e6",
            background: "#5ad4e659",
            token: "region.bluish"
        },
        {
            foreground: "#948ae3",
            background: "#948ae359",
            token: "region.purplish"
        },
        {
            foreground: "#fc618d",
            background: "#fc618d59",
            token: "region.pinkish"
        },
        {
            foreground: "#FFFFFF",
            token: "region.whitish"
        },
        {
            foreground: "#f7f1ff",
            token: "source"
        },
        {
            foreground: "#8b888f",
            token: "source.scss"
        },
        {
            foreground: "#8b888f",
            token: "source.sass"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.sass variable.other"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.sass variable.sass"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.scss variable.other"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.scss variable.scss"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.scss variable.sass"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.css variable.other"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.css variable.scss"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.less variable.other"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.less variable.other.less"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "source.less variable.declaration.less"
        },
        {
            foreground: "#948ae3",
            token: "source.git-show.commit.sha"
        },
        {
            foreground: "#8b888f",
            token: "source.git-show.author"
        },
        {
            foreground: "#8b888f",
            token: "source.git-show.date"
        },
        {
            foreground: "#8b888f",
            token: "source.git-diff.command"
        },
        {
            foreground: "#8b888f",
            token: "source.git-diff.command meta.diff.git-diff.header.from-file"
        },
        {
            foreground: "#8b888f",
            token: "source.git-diff.command meta.diff.git-diff.header.to-file"
        },
        {
            foreground: "#948ae3",
            token: "source.git-show meta.diff.git-diff.header.extended.index.from-sha"
        },
        {
            foreground: "#948ae3",
            token: "source.git-show meta.diff.git-diff.header.extended.index.to-sha"
        },
        {
            foreground: "#fd9353",
            token: "source.git-show meta.diff.range.unified"
        },
        {
            foreground: "#8b888f",
            token: "source.git-show meta.diff.header.from-file"
        },
        {
            foreground: "#8b888f",
            token: "source.git-show meta.diff.header.to-file"
        },
        {
            foreground: "#fc618d",
            token: "storage"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "storage.type"
        },
        {
            fontStyle: "normal",
            foreground: "#fc618d",
            token: "storage.type.extends"
        },
        {
            fontStyle: "normal",
            foreground: "#fc618d",
            token: "storage.type.function.arrow"
        },
        {
            fontStyle: "italic",
            foreground: "#fc618d",
            token: "storage.modifier"
        },
        {
            fontStyle: "italic",
            foreground: "#fc618d",
            token: "storage.type.modifier"
        },
        {
            foreground: "#948ae3",
            token: "storage.class.restructuredtext.ref"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.visibility.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.lifetime.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.modifier.const.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.modifier.dyn.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.modifier.mut.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.modifier.static.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.type.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.type.core.rust"
        },
        {
            foreground: "#5ad4e6",
            token: "storage.class.std.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.type.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.const.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.dyn.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.mut.rust"
        },
        {
            foreground: "#fc618d",
            token: "storage.modifier.static.rust"
        },
        {
            foreground: "#fc618d",
            token: "keyword.other.rust"
        },
        {
            foreground: "#fc618d",
            token: "keyword.other.where.rust"
        },
        {
            foreground: "#f7f1ff",
            token: "storage.modifier.import.java"
        },
        {
            foreground: "#fce566",
            token: "string"
        },
        {
            foreground: "#f7f1ff",
            token: "string.unquoted.label"
        },
        {
            foreground: "#f7f1ff",
            token: "string source"
        },
        {
            foreground: "#8b888f",
            token: "string source punctuation.section.embedded"
        },
        {
            foreground: "#8b888f",
            token: "string punctuation.definition.string source"
        },
        {
            foreground: "#fc618d",
            token: "string.other.link.title"
        },
        {
            foreground: "#fc618d",
            token: "string.other.link.description"
        },
        {
            foreground: "#5ad4e6",
            token: "string.other.link.description.title"
        },
        {
            foreground: "#fc618d",
            token: "string.regexp punctuation.definition.string.begin"
        },
        {
            foreground: "#fc618d",
            token: "string.regexp punctuation.definition.string.end"
        },
        {
            foreground: "#7bd88f",
            token: "string.other.ref"
        },
        {
            foreground: "#7bd88f",
            token: "string.other.restructuredtext.ref"
        },
        {
            foreground: "#bab6c0",
            token: "string.other.git-status.help.key"
        },
        {
            foreground: "#fc618d",
            token: "string.other.git-status.remote"
        },
        {
            foreground: "#5ad4e6",
            token: "support.constant"
        },
        {
            foreground: "#8b888f",
            token: "support.constant.handlebars"
        },
        {
            foreground: "#bab6c0",
            token: "support.type.vendor-prefix.css"
        },
        {
            foreground: "#7bd88f",
            token: "support.function"
        },
        {
            foreground: "#7bd88f",
            token: "support.macro"
        },
        {
            foreground: "#8b888f",
            token: "support.function.delimiter.elm"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "support.type"
        },
        {
            fontStyle: "italic",
            foreground: "#5ad4e6",
            token: "entity.name.type.object.console"
        },
        {
            foreground: "#5ad4e6",
            token: "support.variable"
        },
        {
            foreground: "#5ad4e6",
            token: "support.variable.property"
        },
        {
            fontStyle: "normal",
            foreground: "#f7f1ff",
            token: "support.type.property-name"
        },
        {
            foreground: "#5ad4e6",
            token: "support.class"
        },
        {
            foreground: "#948ae3",
            token: "support.constant.core.rust"
        },
        {
            foreground: "#69676c",
            token: "comment support"
        },
        {
            foreground: "#69676c",
            token: "comment support.class"
        },
        {
            foreground: "#f7f1ff",
            token: "text"
        },
        {
            foreground: "#f7f1ff",
            token: "text.find-in-files"
        },
        {
            foreground: "#f7f1ff",
            token: "variable"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "variable.parameter"
        },
        {
            fontStyle: "italic",
            foreground: "#fd9353",
            token: "parameters variable.function"
        },
        {
            fontStyle: "italic",
            foreground: "#bab6c0",
            token: "variable.language"
        },
        {
            fontStyle: "italic",
            foreground: "#bab6c0",
            token: "variable.parameter.function.language.special.self.python"
        },
        {
            fontStyle: "italic",
            foreground: "#bab6c0",
            token: "variable.parameter.function.language.special.cls.python"
        },
        {
            foreground: "#948ae3",
            token: "variable.language.arguments"
        },
        {
            foreground: "#5ad4e6",
            token: "variable.other.class"
        },
        {
            foreground: "#948ae3",
            token: "variable.other.constant"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other.readwrite"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other.member"
        },
        {
            foreground: "#948ae3",
            token: "variable.other.enummember"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other.property"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other.property.static"
        },
        {
            foreground: "#f7f1ff",
            token: "variable.other.event"
        },
        {
            foreground: "#7bd88f",
            token: "variable.function"
        },
        {
            foreground: "#fd9353",
            token: "variable.other.substitution"
        },
        {
            foreground: "#948ae3",
            token: "source.ruby variable.other.readwrite.instance.ruby"
        },
        {
            foreground: "#948ae3",
            token: "source.ruby variable.other.readwrite.class.ruby"
        },
        {
            foreground: "#7bd88f",
            token: "source.jinja2 variable.other.jinja2.block"
        },
        {
            foreground: "#fd9353",
            token: "source.jinja2 variable.other.jinja2"
        }
    ],
    encodedTokensColors: []
})
