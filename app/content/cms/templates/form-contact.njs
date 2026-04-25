<h2>{{ t('contactForm') }}</h2>
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
            placeholder="{{ t('name') }}"
            required
        />
        <div class="invalid-feedback">
          {{ t('fieldRequired') }}
        </div>
        <label for="contactName">{{ t('name') }}</label>
      </div>
    </div>
    
    <div class="col-12 col-md-6 mb-3">
      <div class="form-floating h-100">
        <input
            type="email"
            class="form-control"
            id="contactEmail"
            name="email"
            placeholder="{{ t('yourEmail') }}"
            required
        />
        <label for="contactEmail" class="form-label">{{ t('yourEmail') }}</label>
        <div class="invalid-feedback">
          {{ t('emailRequired') }}
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
        placeholder="{{ t('subject') }}"
        required
    />
    <label for="contactSubject" class="form-label">{{ t('subject') }}</label>
    <div class="invalid-feedback">
      {{ t('fieldRequired') }}
    </div>
  </div>
  
  <div class="form-floating mb-3">
    <textarea
        class="form-control"
        id="contactContent"
        name="content"
        rows="4"
        placeholder="{{ t('content') }}"
        required
    ></textarea>
    <label for="contactContent" class="form-label">{{ t('content') }}</label>
    <div class="invalid-feedback">
      {{ t('fieldRequired') }}
    </div>
  </div>
  
  <button id="contactSubmitBtn"
          type="submit"
          class="btn btn-success"
          disabled
  >{{ t('send') }}</button>
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
        <h5 class="modal-title" id="contactModalOkLabel">{{ t('messageSent') }}</h5>
        <h5 class="modal-title d-none" id="contactModalErrorLabel">{{ t('messageError') }}</h5>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
        ></button>
      </div>
      <div id="contactModalOkBody" class="modal-body">
        {{ t('messageThanks') }}
      </div>
      <div id="contactModalErrorBody" class="modal-body d-none">
        {{ t('messageSorry') }}
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
