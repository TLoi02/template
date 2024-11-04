function doPayment_new() {
    let checkResult = checkMultiPageInputs();

    if (checkResult == true) {
        return true;
    }
    document.getElementsByName("cardholder_name")[0].style.borderColor = "";
    document.getElementsByName("ccn")[0].style.borderColor = "";
    document.getElementsByName("exp_month")[0].style.borderColor = "";
    document.getElementsByName("exp_year")[0].style.borderColor = "";

    var cvcExists = document.getElementsByName("cvc_code")[0];

    if (cvcExists) {
        document.getElementsByName("cvc_code")[0].style.borderColor = "";
        var cvc = document.getElementsByName("cvc_code")[0].value;
    }

    var ccnNo = document.getElementsByName("ccn")[0].value;
    var cardholder = document.getElementsByName("cardholder_name")[0].value;
    var exp_month_year = document.getElementsByName("exp_month_year")[0].value;
    var cnIsInvalid = false;
    var cvcIsInvalid = false;
    var ccnIsInvalid = false;
    var dateIsInvalid = false;
    var tokenized = $('#tokenized_elem').attr('id');

    if (cardholder) {
        if (/[!@#$%^&*()_+={}|\\\\;\"\n\r\t\[\]<>?\/]/.test(cardholder) || /(^[.-]|[.-]$)/.test(cardholder)) {
            // Wrong input format.
            document.getElementsByName("cardholder_name")[0].style.borderColor = "rgb(255, 102, 102)";
            document.getElementsByName("cardholder_name")[0].style.borderWidth = "2px";
            var cnTooltip = document.getElementsByName("cn_tooltip");
            if (cnTooltip && cnTooltip[0])
                cnTooltip[0].style.display = "inline";

            cnIsInvalid = true;
        } else {
            // Input OK.
            document.getElementsByName("cardholder_name")[0].style.borderColor = "#a5d9a5";
            var cnTooltip = document.getElementsByName("cn_tooltip");
            if (cnTooltip && cnTooltip[0])
                cnTooltip[0].style.display = "none";
        }
    } else {
        // Input missing.
        document.getElementsByName("cardholder_name")[0].style.borderColor = "rgb(255, 102, 102)";
        document.getElementsByName("cardholder_name")[0].style.borderWidth = "2px";
        var errorLabel = document.getElementsByName("error_label");
        if (errorLabel && errorLabel[0])
            errorLabel[0].innerHTML = "Please fill out the cardholder name.";
        cnIsInvalid = true;
    }

    if (cvc) {
        if (/[^0-9]+/.test(cvc) || cvc.length > 4) {
            // Wrong input format.
            document.getElementsByName("cvc_code")[0].style.borderColor = "rgb(255, 102, 102)";
            document.getElementsByName("cvc_code")[0].style.borderWidth = "2px";

            cvcIsInvalid = true;
        } else {
            // Input OK;
            document.getElementsByName("cvc_code")[0].style.borderColor = "#a5d9a5";
        }
    } else {
        // Input missing.
        document.getElementsByName("cvc_code")[0].style.borderColor = "rgb(255, 102, 102)";
        document.getElementsByName("cvc_code")[0].style.borderWidth = "2px";
        cvcIsInvalid = true;
    }

    if (ccnNo) {
        // Tests ccn value for spacing. Remove spacing if so. Relevant for form auto-spacing -> 1705
        if (/^(.*\s+.*)+$/.test(ccnNo))
            ccnNo = ccnNo.replace(/\s+/g, '');

        //Luhn check algorithm
        var nCheck = 0
          , nDigit = 0
          , bEven = false;
        for (var n = ccnNo.length - 1; n >= 0; n--) {
            var cDigit = ccnNo.charAt(n)
              , nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9)
                    nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }

        if ((nCheck % 10) != 0 || /[^0-9]+/.test(ccnNo) || ccnNo.length < 15 || ccnNo.length > 19) {
            // Wrong input format.
            document.getElementsByName("ccn")[0].style.borderColor = "rgb(255, 102, 102)";
            document.getElementsByName("ccn")[0].style.borderWidth = "2px";
            ccnIsInvalid = true;
        } else {
            // Input OK.
            document.getElementsByName("ccn")[0].style.borderColor = "#a5d9a5";
        }
    } else {
        // Input missing.
        document.getElementsByName("ccn")[0].style.borderColor = "rgb(255, 102, 102)";
        document.getElementsByName("ccn")[0].style.borderWidth = "2px";
        ccnIsInvalid = true;
    }

    var datePieces = exp_month_year.split('/');
    var month = datePieces[0];
    var year = datePieces[1];

    if (month)
        month = month.replace(/\s+/g, '');
    if (year && document.getElementById("new"))
        year = year.replace(/\s+/g, '');
    if (year && document.getElementById("new") && year.length === 2)
        year = '20' + year;
    if (year && tokenized)
        year = '20' + year.replace(/\s+/g, '');

    document.getElementsByName("exp_month")[0].value = month;
    document.getElementsByName("exp_year")[0].value = year;

    var d1 = new Date(year,(+month));
    var today = new Date();

    if (exp_month_year) {
        if (/^\d{1,2}$/.test(month) && /^\d{4}$/.test(year) && d1 > today) {
            var dateTooltip = document.getElementsByName("date_tooltip");
            if (dateTooltip && dateTooltip[0]) {
                dateTooltip[0].style.display = "none";
                dateTooltip[0].innerHTML = "";
            }
            document.getElementsByName("exp_month_year")[0].style.borderColor = "#a5d9a5";
        } else {
            var dateTooltip = document.getElementsByName("date_tooltip");
            if (dateTooltip && dateTooltip[0]) {
                dateTooltip[0].style.display = "inline";
                dateTooltip[0].style.fontSize = "12px";
                dateTooltip[0].style.color = "rgb(255, 102, 102)";
                var msg = "";
                if (d1 <= today)
                    msg = "Card expired.";
                if (year.length !== 4)
                    msg = "Year must be either 2 or 4 digits long.";
                dateTooltip[0].innerHTML = msg;
            }
            document.getElementsByName("exp_month_year")[0].style.borderColor = "rgb(255, 102, 102)";
            document.getElementsByName("exp_month_year")[0].style.borderWidth = "2px";
            dateIsInvalid = true;
        }
    } else {
        document.getElementsByName("exp_month_year")[0].style.borderColor = "rgb(255, 102, 102)";
        document.getElementsByName("exp_month_year")[0].style.borderWidth = "2px";
        dateIsInvalid = true;
    }

    if (cnIsInvalid || cvcIsInvalid || ccnIsInvalid || dateIsInvalid)
        return false;

    /*****************************************
	 * prevent date field to disable itself when submitting. only for non datepicker user like 1705.
	 *****************************************/
    if (tokenized) {//do nothing if tokenized
    } else {
        if (!document.getElementById("1705") && !document.getElementById("2011") && !document.getElementById("manual_input")) {
            $("#exp_month_year").prop("disabled", true);
        }

        if (!document.getElementById("new")) {
            $("#exp_month_year").prop("disabled", true);
        }
    }
    preventSecondBtnClick();
    return true;
}

function checkMultiPageInputs() {
    let radioButtonElements = document.forms[0].elements['token_id'];
    if (radioButtonElements) {
        for (let index = 0; index < radioButtonElements.length; index++) {
            let currentRadio = radioButtonElements[index];
            if (currentRadio.type == 'radio' && currentRadio.checked)
                return true;
        }
    }
    return false;
}

