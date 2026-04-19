/**
 * Online Examination Form Processor — client-side regex validation.
 * Modular checks map each field to a regular language (see theory.html / docs/theory.txt).
 */

/** @typedef {'fullName'|'dob'|'examCode'|'hallTicket'|'subjectCode'|'document'} FieldKey */

/**
 * Compiled regular expressions (one comment per pattern).
 */
const PATTERNS = {
  // Full name: letters and spaces only; total length between 2 and 30 inclusive.
  fullName: /^[A-Za-z ]{2,30}$/,

  // Date of birth: DD/MM/YYYY with leading zeros; day 01–31, month 01–12, year any four digits.
  dob: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,

  // Exam code: exactly two uppercase letters immediately followed by three decimal digits.
  examCode: /^[A-Z]{2}\d{3}$/,

  // Hall ticket: three uppercase letters concatenated with five decimal digits.
  hallTicket: /^[A-Z]{3}\d{5}$/,

  // Subject code: two or three uppercase letters followed by exactly three digits.
  subjectCode: /^[A-Z]{2,3}\d{3}$/,

  // Uploaded filename: non-empty basename, literal dot, extension pdf|jpg|png (case-insensitive via flag).
  fileName: /^.+\.(pdf|jpg|png)$/i,
};

/** @type {Record<FieldKey, { inputId: string; errorId: string; emptyMsg: string; invalidMsg: string }>} */
const FIELD_META = {
  fullName: {
    inputId: "fullName",
    errorId: "fullName-error",
    emptyMsg: "Please enter your full name.",
    invalidMsg: "Use only letters and spaces, between 2 and 30 characters.",
  },
  dob: {
    inputId: "dob",
    errorId: "dob-error",
    emptyMsg: "Please enter your date of birth.",
    invalidMsg: "Use DD/MM/YYYY with leading zeros and valid day/month ranges.",
  },
  examCode: {
    inputId: "examCode",
    errorId: "examCode-error",
    emptyMsg: "Please enter the exam code.",
    invalidMsg: "Use two uppercase letters followed by three digits (e.g. CS101).",
  },
  hallTicket: {
    inputId: "hallTicket",
    errorId: "hallTicket-error",
    emptyMsg: "Please enter your hall ticket number.",
    invalidMsg: "Use three uppercase letters followed by five digits (e.g. ABC12345).",
  },
  subjectCode: {
    inputId: "subjectCode",
    errorId: "subjectCode-error",
    emptyMsg: "Please enter the subject code.",
    invalidMsg: "Use two or three uppercase letters followed by three digits.",
  },
  document: {
    inputId: "document",
    errorId: "document-error",
    emptyMsg: "Please choose a PDF, JPG, or PNG file.",
    invalidMsg: "Filename must end with .pdf, .jpg, or .png",
  },
};

const NAME_MAX = 30;

/**
 * @param {FieldKey} key
 * @param {string} rawValue
 * @returns {{ ok: boolean; empty: boolean }}
 */
function validateTextField(key, rawValue) {
  const value = rawValue.trim();
  if (!value) return { ok: false, empty: true };

  switch (key) {
    case "fullName":
      return { ok: PATTERNS.fullName.test(value), empty: false };
    case "dob":
      return { ok: PATTERNS.dob.test(value), empty: false };
    case "examCode":
      return { ok: PATTERNS.examCode.test(value), empty: false };
    case "hallTicket":
      return { ok: PATTERNS.hallTicket.test(value), empty: false };
    case "subjectCode":
      return { ok: PATTERNS.subjectCode.test(value), empty: false };
    default:
      return { ok: false, empty: true };
  }
}

/**
 * @param {FileList|null} files
 * @returns {{ ok: boolean; empty: boolean }}
 */
function validateFileField(files) {
  const file = files && files[0];
  if (!file) return { ok: false, empty: true };
  return { ok: PATTERNS.fileName.test(file.name), empty: false };
}

/**
 * @param {HTMLElement} el
 * @param {boolean} show
 * @param {string} message
 */
function setError(el, show, message) {
  if (!(el instanceof HTMLElement)) return;
  el.hidden = !show;
  el.textContent = show ? message : "";
}

/**
 * @param {HTMLInputElement} input
 * @param {'unset'|'valid'|'invalid'} state
 */
function setVisualState(input, state) {
  input.classList.remove("is-valid", "is-invalid");
  if (state === "valid") input.classList.add("is-valid");
  if (state === "invalid") input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", state === "invalid" ? "true" : "false");
}

