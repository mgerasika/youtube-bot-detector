export const style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
.iconDiv {
    position:absolute;
    left:0px;
    top:0px;
    font-size:12px;
    border:1px solid black;
    color:black;
    border-radius:4px; 
    z-index:100;
    background-color:white;
    padding:4px 8px;
}

.bot .iconDiv {
    color:red;
    border:1px solid red;
}
`;
