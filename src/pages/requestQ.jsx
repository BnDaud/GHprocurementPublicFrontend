import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import API from "../endpoint/base";
import "react-phone-input-2/lib/style.css";
function RequestQuote() {
  const initialState = {
    email: "",
    file: null, // this is an image file
    name: "",
    phone: "",
    company: "",
    item: "",
  };
  const [payload, setPayload] = useState(initialState);
  const [imagepreview, setImagepreview] = useState("");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const SendRFQ = async () => {
      const url = API.sendRFQ();
      const body = new FormData();
      body.append("email", payload.email);
      body.append("name", payload.name);
      body.append("company", payload.company);
      body.append("phone", payload.phone);
      body.append("item", payload.item);
      body.append("file", payload.file);
      try {
        const res = await fetch(url, { method: "POST", body: body });
        if (!res.ok) {
          // get response text or JSON for better error info
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        console.log("Returned data", data);
      } catch (e) {
        console.log(e.message);
      }
    };
    if (submit) {
      console.log(payload);
      SendRFQ();
      setSubmit(false);
    }
  }, [submit]);

  const updatePayload = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full min-h-100  px-2  md:pr-5 lg:pr-10 pb-20 space-y-4 mt-10">
      <div className="w-full min-h-85 p-4 bg-white rounded-2xl">
        <p className="text-xl font-bold">Request For Quote</p>

        <form className="mt-5 space-y-2 text-sm md:text-base">
          {" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              Name<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 w-55 md:w-70  p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Full Name"
              required
              value={payload.name}
              onChange={(e) => updatePayload("name", e.target.value)}
              type="text"
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold md:mr-4 mr-2">
              {" "}
              Email<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="example@email.com"
              required
              type="email"
              value={payload.email}
              onChange={(e) => updatePayload("email", e.target.value)}
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              From<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Company Name"
              required
              type="text"
              value={payload.company}
              onChange={(e) => updatePayload("company", e.target.value)}
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              Phone<span className="text-red-600"> *</span>
            </label>
            <PhoneInput
              country="us"
              value={payload.phone}
              enableSearch
              onChange={(phone) => updatePayload("phone", `+${phone}`)}
              containerClass="!w-55 md:!w-70"
              inputClass="!w-full  !h-10 !rounded-xl !bg-white !border !border-gray !px-10 !text-sm md:!text-base"
            />
          </div>
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              Item<span className="text-red-600"> *</span>
            </label>
            <textarea
              className="h-40 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Full Name"
              required
              type="text"
              value={payload.item}
              onChange={(e) => updatePayload("item", e.target.value)}
            ></textarea>
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-4">
              {" "}
              File<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Description"
              required
              type="file"
              accept="image/*"
              onChange={(e) => {
                updatePayload("file", e.target.files[0]);
                setImagepreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {imagepreview && (
            <img
              src={imagepreview}
              alt="Preview"
              className="mt-3 h-40 w-40 object-cover rounded-lg border"
            />
          )}
          <div className="flex gap-4 mt-5">
            {" "}
            <div
              className="bg-purple px-4 py-2 text-center text-peach font-bold rounded-xl cursor-pointer"
              onClick={() => setSubmit(!submit)}
            >
              Send RFQ
            </div>
            <div className=" px-4 py-2 text-center text-purple outline hover:bg-purple hover:text-peach hover-outline-none font-bold rounded-xl">
              {" "}
              Reset
            </div>{" "}
          </div>
          <p className="mt-5 text-sm font-bold text-center text-gray">
            {" "}
            We will follow up within 48 hours{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default RequestQuote;
