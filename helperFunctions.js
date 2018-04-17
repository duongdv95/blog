alert("works!");
function empty() {
    var x;
    x = document.querySelectorAll("input");
    for(var i = 0; i < x.length; i++){
        if (x[i] == "") {
            alert("Please fill out all forms");
            return false
        }
    }
}