export const style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
.ybf-comment {
}
.ybf-icon {
    cursor:pointer;
    position:absolute;
    left:0px;
    top:0px;
    font-size:10px;
    color:black;
    z-index:100;
    background-color:white;
    border-radius:50%;
    color:red;
}
.ybf-popup {
    font-weight: normal;
    position:absolute;
    font-size:14px;
    width: 300px;
    z-index:200;
    border:1px solid #ccc;
    border-radius:4px; 
    background-color:white;
    padding:8px;
    line-height:24px;
  }
`;
