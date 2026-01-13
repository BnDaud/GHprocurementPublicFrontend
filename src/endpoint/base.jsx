const BASEURL = import.meta.env.VITE_API;

const API = {
  alldata: (arg = "") => `${BASEURL}/alldata${arg && "/" + arg}/?format=json`,
  sendRFQ: () => `${BASEURL}/rfqs/`,
};

export default API;
