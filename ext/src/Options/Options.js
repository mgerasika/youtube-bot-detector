import * as React from 'react';
import './styles.scss';
const Options = () => {
    return (React.createElement("div", null,
        React.createElement("form", null,
            React.createElement("p", null,
                React.createElement("label", { htmlFor: "username" }, "Your Name"),
                React.createElement("br", null),
                React.createElement("input", { type: "text", id: "username", name: "username", spellCheck: "false", autoComplete: "off", required: true })),
            React.createElement("p", null,
                React.createElement("label", { htmlFor: "logging" },
                    React.createElement("input", { type: "checkbox", name: "logging" }),
                    " Show the features enabled on each page in the console"),
                React.createElement("p", null, "cool cool cool")))));
};
export default Options;
