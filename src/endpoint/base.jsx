const BASEURL = import.meta.env.VITE_API;
// the public content (catalog, FAQ, posts) can come from another address when
// viewing locally; in production it is the same API
const DATABASE = import.meta.env.VITE_API_DATA || BASEURL;

const API = {
  alldata: () => `${DATABASE}/alldata/?format=json`,
  sendRFQ: () => `${BASEURL}/rfqs/`,
  customer: {
    login: () => `${BASEURL}/customer/login/`,
    requestLink: () => `${BASEURL}/customer/request-link/`,
    setPassword: () => `${BASEURL}/customer/set-password/`,
    me: () => `${BASEURL}/customer/me/`,
    requests: () => `${BASEURL}/customer/requests/`,
    request: (id) => `${BASEURL}/customer/requests/${id}/`,
    track: () => `${BASEURL}/customer/track/`,
    messages: (id) => `${BASEURL}/customer/requests/${id}/messages/`,
    accept: (id) => `${BASEURL}/customer/requests/${id}/accept/`,
    updateEmail: (id, update) => `${BASEURL}/customer/requests/${id}/updates/${update}/email/`,
    trackEmail: () => `${BASEURL}/customer/track/email/`,
  },
};

export default API;
