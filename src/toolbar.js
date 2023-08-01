let gridlinesOn = true;
let gravField = false;

function toggleGridlines () {
	gridlinesOn = !gridlinesOn;
}

function toggleGravField () {
	gravField = !gravField;
}

document.getElementById("gridlines").addEventListener("click", toggleGridlines);
document.getElementById("gravField").addEventListener("click", toggleGravField);

export { gridlinesOn };
export { gravField };