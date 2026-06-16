const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()/-]{6,15}$/;
const SALES_EMAIL = "sgbuildbg@gmail.com";
const FORM_ENDPOINT = "https://api.web3forms.com/submit";

interface Strings {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: string;
  sending: string;
  success: string;
  error: (email: string) => string;
}

const COPY: Record<"bg" | "en", Strings> = {
  bg: {
    name: "Моля, въведете вашето име и фамилия.",
    email: "Моля, въведете валиден имейл адрес.",
    phone: "Моля, въведете валиден телефонен номер.",
    message: "Моля, напишете кратко съобщение.",
    consent: "Моля, приемете Политиката за поверителност, за да продължите.",
    sending: "Изпращане…",
    success:
      "Вашето запитване беше изпратено успешно. Ще се свържем с Вас в рамките на 1 работен ден.",
    error: (email) =>
      `Нещо се обърка при изпращането. Моля, пишете ни директно на ${email}.`,
  },
  en: {
    name: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    message: "Please write a short message.",
    consent: "Please accept the Privacy Policy to continue.",
    sending: "Sending…",
    success:
      "Your enquiry has been sent successfully. We'll get back to you within 1 working day.",
    error: (email) =>
      `Something went wrong. Please write to us directly at ${email}.`,
  },
};

interface Field {
  input: HTMLInputElement | HTMLTextAreaElement;
  error: HTMLElement;
  validate: (value: string) => string | null;
}

export function initForm(): void {
  const formEl = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!formEl) return;
  const form: HTMLFormElement = formEl;

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

    void submit();
  });

  async function submit(): Promise<void> {
    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const originalLabel = btn?.textContent ?? "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = t.sending;
    }

    try {
      const data = new FormData(form);
      // Prefix phone with country code before sending
      const phone = data.get("phone");
      if (typeof phone === "string") data.set("phone", `+359 ${phone}`);

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) { showError(); return; }
      const raw: unknown = await res.json();
      const success =
        typeof raw === "object" && raw !== null &&
        (raw as Record<string, unknown>)["success"] === true;

      if (success) {
        if (status) {
          status.textContent = t.success;
          status.classList.remove("hidden");
        }
        form.reset();
      } else {
        showError();
      }
    } catch {
      showError();
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    }
  }

  function showError(): void {
    if (status) {
      status.textContent = t.error(SALES_EMAIL);
      status.classList.remove("hidden");
    }
  }

  for (const field of fields) {
    field.input.addEventListener("blur", () => {
      if (attempted) validateField(field);
    });
  }
  consent?.addEventListener("change", () => {
    if (attempted) validateConsent();
  });

}
