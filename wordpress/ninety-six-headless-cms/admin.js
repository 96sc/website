/* global document, Event, window */

(function () {
  function closestImageField(element) {
    return element ? element.closest(".n96-image-field") : null;
  }

  function setImageValue(field, value) {
    const input = field.querySelector(".n96-image-url");
    const preview = field.querySelector(".n96-image-preview");
    const clearButton = field.querySelector(".n96-image-clear");

    if (input) {
      input.value = value;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (preview) {
      preview.src = value;
      preview.hidden = value === "";
    }

    if (clearButton) {
      clearButton.hidden = value === "";
    }
  }

  document.addEventListener("click", function (event) {
    const selectButton = event.target.closest(".n96-image-select");
    const clearButton = event.target.closest(".n96-image-clear");

    if (selectButton) {
      event.preventDefault();

      const field = closestImageField(selectButton);

      if (!field || !window.wp || !window.wp.media) {
        return;
      }

      const frame = window.wp.media({
        title: "Choose image",
        button: {
          text: "Use this image"
        },
        multiple: false
      });

      frame.on("select", function () {
        const attachment = frame.state().get("selection").first().toJSON();
        const size = attachment.sizes && (attachment.sizes.large || attachment.sizes.medium);
        setImageValue(field, (size && size.url) || attachment.url || "");
      });

      frame.open();
    }

    if (clearButton) {
      event.preventDefault();
      const field = closestImageField(clearButton);

      if (field) {
        setImageValue(field, "");
      }
    }
  });
})();