function doPayment_tokenizedOnCard() {
    var cvcExists = document.getElementsByName("cvc_code")[0];

    if (cvcExists) {
        document.getElementsByName("cvc_code")[0].style.borderColor = "";
        var cvc = document.getElementsByName("cvc_code")[0].value;
    }

    var tokenized = $('#tokenized_elem_cvc').attr('id');
    var cvcIsInvalid = false;

    /*****************************************
	 * CARD VALUE CODE VALIDATION
	 *****************************************/
    if (cvc) {
        if (/[^0-9]+/.test(cvc) || cvc.length > 4) {
            // Wrong input format.
            document.getElementsByName("cvc_code")[0].style.borderColor = "rgb(255, 102, 102)";
            cvcIsInvalid = true;
        } else {
            // Input OK;
            document.getElementsByName("cvc_code")[0].style.borderColor = "#a5d9a5";
        }
    } else {
        // Input missing.
        document.getElementsByName("cvc_code")[0].style.borderColor = "rgb(255, 102, 102)";
        cvcIsInvalid = true;
    }

    /*****************************************
	 * RETURN FALSE FOR INVALID FIELD
	 *****************************************/
    if (cvcIsInvalid)
        return false;
    preventSecondBtnClick();
    return true;
}

function preventSecondBtnClick() {
    var elements = document.querySelectorAll(".btn[type=submit]");

    if (elements.length > 0) {
        elements[0].disabled = true;
    }
}

function sleep(seconds) {
    var waitUntil = new Date().getTime() + seconds * 1000;
    while (new Date().getTime() < waitUntil)
        true;
}

function autoPost() {
    autoSubmitForm = document.getElementById("autoSubmitForm");
    autoSubmitFormNoDelay = document.getElementById("autoSubmitFormNoDelay");
    if (autoSubmitForm) {
        sleep(2);
        autoSubmitForm.submit();
    } else if (autoSubmitFormNoDelay) {
        autoSubmitFormNoDelay.submit();
    }
}

function processBtnClick(e) {
    var cancelLinkObject = document.getElementById("cancel_link");
    var backLinkObject = document.getElementById("back_link");
    var link;
    var target = e.target;

    if (target.id == 'cancelBtn') {
        link = cancelLinkObject.value;
        window.location = link;
    } else if (target.id == 'backBtn') {
        link = backLinkObject.value;
        window.location = link;
    } else if (target.id == 'autopostLink') {
        autoPost();
    } else if (target.id == 'closeWindow') {
        window.close();
    }
}

function processCreditCardFormSubmit(e) {
    if (doPayment_new() == false) {
        e.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var cancelBtn = document.getElementById('cancelBtn');
    var backBtn = document.getElementById('backBtn');
    var autopostLink = document.getElementById('autopostLink');
    var creditCardForm = document.getElementById('creditCardForm');
    var closeWindowBtn = document.getElementById('closeWindow');

    if (cancelBtn) {
        cancelBtn.addEventListener("click", processBtnClick);
    }

    if (backBtn) {
        backBtn.addEventListener("click", processBtnClick);
    }

    if (creditCardForm) {
        creditCardForm.addEventListener("submit", processCreditCardFormSubmit);
    }

    if (autopostLink) {
        autopostLink.addEventListener("click", processBtnClick);
    }

    if (closeWindowBtn) {
        console.log("-----------------");
        closeWindowBtn.addEventListener("click", processBtnClick)
    }
});

document.addEventListener('invalid', (function() {
    return function(e) {
        e.preventDefault();
    }
    ;
}
)(), true);

function luhnCheck() {
    var ccnNo = document.getElementsByName("ccn")[0].value;
    ccnNo = ccnNo.replace(/\s/g, '');
    var nCheck = 0
      , nDigit = 0
      , bEven = false;
    for (var n = ccnNo.length - 1; n >= 0; n--) {
        var cDigit = ccnNo.charAt(n)
          , nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9)
                nDigit -= 9;
        }
        nCheck += nDigit;
        bEven = !bEven;
    }
    return (nCheck % 10) != 0;
}

// Check if Visa/MC CC data are valid by submit.
function isCCValid(ccn, expMonthYear, cvcCode, cardholderName, error_icon_cn, error_icon_ccn, error_icon_cvv, error_icon_date) {
    const ccnValidation = document.getElementById("ccn-validation-invalid");
    const monthYearValidation = document.getElementById("month-year-validation");
    const cvvValidation = document.getElementById("cvv-validation");
    const nameValidation = document.getElementById("name-validation");
    const ccn_invalid_txt = document.getElementById("ccn_invalid_txt");
    const date_invalid_txt = document.getElementById("date_invalid_txt");
    const cvc_invalid_txt = document.getElementById("cvc_invalid_txt");
    const cn_invalid_txt = document.getElementById("cn_invalid_txt");

    // Reset all errors before checking.
    ccn.classList.remove("not-valid");
    expMonthYear.classList.remove("not-valid");
    cvcCode.classList.remove("not-valid");
    cardholderName.classList.remove("not-valid");
    ccnValidation.innerHTML = "";
    monthYearValidation.innerHTML = "";
    cvvValidation.innerHTML = "";
    nameValidation.innerHTML = "";

    let ccnNo = ccn.value.replace(/\s/g, '');
    let isInvalid = false;
    let expDate = new Date(document.getElementById("exp_year").value,document.getElementById("exp_month").value);
    let dateNow = new Date();

    if (ccnNo.length > 19 || 13 > ccnNo.length || luhnCheck()) {
        ccn.classList.add("not-valid");
        error_icon_ccn.style.display = 'block';
        ccnValidation.innerHTML = ccn_invalid_txt.value;
        isInvalid = true;
    }
    if (expDate.getYear() < dateNow.getYear() || (expDate.getYear() == dateNow.getYear() && expDate.getMonth() < dateNow.getMonth())) {
        expMonthYear.classList.add("not-valid");
        error_icon_date.style.display = 'block';
        monthYearValidation.innerHTML = date_invalid_txt.value;
        isInvalid = true;
    }
    if (cvcCode.value.length < 3) {
        cvcCode.classList.add("not-valid");
        error_icon_cvv.style.display = 'block';
        cvvValidation.innerHTML = cvc_invalid_txt.value;
        isInvalid = true;
    }
    if (cardholderName.value.trim().length == 0) {
        cardholderName.classList.add("not-valid");
        error_icon_cn.style.display = 'block';
        nameValidation.innerHTML = cn_invalid_txt.value;
        isInvalid = true;
    }
    if (isInvalid == false) {
        ccn.classList.add("valid");
        expMonthYear.classList.add("valid");
        cvcCode.classList.add("valid");
        cardholderName.classList.add("valid");
        error_icon_ccn.style.display = 'none';
        error_icon_date.style.display = 'none';
        error_icon_cvv.style.display = 'none';
        error_icon_cn.style.display = 'none';
    }

    if (isInvalid) {
        $('#submit-button').prop("disabled", "disabled");
        $("#submit-button").children('b').html($("#invalid_btn_txt").attr("value"));
        return !1;
    }
    return !0;
}