/**
 * @param {FieldKey} key
 * @param {{ touched: boolean; forceShow: boolean }} opts
 * @returns {boolean}
 */
function validateAndRenderField(key, opts) {
  const meta = FIELD_META[key];
  const input = /** @type {HTMLInputElement|null} */ (document.getElementById(meta.inputId));
  const errorEl = document.getElementById(meta.errorId);
  if (!input || !errorEl) return false;

  const { touched, forceShow } = opts;

  if (key === "document") {
    const result = validateFileField(input.files);
    if (result.empty) {
      setVisualState(input, forceShow ? "invalid" : "unset");
      setError(errorEl, forceShow || touched, meta.emptyMsg);
      return false;
    }
    if (!result.ok) {
      setVisualState(input, "invalid");
      setError(errorEl, true, meta.invalidMsg);
      return false;
    }
    setVisualState(input, "valid");
    setError(errorEl, false, "");
    return true;
  }

  const result = validateTextField(key, input.value);
  if (result.empty) {
    setVisualState(input, forceShow ? "invalid" : "unset");
    setError(errorEl, forceShow || touched, meta.emptyMsg);
    return false;
  }
  if (!result.ok) {
    setVisualState(input, "invalid");
    setError(errorEl, true, meta.invalidMsg);
    return false;
  }
  setVisualState(input, "valid");
  setError(errorEl, false, "");
  return true;
}

/**
 * @returns {boolean}
 */
function isFormFullyValid() {
  /** @type {FieldKey[]} */
  const keys = ["fullName", "dob", "examCode", "hallTicket", "subjectCode", "document"];
  return keys.every((k) => {
    const meta = FIELD_META[k];
    const input = /** @type {HTMLInputElement|null} */ (document.getElementById(meta.inputId));
    if (!input) return false;
    if (k === "document") return validateFileField(input.files).ok;
    const r = validateTextField(k, input.value);
    return r.ok && !r.empty;
  });
}

function updateSubmitButton() {
  const btn = document.getElementById("submit-btn");
  if (btn instanceof HTMLButtonElement) btn.disabled = !isFormFullyValid();
}

function updateNameCounter() {
  const input = document.getElementById("fullName");
  const out = document.getElementById("name-count");
  if (input instanceof HTMLInputElement && out) {
    out.textContent = String(Math.min(input.value.length, NAME_MAX));
  }
}

function updateFilePreview() {
  const input = document.getElementById("document");
  const preview = document.getElementById("document-preview");
  if (!(input instanceof HTMLInputElement) || !preview) return;
  const file = input.files && input.files[0];
  preview.textContent = file ? `Selected: ${file.name}` : "";
}

/**
 * @param {FieldKey} key
 */
function wireField(key) {
  const meta = FIELD_META[key];
  const input = document.getElementById(meta.inputId);
  if (!(input instanceof HTMLInputElement)) return;

  const run = () => {
    validateAndRenderField(key, { touched: true, forceShow: false });
    updateSubmitButton();
    if (key === "document") updateFilePreview();
  };

  input.addEventListener("blur", run);

  if (key === "document") {
    input.addEventListener("change", run);
  } else {
    input.addEventListener("input", () => {
      if (key === "fullName") updateNameCounter();
      run();
    });
  }
}

function init() {
  const form = document.getElementById("exam-form");
  const success = document.getElementById("form-success");
  const resetBtn = document.getElementById("reset-btn");

  /** @type {FieldKey[]} */
  const keys = ["fullName", "dob", "examCode", "hallTicket", "subjectCode", "document"];
  keys.forEach(wireField);

  updateNameCounter();
  updateSubmitButton();

  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let allOk = true;
      keys.forEach((k) => {
        if (!validateAndRenderField(k, { touched: true, forceShow: true })) allOk = false;
      });
      updateSubmitButton();
      if (success instanceof HTMLElement) {
        success.hidden = !allOk;
      }
      if (allOk) success?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (resetBtn instanceof HTMLButtonElement) {
    resetBtn.addEventListener("click", () => {
      window.requestAnimationFrame(() => {
        keys.forEach((k) => {
          const meta = FIELD_META[k];
          const input = document.getElementById(meta.inputId);
          const err = document.getElementById(meta.errorId);
          if (input instanceof HTMLInputElement) setVisualState(input, "unset");
          if (err) setError(err, false, "");
        });
        updateNameCounter();
        updateFilePreview();
        if (success) success.hidden = true;
        updateSubmitButton();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
