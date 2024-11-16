import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import './styles.scss';
function openWebPage(url) {
    return browser.tabs.create({ url });
}
const Popup = () => {
    return (React.createElement("section", { id: "popup" },
        React.createElement("h2", null, "Youtube bot"),
        React.createElement("button", { id: "options__button", type: "button", onClick: () => {
                return openWebPage('options.html');
            } }, "Options Page"),
        React.createElement("div", { className: "links__holder" },
            React.createElement("ul", null,
                React.createElement("li", null,
                    React.createElement("button", { type: "button", onClick: () => {
                            return openWebPage('https://github.com/abhijithvijayan/web-extension-starter');
                        } }, "GitHub")),
                React.createElement("li", null,
                    React.createElement("button", { type: "button", onClick: () => {
                            return openWebPage('https://www.buymeacoffee.com/abhijithvijayan');
                        } }, "Buy Me A Coffee"))))));
};
export default Popup;
