/**
 * Contact form: client-side validation with accessible inline errors.
 * Bilingual — strings are picked from `document.documentElement.lang`
 * ("bg" primary, "en" fallback) so the same bundle serves both pages.
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

interface Strings {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: string;
  subject: string;
  fName: string;
  fEmail: string;
  fPhone: string;
  success: (email: string, phone: string) => string;
}

const COPY: Record<"bg" | "en", Strings> = {
  bg: {
    name: "Моля, въведете вашето име и фамилия.",
    email: "Моля, въведете валиден имейл адрес.",
    phone: "Моля, въведете валиден телефонен номер.",
    message: "Моля, напишете кратко съобщение.",
    consent: "Моля, приемете Политиката за поверителност, за да продължите.",
    subject: "Запитване за оферта — вили SJ Build",
    fName: "Име",
    fEmail: "Имейл",
    fPhone: "Телефон",
    success: (email, phone) =>
      `Вашето имейл приложение трябва вече да е отворено със съобщението — просто натиснете „изпрати“. ` +
      `Ако не се е отворило, пишете на ${email} или се обадете на ${phone}.`,
  },
  en: {
    name: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    message: "Please write a short message.",
    consent: "Please accept the Privacy Policy to continue.",
    subject: "Quote request — SJ Build villas",
    fName: "Name",
    fEmail: "Email",
    fPhone: "Phone",
    success: (email, phone) =>
      `Your email app should now be open with your message — just press send. ` +
      `If it didn't open, write to ${email} or call ${phone}.`,
  },
};

interface Field {
  input: HTMLInputElement | HTMLTextAreaElement;
  error: HTMLElement;
  validate: (value: string) => string | null;
}

export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const t = document.documentElement.lang === "en" ? COPY.en : COPY.bg;
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

  register("name", (v) => (v.trim().length > 1 ? null : t.name));
  register("email", (v) => (EMAIL_RE.test(v.trim()) ? null : t.email));
  register("phone", (v) => (PHONE_RE.test(v.trim()) ? null : t.phone));
  register("message", (v) => (v.trim() ? null : t.message));

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
      consentError.textContent = ok ? "" : t.consent;
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

    const subject = encodeURIComponent(t.subject);
    const body = encodeURIComponent(
      `${t.fName}: ${payload.name}\n${t.fEmail}: ${payload.email}\n${t.fPhone}: ${payload.phone}\n\n${payload.message}`,
    );
    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = t.success(SALES_EMAIL, SALES_PHONE);
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
