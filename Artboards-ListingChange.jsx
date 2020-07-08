#target illustrator
#targetengine main

/********************************************************
  Description .....: Find/Replace text in artboard names
  Version .........: 1.2.0
  C.Date / M.Date .: 03.07.2020 / 07.07.2020
  Target App ......: Adobe Illustrator
  Tested on .......: 22.1 Mac, 24.2 Mac; 22.1 Win
  Inspired by .....: https://github.com/WELZ-gh/Drafts/tree/master/Saved/Illustrator%20Scripting
  Credits on ......: https://scriptui.joonas.me/
********************************************************/

function main()
{
	var sTitle = "Change Artboards Listing";

	if (app.documents.length === 0) {
		alert(sTitle+'\nPlease open a document and try again', sTitle, true);
		return;
	}

	var doc = app.activeDocument;
	var findStrRegExp;
	var undoCount = 0;
	var caseValue;
	var i;

	// DIALOG
	var FRdialog = new Window("dialog", sTitle);
		FRdialog.orientation = "row";
		FRdialog.spacing = 20;
		FRdialog.margins = 16;

	// BASEGROUP
	var baseGroup = FRdialog.add("group", undefined, {name: "baseGroup"});
		baseGroup.orientation = "column";
		baseGroup.alignment = ["right","top"];
		baseGroup.margins.top = 2;

	// FINDGROUP
	var findGroup = baseGroup.add("group", undefined, {name: "findGroup"});
		findGroup.orientation = "row";
		findGroup.alignment = ["right","top"];

	var findLabel = findGroup.add("statictext", undefined, "Find:", {name: "findLabel"});

	var findString = findGroup.add('edittext {properties: {name: "findString"}}');
		findString.preferredSize.width = 300;
		findString.active = true;

	// REPLACEGROUP
	var replaceGroup = baseGroup.add("group", undefined, {name: "replaceGroup"});
		replaceGroup.orientation = "row";
		replaceGroup.alignment = ["right","top"];

	var replaceLabel = replaceGroup.add("statictext", undefined, "Replace:", {name: "replaceLabel"});

	var replaceString = replaceGroup.add('edittext {properties: {name: "replaceString"}}');
		replaceString.preferredSize.width = 300;

	// OPTGROUP
	var optGroup = baseGroup.add("group", undefined, {name: "optGroup"});
		optGroup.preferredSize.width = 300;
		optGroup.orientation = "row";
		optGroup.alignment = ["right","top"];

	var regexpCBox = optGroup.add("checkbox", undefined, "Regular expressions", {name: "regexpCBox"});
		regexpCBox.value = true;

	var caseCBox = optGroup.add("checkbox", undefined, "Match case", {name: "caseCBox"});
		caseCBox.value = true;

	regexpCBox.onClick = function () {
		caseCBox.value = true;
		caseCBox.enabled = !caseCBox.enabled;
		}

	// WILDCARDS
	var wcardsGroup = baseGroup.add("group", undefined, {name: "wcardsGroup"});
		wcardsGroup.preferredSize.width = 300;
		wcardsGroup.alignment = ["right", "top"];

	var wcardsCBox = wcardsGroup.add("checkbox", undefined, "Extra wildcards", {name: "wcardsCBox"});
		wcardsCBox.helpTip = "\\c1\t- replace with counter\n\\c2\t- replace with 2digit counter\n\\c3\t- replace with 3digit counter";

	// BTNGROUP
	var btnGroup = FRdialog.add("group", undefined, {name: "btnGroup"});
		btnGroup.orientation = "column";
		btnGroup.alignment = ["center","top"];
		btnGroup.alignChildren = ["center","top"];

	var btnReplace = btnGroup.add("button", undefined, "Replace", {name: "btnReplace"});
		btnReplace.preferredSize.width = 80;
		btnReplace.onClick = replacing;
		btnReplace.helpTip = 'Alt+Click: Toggle Artboards panel visibility';

	var btnUndo = btnGroup.add("button", undefined, "Undo", {name: "btnUndo"});
		btnUndo.preferredSize.width = 80;
		btnUndo.enabled = false;
		btnUndo.onClick = function () {
			if (undoCount > 0) {
				app.undo();
				undoCount -= 1;
			}
			if (undoCount === 0) btnUndo.enabled = false;
			app.redraw();
		}

	var btnClose = btnGroup.add("button", undefined, "Close", {name: "btnClose"});
		btnClose.preferredSize.width = 80;
		btnClose.onClick = function () { FRdialog.close(); }

	function replacing() {

		if (ScriptUI.environment.keyboardState.altKey) {
			app.executeMenuCommand('Adobe Artboard Palette');
			return;
		}

		if (regexpCBox.value === true) {

			if (findString.text === "") {

				myAlert(sTitle, 'Expected: Data in the \u0022Find:\u0022 field');
				return;

			} else {

				caseCBox.value === true ? caseValue = "g" : caseValue = "gi";

				findStrRegExp = new RegExp(findString.text, caseValue);

				for (i = 0; i < doc.artboards.length; i++) {
					doc.artboards[i].name = doc.artboards[i].name.replace (findStrRegExp, replaceString.text);
						if (wcardsCBox.value === true) {
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c1/g, counter(i + 1, 1));
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c2/g, counter(i + 1, 2));
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c3/g, counter(i + 1, 3));
						}
				}

				if (undoCount === 0) btnUndo.enabled = true;
				undoCount += 1;
				app.redraw();
				return;

			}

		} else {

			if (findString.text === "") {

				myAlert(sTitle, 'Expected: Data in the \u0022Find:\u0022 field');
				return;

			} else {

				for (i = 0; i < doc.artboards.length; i++) {
					doc.artboards[i].name = doc.artboards[i].name.replace (findString.text, replaceString.text);
						if (wcardsCBox.value === true) {
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c1/g, counter(i + 1, 1));
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c2/g, counter(i + 1, 2));
							doc.artboards[i].name = doc.artboards[i].name.replace (/\\c3/g, counter(i + 1, 3));
						}
				}

				if (undoCount === 0) btnUndo.enabled = true;
				undoCount += 1;
				app.redraw();
				return;

			}
		}
	}

	FRdialog.show();

	function myAlert(head, msg)
	{
		var myalert = new Window("dialog", undefined, undefined, {closeButton: false});
			myalert.text = head;
			myalert.orientation = "column";
			myalert.alignChildren = ["center","top"];
			myalert.spacing = 25;
			myalert.margins = [35,20,35,20];

		var mylabel = myalert.add("statictext", undefined, undefined, {name: "mylabel"});
			mylabel.text = msg;

		var mybtn = myalert.add("button", undefined, undefined, {name: "mybtn"});
			mybtn.text = "Ok";
			mybtn.preferredSize.width = 80;

		myalert.center(FRdialog);
		myalert.show();
	}

	function counter(n, digits)
	{
		switch (digits) {
			case 1:
				return n;
			case 2:
				if (n > 9) { return n; } else { return "0" + n; }
				break;
			case 3:
				if (n <= 9) { return "00" + n; }
				else if (n > 9 && n < 100) { return "0" + n; }
				else { return n; }
				break;
		}
	}

}

try {
	main();
} catch (e) {
	alert(e.message, undefined, true);
}
