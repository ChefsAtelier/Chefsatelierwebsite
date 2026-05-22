(function () {
  var form = document.getElementById("callback-form");
  var status = document.getElementById("callback-status");
  var submitBtn = document.getElementById("callback-submit");
  var phoneInput = document.getElementById("phone");
  var naamInput = document.getElementById("naam");
  var dateInput = document.getElementById("gewenste-datum");
  var datePicker = document.getElementById("gewenste-datum-picker");
  var guestsInput = document.getElementById("aantal-personen");
  var emailInput = document.getElementById("email");
  var dateOpenBtn = document.getElementById("gewenste-datum-open");
  if (!form || !status || !submitBtn) return;

  var fieldInputs = [naamInput, dateInput, guestsInput, phoneInput, emailInput].filter(Boolean);

  function clearFieldError(el) {
    if (!el) return;
    el.classList.remove("border-red-400/60", "focus:border-red-400");
    el.setAttribute("aria-invalid", "false");
  }

  function setFieldError(el) {
    if (!el) return;
    el.classList.add("border-red-400/60", "focus:border-red-400");
    el.setAttribute("aria-invalid", "true");
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.classList.remove("hidden");
    status.dataset.kind = kind || "";
    status.classList.toggle("border-secondary/40", kind === "success");
    status.classList.toggle("bg-secondary/10", kind === "success");
    status.classList.toggle("border-red-400/40", kind === "error");
    status.classList.toggle("bg-red-500/10", kind === "error");
  }

  function formatDutchDate(date) {
    var d = String(date.getDate()).padStart(2, "0");
    var m = String(date.getMonth() + 1).padStart(2, "0");
    return d + "-" + m + "-" + date.getFullYear();
  }

  function parseDutchDate(value) {
    var raw = (value || "").trim();
    if (!raw) return null;

    var iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      var y = parseInt(iso[1], 10);
      var mo = parseInt(iso[2], 10) - 1;
      var d = parseInt(iso[3], 10);
      var dtIso = new Date(y, mo, d);
      if (dtIso.getFullYear() === y && dtIso.getMonth() === mo && dtIso.getDate() === d) return dtIso;
      return null;
    }

    var m = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (!m) return null;
    var day = parseInt(m[1], 10);
    var month = parseInt(m[2], 10) - 1;
    var year = parseInt(m[3], 10);
    var dt = new Date(year, month, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== month || dt.getDate() !== day) return null;
    return dt;
  }

  function normalizePhone(input) {
    var raw = (input || "").trim();
    if (!raw) return "";
    if (raw.indexOf("00") === 0) raw = "+" + raw.slice(2);
    var plus = raw.indexOf("+") === 0 ? "+" : "";
    var digits = raw.replace(/[^\d]/g, "");
    return plus ? "+" + digits : digits;
  }

  function isValidPhone(normalized) {
    if (!normalized) return false;
    if (normalized.indexOf("+") === 0) {
      var d = normalized.slice(1);
      return /^\d{8,15}$/.test(d);
    }
    if (/^0\d{8,9}$/.test(normalized)) return true;
    return /^\d{9,15}$/.test(normalized);
  }

  function validatePhone(showError) {
    if (!phoneInput) return true;
    var normalized = normalizePhone(phoneInput.value);
    var ok = isValidPhone(normalized);
    if (ok) clearFieldError(phoneInput);
    else setFieldError(phoneInput);
    if (!ok && showError) {
      setStatus("Vul een geldig telefoonnummer in (NL of Europees, bijv. +31… of 06…).", "error");
    }
    return ok;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
  }

  function validateForm() {
    var firstInvalid = null;
    var message = "";
    var guestsRaw = "";

    fieldInputs.forEach(clearFieldError);

    if (!naamInput || !naamInput.value.trim()) {
      message = "Vul je naam in.";
      setFieldError(naamInput);
      firstInvalid = firstInvalid || naamInput;
    }

    if (!dateInput || !parseDutchDate(dateInput.value)) {
      message = message || "Vul een geldige datum in (dd-mm-jjjj).";
      setFieldError(dateInput);
      firstInvalid = firstInvalid || dateInput;
    }

    guestsRaw = guestsInput ? guestsInput.value.replace(/\D/g, "") : "";
    var guests = parseInt(guestsRaw, 10);
    if (!guestsInput || !guestsRaw || !Number.isFinite(guests) || guests < 1) {
      message = message || "Vul een geldig aantal personen in.";
      setFieldError(guestsInput);
      firstInvalid = firstInvalid || guestsInput;
    }

    if (!validatePhone(false)) {
      message = message || "Vul een geldig telefoonnummer in (NL of Europees, bijv. +31… of 06…).";
      firstInvalid = firstInvalid || phoneInput;
    }

    if (!emailInput || !isValidEmail(emailInput.value)) {
      message = message || "Vul een geldig mailadres in.";
      setFieldError(emailInput);
      firstInvalid = firstInvalid || emailInput;
    }

    if (firstInvalid) {
      setStatus(message, "error");
      firstInvalid.focus();
      return false;
    }

    if (dateInput && parseDutchDate(dateInput.value)) {
      dateInput.value = formatDutchDate(parseDutchDate(dateInput.value));
    }

    if (phoneInput) {
      phoneInput.value = normalizePhone(phoneInput.value);
    }

    if (guestsInput && guestsRaw) {
      guestsInput.value = String(guests);
    }

    return true;
  }

  function openDatePicker() {
    if (!datePicker) return;
    datePicker.classList.remove("pointer-events-none");
    if (typeof datePicker.showPicker === "function") {
      datePicker.showPicker();
    } else {
      datePicker.click();
    }
    datePicker.classList.add("pointer-events-none");
  }

  if (datePicker && dateInput) {
    datePicker.addEventListener("change", function () {
      if (!datePicker.value) return;
      var parts = datePicker.value.split("-");
      dateInput.value = parts[2] + "-" + parts[1] + "-" + parts[0];
      clearFieldError(dateInput);
    });

    dateInput.addEventListener("blur", function () {
      var parsed = parseDutchDate(dateInput.value);
      if (!parsed) {
        datePicker.value = "";
        return;
      }
      var y = parsed.getFullYear();
      var mo = String(parsed.getMonth() + 1).padStart(2, "0");
      var d = String(parsed.getDate()).padStart(2, "0");
      datePicker.value = y + "-" + mo + "-" + d;
    });
  }

  if (dateOpenBtn) {
    dateOpenBtn.addEventListener("click", openDatePicker);
  }

  if (guestsInput) {
    guestsInput.addEventListener("input", function () {
      guestsInput.value = guestsInput.value.replace(/\D/g, "");
    });
  }

  fieldInputs.forEach(function (el) {
    el.addEventListener("input", function () {
      if (status.dataset.kind === "error") {
        clearFieldError(el);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.classList.add("hidden");

    if (!validateForm()) return;

    submitBtn.disabled = true;
    var prevText = submitBtn.textContent;
    submitBtn.textContent = "Versturen…";

    var formData = new FormData(form);

    var succeeded = false;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          succeeded = true;
          setStatus("Bedankt! We hebben je aanvraag ontvangen en nemen binnen 24 uur contact met je op.", "success");
          var fields = document.getElementById("callback-fields");
          if (fields) fields.classList.add("hidden");
          submitBtn.disabled = true;
          form.reset();
        } else {
          setStatus("Oeps, het verzenden ging niet goed. Probeer het nog eens of stuur ons een bericht.", "error");
        }
      })
      .catch(function () {
        setStatus("Oeps, het verzenden ging niet goed. Probeer het nog eens of stuur ons een bericht.", "error");
      })
      .finally(function () {
        if (!succeeded) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevText;
        }
      });
  });
})();
