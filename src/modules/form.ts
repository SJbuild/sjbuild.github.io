/**
 * Contact form: client-side validation with accessible inline errors.
 *
 * TODO(backend): there is no server endpoint yet. On valid submit the payload
 * is logged and a prefilled mailto: compose to sales@sjbuild.bg is opened —
 * the success message deliberately does not claim server delivery. Upgrade
 * path: POST the payload to an endpoint (own API / Formspree / Netlify Forms)
 * and replace the mailto branch.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()/-]{6,15}$/;
const SALES_EMAIL = "sales@sjbuild.bg";
const SALES_PHONE = "+359 897 700 770";

interface Field {
  input: HTMLInputElement | HTMLTextAreaElement;
  error: HTMLElement;
  validate: (value: string) => string | null;
}

export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const honeypot = form.querySelector<HTMLInputElement>('input[name="website"]');
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"]');
  const consentError = form.querySelector<HTMLElement>("#err-consent");
  let attempted = false;

  const fields: Field[] = [];
  const register = (name: string, validate: Field["validate"]): void => {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    const error = form.querySelector<HTMLElement>(`#err-${name}`);
    if (input && error) fields.push({ input, error, validate });
  };

  register("name", (v) => (v.trim().length > 1 ? null : "Please enter your full name."));
  register("email", (v) => (EMAIL_RE.test(v.trim()) ? null : "Please enter a valid email address."));
  register("phone", (v) => (PHONE_RE.test(v.trim()) ? null : "Please enter a valid phone number."));
  register("message", (v) => (v.trim() ? null : "Please write a short message."));

  const setError = (field: Field, message: string | null): void => {
    field.error.textContent = message ?? "";
    field.error.classList.toggle("hidden", !message);
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
  };

  const validateField = (field: Field): boolean => {
    const message = field.validate(field.input.value);
    setError(field, message);
    return !message;
  };

  const validateConsent = (): boolean => {
    const ok = consent?.checked ?? false;
    if (consentError) {
      consentError.textContent = ok ? "" : "Please accept the Privacy Policy to continue.";
      consentError.classList.toggle("hidden", ok);
    }
    consent?.setAttribute("aria-invalid", String(!ok));
    return ok;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    attempted = true;
    if (honeypot?.value) return; // silently drop bot submissions

    let firstInvalid: HTMLElement | null = null;
    for (const field of fields) {
      if (!validateField(field)) firstInvalid ??= field.input;
    }
    if (!validateConsent()) firstInvalid ??= consent ?? null;
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const value = (name: string): string =>
      form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)?.value.trim() ?? "";
    const payload = {
      name: value("name"),
      email: value("email"),
      phone: `+359 ${value("phone")}`,
      message: value("message"),
    };
    console.table(payload);

    const subject = encodeURIComponent("Quote request — SJ Build villas");
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\n${payload.message}`,
    );
    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent =
        `Your email app should now be open with your message — just press send. ` +
        `If it didn't open, write to ${SALES_EMAIL} or call ${SALES_PHONE}.`;
      status.classList.remove("hidden");
    }
  });

  for (const field of fields) {
    field.input.addEventListener("blur", () => {
      if (attempted) validateField(field);
    });
  }
  consent?.addEventListener("change", () => {
    if (attempted) validateConsent();
  });
}
