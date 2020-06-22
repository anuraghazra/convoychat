const initOAuthWindow = (onSuccess: Function) => () => {
  const isDev: boolean = process.env.NODE_ENV === "development";
  const url: string = isDev ? "localhost:4000" : window.location.host;

  const consentURL = `${window.location.protocol}//${url}/auth/login`;

  window.open(consentURL, "__blank", "width=500&height=800");
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data === "success") {
      onSuccess();
    }
  });
};

const formatDate = (date: string): string => {
  return new Date(Number(date))
    .toDateString()
    .slice(4, 10)
    .toLowerCase();
}

// https://github.com/withspectrum/spectrum/blob/alpha/admin/src/helpers/utils.js
const timeAgo = (time: string): string | number => {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * 1000;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_YEAR = MS_PER_DAY * 365;

  let current: any = new Date();
  let previous: any = new Date(time);
  let elapsed = current - previous

  if (elapsed < MS_PER_MINUTE) {
    return Math.round(elapsed / MS_PER_SECOND) + 's ago';
  } else if (elapsed < MS_PER_HOUR) {
    return Math.round(elapsed / MS_PER_MINUTE) + 'm ago';
  } else if (elapsed < MS_PER_DAY) {
    return Math.round(elapsed / MS_PER_HOUR) + 'h ago';
  } else if (elapsed < MS_PER_YEAR) {
    return Math.round(elapsed / MS_PER_DAY) + 'd ago';
  } else {
    return Math.round(elapsed / MS_PER_YEAR) + 'y ago';
  }
}

const scrollToBottom = (elm: HTMLElement) => {
  if (!elm || !(elm instanceof HTMLElement)) return;
  elm.scrollTop = elm.scrollTop = elm.scrollHeight - elm.clientHeight;
}

const textareaAutoResize = (element: HTMLTextAreaElement) => {
  if (!element) return;
  element.style.height = "1px";
  element.style.height = element.scrollHeight + "px";
}

const copyToClipboard = (str: string) => {
  if (!str) return;
  let el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

const parseURL = (href: string) => {
  const match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}


export {
  timeAgo,
  parseURL,
  formatDate,
  scrollToBottom,
  initOAuthWindow,
  copyToClipboard,
  textareaAutoResize,
};
