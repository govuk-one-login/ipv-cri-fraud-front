window.onload = function() {
  document.getElementById("continue").addEventListener("click", function() {
    var button = this;
      button.classList.add('processing-spinner')
      button.setAttribute("disabled","disabled");
      button.setAttribute("role","alert");
      button.setAttribute("aria-busy","alert");
      button.setAttribute("aria-live","assertive");
      button.setAttribute("aria-label","loading");

      document.getElementsByTagName("form")[0].submit();
  })
}