$(document).ready(function() {
    var elem_cm = document.getElementById("cardholder_name");
    var elem_ccn = document.getElementById("ccn");
    var elem_cvc = document.getElementById("cvc_code");
    var elem_date = document.getElementById("exp_month_year");
    if (elem_cm)
        elem_cm.setAttribute("required", "true");
    if (elem_ccn)
        elem_ccn.setAttribute("required", "true");
    if (elem_cvc)
        elem_cvc.setAttribute("required", "true");
    if (elem_date)
        elem_date.setAttribute("required", "true");

    var error_icon_cn = document.getElementById("errorIconCN");
    var error_icon_ccn = document.getElementById("errorIconCCN");
    var error_icon_cvv = document.getElementById("errorIconCVV");
    var error_icon_date = document.getElementById("errorIconDate");
    if (error_icon_cn)
        error_icon_cn.style.display = 'none';
    if (error_icon_ccn)
        error_icon_ccn.style.display = 'none';
    if (error_icon_cvv)
        error_icon_cvv.style.display = 'none';
    if (error_icon_date)
        error_icon_date.style.display = 'none';

    if (document.getElementById("new")) {

        /*document.getElementById('submit-button').onclick = function() {
				return isCCValid();
		};*/

        let visa = `<svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="visa" fill-rule="nonzero"> <rect id="Rectangle-1" fill="#0E4595" x="0" y="0" width="750" height="471" rx="40"></rect> <polygon id="Shape" fill="#FFFFFF" points="278.1975 334.2275 311.5585 138.4655 364.9175 138.4655 331.5335 334.2275"></polygon> <path d="M524.3075,142.6875 C513.7355,138.7215 497.1715,134.4655 476.4845,134.4655 C423.7605,134.4655 386.6205,161.0165 386.3045,199.0695 C386.0075,227.1985 412.8185,242.8905 433.0585,252.2545 C453.8275,261.8495 460.8105,267.9695 460.7115,276.5375 C460.5795,289.6595 444.1255,295.6545 428.7885,295.6545 C407.4315,295.6545 396.0855,292.6875 378.5625,285.3785 L371.6865,282.2665 L364.1975,326.0905 C376.6605,331.5545 399.7065,336.2895 423.6355,336.5345 C479.7245,336.5345 516.1365,310.2875 516.5505,269.6525 C516.7515,247.3835 502.5355,230.4355 471.7515,216.4645 C453.1005,207.4085 441.6785,201.3655 441.7995,192.1955 C441.7995,184.0585 451.4675,175.3575 472.3565,175.3575 C489.8055,175.0865 502.4445,178.8915 512.2925,182.8575 L517.0745,185.1165 L524.3075,142.6875" id="path13" fill="#FFFFFF"></path> <path d="M661.6145,138.4655 L620.3835,138.4655 C607.6105,138.4655 598.0525,141.9515 592.4425,154.6995 L513.1975,334.1025 L569.2285,334.1025 C569.2285,334.1025 578.3905,309.9805 580.4625,304.6845 C586.5855,304.6845 641.0165,304.7685 648.7985,304.7685 C650.3945,311.6215 655.2905,334.1025 655.2905,334.1025 L704.8025,334.1025 L661.6145,138.4655 Z M596.1975,264.8725 C600.6105,253.5935 617.4565,210.1495 617.4565,210.1495 C617.1415,210.6705 621.8365,198.8155 624.5315,191.4655 L628.1385,208.3435 C628.1385,208.3435 638.3555,255.0725 640.4905,264.8715 L596.1975,264.8715 L596.1975,264.8725 Z" id="Path" fill="#FFFFFF"></path> <path d="M232.9025,138.4655 L180.6625,271.9605 L175.0965,244.8315 C165.3715,213.5575 135.0715,179.6755 101.1975,162.7125 L148.9645,333.9155 L205.4195,333.8505 L289.4235,138.4655 L232.9025,138.4655" id="path16" fill="#FFFFFF"></path> <path d="M131.9195,138.4655 L45.8785,138.4655 L45.1975,142.5385 C112.1365,158.7425 156.4295,197.9015 174.8155,244.9525 L156.1065,154.9925 C152.8765,142.5965 143.5085,138.8975 131.9195,138.4655" id="path18" fill="#F2AE14"></path> </g> </g></svg>`;
        let maestro = `<svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="maestro" fill-rule="nonzero"> <rect id="Rectangle-1" fill="#000000" x="0" y="0" width="750" height="471" rx="40"></rect> <g id="Group" transform="translate(133.000000, 48.000000)"> <path d="M146.8,373.77 L146.8,349 C146.8,339.65 140.8,333.36 131.25,333.28 C126.25,333.2 120.99,334.77 117.35,340.28 C114.62,335.9 110.35,333.28 104.28,333.28 C99.6528149,333.047729 95.2479974,335.280568 92.7,339.15 L92.7,334.27 L84.09,334.27 L84.09,373.82 L92.78,373.82 L92.78,351.85 C92.78,344.98 96.59,341.34 102.46,341.34 C108.17,341.34 111.07,345.06 111.07,351.76 L111.07,373.76 L119.76,373.76 L119.76,351.85 C119.76,344.98 123.76,341.34 129.44,341.34 C135.31,341.34 138.13,345.06 138.13,351.76 L138.13,373.76 L146.8,373.77 Z M195.28,354 L195.28,334.23 L186.67,334.23 L186.67,339 C183.94,335.44 179.8,333.21 174.18,333.21 C163.09,333.21 154.41,341.9 154.41,353.98 C154.41,366.06 163.1,374.75 174.18,374.75 C179.81,374.75 183.94,372.52 186.67,368.96 L186.67,373.76 L195.28,373.76 L195.28,354 Z M163.28,354 C163.28,347.05 167.83,341.34 175.28,341.34 C182.4,341.34 187.19,346.8 187.19,354 C187.19,361.2 182.39,366.66 175.28,366.66 C167.81,366.66 163.26,360.95 163.26,354 L163.28,354 Z M379.4,333.19 C382.306602,333.161358 385.190743,333.701498 387.89,334.78 C390.404719,335.784654 392.697997,337.272736 394.64,339.16 C396.553063,341.035758 398.069744,343.276773 399.1,345.75 C401.246003,351.047587 401.246003,356.972413 399.1,362.27 C398.069744,364.743227 396.553063,366.984242 394.64,368.86 C392.698322,370.747671 390.404958,372.235809 387.89,373.24 C382.423165,375.368264 376.356835,375.368264 370.89,373.24 C368.379501,372.23863 366.092168,370.749994 364.16,368.86 C362.258485,366.978798 360.749319,364.738843 359.72,362.27 C357.573997,356.972413 357.573997,351.047587 359.72,345.75 C360.749788,343.28141 362.258895,341.041542 364.16,339.16 C366.092334,337.270213 368.379623,335.781606 370.89,334.78 C373.595493,333.69893 376.486681,333.158743 379.4,333.19 Z M379.4,341.33 C377.718221,341.315441 376.049964,341.631425 374.49,342.26 C373.019746,342.850363 371.685751,343.735156 370.57,344.86 C369.447092,346.008077 368.563336,347.367702 367.97,348.86 C366.704271,352.169784 366.704271,355.830216 367.97,359.14 C368.562861,360.632544 369.446675,361.992258 370.57,363.14 C371.685751,364.264844 373.019746,365.149637 374.49,365.74 C377.649488,366.979283 381.160512,366.979283 384.32,365.74 C385.794284,365.146098 387.134154,364.26192 388.26,363.14 C389.392829,361.995929 390.283848,360.635594 390.88,359.14 C392.145729,355.830216 392.145729,352.169784 390.88,348.86 C390.283848,347.364406 389.392829,346.004071 388.26,344.86 C387.134154,343.73808 385.794284,342.853902 384.32,342.26 C382.757613,341.626714 381.085807,341.307304 379.4,341.32 L379.4,341.33 Z M242.1,354 C242.02,341.67 234.41,333.23 223.32,333.23 C211.74,333.23 203.63,341.67 203.63,354 C203.63,366.58 212.07,374.77 223.9,374.77 C229.9,374.77 235.32,373.28 240.12,369.23 L235.9,362.86 C232.633262,365.479648 228.586894,366.936341 224.4,367 C218.86,367 213.81,364.44 212.57,357.32 L241.94,357.32 C242,356.23 242.1,355.16 242.1,354 Z M212.65,350.53 C213.56,344.82 217.03,340.93 223.16,340.93 C228.7,340.93 232.26,344.4 233.16,350.53 L212.65,350.53 Z M278.34,344.33 C274.582803,342.165547 270.335565,340.995319 266,340.93 C261.28,340.93 258.47,342.67 258.47,345.56 C258.47,348.21 261.47,348.95 265.17,349.45 L269.22,350.03 C277.83,351.27 283.04,354.91 283.04,361.86 C283.04,369.39 276.42,374.77 265.04,374.77 C258.59,374.77 252.63,373.11 247.91,369.64 L251.96,362.94 C255.757785,365.757702 260.39304,367.215905 265.12,367.08 C270.99,367.08 274.12,365.34 274.12,362.28 C274.12,360.05 271.89,358.81 267.17,358.14 L263.12,357.56 C254.27,356.32 249.47,352.35 249.47,345.89 C249.47,338.03 255.92,333.23 265.93,333.23 C272.22,333.23 277.93,334.64 282.06,337.37 L278.34,344.33 Z M319.69,342.1 L305.62,342.1 L305.62,360 C305.62,364 307.03,366.62 311.33,366.62 C314.014365,366.531754 316.632562,365.76453 318.94,364.39 L321.42,371.75 C318.192475,373.761602 314.463066,374.822196 310.66,374.81 C300.48,374.81 296.93,369.35 296.93,360.16 L296.93,342.16 L288.93,342.16 L288.93,334.3 L296.93,334.3 L296.93,322.3 L305.62,322.3 L305.62,334.3 L319.68,334.3 L319.69,342.1 Z M349.47,333.25 C351.556514,333.260012 353.62609,333.625232 355.59,334.33 L352.94,342.44 C351.229904,341.756022 349.401653,341.416198 347.56,341.44 C341.93,341.44 339.12,345.08 339.12,351.62 L339.12,373.79 L330.52,373.79 L330.52,334.23 L339,334.23 L339,339 C341.149726,335.306198 345.148028,333.084492 349.42,333.21 L349.47,333.25 Z" id="Shape" fill="#FFFFFF"></path> <g id="_Group_"> <rect id="Rectangle-path" fill="#7673C0" x="176.95" y="32.39" width="130.5" height="234.51"></rect> <path d="M185.24,149.64 C185.20514,103.86954 206.225386,60.6268374 242.24,32.38 C181.092968,-15.6818249 93.2777189,-8.68578574 40.5116372,48.4512353 C-12.2544445,105.588256 -12.2544445,193.681744 40.5116372,250.818765 C93.2777189,307.955786 181.092968,314.951825 242.24,266.89 C206.228151,238.645328 185.208215,195.406951 185.24,149.64 Z" id="_Path_" fill="#EB001B"></path> <path d="M483.5,149.64 C483.501034,206.73874 450.90156,258.826356 399.545558,283.782862 C348.189556,308.739368 287.092343,302.183759 242.2,266.9 C278.166584,238.620187 299.164715,195.398065 299.164715,149.645 C299.164715,103.891935 278.166584,60.669813 242.2,32.39 C287.090924,-2.89264477 348.185845,-9.44904288 399.541061,15.5049525 C450.896277,40.4589479 483.497206,92.543064 483.5,149.64 Z" id="Shape" fill="#00A1DF"></path> </g> </g> </g> </g></svg>`;
        let mastercard = `<svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="mastercard" fill-rule="nonzero"> <rect id="Rectangle-1" fill="#000000" x="0" y="0" width="750" height="471" rx="40"></rect> <g id="Group" transform="translate(133.000000, 48.000000)"> <path d="M88.13,373.67 L88.13,348.82 C88.13,339.29 82.33,333.08 72.81,333.08 C67.81,333.08 62.46,334.74 58.73,340.08 C55.83,335.52 51.73,333.08 45.48,333.08 C40.7599149,332.876008 36.2525337,335.054575 33.48,338.88 L33.48,333.88 L25.61,333.88 L25.61,373.64 L33.48,373.64 L33.48,350.89 C33.48,343.89 37.62,340.54 43.42,340.54 C49.22,340.54 52.53,344.27 52.53,350.89 L52.53,373.67 L60.4,373.67 L60.4,350.89 C60.4,343.89 64.54,340.54 70.34,340.54 C76.14,340.54 79.45,344.27 79.45,350.89 L79.45,373.67 L88.13,373.67 Z M217.35,334.32 L202.85,334.32 L202.85,322.32 L195,322.32 L195,334.32 L186.72,334.32 L186.72,341.32 L195,341.32 L195,360 C195,369.11 198.31,374.5 208.25,374.5 C212.015784,374.421483 215.705651,373.426077 219,371.6 L216.51,364.6 C214.275685,365.996557 211.684475,366.715565 209.05,366.67 C204.91,366.67 202.84,364.18 202.84,360.04 L202.84,341 L217.34,341 L217.34,334.37 L217.35,334.32 Z M291.07,333.08 C286.709355,332.982846 282.618836,335.185726 280.3,338.88 L280.3,333.88 L272.43,333.88 L272.43,373.64 L280.3,373.64 L280.3,351.31 C280.3,344.68 283.61,340.54 289,340.54 C290.818809,340.613783 292.62352,340.892205 294.38,341.37 L296.87,333.91 C294.971013,333.43126 293.02704,333.153071 291.07,333.08 Z M179.66,337.22 C175.52,334.32 169.72,333.08 163.51,333.08 C153.57,333.08 147.36,337.64 147.36,345.51 C147.36,352.14 151.92,355.86 160.61,357.11 L164.75,357.52 C169.31,358.35 172.21,360.01 172.21,362.08 C172.21,364.98 168.9,367.08 162.68,367.08 C157.930627,367.177716 153.278889,365.724267 149.43,362.94 L145.29,369.15 C151.09,373.29 158.13,374.15 162.29,374.15 C173.89,374.15 180.1,368.77 180.1,361.31 C180.1,354.31 175.1,350.96 166.43,349.71 L162.29,349.3 C158.56,348.89 155.29,347.64 155.29,345.16 C155.29,342.26 158.6,340.16 163.16,340.16 C168.16,340.16 173.1,342.23 175.59,343.47 L179.66,337.22 Z M299.77,353.79 C299.77,365.79 307.64,374.5 320.48,374.5 C326.28,374.5 330.42,373.26 334.56,369.94 L330.42,363.73 C327.488758,366.10388 323.841703,367.41823 320.07,367.46 C313.07,367.46 307.64,362.08 307.64,354.21 C307.64,346.34 313,341 320.07,341 C323.841703,341.04177 327.488758,342.35612 330.42,344.73 L334.56,338.52 C330.42,335.21 326.28,333.96 320.48,333.96 C308.05,333.13 299.77,341.83 299.77,353.84 L299.77,353.79 Z M244.27,333.08 C232.67,333.08 224.8,341.36 224.8,353.79 C224.8,366.22 233.08,374.5 245.09,374.5 C250.932775,374.623408 256.638486,372.722682 261.24,369.12 L257.1,363.32 C253.772132,365.898743 249.708598,367.349004 245.5,367.46 C240.12,367.46 234.32,364.15 233.5,357.11 L262.91,357.11 L262.91,353.8 C262.91,341.37 255.45,333.09 244.27,333.09 L244.27,333.08 Z M243.86,340.54 C249.66,340.54 253.8,344.27 254.21,350.48 L232.68,350.48 C233.92,344.68 237.68,340.54 243.86,340.54 Z M136.59,353.79 L136.59,333.91 L128.72,333.91 L128.72,338.91 C125.82,335.18 121.72,333.11 115.88,333.11 C104.7,333.11 96.41,341.81 96.41,353.82 C96.41,365.83 104.69,374.53 115.88,374.53 C121.68,374.53 125.82,372.46 128.72,368.73 L128.72,373.73 L136.59,373.73 L136.59,353.79 Z M104.7,353.79 C104.7,346.33 109.26,340.54 117.13,340.54 C124.59,340.54 129.13,346.34 129.13,353.79 C129.13,361.66 124.13,367.04 117.13,367.04 C109.26,367.45 104.7,361.24 104.7,353.79 Z M410.78,333.08 C406.419355,332.982846 402.328836,335.185726 400.01,338.88 L400.01,333.88 L392.14,333.88 L392.14,373.64 L400,373.64 L400,351.31 C400,344.68 403.31,340.54 408.7,340.54 C410.518809,340.613783 412.32352,340.892205 414.08,341.37 L416.57,333.91 C414.671013,333.43126 412.72704,333.153071 410.77,333.08 L410.78,333.08 Z M380.13,353.79 L380.13,333.91 L372.26,333.91 L372.26,338.91 C369.36,335.18 365.26,333.11 359.42,333.11 C348.24,333.11 339.95,341.81 339.95,353.82 C339.95,365.83 348.23,374.53 359.42,374.53 C365.22,374.53 369.36,372.46 372.26,368.73 L372.26,373.73 L380.13,373.73 L380.13,353.79 Z M348.24,353.79 C348.24,346.33 352.8,340.54 360.67,340.54 C368.13,340.54 372.67,346.34 372.67,353.79 C372.67,361.66 367.67,367.04 360.67,367.04 C352.8,367.45 348.24,361.24 348.24,353.79 Z M460.07,353.79 L460.07,318.17 L452.2,318.17 L452.2,338.88 C449.3,335.15 445.2,333.08 439.36,333.08 C428.18,333.08 419.89,341.78 419.89,353.79 C419.89,365.8 428.17,374.5 439.36,374.5 C445.16,374.5 449.3,372.43 452.2,368.7 L452.2,373.7 L460.07,373.7 L460.07,353.79 Z M428.18,353.79 C428.18,346.33 432.74,340.54 440.61,340.54 C448.07,340.54 452.61,346.34 452.61,353.79 C452.61,361.66 447.61,367.04 440.61,367.04 C432.73,367.46 428.17,361.25 428.17,353.79 L428.18,353.79 Z" id="Shape" fill="#FFFFFF"></path> <g> <rect id="Rectangle-path" fill="#FF5F00" x="170.55" y="32.39" width="143.72" height="234.42"></rect> <path d="M185.05,149.6 C185.05997,103.912554 205.96046,60.7376085 241.79,32.39 C180.662018,-15.6713968 92.8620037,-8.68523415 40.103462,48.4380037 C-12.6550796,105.561241 -12.6550796,193.638759 40.103462,250.761996 C92.8620037,307.885234 180.662018,314.871397 241.79,266.81 C205.96046,238.462391 185.05997,195.287446 185.05,149.6 Z" id="Shape" fill="#EB001B"></path> <path d="M483.26,149.6 C483.30134,206.646679 450.756789,258.706022 399.455617,283.656273 C348.154445,308.606523 287.109181,302.064451 242.26,266.81 C278.098424,238.46936 299.001593,195.290092 299.001593,149.6 C299.001593,103.909908 278.098424,60.7306402 242.26,32.39 C287.109181,-2.86445052 348.154445,-9.40652324 399.455617,15.5437274 C450.756789,40.493978 483.30134,92.5533211 483.26,149.6 Z" id="Shape" fill="#F79E1B"></path> </g> </g> </g> </g></svg>`;
        let unionpay = `<svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="unionpay" fill-rule="nonzero"> <rect id="Rectangle-path" fill="#FFFFFF" x="0" y="0" width="750" height="471" rx="40"></rect> <path d="M201.809581,55 L344.203266,55 C364.072152,55 376.490206,71.4063861 371.833436,91.4702467 L305.500331,378.94775 C300.843561,399.011611 280.871191,415.417997 261.002305,415.417997 L118.60862,415.417997 C98.7397339,415.417997 86.32168,399.011611 90.9784502,378.94775 L157.311555,91.4702467 C161.968325,71.3018868 181.837211,55 201.706097,55 L201.809581,55 Z" id="Shape" fill="#D10429"></path> <path d="M331.750074,55 L495.564902,55 C515.433788,55 506.430699,71.4063861 501.773929,91.4702467 L435.440824,378.94775 C430.784054,399.011611 432.232827,415.417997 412.363941,415.417997 L248.549113,415.417997 C228.576743,415.417997 216.262173,399.011611 221.022427,378.94775 L287.355531,91.4702467 C292.012302,71.3018868 311.881188,55 331.853558,55 L331.750074,55 Z" id="Shape" fill="#022E64"></path> <path d="M489.814981,55 L632.208666,55 C652.077552,55 664.495606,71.4063861 659.838836,91.4702467 L593.505731,378.94775 C588.848961,399.011611 568.876591,415.417997 549.007705,415.417997 L406.61402,415.417997 C386.64165,415.417997 374.32708,399.011611 378.98385,378.94775 L445.316955,91.4702467 C449.973725,71.3018868 469.842611,55 489.711498,55 L489.814981,55 Z" id="Shape" fill="#076F74"></path> <path d="M465.904754,326.014514 L479.357645,326.014514 L483.186545,312.952104 L469.837137,312.952104 L465.904754,326.014514 Z M476.667067,290.066763 L472.010297,305.532656 C472.010297,305.532656 477.081002,302.920174 479.875064,302.08418 C482.669126,301.457184 486.808478,300.934688 486.808478,300.934688 L490.016475,290.171263 L476.563583,290.171263 L476.667067,290.066763 Z M483.393513,267.912917 L478.94371,282.751814 C478.94371,282.751814 483.910932,280.45283 486.704994,279.721335 C489.499056,278.98984 493.638407,278.780842 493.638407,278.780842 L496.846405,268.017417 L483.496997,268.017417 L483.393513,267.912917 Z M513.093359,267.912917 L495.708083,325.910015 L500.364853,325.910015 L496.742921,337.927431 L492.086151,337.927431 L490.947829,341.584906 L474.390424,341.584906 L475.528745,337.927431 L442,337.927431 L445.311481,326.850508 L448.726446,326.850508 L466.318689,267.912917 L469.837137,256 L486.704994,256 L484.94577,261.956459 C484.94577,261.956459 489.395572,258.716981 493.741891,257.567489 C497.984726,256.417997 522.406899,256 522.406899,256 L518.784967,267.808418 L512.989875,267.808418 L513.093359,267.912917 Z" id="Shape" fill="#FEFEFE"></path> <path d="M520,256 L538.006178,256 L538.213146,262.792453 C538.109662,263.941945 539.041016,264.464441 541.214175,264.464441 L544.836108,264.464441 L541.524627,275.645864 L531.797151,275.645864 C523.414965,276.272859 520.206968,272.615385 520.413935,268.539913 L520.103484,256.104499 L520,256 Z M522.216235,309.20029 L505.037927,309.20029 L507.935473,299.272859 L527.597391,299.272859 L530.391454,290.181422 L511.039986,290.181422 L514.351467,279 L568.163034,279 L564.851553,290.181422 L546.741891,290.181422 L543.947829,299.272859 L562.057491,299.272859 L559.056461,309.20029 L539.498026,309.20029 L535.979578,313.380261 L543.947829,313.380261 L545.914021,325.920174 C546.120989,327.174165 546.120989,328.01016 546.534924,328.532656 C546.948859,328.950653 549.328986,329.159652 550.674275,329.159652 L553.054402,329.159652 L549.328986,341.386067 L543.223443,341.386067 C542.292089,341.386067 540.843316,341.281567 538.877124,341.281567 C537.014416,341.072569 535.77261,340.027576 534.530805,339.400581 C533.392483,338.878084 531.736743,337.519594 531.322808,335.11611 L529.4601,322.576197 L520.560494,334.907112 C517.766432,338.773585 513.937532,341.804064 507.418054,341.804064 L495,341.804064 L498.311481,330.936139 L503.071735,330.936139 C504.417024,330.936139 505.65883,330.413643 506.590184,329.891147 C507.521538,329.473149 508.349408,329.055152 509.177278,327.696662 L522.216235,309.20029 Z M334.31354,282 L379.742921,282 L376.43144,292.972424 L358.321778,292.972424 L355.527716,302.272859 L374.154797,302.272859 L370.739832,313.558781 L352.216235,313.558781 L347.662948,328.711176 C347.145529,330.383164 352.112751,330.592163 353.871975,330.592163 L363.185516,329.338171 L359.4601,341.878084 L338.556375,341.878084 C336.900635,341.878084 335.65883,341.669086 333.796122,341.251089 C332.036897,340.833091 331.209027,339.997097 330.48464,338.847605 C329.760254,337.593614 328.518449,336.65312 329.346319,333.936139 L335.348378,313.872279 L325,313.872279 L328.414965,302.377358 L338.763343,302.377358 L341.557405,293.076923 L331.209027,293.076923 L334.520508,282.104499 L334.31354,282 Z M365.700875,262.165457 L384.327956,262.165457 L380.912991,273.555878 L355.455981,273.555878 L352.661919,275.959361 C351.420113,277.108853 351.109662,276.690856 349.557405,277.526851 C348.108632,278.258345 345.107603,279.721335 341.175219,279.721335 L333,279.721335 L336.311481,268.748911 L338.795092,268.748911 C340.864767,268.748911 342.31354,268.539913 343.037927,268.121916 C343.865797,267.599419 344.797151,266.449927 345.728505,264.56894 L350.385275,256 L368.908872,256 L365.700875,262.269956 L365.700875,262.165457 Z M400.808726,280.975327 C400.808726,280.975327 405.879431,276.272859 414.572069,274.809869 C416.538261,274.391872 428.956314,274.600871 428.956314,274.600871 L430.819023,268.330914 L404.637626,268.330914 L400.808726,281.079826 L400.808726,280.975327 Z M425.437866,285.782293 L399.463436,285.782293 L397.91118,291.111756 L420.470644,291.111756 C423.161223,290.798258 423.678642,291.216255 423.885609,291.007257 L425.54135,285.782293 L425.437866,285.782293 Z M391.702153,256.104499 L407.535171,256.104499 L405.258528,264.150943 C405.258528,264.150943 410.22575,260.075472 413.744198,258.612482 C417.262647,257.358491 425.127414,256.104499 425.127414,256.104499 L450.791393,256 L441.995271,285.468795 C440.546498,290.484761 438.787274,293.724238 437.752436,295.291727 C436.821082,296.754717 435.68276,298.113208 433.406117,299.367199 C431.232958,300.516691 429.266766,301.248186 427.404058,301.352685 C425.748317,301.457184 423.057739,301.561684 419.53929,301.561684 L394.806666,301.561684 L387.873253,324.865022 C387.25235,327.164006 386.941899,328.313498 387.355834,328.940493 C387.666285,329.46299 388.597639,330.089985 389.735961,330.089985 L400.601758,329.044993 L396.876342,341.793904 L384.665256,341.793904 C380.732872,341.793904 377.93881,341.689405 375.972618,341.584906 C374.10991,341.375907 372.143718,341.584906 370.798429,340.539913 C369.660107,339.49492 367.900883,338.13643 368.004367,336.777939 C368.10785,335.523948 368.625269,333.433962 369.45314,330.507983 L391.702153,256.104499 Z" id="Shape" fill="#FEFEFE"></path> <path d="M437.840227,303 L436.391454,310.105951 C435.770551,312.300435 435.253132,313.972424 433.597391,315.435414 C431.838167,316.898403 429.871975,318.465893 425.111721,318.465893 L416.3156,318.88389 L416.212116,326.825835 C416.108632,329.020319 416.729535,328.811321 417.039986,329.229318 C417.453921,329.647315 417.764373,329.751814 418.178308,329.960813 L420.97237,329.751814 L429.354556,329.333817 L425.836108,341.037736 L416.212116,341.037736 C409.48567,341.037736 404.414965,340.828737 402.862708,339.574746 C401.206968,338.529753 401,337.275762 401,334.976778 L401.620903,303.835994 L417.039986,303.835994 L416.833019,310.21045 L420.558435,310.21045 C421.80024,310.21045 422.731594,310.105951 423.249013,309.792453 C423.766432,309.478955 424.076883,308.956459 424.283851,308.224964 L425.836108,303.208999 L437.94371,303.208999 L437.840227,303 Z M218.470396,147 C217.952978,149.507983 208.018534,195.592163 208.018534,195.592163 C205.845375,204.892598 204.293118,211.580552 199.118929,215.865022 C196.117899,218.373004 192.599451,219.522496 188.563583,219.522496 C182.044105,219.522496 178.318689,216.283019 177.697786,210.117562 L177.594302,208.027576 C177.594302,208.027576 179.560494,195.592163 179.560494,195.487663 C179.560494,195.487663 189.908872,153.478955 191.771581,147.940493 C191.875064,147.626996 191.875064,147.417997 191.875064,147.313498 C171.695727,147.522496 168.073794,147.313498 167.866827,147 C167.763343,147.417997 167.245924,150.030479 167.245924,150.030479 L156.690578,197.36865 L155.759224,201.339623 L154,214.506531 C154,218.373004 154.724386,221.612482 156.276643,224.224964 C161.140381,232.793904 174.903724,234.047896 182.665008,234.047896 C192.702935,234.047896 202.119959,231.853411 208.43247,227.986938 C219.505234,221.403483 222.40278,211.058055 224.886391,201.966618 L226.128196,197.264151 C226.128196,197.264151 236.787026,153.687954 238.649734,148.044993 C238.753218,147.731495 238.753218,147.522496 238.856702,147.417997 C224.162004,147.522496 219.919169,147.417997 218.470396,147.104499 L218.470396,147 Z M277.499056,233.622642 C270.358675,233.518142 267.771581,233.518142 259.389394,233.936139 L259.078943,233.309144 C259.803329,230.069666 260.6312,226.934688 261.252102,223.69521 L262.28694,219.306241 C263.839197,212.513788 265.28797,204.467344 265.494937,202.063861 C265.701905,200.600871 266.11584,196.943396 261.976489,196.943396 C260.217264,196.943396 258.45804,197.77939 256.595332,198.615385 C255.560494,202.272859 253.594302,212.513788 252.559465,217.111756 C250.489789,226.934688 250.386305,228.08418 249.454951,232.891147 L248.834048,233.518142 C241.4867,233.413643 238.899605,233.413643 230.413935,233.83164 L230,233.100145 C231.448773,227.248186 232.794062,221.396226 234.139351,215.544267 C237.6578,199.764877 238.589154,193.703919 239.520508,185.657475 L240.244894,185.239478 C248.523597,184.089985 250.489789,183.776488 259.492878,182 L260.217264,182.835994 L258.871975,187.851959 C260.424232,186.911466 261.873005,185.970972 263.425262,185.239478 C267.668097,183.149492 272.324867,182.522496 274.911962,182.522496 C278.844345,182.522496 283.190664,183.671988 284.949888,188.269956 C286.605629,192.345428 285.570791,197.361393 283.294148,207.288824 L282.155826,212.30479 C279.879183,223.381713 279.465248,225.367199 278.223443,232.891147 L277.395572,233.518142 L277.499056,233.622642 Z M306.558435,233.650218 C302.212116,233.650218 299.418054,233.545718 296.727476,233.650218 C294.036897,233.650218 291.449803,233.859216 287.413935,233.963716 L287.206968,233.650218 L287,233.232221 C288.138322,229.05225 288.655741,227.58926 289.276643,226.12627 C289.794062,224.66328 290.311481,223.20029 291.346319,218.91582 C292.588124,213.377358 293.415995,209.510885 293.933413,206.062409 C294.554316,202.822932 294.864767,200.001451 295.278703,196.761974 L295.589154,196.552975 L295.899605,196.239478 C300.245924,195.612482 302.936502,195.194485 305.730565,194.776488 C308.524627,194.358491 311.422173,193.835994 315.871975,193 L316.078943,193.417997 L316.182427,193.835994 C315.354556,197.28447 314.526686,200.732946 313.698816,204.181422 C312.870946,207.629898 312.043075,211.078374 311.318689,214.526851 C309.766432,221.8418 309.042046,224.558781 308.731594,226.544267 C308.317659,228.425254 308.214175,229.365747 307.593273,233.127721 L307.179338,233.441219 L306.765402,233.754717 L306.558435,233.650218 Z M352.499319,207.975327 C352.188868,209.856313 350.533127,216.857765 348.359968,219.783745 C346.807711,221.978229 345.048487,223.33672 342.978811,223.33672 C342.357909,223.33672 338.83946,223.33672 338.735976,218.007257 C338.735976,215.394775 339.253395,212.677794 339.874298,209.751814 C341.737006,201.287373 344.013649,194.285922 349.705257,194.285922 C354.15506,194.285922 354.465511,199.510885 352.499319,207.975327 Z M371.229884,208.811321 C373.713495,197.734398 371.747303,192.509434 369.367176,189.374456 C365.64176,184.567489 359.018798,183 352.188868,183 C348.049517,183 338.322041,183.417997 330.664241,190.523948 C325.179601,195.644412 322.592506,202.645864 321.143733,209.333817 C319.591476,216.12627 317.832252,228.352685 329.008501,232.950653 C332.423466,234.413643 337.390687,234.83164 340.598684,234.83164 C348.773903,234.83164 357.156089,232.532656 363.4686,225.844702 C368.332338,220.41074 370.505497,212.259797 371.333368,208.811321 L371.229884,208.811321 Z M545.661919,234.891147 C536.969281,234.786647 534.48567,234.786647 526.517419,235.204644 L526,234.577649 C528.173159,226.322206 530.346319,217.962264 532.312511,209.602322 C534.796122,198.734398 535.417024,194.13643 536.244894,187.761974 L536.865797,187.239478 C545.454951,185.985486 547.835078,185.671988 556.838167,184 L557.045135,184.731495 C555.389394,191.628447 553.837137,198.4209 552.181397,205.213353 C548.869916,219.529753 547.731594,226.844702 546.489789,234.36865 L545.661919,234.995646 L545.661919,234.891147 Z" id="Shape" fill="#FEFEFE"></path> <path d="M533.159909,209.373777 C532.745974,211.150265 531.090233,218.256216 528.917074,221.182195 C527.468301,223.272181 523.949852,224.630672 521.983661,224.630672 C521.362758,224.630672 517.947793,224.630672 517.740826,219.405708 C517.740826,216.793226 518.258244,214.076245 518.879147,211.150265 C520.741855,202.894822 523.018498,195.893371 528.710106,195.893371 C533.159909,195.893371 535.126101,201.013836 533.159909,209.478277 L533.159909,209.373777 Z M550.234733,210.209772 C552.718344,199.132849 542.576933,209.269278 541.024677,205.611804 C538.541066,199.864344 540.093322,188.369423 530.158879,184.50295 C526.329979,182.935461 517.32689,184.920947 509.66909,192.026898 C504.287934,197.042863 501.597355,204.044315 500.148582,210.732268 C498.596326,217.420222 496.837101,229.751136 507.909866,234.035606 C511.428315,235.603095 514.636312,236.021092 517.844309,235.812094 C529.020558,235.185098 537.506228,218.151717 543.818739,211.463763 C548.682476,206.1343 549.510347,213.449249 550.234733,210.209772 Z M420.292089,233.622642 C413.151708,233.518142 410.668097,233.518142 402.28591,233.936139 L401.975459,233.309144 C402.699846,230.069666 403.527716,226.934688 404.252102,223.69521 L405.183456,219.306241 C406.735713,212.513788 408.28797,204.467344 408.391454,202.063861 C408.598421,200.600871 409.012356,196.943396 404.976489,196.943396 C403.217264,196.943396 401.354556,197.77939 399.595332,198.615385 C398.663978,202.272859 396.594302,212.513788 395.559465,217.111756 C393.593273,226.934688 393.386305,228.08418 392.454951,232.891147 L391.834048,233.518142 C384.4867,233.413643 381.899605,233.413643 373.413935,233.83164 L373,233.100145 C374.448773,227.248186 375.794062,221.396226 377.139351,215.544267 C380.6578,199.764877 381.48567,193.703919 382.520508,185.657475 L383.141411,185.239478 C391.420113,184.089985 393.489789,183.776488 402.389394,182 L403.113781,182.835994 L401.871975,187.851959 C403.320748,186.911466 404.873005,185.970972 406.321778,185.239478 C410.564613,183.149492 415.221383,182.522496 417.808478,182.522496 C421.740862,182.522496 425.983697,183.671988 427.846405,188.269956 C429.502145,192.345428 428.363824,197.361393 426.08718,207.288824 L424.948859,212.30479 C422.568732,223.381713 422.25828,225.367199 421.016475,232.891147 L420.188605,233.518142 L420.292089,233.622642 Z M482.293118,147.104499 L476.291059,147.208999 C460.768492,147.417997 454.559465,147.313498 452.075854,147 C451.868886,148.149492 451.454951,150.134978 451.454951,150.134978 C451.454951,150.134978 445.866827,176.050798 445.866827,176.155298 C445.866827,176.155298 432.620903,231.330914 432,233.943396 C445.556375,233.734398 451.041016,233.734398 453.421143,234.047896 C453.938562,231.435414 457.043075,216.07402 457.146559,216.07402 C457.146559,216.07402 459.837137,204.788099 459.940621,204.370102 C459.940621,204.370102 460.768492,203.22061 461.596362,202.698113 L462.838167,202.698113 C474.531835,202.698113 487.674275,202.698113 498.022653,195.069666 C505.05955,189.844702 509.819804,182.007257 511.992964,172.602322 C512.510383,170.303338 512.924318,167.586357 512.924318,164.764877 C512.924318,161.107402 512.199931,157.554427 510.130256,154.732946 C504.852583,147.313498 494.400721,147.208999 482.293118,147.104499 Z M490.054402,174.169811 C488.812597,179.917271 485.08718,184.828737 480.326926,187.127721 C476.394543,189.113208 471.634289,189.322206 466.667067,189.322206 L463.45907,189.322206 L463.666037,188.068215 C463.666037,188.068215 469.564613,162.152395 469.564613,162.256894 L469.771581,160.898403 L469.875064,159.853411 L472.255191,160.062409 C472.255191,160.062409 484.466278,161.107402 484.673245,161.107402 C489.433499,162.988389 491.503175,167.795356 490.054402,174.169811 Z M617.261369,182.835994 L616.536983,182 C607.740862,183.776488 606.085121,184.089985 598.013386,185.239478 L597.392483,185.866473 C597.392483,185.970972 597.288999,186.075472 597.288999,186.28447 L597.288999,186.179971 C591.28694,200.287373 591.390424,197.256894 586.526686,208.333817 C586.526686,207.811321 586.526686,207.497823 586.423202,206.975327 L585.181397,182.940493 L584.45701,182.104499 C575.14347,183.880987 574.936502,184.194485 566.450832,185.343977 L565.82993,185.970972 C565.726446,186.28447 565.726446,186.597968 565.726446,186.911466 L565.82993,187.015965 C566.864767,192.554427 566.6578,191.300435 567.692638,199.973875 C568.210057,204.258345 568.830959,208.542816 569.348378,212.722787 C570.176248,219.828737 570.693667,223.277213 571.728505,234.040639 C565.933413,243.654572 564.588124,247.312046 559,255.776488 L559.310451,256.612482 C567.692638,256.298984 569.555346,256.298984 575.764373,256.298984 L577.109662,254.731495 C581.766432,244.595065 617.364853,182.940493 617.364853,182.940493 L617.261369,182.835994 Z M314.543608,189.75837 C319.303862,186.414394 319.924765,181.816425 315.888897,179.412942 C311.85303,177.009459 304.712649,177.740954 299.952395,181.084931 C295.192141,184.324408 294.674722,188.922376 298.71059,191.430359 C302.642973,193.729343 309.783354,193.102347 314.543608,189.75837 Z" id="Shape" fill="#FEFEFE"></path> <path d="M575.734683,256.104499 L568.80127,268.121916 C566.628111,272.197388 562.488759,275.332366 556.072765,275.332366 L545,275.123367 L548.207997,264.255443 L550.381157,264.255443 C551.519478,264.255443 552.347349,264.150943 552.968251,263.837446 C553.589154,263.628447 553.899605,263.21045 554.417024,262.583454 L558.556375,256 L575.838167,256 L575.734683,256.104499 Z" id="Shape" fill="#FEFEFE"></path> </g> </g></svg>`;

        var cardnumber_mask = new IMask(document.getElementById('ccn'),{
            mask: [{
                mask: '0000 0000 0000 0000 000',
                regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
                cardtype: 'mastercard'
            }, {
                mask: '0000 0000 0000 0000 000',
                regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
                cardtype: 'maestro'
            }, {
                mask: '0000 0000 0000 0000 000',
                regex: '^4\\d{0,15}',
                cardtype: 'visa'
            }, {
                mask: '0000 0000 0000 0000 000',
                regex: '^62\\d{0,14}',
                cardtype: 'unionpay'
            }, {
                mask: '0000 0000 0000 0000 000',
                cardtype: 'Unknown'
            }],
            dispatch: function(appended, dynamicMasked) {
                var number = (dynamicMasked.value + appended).replace(/\D/g, '');

                for (var iterator = 0; iterator < dynamicMasked.compiledMasks.length; iterator++) {
                    if (dynamicMasked.compiledMasks[iterator].isComplete)
                        document.getElementById("ccn").classList.remove("not-valid");

                    let re = new RegExp(dynamicMasked.compiledMasks[iterator].regex);
                    if (number.match(re) != null)
                        return dynamicMasked.compiledMasks[iterator];
                }
            }
        });

        var expirationdate_mask = new IMask(document.getElementById('exp_month_year'),{
            mask: 'MM{/}YY',
            groups: {
                YY: new IMask.MaskedPattern.Group.Range([0, 99]),
                MM: new IMask.MaskedPattern.Group.Range([1, 12]),
            }
        });

        var securitycode_mask = new IMask(document.getElementById('cvc_code'),{
            mask: '000'
        });

        var cardholdername_mask = new IMask(document.getElementById('cardholder_name'),{
            mask: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
        });

        // CC NUMBER REAL-TIME CHECK
        cardnumber_mask.on("accept", function() {
            switch (cardnumber_mask.masked.currentMask.cardtype) {
            case 'american express':
                ccicon.innerHTML = amex;
                break;
            case 'visa':
                ccicon.innerHTML = visa;
                break;
            case 'maestro':
                ccicon.innerHTML = maestro;
                break;
            case 'mastercard':
                ccicon.innerHTML = mastercard;
                break;
            default:
                ccicon.innerHTML = '';
                break;
            }
        });

        cardnumber_mask.on("accept", function() {
            document.getElementById("ccn").classList.remove("not-valid");
            error_icon_ccn.style.display = 'none';
            //document.getElementById("ccn-validation").innerHTML = "";
        });

        // EXPIRY DATE REAL-TIME CHECK
        expirationdate_mask.on("accept", function() {
            if (expirationdate_mask.masked.isComplete) {
                var arrayOfStrings = expirationdate_mask.masked.value.split('/');
                document.getElementById("exp_month").value = arrayOfStrings[0];
                document.getElementById("exp_year").value = `${20}${arrayOfStrings[1]}`;

                let expmonth = document.getElementById("exp_month").value;
                let expyear = document.getElementById("exp_year").value;
                let expDate = new Date(expyear,expmonth);
                let dateNow = new Date();

                if (expDate.getYear() < dateNow.getYear() || (expDate.getYear() == dateNow.getYear() && expDate.getMonth() < dateNow.getMonth())) {
                    document.getElementById("exp_month_year").classList.add("not-valid");
                    document.getElementById("month-year-validation").innerHTML = "Expiry date is not valid.";
                } else {
                    document.getElementById("exp_month_year").classList.remove("not-valid");
                    error_icon_date.style.display = 'none';
                    document.getElementById("month-year-validation").innerHTML = "";
                }
            }
        });

        // CVV REAL-TIME CHECK
        securitycode_mask.on("accept", function() {
            if (securitycode_mask.masked.isComplete) {
                document.getElementById("cvc_code").classList.remove("not-valid");
                error_icon_cvv.style.display = 'none';
                document.getElementById("cvv-validation").innerHTML = "";
            }
        });

        // CARDHOLDER NAME REAL-TIME CHECK
        cardholdername_mask.on("accept", function() {
            document.getElementById("cardholder_name").classList.remove("not-valid");
            error_icon_cn.style.display = 'none';
            document.getElementById("name-validation").innerHTML = "";
        });
    } else {
        var exp_month_year = $('#exp_month_year');
        if (exp_month_year && exp_month_year.datepicker) {
            var options = {
                format: 'mm/yyyy',
                minViewMode: 1,
                autoclose: true,
            };

            exp_month_year.datepicker(options).on("changeDate", function(e) {
                //dateText comes in as MM/DD/YY
                var datePieces = exp_month_year.val().split('/');
                var month = datePieces[0];
                var year = datePieces[1];
                //define select option values for
                //corresponding element
                $('#exp_month').val(month);
                $('#exp_year').val(year);
                $('#exp_month_year').focus();
            });

            exp_month_year.datepicker('setStartDate', new Date());
        }
    }

    var tokenized = $('#tokenized_elem').attr('id');
    var tokenized_on_card = $('#tokenized_elem_cvc').attr('id');

    /*****************************************
	 * AUTO SUBMIT FORM
	 *****************************************/
    if (tokenized) {
        // Call submit function as soon as one of the form fields get unfocused.
        $("#ccn").blur(function() {
            $("#creditCardForm").submit();
        });
        $("#exp_month_year").blur(function() {
            $("#creditCardForm").submit();
        });
        $("#cvc_code").blur(function() {
            $("#creditCardForm").submit();
        });
        $("#cardholder_name").blur(function() {
            $("#creditCardForm").submit();
        });

        const elem_ccn = document.getElementById("ccn");
        const elem_date = document.getElementById("exp_month_year");
        const elem_cvc = document.getElementById("cvc_code");
        const elem_cn = document.getElementById("cardholder_name");

        $('#creditCardForm').on('submit', function(e) {
            // Stop the form from submitting itself to the server.
            // Check for form field mistakes.	
            //var checkElements = doPayment_new();

            // Abord if a field is invalid.
            //if (checkElements === false) {
            //return false;
            //}

            //var userLang = navigator.language || navigator.userLanguage; 
            //console.log("The language is: " + userLang);

            if (!isCCValid(elem_ccn, elem_date, elem_cvc, elem_cn, error_icon_cn, error_icon_ccn, error_icon_cvv, error_icon_date))
                return false;

            e.preventDefault();

            // Create data to attach to POST body.
            var data = "ccn=" + $('#ccn').val() + "&cvc_code=" + $('#cvc_code').val() + "&exp_year=" + $('#exp_year').val() + "&exp_month=" + $('#exp_month').val() + "&cardholder_name=" + $('#cardholder_name').val();

            $.ajax({
                type: "POST",
                url: $('#tokenized_url').val(),
                data: data,
                success: function(data) {}
            });
        });
    }

    if (tokenized_on_card) {
        // Call submit function as soon as one of the form fields get unfocused.
        $("#cvc_code").blur(function() {
            $("#creditCardForm").submit();
        });

        $('#creditCardForm').on('submit', function(e) {
            // Stop the form from submitting itself to the server.
            // Check for form field mistakes. 
            var checkElements = doPayment_tokenizedOnCard();

            // Abord if a field is invalid.
            if (checkElements === false) {
                return false;
            }
            e.preventDefault();

            // Create data to attach to POST body.
            var data = "cvc_code=" + $('#cvc_code').val();

            $.ajax({
                type: "POST",
                url: $('#tokenized_url').val(),
                data: data,
                success: function(data) {}
            });
        });
    }

    var transactionID = $('#transaction_id').val();
    var amount = $('#amount').val();
    var currency = $('#currency').val();
    var sessionID = $('#session_id').val();
    var pc21URL = $('#pc21_url').val();
    var convert = document.getElementById("convert");
    if (convert) {
        convert.addEventListener("click", function() {
            var ccn = document.getElementById("ccn").value;
            var post_value = "transaction_id=" + transactionID + "&amount=" + amount + "&currency=" + currency + "&ccn=" + ccn;
            $.ajax({
                type: "POST",
                url: pc21URL + "/" + sessionID + "/pfs/dcc",
                data: post_value,
                error: function(xhr, ajaxOptions, thrownError) {
                    alert("Error requesting currency convertion ");
                },
                success: function(msg) {
                    $('#convertedAmount').html('<br/><font><b>' + msg + '</b></font>');
                }
            });
        });
    }
});
