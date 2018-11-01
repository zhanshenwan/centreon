import React from "react";

export default ({ icon, colorClass, label, onClick }) => (
    <div class="cntn" style={{paddingRight:'2px'}}>
        <button type="button" onClick={onClick} class={`btc ${colorClass} ui-button`} style={{display:'inline-block'}}>
            <span class={`ui-button-icon ui-icon ui-${icon}`}></span>
            <span class="ui-button-icon-space"></span>{label}
        </button>
    </div>
);
