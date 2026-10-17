import { LuCreditCard } from "react-icons/lu";

// Paying inside the account is planned. Until then the quotation says how to pay.
export default function PayCard() {
  return (
    <section aria-labelledby="pay-title" className="mb-7 rounded-[28px] border border-line bg-white px-6 py-7 sm:px-10">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-12 flex-none items-center justify-center rounded-full bg-lilac text-2xl text-purple"><LuCreditCard aria-hidden="true" /></span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="pay-title" className="text-[24px] font-extrabold text-purple">Pay in the app</h2>
            <span className="rounded-full bg-[#fff1d6] px-3 py-1 text-[12.5px] font-extrabold uppercase tracking-[.06em] text-[#7a4b00]">Coming soon</span>
          </div>
          <p className="mt-1.5 text-[15.5px] leading-relaxed text-[#4b3d54]">
            Soon you will be able to pay for your order right here, and it will confirm itself the moment the payment goes through. Until then, please follow the payment steps in your quotation.
          </p>
          <button type="button" disabled className="mt-4 inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-[14px] bg-[#e7dcec] px-7 font-extrabold text-[#8d7f96]">Pay now</button>
        </div>
      </div>
    </section>
  );
}
