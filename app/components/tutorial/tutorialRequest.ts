let tutorialRequestedAfterRegistration = false;

export function requestTutorialAfterRegistration() {
  tutorialRequestedAfterRegistration = true;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("tutorial_auto_open", "1");
    } catch (e) {
      // ignore storage errors
    }
    try {
      window.dispatchEvent(new CustomEvent('tutorialRequested'));
    } catch (e) {
      // ignore dispatch errors in older browsers
    }
  }
}

export function consumeTutorialAfterRegistration() {
  let requested = tutorialRequestedAfterRegistration;

  if (!requested && typeof window !== "undefined") {
    try {
      requested = sessionStorage.getItem("tutorial_auto_open") === "1";
    } catch (e) {
      // ignore storage errors
    }
  }

  // clear both sources
  tutorialRequestedAfterRegistration = false;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("tutorial_auto_open");
    } catch (e) {
      // ignore
    }
  }

  return requested;
}