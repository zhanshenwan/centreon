var autologout_xhr2 = null;
var autologout_docXML;
var autologout_items_state;
var autologout_items_time;
var autologout_state;
var autologout_currentTime;

function check_session() {
    autologout_xhr2 = null;

    if (window.XMLHttpRequest) {
        autologout_xhr2 = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        autologout_xhr2 = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (autologout_xhr2 == null) {
        alert("Le web browser ne supporte pas l'AJAX.");
    }
    autologout_xhr2.onreadystatechange = change_status();
    autologout_xhr2.open("GET", "./include/core/autologout/autologoutXMLresponse.php", true);
    autologout_xhr2.send(null);
}

function change_status() {
    if (autologout_xhr2.readyState != 4 && autologout_xhr2.readyState != "complete") {
        return (0);
    }
    autologout_docXML = autologout_xhr2.responseXML;
    autologout_items_state = autologout_docXML.getElementsByTagName("state");
    autologout_items_time = autologout_docXML.getElementsByTagName("time");
    autologout_state = autologout_items_state.item(0).firstChild.data;
    autologout_currentTime = autologout_items_time.item(0).firstChild.data;

    if (autologout_state == "ok") {
        if (document.getElementById('date')) {
            document.getElementById('date').innerHTML = autologout_currentTime;
        }
    } else if (autologout_state == "nok") {
        window.location.replace("./index.php");
    }
}

setInterval(check_session, <?php echo $tM; ?>);
