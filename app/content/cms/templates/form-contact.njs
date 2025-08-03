<h2>{{ translations.contactForm }}</h2>
<form
    id="contact-form"
    class="needs-validation"
    novalidate
    hx-post="/contact"
    hx-swap="none"
>
  
  <div class="row gx-3">
    <div class="col-12 col-md-6 mb-3">
      <div class="d-none">
        <input id="honeypot" type="text" name="catcher">
        <label for="honeypot">Come to daddy</label>
      </div>
      <div class="form-floating h-100">
        <input
            type="text"
            class="form-control"
            id="contactName"
            name="name"
            placeholder="{{ translations.name }}"
            required
        />
        <div class="invalid-feedback">
          {{ translations.fieldRequired }}
        </div>
        <label for="contactName">{{ translations.name }}</label>
      </div>
    </div>
    
    <div class="col-12 col-md-6 mb-3">
      <div class="form-floating h-100">
        <input
            type="email"
            class="form-control"
            id="contactEmail"
            name="email"
            placeholder="{{ translations.yourEmail }}"
            required
        />
        <label for="contactEmail" class="form-label">{{ translations.yourEmail }}</label>
        <div class="invalid-feedback">
          {{ translations.emailRequired }}
        </div>
      </div>
    </div>
  </div>
  
  <div class="form-floating mb-3">
    <input
        type="text"
        class="form-control"
        id="contactSubject"
        name="title"
        placeholder="{{ translations.subject }}"
        required
    />
    <label for="contactSubject" class="form-label">{{ translations.subject }}</label>
    <div class="invalid-feedback">
      {{ translations.fieldRequired }}
    </div>
  </div>
  
  <div class="form-floating mb-3">
    <textarea
        class="form-control"
        id="contactContent"
        name="content"
        rows="4"
        placeholder="{{ translations.content }}"
        required
    ></textarea>
    <label for="contactContent" class="form-label">{{ translations.content }}</label>
    <div class="invalid-feedback">
      {{ translations.fieldRequired }}
    </div>
  </div>
  
  <button id="contactSubmitBtn"
          type="submit"
          class="btn btn-success"
          disabled
  >{{ translations.send }}</button>
</form>

<div
    class="modal fade"
    id="contactModal"
    tabindex="-1"
    aria-labelledby="contactModalLabel"
    aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="contactModalOkLabel">{{ translations.messageSent }}</h5>
        <h5 class="modal-title d-none" id="contactModalErrorLabel">{{ translations.messageError }}</h5>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
        ></button>
      </div>
      <div id="contactModalOkBody" class="modal-body">
        {{ translations.messageThanks }}
      </div>
      <div id="contactModalErrorBody" class="modal-body d-none">
        {{ translations.messageSorry }}
      </div>
      <div class="modal-footer">
        <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
        >
          Ok
        </button>
      </div>
    </div>
  </div>
</div>

{% block javascripts %}
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const inputs    = form.querySelectorAll('.form-control');

    function toggleSubmit() {
      submitBtn.disabled = !form.checkValidity();
    }

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
        toggleSubmit();
      });
      input.addEventListener('input', () => {
        if (['is-valid', 'is-invalid'].includes(input.classList)) {
          if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
          }
        }
        toggleSubmit();
      });
    });

    form.addEventListener('change', toggleSubmit);
    toggleSubmit();
  });
  
  document.body.addEventListener('htmx:afterRequest', function (evt) {
    if (evt.target.id !== 'contact-form') return;
    
    const modalEl = document.getElementById('contactModal');
    const modalTitleOkEl = document.getElementById('contactModalOkLabel');
    const modalTitleErrorEl = document.getElementById('contactModalErrorLabel');
    const modalBodyOkEl = document.getElementById('contactModalOkBody');
    const modalBodyErrorEl = document.getElementById('contactModalErrorBody');
    const bsModal = new bootstrap.Modal(modalEl);
    const status = evt.detail.xhr.status;
    if (status >= 200 && status < 300) {
      modalEl.addEventListener('hidden.bs.modal', function () {
        const form = document.forms.namedItem('contact-form');
        form.reset();
        form.classList.remove('was-validated');
      }, { once: true });

      modalTitleOkEl.classList.remove('d-none');
      modalTitleErrorEl.classList.add('d-none');
      modalBodyOkEl.classList.remove('d-none');
      modalBodyErrorEl.classList.add('d-none');
    } else {
      modalTitleOkEl.classList.add('d-none');
      modalTitleErrorEl.classList.remove('d-none');
      modalBodyOkEl.classList.add('d-none');
      modalBodyErrorEl.classList.remove('d-none');
    }
    bsModal.show();
  });
</script>
{% endblock %}