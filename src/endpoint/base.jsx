const BASEURL = import.meta.env.VITE_API;

const API = {
  alldata: (arg = "") => `${BASEURL}/alldata${arg && "/" + arg}/?format=json`,
};

export default API;
