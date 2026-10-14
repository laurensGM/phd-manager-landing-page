// PhD Manager landing page scripts
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var messageField = form.querySelector('[name="message"]');
  var subjectField = form.querySelector('[name="_subject"]');

  document.querySelectorAll('[data-subject], [data-message]').forEach(function (link) {
    link.addEventListener('click', function () {
      var subject = link.getAttribute('data-subject');
      var message = link.getAttribute('data-message');
      if (subject && subjectField) subjectField.value = subject;
      if (message && messageField && !messageField.value.trim()) {
        messageField.value = message;
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var loading = form.querySelector('.form-status--loading');
    var errorEl = form.querySelector('.form-status--error');
    var sentEl = form.querySelector('.form-status--sent');
    var submit = form.querySelector('[type="submit"]');

    loading.hidden = false;
    errorEl.hidden = true;
    sentEl.hidden = true;
    submit.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(function (response) {
        if (response.ok) return null;
        return response.json().then(function (data) {
          var details = data && data.errors && data.errors.map(function (item) {
            return item.message;
          }).filter(Boolean).join(' ');
          throw new Error((data && data.error) || details || 'Something went wrong. Please try again.');
        }, function () {
          throw new Error('Something went wrong. Please try again.');
        });
      })
      .then(function () {
        sentEl.hidden = false;
        form.reset();
        if (subjectField) subjectField.value = 'PhD Manager early access';
      })
      .catch(function (err) {
        errorEl.textContent = err.message || 'Something went wrong. Please try again.';
        errorEl.hidden = false;
      })
      .finally(function () {
        loading.hidden = true;
        submit.disabled = false;
      });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
